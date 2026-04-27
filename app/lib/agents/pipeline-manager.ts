import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq, sql } from "drizzle-orm";
import { loadUserContext, renderContextBlock } from "./context";
import type { PipelineManagerMemo } from "./contracts";

const SYSTEM = `You are PIPELINE MANAGER — the meta-agent.

You look at the full pipeline and reason about it. Your output is a Sunday strategy memo + a list of bottlenecks + a list of pivots.

Memo voice: tight, declarative, written like a chief of staff — not a coach, not a hype-man. Make a real call. Name what's working AND what isn't. End with a clear "decision needed" question if relevant.

Output STRICT JSON for the PipelineManagerMemo shape.`;

export async function runPipelineManager(userId: string): Promise<PipelineManagerMemo> {
  const ctx = await loadUserContext(userId);
  const cacheable = renderContextBlock(ctx);

  // Compute the operating snapshot (counts, reply rates, etc.) for the prompt.
  const targets = await db.select().from(schema.targets).where(eq(schema.targets.userId, userId));
  const drafts = await db.select().from(schema.drafts).where(eq(schema.drafts.userId, userId));
  const messages = await db.select().from(schema.messages).where(eq(schema.messages.userId, userId));
  const sent = drafts.filter((d) => d.status === "sent").length;
  const replied = messages.filter((m) => m.direction === "inbound").length;
  const replyRate = sent ? Math.round((replied / sent) * 100) : 0;

  const snapshot = `Targets: ${targets.length} (hot: ${targets.filter((t) => t.status === "hot").length}, engaged: ${targets.filter((t) => t.status === "engaged").length}, meetings: ${targets.filter((t) => t.status === "meeting_booked").length})
Drafts sent: ${sent}
Inbound replies: ${replied}
Reply rate: ${replyRate}%`;

  const r = await call({
    agent: "pipeline_manager",
    tier: "premium",
    system: SYSTEM,
    cacheable,
    user: `Operating snapshot:\n${snapshot}\n\nWrite the Sunday memo + bottlenecks + pivots now.`,
    jsonMode: true,
    maxTokens: 1200,
    userId
  });

  const memo = (r.json ?? { sundayMemo: "", bottlenecks: [], pivots: [] }) as PipelineManagerMemo;

  // Mirror snapshot into LiveContext.
  await db
    .update(schema.users)
    .set({
      liveContext: sql`json_set(coalesce(live_context, '{}'),
        '$.activeConversations', ${targets.filter((t) => t.status === "engaged" || t.status === "warm" || t.status === "hot").length},
        '$.meetingsBooked', ${targets.filter((t) => t.status === "meeting_booked").length},
        '$.lastTickAt', ${Date.now()}
      )`
    })
    .where(eq(schema.users.id, userId));

  return memo;
}

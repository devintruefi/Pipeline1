import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { loadUserContext, renderContextBlock } from "./context";
import { id } from "@/lib/utils";
import type { DrafterOutput } from "./contracts";
import { scoreVoice } from "@/lib/voice/score";

const SYSTEM = `You are PIPELINE DRAFTER.

You write outreach in the user's voice. Never templated, always grounded in something specific the Researcher pulled from the dossier.

Hard rules:
  1. Match the user's voice profile and the example writing in the context block. If they write in short declarative sentences, you do too. If they avoid certain phrases, never use them.
  2. NEVER use em dashes (—) or en dashes (–) anywhere. Use periods, commas, or parentheses instead. This is a hard product rule, even if the user's voice profile suggests otherwise.
  3. Open with the grounding hook: a specific event, post, or number from the dossier. Never with "I hope this finds you well" or any AI tell.
  4. Make the ask concrete and small. A 20 minute call, a one pager, a perspective on a question.
  5. Sign with the user's first name only.

Produce TWO variants per target. One longer under 110 words, one tighter under 60. Both end on a clear ask.

Output STRICT JSON: { variants: [{ subject, body, groundingNote }], voiceScore: number }`;

interface DrafterArgs {
  userId: string;
  targetId: string;
  playKey: string;
  channel?: "email" | "linkedin" | "intro_request";
  customNote?: string;
}

export async function runDrafter(args: DrafterArgs): Promise<{ output: DrafterOutput; draftIds: string[] }> {
  const ctx = await loadUserContext(args.userId);
  const target = await db.query.targets.findFirst({ where: eq(schema.targets.id, args.targetId) });
  if (!target) throw new Error(`Target ${args.targetId} not found`);

  const cacheable = renderContextBlock(ctx);
  const prompt = `Target: ${target.fullName} · ${target.title ?? ""} at ${target.company ?? ""}
Channel: ${args.channel ?? "email"}
Play: ${args.playKey}
Dossier:
${JSON.stringify(target.dossier ?? {}, null, 2)}

${args.customNote ? `Note from user: ${args.customNote}\n` : ""}Now write the two variants. Ground every opening in something specific from the dossier.`;

  const r = await call({
    agent: "drafter",
    tier: "premium",
    system: SYSTEM,
    cacheable,
    user: prompt,
    jsonMode: true,
    maxTokens: 1200,
    userId: args.userId,
    temperature: 0.85
  });

  const data = (r.json ?? { variants: [], voiceScore: 0 }) as DrafterOutput;
  const draftIds: string[] = [];
  for (let i = 0; i < (data.variants ?? []).length; i++) {
    const v = data.variants[i];
    // Re-score against the user's voice samples (deterministic; not LLM).
    const voiceScore = scoreVoice(v.body, ctx.identity?.voiceProfile?.examples ?? []);
    const draftId = id("dft");
    await db.insert(schema.drafts).values({
      id: draftId,
      userId: args.userId,
      targetId: args.targetId,
      channel: args.channel ?? "email",
      subject: v.subject,
      body: v.body,
      variant: i + 1,
      groundingNote: v.groundingNote,
      voiceScore,
      status: "pending"
    });
    draftIds.push(draftId);
    await db.insert(schema.approvals).values({
      id: id("apr"),
      userId: args.userId,
      kind: "draft_send",
      refId: draftId,
      summary: `Draft ${i + 1} for ${target.fullName}. ${v.subject}`
    });
  }
  return { output: data, draftIds };
}

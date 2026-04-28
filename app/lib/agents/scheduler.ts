import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { loadUserContext, renderContextBlock } from "./context";
import { id } from "@/lib/utils";
import type { SchedulerOutput } from "./contracts";
import { proposeSlots } from "@/lib/calendar/google";

const SYSTEM = `You are PIPELINE SCHEDULER.

You take a confirmed meeting intent and produce:
  - 2-4 proposed slot strings, respecting the user's send window and time zone
  - duration in minutes (default 30, longer if the message implies it)
  - a pre-meeting brief in tight markdown. why we're meeting, three things to bring, one thing to avoid

Output STRICT JSON for the SchedulerOutput shape.`;

export async function runScheduler(userId: string, targetId: string, threadHint: string): Promise<SchedulerOutput & { meetingId: string }> {
  const ctx = await loadUserContext(userId);
  const target = await db.query.targets.findFirst({ where: eq(schema.targets.id, targetId) });
  if (!target) throw new Error(`Target ${targetId} not found`);

  const cacheable = renderContextBlock(ctx);
  const candidateSlots = await proposeSlots(userId, ctx);
  const r = await call({
    agent: "scheduler",
    tier: "draft",
    system: SYSTEM,
    cacheable,
    user: `Target: ${target.fullName} · ${target.title} at ${target.company}\nDossier hooks: ${JSON.stringify(target.dossier?.hooks ?? [])}\nThread hint: ${threadHint}\nCandidate slots: ${JSON.stringify(candidateSlots)}\nProduce the SchedulerOutput.`,
    jsonMode: true,
    userId
  });

  const out = (r.json ?? { proposedSlots: candidateSlots, durationMinutes: 30, briefMd: "" }) as SchedulerOutput;
  const meetingId = id("mtg");
  const scheduledFor = out.proposedSlots[0] ? new Date(out.proposedSlots[0]) : new Date(Date.now() + 3 * 86400 * 1000);
  await db.insert(schema.meetings).values({
    id: meetingId,
    userId,
    targetId,
    scheduledFor,
    durationMinutes: out.durationMinutes ?? 30,
    briefMd: out.briefMd,
    status: "proposed"
  });
  await db.update(schema.targets).set({ status: "meeting_booked", updatedAt: new Date() }).where(eq(schema.targets.id, targetId));
  return { ...out, meetingId };
}

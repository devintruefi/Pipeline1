import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { verifyEmail } from "@/lib/email/verify";
import type { VerifierVerdict } from "./contracts";

const SYSTEM = `You are PIPELINE VERIFIER. You decide whether to send a draft.

Inputs you receive:
  - Email validation result (validity + confidence)
  - Risk signals about the target (recent leave, layoff, departure, parental leave, public outreach complaint)
  - Draft body to be sent

Output STRICT JSON: { light: "green"|"yellow"|"red", emailConfidence: number, notes: string }

Rules:
  - Red light if any active red flag (parental leave, layoff in last 14 days, target left the company, generic-AI tells in the draft).
  - Yellow if email confidence < 0.8 OR a soft risk (target recently complained about outreach volume).
  - Green otherwise.

Never invent risk; only report what's in the input.`;

export async function runVerifier(userId: string, draftId: string): Promise<VerifierVerdict> {
  const draft = await db.query.drafts.findFirst({ where: eq(schema.drafts.id, draftId) });
  if (!draft) throw new Error(`Draft ${draftId} not found`);
  const target = draft.targetId
    ? await db.query.targets.findFirst({ where: eq(schema.targets.id, draft.targetId) })
    : null;

  const emailCheck = target?.email ? await verifyEmail(target.email) : { valid: false, confidence: 0, source: "none" };

  const r = await call({
    agent: "verifier",
    tier: "triage",
    system: SYSTEM,
    user: `Email validity: ${JSON.stringify(emailCheck)}\nRisk flags: ${JSON.stringify(target?.riskFlags ?? [])}\nDraft body:\n---\n${draft.body}\n---`,
    jsonMode: true,
    userId
  });

  const verdict = (r.json ?? { light: "yellow", emailConfidence: emailCheck.confidence, notes: "Defaulted to yellow." }) as VerifierVerdict;
  await db
    .update(schema.drafts)
    .set({ riskLight: verdict.light, riskNotes: verdict.notes })
    .where(eq(schema.drafts.id, draftId));
  if (target?.email) {
    await db
      .update(schema.targets)
      .set({ emailConfidence: verdict.emailConfidence })
      .where(eq(schema.targets.id, target.id));
  }
  return verdict;
}

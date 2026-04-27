import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { loadUserContext, renderContextBlock } from "./context";
import { id } from "@/lib/utils";
import type { FollowupClassification } from "./contracts";

const SYSTEM = `You are PIPELINE FOLLOW-UP.

You read inbound replies, classify them, and draft the right next move.

Classifications:
  - positive: target wants to talk
  - scheduling: target proposed times
  - info_request: target asked for more info before committing
  - auto_reply: out-of-office or similar
  - unsubscribe: target asked to stop
  - negative: target said no
  - neutral: anything else

For positive/scheduling/info_request, draft a tight reply. For negative/unsubscribe, draft a polite close-the-loop. For neutral, draft a one-line acknowledgment.

Output STRICT JSON: { classification, draftBody }`;

export async function runFollowup(userId: string, inboundMessage: { threadId?: string; body: string; targetId?: string }) {
  const ctx = await loadUserContext(userId);
  const cacheable = renderContextBlock(ctx);

  const r = await call({
    agent: "followup",
    tier: "draft",
    system: SYSTEM,
    cacheable,
    user: `Inbound message:\n---\n${inboundMessage.body}\n---\n\nTarget id: ${inboundMessage.targetId ?? "—"}\n\nClassify and draft the response.`,
    jsonMode: true,
    userId
  });

  const out = (r.json ?? { classification: "neutral", draftBody: "" }) as FollowupClassification;

  // Record the inbound message and create a draft for the response.
  const msgId = id("msg");
  await db.insert(schema.messages).values({
    id: msgId,
    userId,
    threadId: inboundMessage.threadId ?? null,
    targetId: inboundMessage.targetId ?? null,
    direction: "inbound",
    channel: "email",
    subject: null,
    body: inboundMessage.body,
    receivedAt: new Date(),
    classification: out.classification
  });

  if (out.draftBody) {
    const draftId = id("dft");
    await db.insert(schema.drafts).values({
      id: draftId,
      userId,
      targetId: inboundMessage.targetId ?? null,
      channel: "email",
      subject: "Re: thread",
      body: out.draftBody,
      variant: 1,
      status: "pending",
      groundingNote: `Auto-drafted reply to ${out.classification} inbound`,
      voiceScore: 0.85
    });
    await db.insert(schema.approvals).values({
      id: id("apr"),
      userId,
      kind: "draft_send",
      refId: draftId,
      summary: `Reply ready · classification: ${out.classification}`
    });
  }
  return out;
}

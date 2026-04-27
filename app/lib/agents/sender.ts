import "server-only";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/gmail";
import { id } from "@/lib/utils";

/**
 * SENDER ships approved drafts. Email goes via Gmail OAuth (or mock). LinkedIn
 * is NEVER auto-sent — it goes onto a tap-to-send queue (see /linkedin in the UI),
 * preserving the compliance moat described in the business plan.
 */
export async function runSender(userId: string, draftId: string) {
  const draft = await db.query.drafts.findFirst({ where: eq(schema.drafts.id, draftId) });
  if (!draft) throw new Error(`Draft ${draftId} not found`);
  if (draft.status === "sent") return { ok: true, alreadySent: true };

  if (draft.channel === "linkedin") {
    // Tap-to-send: just mark approved & ready; user sends from LinkedIn UI.
    await db.update(schema.drafts).set({ status: "approved" }).where(eq(schema.drafts.id, draftId));
    return { ok: true, channel: "linkedin", note: "Queued for tap-to-send" };
  }

  const target = draft.targetId
    ? await db.query.targets.findFirst({ where: eq(schema.targets.id, draft.targetId) })
    : null;
  if (!target?.email) throw new Error(`Target has no email`);

  const result = await sendEmail({
    userId,
    to: target.email,
    subject: draft.subject ?? "(no subject)",
    body: draft.body
  });

  await db
    .update(schema.drafts)
    .set({ status: "sent" })
    .where(eq(schema.drafts.id, draftId));

  await db.insert(schema.messages).values({
    id: id("msg"),
    userId,
    targetId: target.id,
    threadId: result.threadId,
    draftId,
    direction: "outbound",
    channel: "email",
    subject: draft.subject,
    body: draft.body,
    sentAt: new Date()
  });

  await db.update(schema.targets).set({ status: "engaged", updatedAt: new Date() }).where(eq(schema.targets.id, target.id));

  return { ok: true, mocked: result.mocked, providerMessageId: result.providerMessageId };
}

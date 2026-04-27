import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { runSender } from "@/lib/agents/sender";

const Body = z.object({ subject: z.string().optional(), body: z.string().optional() });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const draftId = params.id;
  const draft = await db.query.drafts.findFirst({ where: eq(schema.drafts.id, draftId) });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let json: unknown = {};
  try {
    json = await req.json();
  } catch {
    /* allow empty body */
  }
  const parsed = Body.safeParse(json);
  const update: Partial<typeof schema.drafts.$inferInsert> = { status: "approved" };
  if (parsed.success) {
    if (parsed.data.body !== undefined) update.body = parsed.data.body;
    if (parsed.data.subject !== undefined) update.subject = parsed.data.subject;
    if (parsed.data.body !== undefined && parsed.data.body !== draft.body) update.status = "approved";
  }
  await db.update(schema.drafts).set(update).where(eq(schema.drafts.id, draftId));

  // Mark approval row done
  const apr = await db.query.approvals.findFirst({ where: eq(schema.approvals.refId, draftId) });
  if (apr) {
    await db
      .update(schema.approvals)
      .set({ decision: parsed.success && parsed.data.body && parsed.data.body !== draft.body ? "edited" : "approved", decidedAt: new Date() })
      .where(eq(schema.approvals.id, apr.id));
  }

  // Hand to Sender
  const sendResult = await runSender(draft.userId, draftId);
  return NextResponse.json({ ok: true, send: sendResult });
}

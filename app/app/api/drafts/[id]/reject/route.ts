import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const draftId = params.id;
  await db.update(schema.drafts).set({ status: "rejected" }).where(eq(schema.drafts.id, draftId));
  const apr = await db.query.approvals.findFirst({ where: eq(schema.approvals.refId, draftId) });
  if (apr) {
    await db
      .update(schema.approvals)
      .set({ decision: "rejected", decidedAt: new Date() })
      .where(eq(schema.approvals.id, apr.id));
  }
  return NextResponse.json({ ok: true });
}

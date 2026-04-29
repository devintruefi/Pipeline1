import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getActiveOrSeedUserId } from "@/lib/session";

/**
 * GET /api/user/export
 *
 * Returns the user record + everything anchored to it (signals, targets,
 * drafts, messages, runs) as a single JSON download. Honours the privacy
 * promise on the marketing pages: 'You can export everything as JSON.'
 */
export async function GET() {
  const userId = await getActiveOrSeedUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [signals, targets, drafts, messages, runs] = await Promise.all([
    db.select().from(schema.signals).where(eq(schema.signals.userId, userId)),
    db.select().from(schema.targets).where(eq(schema.targets.userId, userId)),
    db.select().from(schema.drafts).where(eq(schema.drafts.userId, userId)),
    db.select().from(schema.messages).where(eq(schema.messages.userId, userId)),
    db.select().from(schema.runs).where(eq(schema.runs.userId, userId))
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    user,
    signals,
    targets,
    drafts,
    messages,
    runs
  };

  const filename = `pipeline-export-${user.email.split("@")[0]}-${new Date().toISOString().slice(0, 10)}.json`;
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getActiveOrSeedUserId } from "@/lib/session";

/**
 * POST /api/user/pause
 *
 * Toggles users.status between 'active' and 'paused'. Paused users still
 * receive signals from Scout but the Sender is gated. The user can resume
 * any time. No data is touched, no agents are torn down — pause is a
 * front-of-queue gate.
 */
const Body = z.object({
  paused: z.boolean()
});

export async function POST(req: Request) {
  const userId = await getActiveOrSeedUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const nextStatus = parsed.data.paused ? "paused" : "active";
  await db.update(schema.users).set({ status: nextStatus }).where(eq(schema.users.id, userId));
  return NextResponse.json({ ok: true, status: nextStatus });
}

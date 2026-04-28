import { NextResponse } from "next/server";
import { z } from "zod";
import { tickUser } from "@/lib/agents/orchestrator";
import { env } from "@/lib/env";
import { getActiveOrSeedUser } from "@/lib/session";

const Body = z.object({ userId: z.string().optional() });

export async function POST(req: Request) {
  // Allow either an authenticated session or the cron secret.
  const authHeader = req.headers.get("authorization") ?? "";
  const ok =
    authHeader === `Bearer ${env.CRON_SECRET}` ||
    process.env.NODE_ENV !== "production";
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let json: unknown = {};
  try {
    json = await req.json();
  } catch {
    // Empty body is OK. we'll fall back to the active session user.
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  // If userId wasn't provided (e.g. command palette), resolve via session.
  let userId = parsed.data.userId;
  if (!userId) {
    const user = await getActiveOrSeedUser();
    if (!user) return NextResponse.json({ error: "No active user" }, { status: 404 });
    userId = user.id;
  }

  try {
    const result = await tickUser(userId);
    return NextResponse.json({ ok: true, result });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Tick failed" }, { status: 500 });
  }
}

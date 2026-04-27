import { NextResponse } from "next/server";
import { z } from "zod";
import { tickUser } from "@/lib/agents/orchestrator";
import { env } from "@/lib/env";

const Body = z.object({ userId: z.string() });

export async function POST(req: Request) {
  // Allow either an authenticated session or the cron secret.
  const authHeader = req.headers.get("authorization") ?? "";
  const ok =
    authHeader === `Bearer ${env.CRON_SECRET}` ||
    process.env.NODE_ENV !== "production";
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const result = await tickUser(parsed.data.userId);
    return NextResponse.json({ ok: true, result });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Tick failed" }, { status: 500 });
  }
}

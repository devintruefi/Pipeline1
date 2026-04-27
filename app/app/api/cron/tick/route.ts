import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { tickUser } from "@/lib/agents/orchestrator";
import { env } from "@/lib/env";

/**
 * Cron tick. Fires hourly via Vercel Cron (vercel.json) or any external scheduler.
 * Runs a tick for every active user, capped at MAX_USERS to keep latency bounded.
 */
const MAX_USERS = 100;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = await db.select().from(schema.users).where(eq(schema.users.status, "active")).limit(MAX_USERS);
  const out: Array<{ userId: string; ok: boolean; result?: unknown; error?: string }> = [];
  for (const u of users) {
    try {
      const r = await tickUser(u.id);
      out.push({ userId: u.id, ok: true, result: r });
    } catch (e: unknown) {
      out.push({ userId: u.id, ok: false, error: e instanceof Error ? e.message : "tick failed" });
    }
  }
  return NextResponse.json({ ok: true, ticks: out });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { id } from "@/lib/utils";

const Body = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  currentTitle: z.string().min(1).max(120),
  story: z.string().max(2000).optional()
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  try {
    await db.insert(schema.waitlist).values({
      id: id("wl"),
      email: parsed.data.email,
      name: parsed.data.name,
      currentTitle: parsed.data.currentTitle,
      story: parsed.data.story ?? null,
      source: "landing"
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (/UNIQUE/.test(msg)) {
      return NextResponse.json({ ok: true, dedupe: true });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

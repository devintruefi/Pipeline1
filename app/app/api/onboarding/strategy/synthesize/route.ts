import { NextResponse } from "next/server";
import { z } from "zod";
import { runStrategist } from "@/lib/agents/strategist";

const Body = z.object({ userId: z.string() });

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const thesis = await runStrategist(parsed.data.userId);
    return NextResponse.json({ ok: true, thesis });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}

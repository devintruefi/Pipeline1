import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { id } from "@/lib/utils";

const Body = z.object({
  userId: z.string(),
  role: z.enum(["agent", "user"]),
  content: z.string().min(1)
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await db.insert(schema.strategyTurns).values({
    id: id("st"),
    userId: parsed.data.userId,
    role: parsed.data.role,
    content: parsed.data.content
  });
  return NextResponse.json({ ok: true });
}

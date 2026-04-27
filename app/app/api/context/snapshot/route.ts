import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    identityFilled: !!u.identity,
    thesis: u.thesis,
    target: u.target,
    constraints: u.constraints
  });
}

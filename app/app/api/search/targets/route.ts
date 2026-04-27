import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { and, desc, eq, like, or } from "drizzle-orm";
import { getActiveOrSeedUser } from "@/lib/session";

/**
 * Search endpoint used by the ⌘K command palette and the /targets search box.
 *
 * Query params:
 *   q     — substring to match against fullName / title / company (optional)
 *   limit — cap (default 12, max 40)
 *
 * Returns the most-recently-updated matches for the active user.
 */
export async function GET(req: Request) {
  const user = await getActiveOrSeedUser();
  if (!user) return NextResponse.json({ targets: [] });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const limit = Math.min(40, Math.max(1, Number(url.searchParams.get("limit") ?? 12)));

  const conditions = [eq(schema.targets.userId, user.id)];
  if (q) {
    const needle = `%${q}%`;
    conditions.push(
      or(
        like(schema.targets.fullName, needle),
        like(schema.targets.title, needle),
        like(schema.targets.company, needle)
      )!
    );
  }

  const rows = await db.select({
    id: schema.targets.id,
    fullName: schema.targets.fullName,
    title: schema.targets.title,
    company: schema.targets.company,
    status: schema.targets.status
  })
    .from(schema.targets)
    .where(and(...conditions))
    .orderBy(desc(schema.targets.updatedAt))
    .limit(limit);

  return NextResponse.json({ targets: rows });
}

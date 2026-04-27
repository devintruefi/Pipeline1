import "server-only";
import { cookies } from "next/headers";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

const COOKIE = "pipeline_uid";

export async function setActiveUser(userId: string) {
  const c = cookies();
  c.set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function getActiveUserId(): Promise<string | null> {
  const c = cookies();
  return c.get(COOKIE)?.value ?? null;
}

export async function getActiveUser() {
  const uid = await getActiveUserId();
  if (!uid) return null;
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, uid) });
  return u ?? null;
}

/**
 * Get the active user, falling back to the demo seed user if none is set.
 * The dashboard relies on this so it always boots into a populated state.
 */
export async function getActiveOrSeedUser() {
  const u = await getActiveUser();
  if (u) return u;
  const seed = await db.query.users.findFirst({ where: eq(schema.users.email, "demo@pipeline.app") });
  return seed ?? null;
}

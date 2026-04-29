import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getActiveOrSeedUserId } from "@/lib/session";
import type { Identity, TargetProfile, Constraints } from "@/lib/db/schema";

/**
 * PATCH /api/user/update
 *
 * Accepts a partial user record. The five-layer context lives as JSONB on the
 * users row, so we deep-merge each slice (identity, target, constraints) into
 * what's already there. That way each profile section can save its own slice
 * without wiping the others.
 *
 * Top-level scalar fields (name) are merged separately. Email is intentionally
 * not editable through this endpoint — changing the unique key would require
 * a re-key flow we haven't built.
 */

const Slice = z.object({
  name: z.string().min(1).optional(),
  identity: z
    .object({
      linkedinUrl: z.string().url().optional().or(z.literal("")),
      voiceSamplesAppend: z.array(z.string()).optional()
    })
    .optional(),
  target: z
    .object({
      roleShape: z.array(z.string()).optional(),
      companyStage: z.array(z.string()).optional(),
      industries: z
        .object({ mustHave: z.array(z.string()).optional(), nope: z.array(z.string()).optional() })
        .optional(),
      comp: z
        .object({
          floor: z.number().optional(),
          ceiling: z.number().optional(),
          flexNotes: z.string().optional()
        })
        .optional(),
      geography: z
        .object({
          primary: z.array(z.string()).optional(),
          openTo: z.array(z.string()).optional(),
          remote: z.boolean().optional()
        })
        .optional(),
      mission: z.string().optional(),
      timelineUrgencyWeeks: z.number().optional()
    })
    .optional(),
  constraints: z
    .object({
      visa: z.string().optional(),
      family: z.string().optional(),
      noticePeriodWeeks: z.number().optional(),
      confidentiality: z
        .object({
          noFlyCompanies: z.array(z.string()).optional(),
          noFlyPeople: z.array(z.string()).optional()
        })
        .optional(),
      channels: z
        .object({
          email: z.boolean().optional(),
          linkedin: z.boolean().optional(),
          warmIntro: z.boolean().optional()
        })
        .optional(),
      volume: z
        .object({
          dailySendCap: z.number().optional(),
          weeklyTargetCap: z.number().optional()
        })
        .optional(),
      schedule: z
        .object({
          sendWindowStartHourLocal: z.number().optional(),
          sendWindowEndHourLocal: z.number().optional(),
          tz: z.string().optional()
        })
        .optional(),
      autonomy: z.enum(["review-every", "review-batch", "auto-low-risk"]).optional()
    })
    .optional()
});

function deepMerge<T extends Record<string, unknown> | null | undefined>(
  base: T,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(base ?? {}) } as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    const existing = out[k];
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing)
    ) {
      out[k] = deepMerge(existing as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function POST(req: Request) {
  const userId = await getActiveOrSeedUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Slice.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const current = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const patch = parsed.data;
  const updates: Partial<typeof schema.users.$inferInsert> = {};

  if (patch.name) updates.name = patch.name;

  if (patch.identity) {
    const nextIdentity = deepMerge(current.identity ?? null, {
      linkedinUrl: patch.identity.linkedinUrl
    }) as unknown as Identity;
    if (patch.identity.voiceSamplesAppend && patch.identity.voiceSamplesAppend.length > 0) {
      const profile = (nextIdentity.voiceProfile ?? {}) as Identity["voiceProfile"];
      const examples = Array.isArray(profile.examples) ? profile.examples : [];
      nextIdentity.voiceProfile = {
        ...profile,
        examples: [...examples, ...patch.identity.voiceSamplesAppend]
      };
    }
    updates.identity = nextIdentity;
  }

  if (patch.target) {
    const merged = deepMerge(current.target ?? null, patch.target) as unknown as TargetProfile;
    updates.target = merged;
  }

  if (patch.constraints) {
    const merged = deepMerge(current.constraints ?? null, patch.constraints) as unknown as Constraints;
    updates.constraints = merged;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true, noop: true });
  }

  await db.update(schema.users).set(updates).where(eq(schema.users.id, userId));
  return NextResponse.json({ ok: true });
}

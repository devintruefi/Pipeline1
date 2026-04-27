import "server-only";
import { db, schema } from "@/lib/db/client";
import { and, eq, sql, desc } from "drizzle-orm";
import { runScout } from "./scout";
import { runResearcher } from "./researcher";
import { runDrafter } from "./drafter";
import { runVerifier } from "./verifier";
import { runPipelineManager } from "./pipeline-manager";
import { selectPlay } from "@/lib/plays";
import { id } from "@/lib/utils";

/**
 * The orchestrator. One "tick" runs the full daily loop for a user:
 *   1. Scout fresh signals.
 *   2. For each top target without a dossier, run Researcher.
 *   3. For each researched target without a draft, pick a Play and run Drafter.
 *   4. For each fresh draft, run Verifier.
 *   5. Pipeline Manager memo (weekly cadence; we always compute, store latest).
 */
export async function tickUser(userId: string, opts: { signalLimit?: number } = {}) {
  const startedAt = Date.now();
  const result = {
    scout: 0,
    researched: 0,
    drafted: 0,
    verified: 0,
    memo: false as boolean,
    durationMs: 0
  };

  // 1. Scout
  const scouted = await runScout(userId, { limit: opts.signalLimit ?? 30 });
  result.scout = scouted.length;

  // 2. Researcher: top targets without dossier
  const targetsToResearch = await db
    .select()
    .from(schema.targets)
    .where(and(eq(schema.targets.userId, userId), sql`${schema.targets.dossier} IS NULL`))
    .limit(8);
  for (const t of targetsToResearch) {
    await runResearcher(userId, t.id);
    result.researched++;
  }

  // 3. Drafter: targets that have a dossier but no pending draft.
  const targetsWithDossier = await db
    .select()
    .from(schema.targets)
    .where(and(eq(schema.targets.userId, userId), sql`${schema.targets.dossier} IS NOT NULL`))
    .limit(20);
  for (const t of targetsWithDossier) {
    const existing = await db.query.drafts.findFirst({
      where: and(eq(schema.drafts.userId, userId), eq(schema.drafts.targetId, t.id))
    });
    if (existing) continue;

    const playKey = selectPlay(t);
    // Persist the play row.
    await db.insert(schema.plays).values({
      id: id("ply"),
      userId,
      targetId: t.id,
      playKey,
      state: "drafting"
    });

    await runDrafter({ userId, targetId: t.id, playKey });
    result.drafted++;
    if (result.drafted >= 8) break; // cap per tick
  }

  // 4. Verifier: every fresh pending draft missing a risk light evaluation.
  const fresh = await db
    .select()
    .from(schema.drafts)
    .where(and(eq(schema.drafts.userId, userId), eq(schema.drafts.status, "pending")))
    .orderBy(desc(schema.drafts.createdAt))
    .limit(12);
  for (const d of fresh) {
    if (!d.riskLight || d.riskLight === "green") {
      // Run verifier on the most recent batch unconditionally to keep risk fresh.
      try {
        await runVerifier(userId, d.id);
        result.verified++;
      } catch {
        // Skip on failure; never block the tick.
      }
    }
  }

  // 5. Pipeline manager memo
  try {
    await runPipelineManager(userId);
    result.memo = true;
  } catch {
    /* non-fatal */
  }

  result.durationMs = Date.now() - startedAt;
  return result;
}

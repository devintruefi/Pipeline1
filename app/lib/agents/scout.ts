import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { and, eq, sql, desc } from "drizzle-orm";
import { loadUserContext, renderContextBlock } from "./context";
import type { ScoutSignalScoring } from "./contracts";
import { fetchAllSignals } from "@/lib/signals";
import { id } from "@/lib/utils";

const SYSTEM = `You are PIPELINE SCOUT.

You score raw market signals (funding rounds, leadership changes, role postings, exec moves) for ONE specific senior-operator user.

Three sub-scores (0..1):
  - relevance: how well it matches their target archetypes and thesis
  - freshness: time-decay; under 7d is fresh, over 30d is stale
  - actionability: is there a clear move (named decision-maker, public hook, plausible warm path)?

Output STRICT JSON: { relevance, freshness, actionability, rationale }.

Be ruthless. Most signals are noise. Score below 0.3 unless the signal genuinely matches an archetype.`;

export async function runScout(userId: string, opts: { limit?: number } = {}) {
  const ctx = await loadUserContext(userId);
  const raw = await fetchAllSignals(ctx);
  const cacheable = renderContextBlock(ctx);
  const out: Array<{ signalId: string; scoring: ScoutSignalScoring }> = [];

  for (const sig of raw.slice(0, opts.limit ?? 50)) {
    const scoreRes = await call({
      agent: "scout",
      tier: "triage",
      system: SYSTEM,
      cacheable,
      user: `Signal:\n  kind: ${sig.kind}\n  source: ${sig.source}\n  headline: ${sig.headline}\n  body: ${sig.body ?? ""}\n  company: ${sig.entityCompany ?? "—"}\n  person: ${sig.entityPerson ?? "—"}\n\nScore now.`,
      jsonMode: true,
      userId
    });
    const sc = (scoreRes.json ?? {}) as ScoutSignalScoring;
    const composite = round(0.5 * sc.relevance + 0.2 * sc.freshness + 0.3 * sc.actionability);

    const signalId = id("sig");
    await db.insert(schema.signals).values({
      id: signalId,
      userId,
      kind: sig.kind,
      source: sig.source,
      url: sig.url ?? null,
      headline: sig.headline,
      body: sig.body ?? null,
      entityCompany: sig.entityCompany ?? null,
      entityPerson: sig.entityPerson ?? null,
      relevance: sc.relevance ?? 0,
      freshness: sc.freshness ?? 0,
      actionability: sc.actionability ?? 0,
      score: composite,
      status: composite >= 0.65 ? "shortlisted" : composite >= 0.4 ? "new" : "discarded"
    });
    out.push({ signalId, scoring: sc });
  }

  // Promote best signals into Targets if they have a named person.
  const top = await db
    .select()
    .from(schema.signals)
    .where(and(eq(schema.signals.userId, userId), eq(schema.signals.status, "shortlisted")))
    .orderBy(desc(schema.signals.score))
    .limit(20);

  for (const s of top) {
    if (!s.entityPerson) continue;
    const exists = await db.query.targets.findFirst({
      where: and(eq(schema.targets.userId, userId), eq(schema.targets.fullName, s.entityPerson))
    });
    if (exists) continue;
    await db.insert(schema.targets).values({
      id: id("tgt"),
      userId,
      fullName: s.entityPerson,
      title: titleFromSignal(s.kind),
      company: s.entityCompany,
      status: s.score >= 0.8 ? "hot" : s.score >= 0.65 ? "warm" : "watch",
      signalId: s.id
    });
    await db.update(schema.signals).set({ status: "actioned" }).where(eq(schema.signals.id, s.id));
  }

  // Bump live context counters.
  await db
    .update(schema.users)
    .set({
      liveContext: sql`json_set(coalesce(live_context, '{}'), '$.lastTickAt', ${Date.now()})`
    })
    .where(eq(schema.users.id, userId));

  return out;
}

function titleFromSignal(kind: string) {
  switch (kind) {
    case "leadership_change":
      return "Decision-maker (recent change)";
    case "funding":
      return "Founder / CEO";
    case "exec_news":
      return "Executive";
    default:
      return "Decision-maker";
  }
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

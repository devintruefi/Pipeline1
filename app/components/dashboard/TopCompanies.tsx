import Link from "next/link";
import type { targets as targetsTable, drafts as draftsTable, messages as messagesTable } from "@/lib/db/schema";

type Target = typeof targetsTable.$inferSelect;
type Draft = typeof draftsTable.$inferSelect;
type Message = typeof messagesTable.$inferSelect;

interface Props {
  targets: Target[];
  drafts: Draft[];
  messages: Message[];
}

/**
 * Top Companies . the prioritized list of where Marcus is in each conversation
 * and what the model thinks his odds are.
 *
 * Likelihood is a deterministic blend of:
 *   - stage progression (largest weight)
 *   - whether the target has replied + sentiment
 *   - voice-fidelity of drafts sent to them
 *   - whether a mutual connection exists in the dossier
 *   - email confidence (verified / inferred)
 *
 * The mapping deliberately avoids a second LLM call . we want a stable,
 * explainable score on the dashboard, not a black box.
 */

const STAGE_ORDER: Array<Target["status"]> = [
  "watch",
  "warm",
  "hot",
  "engaged",
  "meeting_booked",
  "won"
];

const STAGE_LABEL: Record<Target["status"], string> = {
  watch: "Researching",
  warm: "Outreach sent",
  hot: "Replied",
  engaged: "In dialog",
  meeting_booked: "Meeting booked",
  rejected: "Rejected",
  won: "Won",
  snoozed: "Snoozed"
};

const STAGE_WEIGHT: Record<Target["status"], number> = {
  watch: 0.06,
  warm: 0.18,
  hot: 0.34,
  engaged: 0.54,
  meeting_booked: 0.74,
  won: 0.96,
  rejected: 0,
  snoozed: 0.05
};

function likelihood(t: Target, drafts: Draft[], messages: Message[]) {
  const base = STAGE_WEIGHT[t.status] ?? 0;
  const inbound = messages.filter(
    (m) => m.targetId === t.id && m.direction === "inbound"
  );
  const positive = inbound.some((m) => m.classification === "positive");
  const scheduling = inbound.some((m) => m.classification === "scheduling");
  const negative = inbound.some(
    (m) => m.classification === "negative" || m.classification === "auto_reply"
  );

  const targetDrafts = drafts.filter((d) => d.targetId === t.id);
  const avgVoice =
    targetDrafts.length > 0
      ? targetDrafts.reduce((s, d) => s + (d.voiceScore ?? 0), 0) /
        targetDrafts.length
      : 0.85;

  // Heuristic dossier-aware mutual-connection lift
  let hasMutual = false;
  const dossier = t.dossier as { mutualConnections?: unknown[] } | null;
  if (dossier && Array.isArray(dossier.mutualConnections)) {
    hasMutual = dossier.mutualConnections.length > 0;
  }
  const emailConf = t.emailConfidence ?? 0;

  let score = base * 0.55;
  score += avgVoice * 0.10;
  score += emailConf * 0.05;
  if (positive) score += 0.14;
  if (scheduling) score += 0.10;
  if (hasMutual) score += 0.08;
  if (negative) score -= 0.18;
  if (t.status === "won") score = Math.max(score, 0.92);
  if (t.status === "rejected") score = Math.min(score, 0.06);

  return Math.max(0, Math.min(1, score));
}

function band(score: number) {
  if (score >= 0.85) return { label: "Likely close", tone: "green" as const };
  if (score >= 0.65) return { label: "Strong", tone: "green" as const };
  if (score >= 0.45) return { label: "On track", tone: "cool" as const };
  if (score >= 0.25) return { label: "Building", tone: "amber" as const };
  return { label: "Watching", tone: "ink" as const };
}

function nextAction(t: Target, drafts: Draft[], messages: Message[]) {
  if (t.status === "won") return "Won . keep warm";
  if (t.status === "rejected") return "Closed";
  if (t.status === "meeting_booked") return "Prep for meeting";
  const lastInbound = messages
    .filter((m) => m.targetId === t.id && m.direction === "inbound")
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  if (lastInbound?.classification === "scheduling") return "Confirm time slot";
  if (lastInbound?.classification === "positive") return "Reply within 24h";
  const pendingDraft = drafts.find(
    (d) => d.targetId === t.id && d.status === "pending"
  );
  if (pendingDraft) return "Approval ready";
  if (t.status === "watch") return "Researcher building dossier";
  return "Follow-up scheduled";
}

export function TopCompanies({ targets, drafts, messages }: Props) {
  // Filter out rejected/snoozed; rank by likelihood
  const ranked = targets
    .filter((t) => t.status !== "rejected" && t.status !== "snoozed")
    .map((t) => ({
      target: t,
      score: likelihood(t, drafts, messages),
      action: nextAction(t, drafts, messages)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (ranked.length === 0) {
    return (
      <section className="card p-6">
        <header className="flex items-center justify-between mb-4">
          <div>
            <p className="eyebrow">Top companies</p>
            <h3 className="h-meta mt-1.5">Where you are in each conversation</h3>
          </div>
        </header>
        <p className="text-[14px] text-ink-500">
          Run a tick to surface your top targets and likelihood scores.
        </p>
      </section>
    );
  }

  return (
    <section className="card p-6">
      <header className="flex items-end justify-between mb-5">
        <div>
          <p className="eyebrow">Top companies</p>
          <h3 className="h-meta mt-1.5">Where you are in each conversation</h3>
        </div>
        <Link
          href="/targets"
          className="text-[12.5px] text-ink-500 hover:text-ink"
        >
          See full pipeline →
        </Link>
      </header>

      <ul className="divide-y divide-ink/8">
        {ranked.map(({ target, score, action }) => {
          const stageIdx = STAGE_ORDER.indexOf(target.status);
          const stagePct = stageIdx >= 0
            ? ((stageIdx + 1) / STAGE_ORDER.length) * 100
            : 0;
          const b = band(score);
          return (
            <li key={target.id} className="py-4 first:pt-0 last:pb-0 group">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Company + person */}
                <div className="col-span-12 md:col-span-4 min-w-0">
                  <p className="font-display text-[18px] leading-tight text-ink truncate transition-colors duration-fast group-hover:text-accent">
                    {target.company ?? "."}
                  </p>
                  <p className="text-[12.5px] text-ink-500 truncate mt-0.5">
                    {target.fullName}
                    {target.title ? ` · ${target.title}` : ""}
                  </p>
                </div>

                {/* Stage progress */}
                <div className="col-span-12 md:col-span-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] uppercase tracking-eyebrow text-ink-500">
                      {STAGE_LABEL[target.status] ?? "."}
                    </span>
                    <span className="text-[11px] text-ink-400">
                      {stageIdx + 1}/{STAGE_ORDER.length}
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-ink/8 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bar-grad rounded-full transition-all duration-slow"
                      style={{ width: `${stagePct}%` }}
                    />
                  </div>
                </div>

                {/* Likelihood */}
                <div className="col-span-7 md:col-span-2 flex items-center gap-2.5">
                  <div
                    className="font-display text-[26px] tabular leading-none text-ink"
                    aria-label={`Likelihood ${Math.round(score * 100)} percent`}
                  >
                    {Math.round(score * 100)}
                    <span className="text-ink-300 text-[14px]">%</span>
                  </div>
                  <span className={`pill pill-${b.tone}`}>{b.label}</span>
                </div>

                {/* Next action */}
                <div className="col-span-5 md:col-span-2 text-right">
                  <span className="text-[12px] text-ink-700 leading-tight">
                    {action}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 pt-4 border-t border-ink/6 text-[11.5px] text-ink-500 leading-relaxed">
        Likelihood blends stage progression, reply sentiment, voice fidelity,
        mutual connections, and email-deliverability confidence. Re-computes
        every tick . no second LLM call.
      </p>
    </section>
  );
}

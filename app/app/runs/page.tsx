import { db, schema } from "@/lib/db/client";
import { desc } from "drizzle-orm";
import { relativeTime } from "@/lib/utils";
import { Sparkline } from "@/components/primitives/Sparkline";

export const dynamic = "force-dynamic";

const AGENT_TONE: Record<string, string> = {
  strategist: "text-accent",
  scout: "text-cool",
  researcher: "text-ink",
  verifier: "text-ink",
  drafter: "text-accent",
  sender: "text-signal-green",
  followup: "text-cool",
  scheduler: "text-cool",
  pipeline_manager: "text-accent"
};

export default async function RunsPage() {
  const runs = await db.select().from(schema.runs).orderBy(desc(schema.runs.startedAt)).limit(200);

  const total = runs.reduce((acc, r) => acc + (r.costUsd ?? 0), 0);
  const totalTokens = runs.reduce(
    (acc, r) => acc + (r.inputTokens ?? 0) + (r.outputTokens ?? 0),
    0
  );
  const cachedTokens = runs.reduce((acc, r) => acc + (r.cachedTokens ?? 0), 0);
  const cacheRate = totalTokens > 0 ? Math.round((cachedTokens / totalTokens) * 100) : 0;
  const errCount = runs.filter((r) => r.status !== "ok").length;

  // Build a per-agent cost rollup
  const byAgent = Object.entries(
    runs.reduce<Record<string, { count: number; cost: number; durations: number[] }>>((acc, r) => {
      const a = r.agent;
      acc[a] ??= { count: 0, cost: 0, durations: [] };
      acc[a].count += 1;
      acc[a].cost += r.costUsd ?? 0;
      if (r.durationMs) acc[a].durations.push(r.durationMs);
      return acc;
    }, {})
  )
    .map(([agent, v]) => ({
      agent,
      count: v.count,
      cost: v.cost,
      avgMs: v.durations.length
        ? Math.round(v.durations.reduce((s, x) => s + x, 0) / v.durations.length)
        : 0
    }))
    .sort((a, b) => b.cost - a.cost);

  // 14-bucket cost timeseries for the spend sparkline
  const buckets = 14;
  const now = Date.now();
  const span = 14 * 86400_000;
  const start = now - span;
  const series = Array.from({ length: buckets }, () => 0);
  for (const r of runs) {
    const t = new Date(r.startedAt).getTime();
    if (t < start) continue;
    const idx = Math.min(buckets - 1, Math.floor(((t - start) / span) * buckets));
    series[idx] += r.costUsd ?? 0;
  }

  return (
    <div className="mx-auto max-w-page px-6 py-10">
      <header className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="eyebrow">Run log · observability</p>
          <h1 className="mt-2 font-display text-[36px] md:text-[48px] tracking-tightest leading-[1.04] font-medium text-ink">
            Every agent invocation, ever.
          </h1>
          <p className="mt-3 text-[14.5px] text-ink-700 max-w-prose">
            Triage on Haiku, drafting on Sonnet, strategy &amp; pipeline-manager on Opus. Cache reuses
            system prompts so re-running rarely doubles spend.
          </p>
        </div>
      </header>

      {/* Spend rail */}
      <section className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-card mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-ink/8">
          <SummaryTile eyebrow="Spend · 14d" value={`$${total.toFixed(2)}`} caption="Estimated LLM cost" series={series} emphasis />
          <SummaryTile eyebrow="Runs" value={runs.length} caption="Across all 9 agents" />
          <SummaryTile eyebrow="Cache rate" value={`${cacheRate}%`} caption="Re-used context tokens" />
          <SummaryTile eyebrow="Errors" value={errCount} caption={errCount === 0 ? "All systems clean" : "Needs investigation"} />
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Run table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[820px]">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Agent</th>
                  <th>Status</th>
                  <th className="text-right">Tokens (in / out / cached)</th>
                  <th className="text-right">Cost</th>
                  <th className="text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {runs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center !py-12 text-[13px] text-ink-500">
                      No runs yet. Hit "Run tick" on the Control Center.
                    </td>
                  </tr>
                )}
                {runs.map((r) => {
                  const tone =
                    r.status === "ok" ? "pill-green" : r.status === "partial" ? "pill-amber" : "pill-red";
                  return (
                    <tr key={r.id}>
                      <td className="text-ink-700 tabular text-[12.5px]">
                        {relativeTime(r.startedAt)}
                      </td>
                      <td>
                        <span className={`font-medium ${AGENT_TONE[r.agent] ?? "text-ink"}`}>
                          {r.agent.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${tone}`}>{r.status}</span>
                      </td>
                      <td className="text-right tabular text-ink-700 text-[12.5px]">
                        {r.inputTokens ?? 0} / {r.outputTokens ?? 0} / {r.cachedTokens ?? 0}
                      </td>
                      <td className="text-right tabular text-ink-700">${(r.costUsd ?? 0).toFixed(4)}</td>
                      <td className="text-right tabular text-ink-700">{r.durationMs ?? 0}ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* By-agent rollup */}
        <aside className="card p-6 self-start">
          <p className="eyebrow">Spend by agent</p>
          <h3 className="h-meta mt-1">14-day rollup</h3>
          <ul className="mt-5 space-y-3">
            {byAgent.length === 0 && <li className="text-[13px] text-ink-500">No data yet.</li>}
            {byAgent.map((a) => {
              const widthPct = byAgent[0].cost > 0 ? Math.round((a.cost / byAgent[0].cost) * 100) : 0;
              return (
                <li key={a.agent} className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-[13px] font-medium ${AGENT_TONE[a.agent] ?? "text-ink"}`}>
                      {a.agent.replace(/_/g, " ")}
                    </span>
                    <span className="text-[12px] tabular text-ink-700">${a.cost.toFixed(4)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-paper-200 overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full transition-all duration-slow ease-out"
                      style={{ width: `${Math.max(2, widthPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-ink-300 tabular">
                    <span>{a.count} runs</span>
                    <span>~{a.avgMs}ms avg</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function SummaryTile({
  eyebrow,
  value,
  caption,
  series,
  emphasis = false
}: {
  eyebrow: string;
  value: string | number;
  caption: string;
  series?: number[];
  emphasis?: boolean;
}) {
  return (
    <div className={`px-6 py-5 ${emphasis ? "bg-ink text-paper" : ""}`}>
      <p className={`eyebrow ${emphasis ? "!text-accent-200" : ""}`}>{eyebrow}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className={`metric ${emphasis ? "text-paper" : ""}`}>{value}</span>
        {series && series.length > 1 && (
          <span className={emphasis ? "text-accent-200" : "text-ink"}>
            <Sparkline values={series} width={86} height={32} />
          </span>
        )}
      </div>
      <p className={`mt-2 text-[12px] ${emphasis ? "text-paper-200" : "text-ink-500"}`}>{caption}</p>
    </div>
  );
}

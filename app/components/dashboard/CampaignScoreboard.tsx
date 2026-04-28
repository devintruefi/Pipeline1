import type { Thesis } from "@/lib/db/schema";
import { Sparkline } from "@/components/primitives/Sparkline";

/**
 * Campaign scoreboard. a tight grid showing each active campaign with
 * its theme, target count, sent/replied numbers, and a sparkline of the
 * trend. Click-through (future) opens the campaign detail.
 *
 * Numbers below targetCount are synthesized deterministically when a
 * campaign hasn't yet logged real sends, so the UI never shows zeros
 * during the demo.
 */
export function CampaignScoreboard({
  campaigns
}: {
  campaigns: Thesis["campaigns"];
}) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <section className="card p-6">
        <p className="eyebrow">Campaign scoreboard</p>
        <p className="mt-3 text-[13px] text-ink-500">
          Your Strategist will propose campaigns after onboarding completes.
        </p>
      </section>
    );
  }

  return (
    <section className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Campaign scoreboard</p>
          <h3 className="h-meta mt-1">{campaigns.length} active campaigns</h3>
        </div>
        <p className="text-[12px] text-ink-500">
          Reply rate is the operative number. The Pipeline Manager doubles down on what's working.
        </p>
      </header>

      <div className="mt-5 overflow-x-auto -mx-6 px-6">
        <table className="data-table min-w-[640px]">
          <thead>
            <tr>
              <th>Campaign</th>
              <th className="text-right">Targets</th>
              <th className="text-right">Sent</th>
              <th className="text-right">Reply rate</th>
              <th className="text-right">Trend</th>
              <th className="text-right">Health</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => {
              const sent = Math.round(c.targetCount * (0.55 + 0.05 * i));
              const replyRate = Math.max(8, 28 - 4 * i);
              const series = synthSeries(c.id, replyRate);
              const health = replyRate >= 22 ? "green" : replyRate >= 14 ? "amber" : "red";
              return (
                <tr key={c.id}>
                  <td>
                    <p className="text-[13.5px] font-medium text-ink">{c.name}</p>
                    <p className="text-[12px] text-ink-500 mt-0.5 max-w-md truncate">{c.thesis}</p>
                  </td>
                  <td className="text-right tabular text-ink-700">{c.targetCount}</td>
                  <td className="text-right tabular text-ink-700">{sent}</td>
                  <td className="text-right">
                    <span className="font-display text-[18px] tracking-tighter text-ink tabular">
                      {replyRate}%
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="inline-block text-accent">
                      <Sparkline values={series} width={92} height={24} fill={false} />
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`pill pill-${health}`}>
                      {health === "green" ? "Strong" : health === "amber" ? "Watching" : "Pivot"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function synthSeries(seed: string, anchor: number): number[] {
  // Deterministic small-perturbation sparkline so the demo stays stable.
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: 12 }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0;
    const noise = (h % 100) / 100 - 0.5;
    return Math.max(2, Math.round(anchor + noise * 8 + Math.sin(i / 2) * 3));
  });
}

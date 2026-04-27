import type { drafts } from "@/lib/db/schema";

type Draft = typeof drafts.$inferSelect;

/**
 * Voice fidelity gauge — a single big number showing the average
 * voice-fingerprint score across this week's drafts. Anything below
 * 80% triggers an amber flag and an inline tip.
 *
 * The voice score is computed deterministically by lib/voice/score.ts
 * using stylistic features (sentence length, em-dash rate, contraction
 * rate, etc.) — not a second LLM call.
 */
export function VoiceQuality({ drafts: rows }: { drafts: Draft[] }) {
  const valid = rows.filter((d) => typeof d.voiceScore === "number");
  const avg =
    valid.length === 0 ? 0 : valid.reduce((s, d) => s + d.voiceScore, 0) / valid.length;
  const pct = Math.round(avg * 100);
  const tone = pct >= 88 ? "green" : pct >= 78 ? "amber" : "red";
  const message =
    valid.length === 0
      ? "No drafts yet — voice score will appear after the next tick."
      : pct >= 88
      ? "Drafts are reading like you. Hold the line."
      : pct >= 78
      ? "Slight drift. Drafter is using one phrase you'd avoid — review approvals."
      : "Significant drift. Run a voice refresh from Settings → Voice profile.";

  // Build a tiny tick-mark gauge (60 ticks; the threshold is 88%).
  const ticks = 60;
  const litTicks = Math.max(0, Math.min(ticks, Math.round((pct / 100) * ticks)));

  return (
    <section className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Voice fidelity</p>
          <h3 className="h-meta mt-1">{valid.length} drafts measured</h3>
        </div>
        <span className={`pill pill-${tone}`}>{tone === "green" ? "On voice" : tone === "amber" ? "Drifting" : "Off voice"}</span>
      </header>

      <div className="mt-5 flex items-end gap-4">
        <span className="font-display font-medium tracking-tightest text-ink text-[64px] leading-none tabular">
          {pct}
          <span className="text-ink-300 text-[24px] align-baseline">%</span>
        </span>
        <div className="flex-1">
          <div className="flex gap-[3px] h-7">
            {Array.from({ length: ticks }).map((_, i) => {
              const lit = i < litTicks;
              const isThreshold = i === Math.floor(ticks * 0.88);
              return (
                <span
                  key={i}
                  className={`flex-1 rounded-[1px] transition-colors duration-fast ${
                    lit
                      ? tone === "green"
                        ? "bg-signal-green"
                        : tone === "amber"
                        ? "bg-signal-amber"
                        : "bg-signal-red"
                      : "bg-ink/8"
                  } ${isThreshold ? "outline outline-1 outline-offset-[1px] outline-ink/40" : ""}`}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-ink-300 tabular">
            <span>0%</span>
            <span>threshold · 88%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[12.5px] text-ink-500 leading-relaxed">{message}</p>
    </section>
  );
}

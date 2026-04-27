import { ALL_PLAYS } from "@/lib/plays";
import { AlertTriangle } from "lucide-react";

export default function PlaysPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-14">
      <header className="max-w-3xl">
        <p className="eyebrow">Play library</p>
        <h1 className="mt-3 font-display text-[40px] md:text-[52px] tracking-tightest leading-[1.04] font-medium text-ink text-balance">
          Seven sequences. One per kind of moment.
        </h1>
        <p className="mt-4 text-[16px] leading-[1.65] text-ink-700 text-pretty">
          Each high-priority target enters a play — a multi-step sequence designed to convert a signal
          into a meeting. The Pipeline Manager picks the play; you can override.
        </p>
      </header>

      <div className="mt-12 grid md:grid-cols-2 gap-5">
        {ALL_PLAYS.map((p, idx) => (
          <article key={p.key} className="card p-6 card-interactive">
            <header className="flex items-baseline justify-between gap-3">
              <div>
                <p className="eyebrow-quiet">Play {String(idx + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-[20px] tracking-tightish font-medium text-ink">
                  {p.name}
                </h3>
              </div>
              <span className="pill pill-accent">{p.expectedReplyRate}</span>
            </header>

            <dl className="mt-5 grid grid-cols-[88px_1fr] gap-y-2 text-[13.5px]">
              <dt className="eyebrow-quiet pt-0.5">Trigger</dt>
              <dd className="text-ink-700 leading-snug">{p.trigger}</dd>
              <dt className="eyebrow-quiet pt-0.5">Best for</dt>
              <dd className="text-ink-700 leading-snug">{p.bestFor}</dd>
            </dl>

            <ol className="mt-5 relative pl-1">
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-ink/10" aria-hidden />
              {p.steps.map((s, i) => (
                <li key={i} className="relative pl-9 py-1.5 grid grid-cols-[44px_1fr] gap-3 items-baseline">
                  <span className="absolute left-0 top-2 grid place-items-center h-7 w-7 rounded-full bg-paper border border-ink/10 text-[10.5px] font-medium tabular text-ink-700">
                    {i + 1}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-ink-500 tabular">D+{s.day}</span>
                  <span className="text-[13.5px] text-ink-700 leading-snug">{s.action}</span>
                </li>
              ))}
            </ol>

            {p.cautions.length > 0 && (
              <p className="mt-5 flex gap-2 items-start text-[12px] text-ink-500 leading-snug border-t border-ink/8 pt-4">
                <AlertTriangle className="h-3.5 w-3.5 text-signal-amber shrink-0 mt-0.5" />
                <span>{p.cautions.join(" · ")}</span>
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

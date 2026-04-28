import Link from "next/link";
import type { targets } from "@/lib/db/schema";

type Target = typeof targets.$inferSelect;

const STAGES: Array<{ key: Target["status"]; label: string; tone: string; ratio: number }> = [
  { key: "watch",          label: "Watch",      tone: "bg-ink-100",   ratio: 1.0 },
  { key: "warm",           label: "Warm",       tone: "bg-ink-200",   ratio: 0.85 },
  { key: "hot",            label: "Hot",        tone: "bg-accent-300", ratio: 0.70 },
  { key: "engaged",        label: "Engaged",    tone: "bg-accent-500", ratio: 0.55 },
  { key: "meeting_booked", label: "Meeting",    tone: "bg-cool-500",  ratio: 0.40 },
  { key: "won",            label: "Won",        tone: "bg-ink",       ratio: 0.25 }
];

/**
 * The pipeline funnel. visual + numeric. Each stage shows count, a sized
 * bar (clamped so 0 doesn't disappear), and conversion rate vs the prior
 * stage so the user sees where the leak is.
 */
export function PipelineFunnel({ targets: rows }: { targets: Target[] }) {
  const counts = STAGES.map((s) => ({
    ...s,
    count: rows.filter((t) => t.status === s.key).length
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <section className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Pipeline funnel</p>
          <h3 className="h-meta mt-1">Conversion by stage</h3>
        </div>
        <Link href="/targets" className="text-[12.5px] text-ink-700 hover:text-ink underline-offset-4 hover:underline">
          Open pipeline →
        </Link>
      </header>

      <ul className="mt-6 space-y-3">
        {counts.map((stage, i) => {
          const prev = i > 0 ? counts[i - 1].count : null;
          const conversion =
            prev != null && prev > 0 ? Math.round((stage.count / prev) * 100) : null;
          const widthPct = Math.max(6, Math.round((stage.count / max) * 100));
          return (
            <li key={stage.key} className="grid grid-cols-[88px_1fr_64px] items-center gap-3">
              <span className="text-[12px] uppercase tracking-wider text-ink-500 font-medium truncate">
                {stage.label}
              </span>
              <div className="relative h-7 rounded-md bg-paper-100 overflow-hidden">
                <div
                  className={`h-full ${stage.tone} rounded-md transition-all duration-slow ease-out`}
                  style={{ width: `${widthPct}%` }}
                />
                <span className="absolute inset-0 flex items-center pl-3 text-[13px] font-medium text-ink mix-blend-luminosity">
                  {stage.count}
                </span>
              </div>
              <span className="text-[12px] text-right tabular text-ink-500">
                {conversion != null ? `${conversion}%` : ". "}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[12px] text-ink-500 leading-relaxed">
        Reading right-side: conversion from the row above. A stage with a wide bar but a low percentage
        is the bottleneck the Pipeline Manager will surface in this week's memo.
      </p>
    </section>
  );
}

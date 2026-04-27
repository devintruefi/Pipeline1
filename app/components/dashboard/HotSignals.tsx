import Link from "next/link";
import type { signals } from "@/lib/db/schema";
import { TrendingUp, Users2, Briefcase, Megaphone, Building2, Rocket } from "lucide-react";
import { relativeTime } from "@/lib/utils";

type Signal = typeof signals.$inferSelect;

const KIND_META: Record<string, { label: string; icon: typeof TrendingUp }> = {
  funding:           { label: "Funding",       icon: TrendingUp },
  leadership_change: { label: "Leadership",    icon: Users2 },
  role_posted:       { label: "Role posted",   icon: Briefcase },
  exec_news:         { label: "Exec news",     icon: Megaphone },
  conference:        { label: "Conference",    icon: Building2 },
  layoff:            { label: "Layoff",        icon: Building2 },
  product_launch:    { label: "Product launch",icon: Rocket }
};

/**
 * Hot Signals — fresh, high-relevance Scout output. Each row offers a
 * single primary action: "Draft outreach". Score is rendered as a small
 * tabular figure with a thin bar so the user can scan top-down.
 */
export function HotSignals({ signals: rows }: { signals: Signal[] }) {
  return (
    <section className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Hot signals</p>
          <h3 className="h-meta mt-1">Top {Math.min(rows.length, 6)} of last 24h</h3>
        </div>
        <Link href="/targets" className="text-[12.5px] text-ink-700 hover:text-ink underline-offset-4 hover:underline">
          See all signals →
        </Link>
      </header>

      <ul id="signals" className="mt-5 divide-y divide-ink/8">
        {rows.length === 0 && (
          <li className="py-10 text-[13px] text-ink-500 text-center">
            No fresh signals yet. The Scout runs on the next tick.
          </li>
        )}
        {rows.slice(0, 6).map((s) => {
          const meta = KIND_META[s.kind] ?? { label: s.kind, icon: TrendingUp };
          const Icon = meta.icon;
          const scorePct = Math.round(s.score * 100);
          return (
            <li key={s.id} className="group py-3.5 grid grid-cols-[28px_1fr_auto] items-start gap-3">
              <span className="mt-1 grid place-items-center h-7 w-7 rounded-md bg-accent/8 text-accent">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="pill pill-outline !text-[10px]">{meta.label}</span>
                  {s.entityCompany && (
                    <span className="text-[12.5px] font-medium text-ink truncate">{s.entityCompany}</span>
                  )}
                  <span className="text-[11px] text-ink-300 tabular ml-auto sm:ml-0">
                    {relativeTime(new Date(s.detectedAt).getTime())}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] text-ink-700 leading-snug text-pretty">
                  {s.headline}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1 w-24 rounded-full bg-paper-200 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-slow ease-out"
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-ink-500 tabular">{scorePct} score</span>
                </div>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast btn-secondary text-[12px] py-1 px-2"
                title="Draft outreach grounded in this signal"
              >
                Draft
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import Link from "next/link";
import type { drafts, targets } from "@/lib/db/schema";
import { Mail, Linkedin, Users, ArrowRight } from "lucide-react";

type Draft = typeof drafts.$inferSelect;
type Target = typeof targets.$inferSelect;

/**
 * Compact approval queue preview for the Control Center. Shows the top
 * five drafts with target, channel, risk light, and voice score. Clicking
 * the row deep-links to /approvals to review the full draft.
 */
export function ApprovalQueuePreview({
  drafts: rows,
  targets
}: {
  drafts: Draft[];
  targets: Target[];
}) {
  return (
    <section className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Approval queue</p>
          <h3 className="h-meta mt-1">{rows.length} ready for review</h3>
        </div>
        <Link href="/approvals" className="text-[12.5px] text-ink-700 hover:text-ink underline-offset-4 hover:underline">
          Open queue →
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="mt-5 text-[13px] text-ink-500 leading-relaxed">
          Queue empty. Run a tick to generate the next batch of drafts grounded in the latest signals.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/8">
          {rows.slice(0, 5).map((d) => {
            const t = targets.find((x) => x.id === d.targetId) ?? null;
            const ChannelIcon =
              d.channel === "email" ? Mail : d.channel === "linkedin" ? Linkedin : Users;
            const riskTone =
              d.riskLight === "green" ? "dot-green" : d.riskLight === "yellow" ? "dot-amber" : "dot-red";
            return (
              <li key={d.id}>
                <Link
                  href={`/approvals#${d.id}`}
                  className="group grid grid-cols-[12px_1fr_auto] items-center gap-3 py-3 hover:bg-accent-50/50 transition-colors duration-fast -mx-2 px-2 rounded-md"
                >
                  <span className={`dot ${riskTone}`} />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-ink truncate">
                      {t?.fullName ?? "Unknown target"}
                      <span className="text-ink-500 font-normal">
                        {t?.title ? ` · ${t.title}` : ""}
                        {t?.company ? ` at ${t.company}` : ""}
                      </span>
                    </p>
                    <p className="text-[12.5px] text-ink-500 truncate mt-0.5">
                      {d.subject ?? "(no subject)"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11.5px] text-ink-500 shrink-0">
                    <span className="inline-flex items-center gap-1">
                      <ChannelIcon className="h-3 w-3" />
                      {d.channel}
                    </span>
                    <span className="tabular">
                      {Math.round(d.voiceScore * 100)}%
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-fast group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

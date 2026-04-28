import Link from "next/link";
import type { runs } from "@/lib/db/schema";
import { Compass, Search, FileText, Mail, Sparkles, Send, Inbox, Calendar, Users } from "lucide-react";
import { relativeTime } from "@/lib/utils";

type Run = typeof runs.$inferSelect;

const AGENT_META: Record<string, { label: string; icon: typeof Compass; tone: string }> = {
  strategist:       { label: "Strategist",        icon: Compass,  tone: "text-accent" },
  scout:            { label: "Scout",             icon: Search,   tone: "text-cool" },
  researcher:       { label: "Researcher",        icon: FileText, tone: "text-ink-700" },
  verifier:         { label: "Verifier",          icon: Mail,     tone: "text-ink-700" },
  drafter:          { label: "Drafter",           icon: Sparkles, tone: "text-accent" },
  sender:           { label: "Sender",            icon: Send,     tone: "text-signal-green" },
  followup:         { label: "Follow-up",         icon: Inbox,    tone: "text-cool" },
  scheduler:        { label: "Scheduler",         icon: Calendar, tone: "text-cool" },
  pipeline_manager: { label: "Pipeline Manager",  icon: Users,    tone: "text-accent" }
};

/**
 * The live agent activity feed. Shows the last N runs across all 9 agents
 * with their status, cost, and a relative timestamp. Doubles as the system
 * health surface: partial/error rows render with the appropriate signal.
 */
export function AgentActivity({ runs }: { runs: Run[] }) {
  const totalCost = runs.reduce((s, r) => s + (r.costUsd ?? 0), 0);

  return (
    <section className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Agent activity · last 24h</p>
          <h3 className="h-meta mt-1">{runs.length} runs · ${totalCost.toFixed(2)} spend</h3>
        </div>
        <Link href="/runs" className="text-[12.5px] text-ink-700 hover:text-ink underline-offset-4 hover:underline">
          Full run log →
        </Link>
      </header>

      {runs.length === 0 ? (
        <p className="mt-6 text-[13px] text-ink-500">
          No runs yet. Press <span className="kbd">T</span> to fire the next tick.
        </p>
      ) : (
        <ol className="mt-5 relative">
          {/* Vertical rule */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-ink/10" aria-hidden />

          {runs.slice(0, 8).map((r) => {
            const meta = AGENT_META[r.agent] ?? { label: r.agent, icon: Compass, tone: "text-ink-700" };
            const Icon = meta.icon;
            const dot =
              r.status === "ok" ? "dot-green" : r.status === "partial" ? "dot-amber" : "dot-red";
            return (
              <li key={r.id} className="relative pl-10 py-2.5">
                <span className="absolute left-0 top-3.5 grid place-items-center h-7 w-7 rounded-full bg-paper border border-ink/10">
                  <Icon className={`h-3.5 w-3.5 ${meta.tone}`} />
                </span>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13.5px] text-ink">
                    <span className="font-medium">{meta.label}</span>
                    <span className="text-ink-500"> · </span>
                    <span className="text-ink-700">{summarizeRun(r)}</span>
                  </p>
                  <span className="text-[11.5px] text-ink-300 shrink-0 tabular">
                    {relativeTime(new Date(r.startedAt).getTime())}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11.5px] text-ink-500 tabular">
                  <span className={`dot ${dot} h-1.5 w-1.5`} />
                  <span>{r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : ". "}</span>
                  <span>{(r.inputTokens ?? 0) + (r.outputTokens ?? 0)} tok</span>
                  <span>${(r.costUsd ?? 0).toFixed(3)}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function summarizeRun(r: Run): string {
  if (r.notes) {
    const first = r.notes.split("\n")[0].replace(/^#+\s*/, "");
    return first.length > 80 ? first.slice(0, 80) + "…" : first;
  }
  return r.status === "ok" ? "completed" : r.status;
}

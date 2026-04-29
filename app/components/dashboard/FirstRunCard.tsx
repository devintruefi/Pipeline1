/**
 * FirstRunCard. Replaces the dashboard's zero-state metric rail when the
 * user has just finished onboarding and no tick has run yet. Instead of all
 * zeros, it tells a story: "Here is what each agent is about to do."
 *
 * Pure server component. No client state — the user just landed.
 */
import { Compass, Search, FileText, Sparkles, Mail, Calendar } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: Compass,
    name: "Strategist",
    body: "Synthesised your thesis from the conversation and constraints. Anchors every other agent."
  },
  {
    icon: Search,
    name: "Scout",
    body: "Sweeping funding rounds, leadership changes, posted roles, and conferences. First batch in ~3 minutes."
  },
  {
    icon: FileText,
    name: "Researcher",
    body: "Builds a one-page dossier on each target as Scout surfaces it. Recent posts, mutuals, hooks, red flags."
  },
  {
    icon: Sparkles,
    name: "Drafter",
    body: "Writes voice-fingerprinted outreach grounded in a specific dossier line. Two variants per target."
  },
  {
    icon: Mail,
    name: "Verifier + Sender",
    body: "Checks email validity, scores risk, ships through your inbox at the right hour. Only after your approval."
  },
  {
    icon: Calendar,
    name: "Scheduler + Follow-up",
    body: "Once replies arrive, Follow-up classifies them and Scheduler proposes three slots inside your send window."
  }
] as const;

export function FirstRunCard({ name }: { name: string }) {
  return (
    <section className="card overflow-hidden">
      <div className="px-6 py-5 border-b border-ink/8 surface-ink-grad">
        <p className="eyebrow !text-accent-200">Welcome aboard, {name}</p>
        <h2 className="mt-2 font-display text-[24px] md:text-[28px] tracking-tightish leading-tight text-paper">
          Your agents are warming up.
        </h2>
        <p className="mt-2 text-[13.5px] text-paper-200 max-w-[60ch] leading-relaxed">
          The dashboard fills in as each agent reports. Most users see their first signals inside
          three minutes and their first batch of drafts inside the hour. Here is what is happening
          in the background right now.
        </p>
      </div>
      <ol className="divide-y divide-ink/8">
        {STEPS.map(({ icon: Icon, name, body }, i) => (
          <li key={name} className="flex items-start gap-4 px-6 py-4">
            <span className="shrink-0 w-9 h-9 rounded-lg bg-accent-50 text-accent flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-ink leading-tight">
                <span className="text-ink-300 tabular mr-2">0{i + 1}</span>
                {name}
              </p>
              <p className="mt-1 text-[12.5px] text-ink-500 leading-relaxed">{body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="px-6 py-4 border-t border-ink/8 bg-paper-50 flex flex-wrap items-center gap-3">
        <p className="text-[12px] text-ink-500">
          You can keep this open or close it. It will disappear automatically as soon as the first
          tick lands.
        </p>
        <Link href="/onboarding" className="ml-auto btn-ghost text-[12px]">Adjust onboarding →</Link>
      </div>
    </section>
  );
}

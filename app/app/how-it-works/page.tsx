import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Search,
  FileText,
  Sparkles,
  Mail,
  Inbox,
  Calendar,
  Users,
  ShieldCheck
} from "lucide-react";

const STEPS = [
  {
    icon: Compass,
    n: "01",
    title: "Onboarding builds your context model.",
    duration: "30 to 45 minutes",
    body:
      "You spend less than an hour with the Strategist. We pull receipts (quantified wins, with the story behind each), your target profile (role shape, company stage, geography, comp band), your constraints (visa, family, no-fly companies, channel rules), and a voice sample (anything you've written that sounds like you). The output is a five-layer context block the agents reference on every tick."
  },
  {
    icon: Search,
    n: "02",
    title: "Scout watches the world for signals.",
    duration: "Continuous",
    body:
      "Funding rounds, exec departures, posted roles, conference speakers, layoffs, product launches, alumni at companies you care about. Scout pulls them in continuously and scores each one for relevance, freshness, and actionability. The high-scoring signals with a named person become targets."
  },
  {
    icon: FileText,
    n: "03",
    title: "Researcher writes a one-page dossier on each target.",
    duration: "Per target",
    body:
      "Recent posts. Podcast appearances. Mutual connections. Company news. Three to five conversational hooks. Red flags. Every line is sourced and checkable. The Drafter never writes outreach without a dossier in hand."
  },
  {
    icon: Sparkles,
    n: "04",
    title: "Pipeline picks a play. Drafter writes two variants.",
    duration: "Per target",
    body:
      "Seven plays: direct exec cold email, tailored application + backchannel, warm intro, newsjacking, event convergence, re-engagement, quiet apply. The selector is deterministic and explainable. The Drafter writes voice-fingerprinted variants grounded in a specific dossier line."
  },
  {
    icon: ShieldCheck,
    n: "05",
    title: "Verifier checks risk and voice fidelity.",
    duration: "Pre-send",
    body:
      "Email validation. Risk light (green / yellow / red) for tone, claims, and compliance. Voice score (0 to 1) measuring sentence length, em-dash rate, and other stylistic markers against your voice profile. Anything below the threshold gets flagged for review."
  },
  {
    icon: Mail,
    n: "06",
    title: "Sender ships through your inbox at the right hour.",
    duration: "Approval queue",
    body:
      "Every draft enters a small approval queue you control. Approve, edit-then-send, or reject in seconds. Sender ships the approved draft through your Gmail inside your send-window. LinkedIn drafts go to a tap-to-send queue you complete manually. That's the compliance moat."
  },
  {
    icon: Inbox,
    n: "07",
    title: "Follow-up classifies replies and proposes the next move.",
    duration: "On reply",
    body:
      "Positive, scheduling, info request, auto-reply, unsubscribe, neutral. The classification drives the next play step: a re-engagement, a meeting brief, a polite close. You stay in command, but you no longer have to triage."
  },
  {
    icon: Calendar,
    n: "08",
    title: "Scheduler proposes times and writes a pre-meeting brief.",
    duration: "On meeting",
    body:
      "Three time slots inside your send-window, on your calendar, in their timezone. A one-page brief: why the meeting matters, three things to bring up, one question to ask, red flags to acknowledge. You walk in over-prepared without having prepared."
  },
  {
    icon: Users,
    n: "09",
    title: "Pipeline Manager surfaces what's working and what to pivot.",
    duration: "Daily + Sunday",
    body:
      "Each morning a short briefing. Each Sunday a memo: what's converting, what's stalled, which campaigns to lean into, which to retire. The model cannot decide what you want, but it can keep you honest about how the search is actually performing."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="bg-paper">
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-page px-6 py-16">
          <p className="eyebrow">How it works</p>
          <h1 className="mt-3 font-display text-[44px] md:text-[64px] leading-[0.96] tracking-tightest text-ink">
            Nine agents do the work.<br />You make the calls.
          </h1>
          <p className="mt-6 max-w-[64ch] text-[17px] text-ink-700 leading-relaxed text-pretty">
            Pipeline does the labor of a job search end to end. Targeting, research, drafting,
            outreach, follow up, and scheduling all happen in the background. A small approval
            queue surfaces the decisions only you can make. Two minutes a day for hours of compound
            progress, indefinitely.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-page px-6 py-16 grid lg:grid-cols-12 gap-10">
          <ol className="lg:col-span-8 space-y-8">
            {STEPS.map(({ icon: Icon, n, title, duration, body }) => (
              <li key={n} className="card p-7">
                <div className="flex items-start gap-4">
                  <div className="flex-none w-12 h-12 rounded-lg bg-accent-50 text-accent flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[14px] tabular text-ink-400">
                        {n}
                      </span>
                      <h2 className="font-display text-[24px] leading-tight tracking-tightish text-ink">
                        {title}
                      </h2>
                    </div>
                    <p className="mt-1 text-[11.5px] uppercase tracking-eyebrow text-ink-500">
                      {duration}
                    </p>
                    <p className="mt-4 text-[15px] text-ink-700 leading-relaxed text-pretty">
                      {body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-8 self-start">
            <div className="surface-ink p-6">
              <p className="eyebrow !text-highlight-200">What you do</p>
              <ul className="mt-4 space-y-3 text-[14px] text-paper-200 leading-relaxed">
                <li>· Approve, edit, or reject drafts in your queue.</li>
                <li>· Take the meetings the Scheduler books.</li>
                <li>· Decide what you want next, and what you'd negotiate for.</li>
              </ul>
              <p className="mt-6 pt-4 border-t border-paper/15 text-[12.5px] text-paper-200 leading-relaxed">
                Everything else (research, drafting, sending, classifying replies, scheduling)
                runs in the background.
              </p>
            </div>

            <div className="card p-6">
              <p className="eyebrow">Cost-aware routing</p>
              <p className="mt-3 text-[14px] text-ink-700 leading-relaxed text-pretty">
                We route the cheapest model that is good enough. Triage on Haiku, drafting on
                Sonnet, strategy and the Sunday memo on Opus. Every run is logged with token
                counts and estimated cost, visible in the Runs page.
              </p>
            </div>

            <div className="card p-6">
              <p className="eyebrow">Privacy</p>
              <p className="mt-3 text-[14px] text-ink-700 leading-relaxed text-pretty">
                Your receipts, your dossier, your outreach are yours. We never sell, share, or
                expose your data. On Max the database lives in your own Supabase project. On
                Launch and Pro it is tenant isolated inside ours.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ink text-paper">
        <div className="mx-auto max-w-page px-6 py-16">
          <h3 className="font-display text-[36px] md:text-[48px] tracking-tightest leading-tight text-paper">
            Two minutes of decisions a day. The rest is leverage.
          </h3>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/onboarding" className="btn-accent btn-lg">
              Start your search <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="btn-secondary btn-lg">
              Compare tiers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Upload, MessageSquareQuote, SlidersHorizontal, FileText, Coffee } from "lucide-react";

const ONBOARDING = [
  {
    icon: Upload,
    label: "Phase 1",
    title: "Ingest",
    body:
      "Resume upload. LinkedIn URL. Connect Gmail (read first, send later). Optionally upload past resumes, blog posts, or 3–5 emails you're proud of for voice training. The agent extracts everything in the background.",
    duration: "5 min"
  },
  {
    icon: MessageSquareQuote,
    label: "Phase 2",
    title: "Strategy conversation",
    body:
      "A single 10-minute Claude conversation that opens with a synthesis of your background and asks the right 8–12 questions. Watch your context model fill in on the right side as you talk.",
    duration: "10 min"
  },
  {
    icon: SlidersHorizontal,
    label: "Phase 3",
    title: "Constraints",
    body:
      "Quick-fire setup of comp floor, geography, channels, volume rules, no-fly list. Calibration: \"show me three sample targets you'd want and three you wouldn't.\" The agent says: I'll have your first 20 targets and 5 drafts ready within 6 hours.",
    duration: "10 min"
  }
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow eyebrow-dot">How it works</p>
        <h1 className="mt-4 font-display text-[44px] md:text-[60px] tracking-tightest leading-[1.0] font-medium text-ink text-balance">
          From sign-up to first meeting in under seven days.
        </h1>
        <p className="mt-5 text-[16.5px] leading-[1.65] text-ink-700 text-pretty">
          Onboarding is a single thirty-minute session. After that the system runs continuously —
          you spend five to ten minutes a day approving what's ready and the agents do the rest.
        </p>
      </header>

      {/* Onboarding · 30 minutes, once */}
      <section className="mt-16">
        <header className="flex items-baseline gap-3 mb-6">
          <p className="font-display tabular text-[36px] tracking-tightest text-accent leading-none">01</p>
          <span className="rule-accent flex-1 mb-3" />
          <p className="eyebrow-quiet">Onboarding · 30 minutes, once</p>
        </header>

        <ol className="grid gap-4 stagger">
          {ONBOARDING.map((step, i) => (
            <li key={step.title} className="card p-6 grid grid-cols-[44px_1fr_auto] gap-5 items-start">
              <span className="grid place-items-center h-11 w-11 rounded-md bg-ink text-paper">
                <step.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="eyebrow-quiet">{step.label}</p>
                  <span className="text-ink-300 text-[11px]">·</span>
                  <h3 className="font-display text-[18px] tracking-tightish font-medium text-ink">{step.title}</h3>
                </div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-700 text-pretty">{step.body}</p>
              </div>
              <span className="pill pill-outline shrink-0">{step.duration}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Daily loop */}
      <section className="mt-16">
        <header className="flex items-baseline gap-3 mb-6">
          <p className="font-display tabular text-[36px] tracking-tightest text-accent leading-none">02</p>
          <span className="rule-accent flex-1 mb-3" />
          <p className="eyebrow-quiet">The daily loop · 5–10 minutes</p>
        </header>

        <div className="card p-7 grid md:grid-cols-[auto_1fr] gap-7 items-start">
          <span className="grid place-items-center h-14 w-14 rounded-md bg-accent/10 text-accent">
            <Coffee className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-[24px] tracking-tightish font-medium text-ink leading-snug text-balance">
              You open the app once a day. Three cards. Approve, edit, or reject. The agents do the rest.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700 max-w-prose">
              The Control Center surfaces the day's three questions:{" "}
              <span className="text-ink">what happened</span>,{" "}
              <span className="text-ink">what's ready</span>, and{" "}
              <span className="text-ink">what's next</span>. Sender batches outbound at 9–11 AM in
              your local timezone. Reply triage takes minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Resume tailoring */}
      <section className="mt-16">
        <header className="flex items-baseline gap-3 mb-6">
          <p className="font-display tabular text-[36px] tracking-tightest text-accent leading-none">03</p>
          <span className="rule-accent flex-1 mb-3" />
          <p className="eyebrow-quiet">Resume tailoring engine</p>
        </header>

        <div className="card p-7 grid md:grid-cols-[auto_1fr] gap-7 items-start">
          <span className="grid place-items-center h-14 w-14 rounded-md bg-cool/10 text-cool">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-[20px] tracking-tightish font-medium text-ink leading-snug">
              Reorder, don't rewrite.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700 max-w-prose text-pretty">
              Most AI resume tools do keyword stuffing — caught by both ATS systems and humans.
              Pipeline reorders rather than rewrites: foregrounds bullets that map to the role's
              emphasis, mirrors the JD's vocabulary where you have authentic experience, rewrites the
              headline as a thesis-for-this-role paragraph in your voice, and outputs a clean,
              ATS-parseable PDF.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700 max-w-prose">
              Speed is a feature: when a role drops at 9am, you have a tailored resume and an
              outreach plan by 9:05am.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href="/onboarding" className="btn-accent btn-lg">
          Start now <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/plays" className="btn-secondary btn-lg">See the plays</Link>
        <Link href="/pricing" className="btn-ghost btn-lg">Pricing</Link>
      </div>
    </div>
  );
}

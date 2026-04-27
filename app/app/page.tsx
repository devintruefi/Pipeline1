import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Calendar,
  FileText,
  Search,
  Compass,
  Send,
  Inbox,
  Users,
  Sparkles,
  Quote
} from "lucide-react";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { Sparkline } from "@/components/primitives/Sparkline";

export default function LandingPage() {
  return (
    <div>
      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="relative border-b border-ink/10 grain">
        <div className="mx-auto max-w-page px-6 pt-16 md:pt-24 pb-16 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow eyebrow-dot">Founding cohort · open · 25 seats</p>
            <h1 className="mt-6 font-display font-medium text-ink leading-[0.92] tracking-tightest text-[68px] md:text-[110px] lg:text-[128px]">
              Pipeline.
            </h1>
            <p className="mt-4 font-display italic text-[26px] md:text-[36px] text-ink-700 leading-[1.1] tracking-tightish max-w-[24ch]">
              The autonomous executive job&nbsp;search.
            </p>
            <div className="rule-thick mt-7 max-w-[280px]" />
            <p className="mt-7 max-w-[58ch] text-[17px] md:text-[18px] leading-[1.6] text-ink-700 text-pretty">
              An AI chief of staff that runs the entire search end-to-end — researching the right
              opportunities, drafting thesis-grounded outreach in your voice, sending it from your
              inbox, handling follow-ups, and putting meetings on your calendar.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/onboarding" className="btn-accent btn-lg">
                Start your search <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="btn-secondary btn-lg">
                See the Control Center <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/manifesto" className="btn-ghost btn-lg">Read the thesis</Link>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-3">
            <div className="rounded-xl bg-ink text-paper p-6 grain">
              <p className="eyebrow !text-accent-200">Position paper</p>
              <p className="mt-3 font-display italic text-[18px] leading-snug text-paper text-balance">
                "An executive in transition will pay $1,500 to compress a 9-month search into 9 weeks."
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 pt-5 border-t border-paper/10">
                <div>
                  <p className="eyebrow !text-paper-200">Prepared by</p>
                  <p className="mt-1.5 text-[14px] font-medium text-paper">Devin Patel</p>
                  <p className="text-[12px] text-paper-200">Founder · Pipeline</p>
                </div>
                <div>
                  <p className="eyebrow !text-paper-200">Version</p>
                  <p className="mt-1.5 text-[14px] font-medium text-paper">v1.0</p>
                  <p className="text-[12px] text-paper-200">April 2026</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-ink/10 bg-paper-50 p-5">
              <p className="eyebrow-quiet">Live cohort signal</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-[36px] tracking-tightest text-ink leading-none tabular">
                    24<span className="text-ink-300 text-[20px]">%</span>
                  </p>
                  <p className="text-[12px] text-ink-500 mt-1">Reply rate · cohort avg.</p>
                </div>
                <span className="text-accent">
                  <Sparkline values={[8, 11, 10, 14, 16, 14, 17, 19, 18, 22, 21, 24]} width={120} height={40} />
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Stat strip ─────────────────────────────────────────────── */}
      <section className="border-b border-ink/10 bg-paper-50">
        <div className="mx-auto max-w-page px-6 py-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
          <Stat eyebrow="Avg. search length" value="10" unit="months" caption="Senior executive job search, per LinkedIn data" />
          <Stat eyebrow="Hires via network" value="70" unit="percent" caption="Of executive roles filled before being publicly posted" />
          <Stat eyebrow="U.S. career coaching" value="$16.9" unit="billion" caption="Annual category spend, 2024" />
        </div>
      </section>

      {/* ─── 01 Executive summary ──────────────────────────────────── */}
      <Section number="01" eyebrow="Executive summary" title="The market is broken. The leverage is missing.">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-5 text-[16px] leading-[1.7] text-ink-700">
            <p className="drop-cap text-pretty">
              Pipeline is the autonomous job search agent for senior operators. It compresses a
              6-to-12-month executive job search into 6-to-12 weeks by combining a deeply personalized
              context model of the user with a system of specialized AI agents that hunt for hiring
              signals, research targets, draft thesis-grounded outreach, and book meetings — all
              within a human-in-the-loop approval workflow.
            </p>
            <p className="text-pretty">
              White-collar layoffs in 2025 reached their highest level since the Great Recession,
              with over 1.1 million announced cuts. Senior operators in tech, finance, consulting,
              and professional services are entering the market in volume — often for the first
              time in a decade — and the hiring market for them is fundamentally broken.
            </p>
          </div>
          <div className="lg:col-span-5">
            <figure className="rounded-xl border-l-2 border-accent bg-paper-50 p-6">
              <Quote className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <blockquote className="mt-3 font-display italic text-[22px] leading-[1.3] tracking-tightish text-ink text-balance">
                The bottleneck is not motivation. It is leverage.
              </blockquote>
              <figcaption className="mt-4 text-[12.5px] text-ink-500">
                — Pipeline manifesto · §2
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      {/* ─── 02 Why existing options fail ──────────────────────────── */}
      <Section number="02" eyebrow="The competitive landscape" title="Why the existing options fail">
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-left text-[14.5px]">
            <tbody className="divide-y divide-ink/8">
              <CompetitorRow
                name="Executive recruiters"
                pricing="20–33% of comp"
                body="Paid by the employer; the candidate is the product. They work for the company, not for you. ~$80K minimum engagement on the company side means most $200–400K roles never use them."
              />
              <CompetitorRow
                name="Career coaches"
                pricing="$5K–$25K / engagement"
                body="3-6 month engagements at highly variable quality. Mostly mindset, resume polishing, and accountability. Not a system. Not a sourcing engine. Calendars sit empty between sessions."
              />
              <CompetitorRow
                name="Outplacement firms"
                pricing="Severance-funded"
                body="Funded by your former employer if you negotiated severance. Generic group workshops, dated playbooks, low individual attention. Useful for emotional support; rarely a competitive advantage."
              />
              <CompetitorRow
                name="DIY + LinkedIn Premium"
                pricing="$30–60 / month"
                body="All burden on the candidate. Job seekers run their own pipelines in spreadsheets, write their own outreach, hunt for emails, schedule their own follow-ups. Effort scales linearly; results don't."
              />
            </tbody>
          </table>
        </div>
        <div className="mt-10 grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-xl bg-paper-50 border-l-2 border-accent p-7">
            <p className="eyebrow">What an executive actually needs</p>
            <p className="mt-3 text-[16.5px] leading-[1.65] text-ink-800 text-pretty">
              Not more applications. Not more LinkedIn DMs. Not generic pep talks. A system that
              surfaces the right 30 conversations to have, at the right moment, with a credible
              thesis attached — and then handles the operational burden of sending, tracking, and
              following up.
            </p>
          </div>
          <div className="lg:col-span-5 rounded-xl bg-ink text-paper p-7">
            <p className="eyebrow !text-accent-200">Pipeline's posture</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-paper-200">
              We work for the candidate — not the company. We never auto-send on LinkedIn. We refuse
              to be a black box: every send is grounded in a specific signal you can audit. Fee
              structure aligns: if you don't get hired, we don't get paid.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── 03 Agents ─────────────────────────────────────────────── */}
      <Section number="03" eyebrow="The system" title="Nine agents, one Personal Context Model.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {AGENTS.map((a) => (
            <article key={a.name} className="card p-6 card-interactive">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-md bg-ink text-paper grid place-items-center">
                  <a.icon className="h-4 w-4" />
                </span>
                <p className="font-display text-[16px] tracking-tightish font-medium text-ink">{a.name}</p>
                <span className="ml-auto pill pill-outline">{a.cadence}</span>
              </div>
              <p className="mt-4 text-[13.5px] leading-[1.6] text-ink-700">{a.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ─── 04 Daily loop ─────────────────────────────────────────── */}
      <Section number="04" eyebrow="The daily loop · 5–10 minutes" title="Three cards. One coffee. Done.">
        <div className="grid md:grid-cols-3 gap-4">
          <DayCard
            tone="ink"
            title="What happened"
            lines={[
              "12 new triggering events overnight.",
              "4 are high-priority — Augury announced a new CPTO.",
              "Reid Larson moves from Watch → Hot."
            ]}
          />
          <DayCard
            tone="accent"
            title="What's ready"
            lines={[
              "8 drafts ready for your review.",
              "2 tailored applications.",
              "1 warm-intro request.",
              "3 follow-ups queued."
            ]}
          />
          <DayCard
            tone="paper"
            title="What's next"
            lines={[
              "6 sends going out 9–11am.",
              "Calendar hold for Sarah Chen Thursday.",
              "Pipeline Manager: 'manufacturing exec churn' campaign at 28% reply — doubling down."
            ]}
          />
        </div>
      </Section>

      {/* ─── 05 Pricing ────────────────────────────────────────────── */}
      <Section number="05" eyebrow="Pricing" title="Aligned incentives. Software margins.">
        <div className="grid md:grid-cols-3 gap-4">
          <PriceCard
            tier="Solo"
            name="Pipeline"
            price="$149"
            suffix="/mo + $1,500 success"
            features={[
              "Full multi-agent system",
              "100 targets / month",
              "Unlimited approvals",
              "Resume tailoring",
              "Gmail + Calendar",
              "Tap-to-send LinkedIn queue"
            ]}
          />
          <PriceCard
            tier="In transition"
            name="Pipeline+"
            price="$249"
            suffix="/mo + $1,500 success"
            highlight
            features={[
              "Everything in Solo",
              "Unlimited targets",
              "Weekly strategy synthesis",
              "Real-time signal alerts",
              "Priority compute",
              "Live human coach (1 hr / mo)"
            ]}
          />
          <PriceCard
            tier="Job found"
            name="Concierge"
            price="$3,000"
            suffix="flat · on offer accepted"
            features={[
              "White-glove onboarding",
              "Custom thesis development",
              "Senior coach pairing",
              "Negotiation support",
              "12-month re-engagement guarantee",
              "Vetted candidates only"
            ]}
          />
        </div>
      </Section>

      {/* ─── Waitlist ──────────────────────────────────────────────── */}
      <section className="border-t border-ink/10 bg-paper-50">
        <div className="mx-auto max-w-page px-6 py-20 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <p className="eyebrow eyebrow-dot">Founding cohort</p>
            <h2 className="mt-3 font-display text-[36px] md:text-[44px] tracking-tightest leading-[1.04] font-medium text-ink text-balance">
              A short waitlist. A serious cohort.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.7] text-ink-700 max-w-prose">
              Pipeline is open to its first 25 design partners. VP/Director-level operators in active
              transition at $200K+ comp. Grandfathered $99/month. No success fee for the cohort.
              Pipeline holds itself accountable to the placement metric.
            </p>
            <ul className="mt-7 grid gap-3 max-w-md">
              {[
                ["First-degree network priority", "We'll work your warm graph before going cold."],
                ["Weekly cohort calls with Devin", "Founder-led; small group; agenda-driven."],
                ["Lifetime grandfathered pricing", "Whatever the price becomes, you keep yours."]
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3 items-start">
                  <span className="dot dot-cool mt-2" />
                  <div>
                    <p className="text-[14px] font-medium text-ink">{t}</p>
                    <p className="text-[13px] text-ink-500">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Section wrappers ──────────────────────────────────────────── */

function Section({
  number,
  eyebrow,
  title,
  children
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10">
      <div className="mx-auto max-w-page px-6 py-16 md:py-24">
        <header className="mb-10 grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-2 flex items-baseline gap-3">
            <span className="font-display tabular text-[44px] tracking-tightest text-accent leading-none">
              {number}
            </span>
            <span className="rule-accent w-12 mb-3" />
          </div>
          <div className="lg:col-span-10">
            <p className="eyebrow-quiet">{eyebrow}</p>
            <h2 className="mt-2 font-display text-[32px] md:text-[42px] tracking-tightest leading-[1.04] font-medium text-ink text-balance">
              {title}
            </h2>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

function Stat({ eyebrow, value, unit, caption }: { eyebrow: string; value: string; unit: string; caption: string }) {
  return (
    <div className="px-6 py-6 md:py-2 flex items-baseline gap-5">
      <div>
        <p className="eyebrow-quiet">{eyebrow}</p>
        <p className="metric mt-2 leading-none">
          {value}
          <span className="text-ink-300 text-[22px] ml-1.5 font-display tracking-tighter">{unit}</span>
        </p>
        <p className="mt-3 text-[12.5px] text-ink-500 leading-snug max-w-[34ch]">{caption}</p>
      </div>
    </div>
  );
}

function CompetitorRow({ name, pricing, body }: { name: string; pricing: string; body: string }) {
  return (
    <tr>
      <td className="bg-paper-50 align-top px-6 py-5 w-64 border-r border-ink/8">
        <p className="font-display text-[15.5px] tracking-tightish font-medium text-ink">{name}</p>
        <p className="mt-1 text-[11.5px] uppercase tracking-wider text-ink-500">{pricing}</p>
      </td>
      <td className="align-top px-6 py-5 text-ink-700 leading-[1.65] text-pretty">{body}</td>
    </tr>
  );
}

function DayCard({ tone, title, lines }: { tone: "ink" | "accent" | "paper"; title: string; lines: string[] }) {
  const cls =
    tone === "ink"
      ? "bg-ink text-paper border-ink"
      : tone === "accent"
      ? "bg-accent/10 text-ink border-accent/30"
      : "bg-white text-ink border-ink/10";
  const eyebrowCls =
    tone === "ink" ? "!text-accent-200" : tone === "accent" ? "" : "";
  return (
    <article className={`${cls} border rounded-xl p-7 ${tone === "ink" ? "grain" : ""}`}>
      <p className={`eyebrow ${eyebrowCls}`}>{title}</p>
      <ul className={`mt-5 space-y-3 text-[14px] leading-relaxed ${tone === "ink" ? "text-paper" : "text-ink-700"}`}>
        {lines.map((l, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className={`dot ${tone === "ink" ? "dot-ink !bg-paper-200" : "dot-cool"} mt-2`} />
            <span className="flex-1">{l}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PriceCard({
  tier,
  name,
  price,
  suffix,
  features,
  highlight
}: {
  tier: string;
  name: string;
  price: string;
  suffix: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <article
      className={`relative rounded-xl p-7 ${
        highlight
          ? "bg-ink text-paper border border-ink shadow-lift grain"
          : "bg-white border border-ink/10 shadow-card"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-7 pill pill-accent !bg-accent !text-paper">Most chosen</span>
      )}
      <p className={`eyebrow ${highlight ? "!text-accent-200" : ""}`}>{tier}</p>
      <p className={`mt-3 font-display text-[20px] tracking-tightish font-medium ${highlight ? "text-paper" : "text-ink"}`}>
        {name}
      </p>
      <p className={`mt-5 font-display tracking-tightest text-[52px] leading-none tabular ${highlight ? "text-paper" : "text-ink"}`}>
        {price}
      </p>
      <p className={`mt-2 text-[12.5px] ${highlight ? "text-paper-200" : "text-ink-500"}`}>{suffix}</p>
      <ul className={`mt-7 space-y-2.5 text-[13.5px] ${highlight ? "text-paper-200" : "text-ink-700"}`}>
        {features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${highlight ? "bg-accent-200" : "bg-accent"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/onboarding"
        className={`mt-7 ${highlight ? "btn-accent" : "btn-secondary"} w-full text-[13.5px]`}
      >
        Choose {name}
      </Link>
    </article>
  );
}

const AGENTS = [
  { name: "1 · Strategist",       cadence: "weekly",        body: "Synthesizes the user's commercial thesis. Maps target archetypes. Generates campaign themes.", icon: Compass },
  { name: "2 · Scout",            cadence: "continuous",    body: "Ingests funding announcements, leadership changes, postings, conference rosters. Scores by relevance, freshness, and actionability.", icon: Search },
  { name: "3 · Researcher",       cadence: "per-target",    body: "Generates a 1-page dossier — recent posts, podcast appearances, mutual connections, company news, recent product launches.", icon: FileText },
  { name: "4 · Verifier",         cadence: "pre-send",      body: "Validates email addresses across multiple providers. Checks for risk signals. Issues a green/yellow/red light.", icon: Mail },
  { name: "5 · Drafter",          cadence: "per-target",    body: "Writes outreach in the user's voice using the dossier and thesis. Multiple variants. Always grounded in something specific.", icon: Sparkles },
  { name: "6 · Sender",           cadence: "continuous",    body: "After approval, ships emails from the user's connected Gmail. LinkedIn drafts go to a tap-to-send queue (compliance-safe).", icon: Send },
  { name: "7 · Follow-up",        cadence: "daily",         body: "Watches the inbox, classifies replies, drafts the right next move. Books slots for positives. Schedules nudges for non-responses.", icon: Inbox },
  { name: "8 · Scheduler",        cadence: "on agreement",  body: "Connects to Google Calendar. Proposes times that respect the user's preferences. Adds pre-meeting briefs.", icon: Calendar },
  { name: "9 · Pipeline Manager", cadence: "daily + weekly", body: "The meta-agent. Looks at the full pipeline, identifies bottlenecks, suggests campaign pivots, generates the Sunday strategy memo.", icon: Users }
];

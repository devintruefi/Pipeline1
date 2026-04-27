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
  Quote,
  GraduationCap,
  Briefcase,
  Crown
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
            <p className="eyebrow eyebrow-dot">Founding cohort · open · 250 seats</p>
            <h1 className="mt-6 font-display font-medium text-ink leading-[0.92] tracking-tightest text-[68px] md:text-[110px] lg:text-[128px]">
              Pipeline.
            </h1>
            <p className="mt-4 font-display italic text-[26px] md:text-[36px] text-ink-700 leading-[1.1] tracking-tightish max-w-[24ch]">
              An autonomous job&nbsp;search, for every level.
            </p>
            <div className="rule-thick mt-7 max-w-[280px]" />
            <p className="mt-7 max-w-[58ch] text-[17px] md:text-[18px] leading-[1.6] text-ink-700 text-pretty">
              An AI chief of staff that runs your entire search end-to-end — researching the right
              opportunities, writing application materials in your voice, sending them, handling
              follow-ups, and putting interviews on your calendar. Whether you're a senior in
              college, a senior at a company that just laid you off, or a CRO between roles.
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
                "Job-search labor compounds. The same playbook works at every level — only the
                signals, the receipts, and the price change."
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 pt-5 border-t border-paper/10">
                <div>
                  <p className="eyebrow !text-paper-200">Prepared by</p>
                  <p className="mt-1.5 text-[14px] font-medium text-paper">Devin Patel</p>
                  <p className="text-[12px] text-paper-200">Founder · Pipeline</p>
                </div>
                <div>
                  <p className="eyebrow !text-paper-200">Version</p>
                  <p className="mt-1.5 text-[14px] font-medium text-paper">v1.1</p>
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

      {/* ─── Three audiences ─────────────────────────────────────────── */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-page px-6 py-16">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5">
              <p className="eyebrow">Three tiers · one architecture</p>
              <h2 className="h-section mt-3">
                The same nine&nbsp;agents. Tuned for where you are in your career.
              </h2>
            </div>
            <p className="lg:col-span-7 text-[16px] text-ink-700 leading-relaxed text-pretty">
              The receipts you carry, the signals worth chasing, and the cadence that wins are all
              different at twenty-two than at fifty-two. Pipeline runs the same multi-agent loop —
              but Launch is built around alumni networks and ATS hygiene; Pro around laid-off
              professionals with real receipts; Max around exec-grade outreach with peer leverage.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: GraduationCap,
                tier: "Launch",
                price: "$19/mo",
                who: "Students, new grads, internships, first-time job seekers.",
                line: "ATS-optimized applications, cover letters that adapt per role, and an alumni-finder that turns LinkedIn into warm intros."
              },
              {
                icon: Briefcase,
                tier: "Pro",
                price: "$79/mo",
                who: "Mid-career, senior IC, anyone laid off with a real track record.",
                line: "Voice-fingerprinted outreach grounded in your receipts, signal alerts on funding and leadership change, and the Sunday memo to keep momentum honest."
              },
              {
                icon: Crown,
                tier: "Max",
                price: "$299/mo + $1,500 placement fee",
                who: "VPs, GMs, CROs, founders. Peer-to-peer leverage at the top.",
                line: "Real-time signal alerts, custom thesis development, full Opus-tier agent depth, and a live coach for the moments the model can't handle alone."
              }
            ].map(({ icon: Icon, tier, price, who, line }) => (
              <div key={tier} className="card p-6">
                <div className="flex items-center gap-2.5 text-accent">
                  <Icon className="h-5 w-5" />
                  <span className="font-display text-[20px] text-ink leading-none">
                    Pipeline {tier}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-ink-500 tabular">{price}</p>
                <p className="mt-4 text-[13.5px] font-medium text-ink-800 leading-snug">
                  {who}
                </p>
                <p className="mt-2 text-[14px] text-ink-700 leading-relaxed text-pretty">
                  {line}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/pricing" className="btn-secondary">
              Compare tiers in detail <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────────────────── */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-page px-6 py-16">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5">
              <p className="eyebrow">How it works</p>
              <h2 className="h-section mt-3">
                Nine specialised agents, one approval queue.
              </h2>
            </div>
            <p className="lg:col-span-7 text-[16px] text-ink-700 leading-relaxed text-pretty">
              Pipeline never sends anything you haven't seen. The agents do the research, the
              writing, the routing, the follow-up — and then surface a small queue of decisions
              you can approve in seconds. Most days that's two minutes of work for hours of
              compound progress.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Compass, title: "Strategist", body: "Synthesises your thesis from your receipts and the role you want next." },
              { icon: Search, title: "Scout", body: "Watches funding rounds, leadership changes, posted roles, conferences — daily." },
              { icon: FileText, title: "Researcher", body: "Builds a 1-page dossier per target — recent posts, mutuals, hooks, red flags." },
              { icon: Sparkles, title: "Drafter", body: "Writes voice-fingerprinted outreach grounded in a single dossier line." },
              { icon: Mail, title: "Verifier + Sender", body: "Validates email, scores risk, ships through your Gmail at the right hour." },
              { icon: Inbox, title: "Follow-up", body: "Classifies replies — positive, scheduling, auto-reply — and proposes the next move." },
              { icon: Calendar, title: "Scheduler", body: "Negotiates time slots inside your send-window and writes a pre-meeting brief." },
              { icon: Users, title: "Pipeline Manager", body: "Surfaces bottlenecks each Sunday and recommends the pivots that compound." }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-5">
                <div className="text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-[18px] text-ink leading-tight">{title}</p>
                <p className="mt-2 text-[13.5px] text-ink-700 leading-relaxed text-pretty">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/how-it-works" className="btn-secondary">
              Walk through the full loop <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Three voices ────────────────────────────────────────────── */}
      <section className="border-b border-ink/10 bg-paper-50">
        <div className="mx-auto max-w-page px-6 py-16">
          <p className="eyebrow text-center">Three searches, three outcomes</p>
          <h2 className="h-section mt-3 text-center max-w-[24ch] mx-auto">
            Different rooms. Same playbook.
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              {
                tier: "Launch",
                pull: "Pipeline turned my LinkedIn into nine introductions before the campus career fair even started.",
                attrib: "Maya — graduating senior, computer science",
                stat: "9 intros · 3 internship offers · 14 days"
              },
              {
                tier: "Pro",
                pull: "I got cut on a Tuesday. By Friday I had three interviews booked and a reason to feel like myself again.",
                attrib: "Daniel — director of product, ex-Stripe",
                stat: "3 interviews · 2 offers · 6 weeks"
              },
              {
                tier: "Max",
                pull: "It compresses the work that two recruiters and an executive coach were doing for me into one inbox.",
                attrib: "Marcus — VP Sales, Series C SaaS",
                stat: "Search to offer · 9 weeks"
              }
            ].map(({ tier, pull, attrib, stat }) => (
              <figure key={tier} className="card p-6">
                <p className="eyebrow">{tier}</p>
                <Quote className="h-5 w-5 mt-3 text-accent" />
                <blockquote className="mt-3 font-display italic text-[20px] leading-snug text-ink text-balance">
                  {pull}
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-ink/8 text-[12.5px] text-ink-500">
                  {attrib}
                </figcaption>
                <p className="mt-1 text-[12px] text-ink-700 tabular">{stat}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Waitlist ────────────────────────────────────────────────── */}
      <section className="bg-ink text-paper grain">
        <div className="mx-auto max-w-page px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow !text-accent-200">Founding cohort</p>
              <h2 className="mt-3 font-display text-[44px] md:text-[64px] leading-[0.95] tracking-tightest text-paper">
                Join the search&nbsp;that runs itself.
              </h2>
              <p className="mt-6 max-w-[60ch] text-[16px] text-paper-200 leading-relaxed text-pretty">
                Tell us where you are in your career and what you want next. We'll send a personalised
                onboarding link within 24 hours. Founding-cohort members lock in their tier price
                for life.
              </p>
            </div>
            <div className="lg:col-span-5">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

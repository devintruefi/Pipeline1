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
  Crown,
  ShieldCheck,
  Zap
} from "lucide-react";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { Sparkline } from "@/components/primitives/Sparkline";
import { AgentsOnline } from "@/components/marketing/AgentsOnline";

export default function LandingPage() {
  return (
    <div>
      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="relative border-b border-ink/10 grain mesh-soft">
        <div className="mx-auto max-w-page px-6 pt-16 md:pt-24 pb-16 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow eyebrow-dot">Founding cohort. 250 seats. Now open.</p>
            <h1 className="mt-6 font-display font-medium leading-[0.92] tracking-tightest text-[68px] md:text-[110px] lg:text-[128px]">
              <span className="text-grad-brand">Pipeline</span><span className="text-ink">.</span>
            </h1>
            <p className="mt-4 font-display italic text-[26px] md:text-[36px] text-ink-700 leading-[1.1] tracking-tightish max-w-[26ch]">
              The work happens without you. The decisions don't.
            </p>
            <div className="rule-thick mt-7 max-w-[280px]" />
            <p className="mt-7 max-w-[58ch] text-[17px] md:text-[18px] leading-[1.6] text-ink-700 text-pretty">
              An AI chief of staff for your job search. Nine specialised agents target the right
              opportunities, write outreach in your voice, send from your inbox, handle follow ups,
              and put meetings on your calendar. You approve every move. About ten minutes a day.
              The rest runs in the background.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/onboarding" className="btn-accent btn-lg glow-accent">
                Start your search <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="btn-secondary btn-lg">
                See the Control Center <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/manifesto" className="btn-ghost btn-lg">Read the thesis</Link>
            </div>

            <div className="mt-10">
              <AgentsOnline />
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-3">
            <div className="surface-ink-grad p-6 grain relative overflow-hidden">
              <p className="eyebrow !text-accent-200">Position paper</p>
              <p className="mt-3 font-display italic text-[20px] leading-[1.25] text-paper text-balance">
                "The work happens without you. The decisions don't."
              </p>
              <p className="mt-4 text-[13.5px] text-paper-200 leading-relaxed">
                Most searches stall not because the candidate isn't trying. They stall because the
                work is the wrong shape for one person. Targeting, drafting, sending, follow up,
                scheduling. Pipeline runs all of it in your voice. You stay focused on the
                conversations that move the offer.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 pt-5 border-t border-paper/10">
                <div>
                  <p className="eyebrow !text-paper-200">Prepared by</p>
                  <p className="mt-1.5 text-[14px] font-medium text-paper">Devin Patel</p>
                  <p className="text-[12px] text-paper-200">Founder, Pipeline</p>
                </div>
                <div>
                  <p className="eyebrow !text-paper-200">Version</p>
                  <p className="mt-1.5 text-[14px] font-medium text-paper">v1.6</p>
                  <p className="text-[12px] text-paper-200">April 2026</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-accent/12 bg-accent-50 p-5">
              <p className="eyebrow-quiet">Live cohort signal</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-[36px] tracking-tightest text-ink leading-none tabular">
                    24<span className="text-ink-300 text-[20px]">%</span>
                  </p>
                  <p className="text-[12px] text-ink-500 mt-1">Reply rate. Cohort average.</p>
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
        <div className="mx-auto max-w-page px-6 py-12 md:py-section">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5">
              <p className="eyebrow">Three tiers. One architecture.</p>
              <h2 className="h-section mt-3">
                One playbook. Tuned for every career stage.
              </h2>
            </div>
            <p className="lg:col-span-7 text-[16px] text-ink-700 leading-relaxed text-pretty">
              The same nine agent loop powers every tier. What changes is what each one optimises
              for. Launch turns alumni networks and ATS hygiene into intern and first job offers.
              Pro pairs real career receipts with high signal outreach to senior hiring managers.
              Max coordinates executive moves where the right warm intro outperforms a hundred
              cold sends.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: GraduationCap,
                tier: "Launch",
                price: "$19/mo",
                who: "Students, new grads, internships, first job seekers.",
                line: "ATS optimized applications, cover letters that adapt per role, and an alumni finder that turns LinkedIn into warm intros."
              },
              {
                icon: Briefcase,
                tier: "Pro",
                price: "$79/mo",
                who: "Mid career, senior IC, anyone laid off with a real track record.",
                line: "Voice fingerprinted outreach grounded in your receipts, signal alerts on funding and leadership change, and the Sunday memo to keep momentum honest."
              },
              {
                icon: Crown,
                tier: "Max",
                price: "$299/mo plus $1,500 placement",
                who: "VPs, GMs, CROs, founders. Executive moves where one warm intro beats a hundred cold sends.",
                line: "Real time signal alerts, custom thesis development, full Opus tier agent depth, and a live coach for the moments the model cannot handle alone."
              }
            ].map(({ icon: Icon, tier, price, who, line }) => (
              <div key={tier} className="card card-interactive p-6">
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
        <div className="mx-auto max-w-page px-6 py-12 md:py-section">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5">
              <p className="eyebrow">How it works</p>
              <h2 className="h-section mt-3">
                Nine agents do the work. You approve.
              </h2>
            </div>
            <p className="lg:col-span-7 text-[16px] text-ink-700 leading-relaxed text-pretty">
              Pipeline does the labor. You make the calls only you can make. Each agent has a
              narrow job: target, research, draft, verify, send, classify, schedule, and review.
              Every outgoing message lands in a queue you approve in seconds. About ten minutes a
              day for hours of compound progress.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Compass, title: "Strategist", body: "Synthesises your thesis from your receipts and the role you want next." },
              { icon: Search, title: "Scout", body: "Watches funding rounds, leadership changes, posted roles, and conferences daily." },
              { icon: FileText, title: "Researcher", body: "Builds a one page dossier per target. Recent posts, mutuals, hooks, red flags." },
              { icon: Sparkles, title: "Drafter", body: "Writes voice fingerprinted outreach grounded in a single dossier line." },
              { icon: Mail, title: "Verifier and Sender", body: "Validates email, scores risk, ships through your Gmail at the right hour." },
              { icon: Inbox, title: "Follow up", body: "Classifies replies and proposes the next move. Positive, scheduling, neutral." },
              { icon: Calendar, title: "Scheduler", body: "Negotiates time slots inside your send window and writes a pre meeting brief." },
              { icon: Users, title: "Pipeline Manager", body: "Surfaces bottlenecks each Sunday and recommends the pivots that compound." }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="card card-interactive p-5">
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
        <div className="mx-auto max-w-page px-6 py-12 md:py-section">
          <p className="eyebrow text-center">Real searches. Real outcomes.</p>
          <h2 className="h-section mt-3 text-center max-w-[24ch] mx-auto">
            Different ladders. Same engine.
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              {
                tier: "Launch",
                pull: "Pipeline turned my LinkedIn into nine introductions before the campus career fair even started.",
                attrib: "Maya. Graduating senior, computer science.",
                stat: "9 intros. 3 internship offers."
              },
              {
                tier: "Pro",
                pull: "I got cut on a Tuesday. By Friday I had three interviews booked and a reason to feel like myself again.",
                attrib: "Daniel. Director of product, ex Stripe.",
                stat: "3 interviews. 2 offers."
              },
              {
                tier: "Max",
                pull: "It compresses the work that two recruiters and an executive coach were doing for me into one inbox.",
                attrib: "Marcus. VP Sales, Series C SaaS.",
                stat: "Two recruiters' workload, in one inbox."
              }
            ].map(({ tier, pull, attrib, stat }) => (
              <figure key={tier} className="card card-interactive p-6">
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

      {/* ─── Numbers strip ───────────────────────────────────────────── */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-page px-6 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {[
              { value: "60+", label: "Touchpoints per active campaign, without lifting a finger" },
              { value: "24%", label: "Cohort average reply rate" },
              { value: "10 min", label: "Daily approval queue review" },
              { value: "$2.40", label: "Average Claude cost per active user per week" }
            ].map(({ value, label }) => (
              <div key={value}>
                <p className="font-display text-[40px] md:text-[48px] tracking-tightest leading-none tabular text-ink">
                  {value}
                </p>
                <p className="mt-3 text-[12.5px] text-ink-500 leading-relaxed max-w-[28ch]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Waitlist ────────────────────────────────────────────────── */}
      <section className="text-paper grain [background:radial-gradient(60%_120%_at_50%_0%,rgb(30_41_70)_0%,rgb(11_18_32)_55%,rgb(7_11_22)_100%)]">
        <div className="mx-auto max-w-page px-6 py-16 md:py-section-lg">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow !text-accent-200">Founding cohort</p>
              <h2 className="mt-3 font-display text-[44px] md:text-[64px] leading-[0.95] tracking-tightest text-paper">
                Join the search&nbsp;that runs itself.
              </h2>
              <p className="mt-6 max-w-[60ch] text-[16px] text-paper-200 leading-relaxed text-pretty">
                Tell us where you are and what you want next. We send a personalised onboarding
                link within 24 hours. Most members are running their first sequence inside a week.
                Founding cohort pricing is locked for life.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-[12.5px] text-paper-200">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-200" />
                  SOC 2 in review
                </span>
                <span className="inline-flex items-center gap-2">
                  <Zap className="h-4 w-4 text-highlight-200" />
                  Hourly tick on Pro and Max
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-200" />
                  Anthropic Claude under the hood
                </span>
              </div>
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

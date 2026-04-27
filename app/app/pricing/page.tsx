import Link from "next/link";
import { PLANS } from "@/lib/billing/plans";
import { Check, ArrowRight } from "lucide-react";

const TIER_LABEL: Record<string, string> = {
  solo: "Solo",
  plus: "In transition",
  concierge: "Job found"
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow eyebrow-dot">Pricing</p>
        <h1 className="mt-4 font-display text-[44px] md:text-[60px] tracking-tightest leading-[1.0] font-medium text-ink text-balance">
          Aligned with the outcome you actually want.
        </h1>
        <p className="mt-5 text-[16.5px] leading-[1.65] text-ink-700 text-pretty">
          Low monthly cost so it's a no-brainer for an executive in transition. Meaningful success fee
          so Pipeline cares about quality of placement, not volume of activity. Total cost is roughly
          0.5% of first-year compensation at a $300K target — one-sixtieth the cost of a retained
          recruiter.
        </p>
      </header>

      <div className="mt-14 grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const tierLabel = TIER_LABEL[p.id] ?? p.id;
          const isHighlight = p.highlight;
          return (
            <article
              key={p.id}
              className={`relative rounded-xl p-7 ${
                isHighlight
                  ? "bg-ink text-paper border border-ink shadow-lift grain"
                  : "bg-white border border-ink/10 shadow-card"
              }`}
            >
              {isHighlight && (
                <span className="absolute -top-3 left-7 pill pill-accent !bg-accent !text-paper">
                  Most chosen
                </span>
              )}
              <p className={`eyebrow ${isHighlight ? "!text-accent-200" : ""}`}>{tierLabel}</p>
              <p
                className={`mt-3 font-display text-[22px] tracking-tightish font-medium ${
                  isHighlight ? "text-paper" : "text-ink"
                }`}
              >
                {p.name}
              </p>

              <p
                className={`mt-6 font-display tracking-tightest text-[56px] leading-none tabular ${
                  isHighlight ? "text-paper" : "text-ink"
                }`}
              >
                ${p.monthly || p.successFee.toLocaleString()}
              </p>
              <p className={`mt-2 text-[12.5px] ${isHighlight ? "text-paper-200" : "text-ink-500"}`}>
                {p.monthly
                  ? `/month + $${p.successFee.toLocaleString()} success fee`
                  : "flat · on offer accepted"}
              </p>

              <ul
                className={`mt-7 space-y-2.5 text-[13.5px] ${
                  isHighlight ? "text-paper-200" : "text-ink-700"
                }`}
              >
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 items-start">
                    <Check
                      className={`h-3.5 w-3.5 mt-1 shrink-0 ${
                        isHighlight ? "text-accent-200" : "text-accent"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/onboarding"
                className={`mt-7 ${isHighlight ? "btn-accent" : "btn-secondary"} w-full text-[13.5px]`}
              >
                Choose {p.name} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </div>

      {/* Unit economics + rationale */}
      <section className="mt-20 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <p className="eyebrow-quiet">Unit economics</p>
          <h2 className="mt-2 font-display text-[28px] md:text-[34px] tracking-tightest leading-[1.08] font-medium text-ink text-balance">
            On a typical Pipeline+ user.
          </h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-[14px]">
              <tbody className="divide-y divide-ink/8">
                <EconRow label="Subscription revenue" value="$1,494" sub="$249/mo × 6 months" />
                <EconRow label="Success fee" value="$1,500" sub="On offer accepted" />
                <EconRow label="Gross revenue per placed user" value="$2,994" emphasized />
                <EconRow label="Variable costs" value="−$360" sub="LLM + email infra" />
                <EconRow label="Payment processing" value="−$90" sub="Stripe ~3%" />
                <EconRow label="Gross margin per placed user" value="$2,544" emphasized accent suffix="(85%)" />
              </tbody>
            </table>
          </div>
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border-l-2 border-accent bg-paper-50 p-6">
            <p className="eyebrow">Why not pure subscription</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700 text-pretty">
              A flat $99/mo subscription would underprice the value of an offer. A flat $5K
              success-only fee would create perverse incentives to claim attribution.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700 text-pretty">
              Modest monthly + meaningful success fee produces the right incentives on both sides:
              users only stay paying if they're getting real pipeline value, and Pipeline is
              rewarded for actually closing.
            </p>
          </div>

          <div className="rounded-xl bg-ink text-paper p-6">
            <p className="eyebrow !text-accent-200">vs. a retained recruiter</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-[36px] tracking-tightest leading-none tabular text-paper">
                  $90k
                </p>
                <p className="mt-1 text-[12px] text-paper-200">Recruiter at $300k comp</p>
              </div>
              <div>
                <p className="font-display text-[36px] tracking-tightest leading-none tabular text-accent-200">
                  $3k
                </p>
                <p className="mt-1 text-[12px] text-paper-200">Pipeline+, fully placed</p>
              </div>
            </div>
            <p className="mt-5 text-[12.5px] text-paper-200 leading-relaxed">
              And a recruiter works for the company. Pipeline works for you.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function EconRow({
  label,
  value,
  sub,
  emphasized,
  accent,
  suffix
}: {
  label: string;
  value: string;
  sub?: string;
  emphasized?: boolean;
  accent?: boolean;
  suffix?: string;
}) {
  return (
    <tr className={accent ? "bg-accent/8" : emphasized ? "bg-paper-50" : ""}>
      <td className={`py-3 px-4 ${emphasized ? "font-medium text-ink" : "text-ink-700"}`}>
        <p>{label}</p>
        {sub && <p className="text-[11.5px] text-ink-500 mt-0.5">{sub}</p>}
      </td>
      <td
        className={`py-3 px-4 text-right tabular ${
          emphasized ? "font-display text-[18px] tracking-tightish font-medium text-ink" : "text-ink-700"
        }`}
      >
        {value} {suffix && <span className="text-ink-500 text-[12px]">{suffix}</span>}
      </td>
    </tr>
  );
}

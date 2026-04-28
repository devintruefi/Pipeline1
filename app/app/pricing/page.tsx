import Link from "next/link";
import { Check, ArrowRight, GraduationCap, Briefcase, Crown } from "lucide-react";
import { PLANS } from "@/lib/billing/plans";

const ICON_BY_PLAN = {
  launch: GraduationCap,
  pro: Briefcase,
  max: Crown
} as const;

export default function PricingPage() {
  return (
    <div className="bg-paper">
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-page px-6 py-16">
          <p className="eyebrow eyebrow-dot">Pricing · founding-cohort rates</p>
          <h1 className="mt-4 font-display text-[44px] md:text-[64px] leading-[0.96] tracking-tightest text-ink">
            Three tiers. One architecture.
          </h1>
          <p className="mt-6 max-w-[64ch] text-[17px] text-ink-700 leading-relaxed text-pretty">
            The agents are the same. What changes is the cadence, the model tier, the volume cap,
            and the kinds of signals worth chasing. Pick the tier that matches where you are now.
            you can move up at any time without losing your context model.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-page px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const Icon = ICON_BY_PLAN[plan.id];
              return (
                <article
                  key={plan.id}
                  className={
                    plan.highlight
                      ? "surface-ink-grad p-7 grain shadow-lift"
                      : "card p-7"
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-5 w-5 ${
                        plan.highlight ? "text-highlight-200" : "text-accent"
                      }`}
                    />
                    <p
                      className={`eyebrow ${
                        plan.highlight ? "!text-highlight-200" : ""
                      }`}
                    >
                      {plan.tagline}
                    </p>
                  </div>
                  <h2
                    className={`mt-3 font-display text-[34px] tracking-tightest leading-tight ${
                      plan.highlight ? "text-paper" : "text-ink"
                    }`}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className={`mt-2 text-[14px] leading-relaxed ${
                      plan.highlight ? "text-paper-200" : "text-ink-700"
                    }`}
                  >
                    {plan.audience}
                  </p>

                  <div
                    className={`mt-6 pt-6 border-t ${
                      plan.highlight ? "border-paper/15" : "border-ink/8"
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`font-display text-[48px] tracking-tightest leading-none tabular ${
                          plan.highlight ? "text-paper" : "text-ink"
                        }`}
                      >
                        ${plan.monthly}
                      </span>
                      <span
                        className={`text-[14px] ${
                          plan.highlight ? "text-paper-200" : "text-ink-500"
                        }`}
                      >
                        /month
                      </span>
                    </div>
                    {plan.successFee > 0 && (
                      <p
                        className={`mt-2 text-[12.5px] ${
                          plan.highlight ? "text-paper-200" : "text-ink-500"
                        }`}
                      >
                        + ${plan.successFee.toLocaleString()} placement fee on accepted offer
                      </p>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex gap-2.5 text-[13.5px] leading-relaxed ${
                          plan.highlight ? "text-paper" : "text-ink-800"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 flex-none mt-0.5 ${
                            plan.highlight ? "text-highlight-200" : "text-accent"
                          }`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`mt-6 pt-6 border-t text-[12px] space-y-1.5 ${
                      plan.highlight
                        ? "border-paper/15 text-paper-200"
                        : "border-ink/8 text-ink-500"
                    }`}
                  >
                    <p>
                      <span className="font-medium">Cadence. </span>
                      {plan.cadence}
                    </p>
                    <p>
                      <span className="font-medium">Models. </span>
                      {plan.modelTier}
                    </p>
                  </div>

                  <Link
                    href="/onboarding"
                    className={
                      plan.highlight
                        ? "btn-accent btn-lg mt-7 w-full justify-center"
                        : "btn-primary btn-lg mt-7 w-full justify-center"
                    }
                  >
                    Start with {plan.name.replace("Pipeline ", "")}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-page px-6 py-16">
          <h3 className="h-section">A few notes on pricing.</h3>
          <div className="mt-6 grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-[88ch] text-[15px] text-ink-700 leading-relaxed text-pretty">
            <p>
              <span className="font-medium text-ink">Founding-cohort lock-in.</span> The first 250
              members of each tier keep their monthly rate forever. We're learning what each
              audience actually needs, and we'd rather earn loyalty than test elasticity.
            </p>
            <p>
              <span className="font-medium text-ink">Move tiers without losing context.</span> Your
              identity, thesis, target profile, constraints, and live context follow you up or down
              the ladder. Graduating from Launch into a real role means the same model that helped
              you find it can help you find the next one.
            </p>
            <p>
              <span className="font-medium text-ink">Placement fee on Max.</span> We bet on the
              outcome with you. Max charges $1,500 only on an offer you accept. If the search
              doesn't land, you only paid for the months we worked together.
            </p>
            <p>
              <span className="font-medium text-ink">No data sold, ever.</span> We don't share your
              receipts, your dossier, or your outreach with anyone. Pipeline is a tool you wield.
              not a marketplace someone wields against you.
            </p>
          </div>
          <div className="mt-10">
            <Link href="/onboarding" className="btn-accent btn-lg">
              Start your search <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { PLANS } from "@/lib/billing/plans";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-14">
      <p className="eyebrow">Pricing</p>
      <h1 className="h-section mt-2">Aligned with the outcome you actually want.</h1>
      <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink-700">
        Low monthly cost so it's a no-brainer for an unemployed executive. Meaningful success fee so
        Pipeline cares about quality of placement, not volume of activity. Total cost is roughly 0.5%
        of first-year compensation at a $300K target — one-sixtieth the cost of a retained recruiter.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {PLANS.map((p) => (
          <div key={p.id} className={`rounded-md p-7 ${p.highlight ? "bg-ink text-paper border border-ink" : "bg-white border border-ink/10"}`}>
            <p className={`eyebrow ${p.highlight ? "text-accent-200" : ""}`}>{p.id === "solo" ? "Solo" : p.id === "plus" ? "In transition" : "Job found"}</p>
            <p className={`mt-2 font-semibold tracking-tighter text-[20px] ${p.highlight ? "text-paper" : "text-ink"}`}>{p.name}</p>
            <p className={`mt-4 font-semibold tracking-tighter text-[44px] ${p.highlight ? "text-paper" : "text-ink"}`}>${p.monthly || p.successFee}{p.monthly ? "" : ""}</p>
            <p className={`text-[12.5px] ${p.highlight ? "text-paper-200" : "text-ink-500"}`}>
              {p.monthly ? `/month + $${p.successFee.toLocaleString()} success fee` : `flat, on offer acceptance`}
            </p>
            <ul className={`mt-6 space-y-2 text-[13.5px] ${p.highlight ? "text-paper-200" : "text-ink-700"}`}>
              {p.features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tightish text-ink">Unit economics, on a typical Pipeline+ user.</h2>
          <table className="mt-4 w-full text-[14px]">
            <tbody className="divide-y divide-ink/10">
              <tr><td className="py-2">Subscription revenue</td><td className="py-2 text-right">$1,494</td></tr>
              <tr><td className="py-2">Success fee</td><td className="py-2 text-right">$1,500</td></tr>
              <tr><td className="py-2 font-semibold">Gross revenue per placed user</td><td className="py-2 text-right font-semibold">$2,994</td></tr>
              <tr><td className="py-2">Variable costs</td><td className="py-2 text-right">$360</td></tr>
              <tr><td className="py-2">Payment processing</td><td className="py-2 text-right">$90</td></tr>
              <tr className="bg-accent/15"><td className="py-2 font-semibold">Gross margin per placed user</td><td className="py-2 text-right font-semibold">$2,544 (85%)</td></tr>
            </tbody>
          </table>
        </div>
        <div className="text-[14px] leading-relaxed text-ink-700 space-y-3">
          <h2 className="text-[20px] font-semibold tracking-tightish text-ink">Why not pure subscription.</h2>
          <p>
            A flat $99/mo subscription would underprice the value of an offer. A flat $5K success-only
            fee would create perverse incentives to claim attribution.
          </p>
          <p>
            Modest monthly + meaningful success fee produces the right incentives on both sides:
            users only stay paying if they're getting real pipeline value, and Pipeline is rewarded
            for actually closing.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * TrustedBy. a quiet logo strip referencing the cohort's prior employers.
 *
 * Companies are rendered as wordmarks in the editorial display family so
 * the strip feels like a footnote in a New Yorker piece, not a logo wall
 * on a SaaS landing page. The opacity is low; the eye reads it as
 * provenance, not advertising.
 */

const COMPANIES = [
  "Stripe",
  "Anthropic",
  "Vercel",
  "Linear",
  "Notion",
  "Ramp",
  "Mercury",
  "Figma"
];

export function TrustedBy() {
  return (
    <div>
      <p className="eyebrow-quiet text-center">
        Founding cohort members come from
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
        {COMPANIES.map((c) => (
          <span
            key={c}
            className="font-display text-[18px] md:text-[22px] tracking-tightish text-ink-700"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

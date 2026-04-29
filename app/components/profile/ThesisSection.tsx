import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "./Section";
import type { Thesis } from "@/lib/db/schema";

/**
 * Read-only thesis surface. The thesis is synthesised by the Strategist
 * during onboarding; users can re-run that conversation to refresh it.
 * We don't let them hand-edit it because the downstream agents read it
 * verbatim and a malformed shape would break drafts.
 */
export function ThesisSection({ thesis }: { thesis: Thesis | null }) {
  return (
    <Section
      eyebrow="06 · Thesis"
      title="What the Strategist heard"
      description="The thesis anchors every other agent. It's read-only here. To refine it, run the Strategist conversation again — your existing answers stay, and only what changes gets re-synthesised."
    >
      {thesis ? (
        <div className="space-y-5">
          <div>
            <p className="eyebrow !text-ink-500 !mt-0">Positioning</p>
            <p className="mt-2 font-display italic text-[18px] leading-snug text-ink text-balance max-w-[60ch]">
              "{thesis.positioning}"
            </p>
          </div>
          {thesis.proofPoints?.length > 0 && (
            <div>
              <p className="eyebrow !text-ink-500 !mt-0">Proof points</p>
              <ul className="mt-2 space-y-1.5 text-[13.5px] text-ink-700">
                {thesis.proofPoints.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-ink-300 tabular shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {thesis.archetypes?.length > 0 && (
            <div>
              <p className="eyebrow !text-ink-500 !mt-0">Archetypes Scout watches for</p>
              <ul className="mt-2 grid sm:grid-cols-2 gap-3">
                {thesis.archetypes.map((a, i) => (
                  <li key={i} className="rounded-lg bg-paper-50 border border-ink/8 px-4 py-3">
                    <p className="text-[13px] font-medium text-ink">{a.label}</p>
                    <p className="mt-1 text-[12px] text-ink-500 leading-relaxed">{a.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="pt-3 border-t border-ink/8 flex items-center gap-2">
            <Link href="/onboarding/strategy" className="btn-secondary text-[12.5px]">
              Re-run the Strategist
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {thesis.refinedAt && (
              <span className="text-[11.5px] text-ink-400 ml-auto">
                Last refined {new Date(thesis.refinedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-[13px] text-ink-500">
          <p>You haven't run the Strategist conversation yet.</p>
          <Link href="/onboarding/strategy" className="mt-3 inline-flex btn-primary text-[12.5px]">
            Run the Strategist now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </Section>
  );
}

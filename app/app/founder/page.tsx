import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FounderPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
      <p className="eyebrow eyebrow-dot">Founder story</p>
      <h1 className="mt-5 font-display text-[44px] md:text-[56px] tracking-tightest leading-[1.0] font-medium text-ink text-balance">
        I built Pipeline because I needed it.
      </h1>
      <div className="rule-thick mt-8 max-w-[220px]" />

      <div className="mt-10 space-y-6 text-[16.5px] md:text-[17.5px] leading-[1.7] text-ink-800">
        <p className="drop-cap text-pretty">
          I spent the back half of last year running my own VP-level job search the old way.
          spreadsheets, manual sourcing, half-finished follow-ups, and a private Slack channel of
          operators all complaining about the same thing. The bottleneck was never motivation. It was
          leverage.
        </p>

        <p className="text-pretty">
          So I built Pipeline. First as a personal tool, then as a system, then as a product. I used
          it on myself, found the load-bearing pieces, and quietly opened it to a few friends who
          were in the same spot. The pattern was the same across all of us. an executive who knew
          exactly what they wanted but had no leverage to find it. Pipeline became the leverage.
        </p>

        <p className="text-pretty">
          We are opening the founding cohort to twenty-five senior operators. If that's you, and
          you're in active transition, I'd love to talk.
        </p>

        <p className="font-display italic text-[24px] tracking-tightish text-ink leading-snug pt-4">
. Devin
        </p>
      </div>

      <footer className="mt-14 pt-8 border-t border-ink/10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-ink-500">
          Devin Patel · Founder · <a href="mailto:devin@truefi.ai" className="text-ink-700 hover:text-ink underline-offset-4 hover:underline">devin@truefi.ai</a>
        </p>
        <Link href="/onboarding" className="btn-accent text-[13.5px]">
          Apply for the cohort <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </footer>
    </article>
  );
}

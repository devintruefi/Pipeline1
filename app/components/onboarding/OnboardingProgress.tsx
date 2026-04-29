import { Check, ScrollText, MessageCircle, SlidersHorizontal } from "lucide-react";

const PHASES = [
  { n: 1, key: "ingest",      label: "Receipts",   icon: ScrollText,        body: "Resume + voice samples" },
  { n: 2, key: "strategy",    label: "Thesis",     icon: MessageCircle,     body: "Conversation with the Strategist" },
  { n: 3, key: "constraints", label: "Constraints",icon: SlidersHorizontal, body: "Roles · comp · geography · channels" }
] as const;

/**
 * Sticky progress strip at the top of every onboarding page. Three named
 * phases with icons. Past phases get a checkmark and a faded accent fill;
 * the current phase gets the brand gradient bar; future phases are quiet.
 *
 * Anchors the user in the flow so they always know where they are and how
 * much is left.
 */
export function OnboardingProgress({ phase }: { phase: "ingest" | "strategy" | "constraints" }) {
  const currentIdx = PHASES.findIndex((p) => p.key === phase);
  return (
    <div className="border-b border-ink/8 bg-paper-50/80 backdrop-blur-sm">
      <div className="mx-auto max-w-page px-6 py-4 flex items-center gap-3 md:gap-6">
        {PHASES.map(({ n, key, label, icon: Icon, body }, i) => {
          const state =
            i < currentIdx ? "done" : i === currentIdx ? "current" : "todo";
          return (
            <div key={key} className="flex items-center gap-3 min-w-0">
              <span
                className={
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium tabular " +
                  (state === "done"
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : state === "current"
                    ? "bg-ink text-paper border border-ink"
                    : "bg-paper border border-ink/12 text-ink-400")
                }
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : n}
              </span>
              <div className="hidden md:block min-w-0">
                <p
                  className={
                    "text-[12px] font-medium leading-none " +
                    (state === "todo" ? "text-ink-400" : "text-ink")
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                </p>
                <p
                  className={
                    "mt-1 text-[11px] truncate " +
                    (state === "todo" ? "text-ink-300" : "text-ink-500")
                  }
                >
                  {body}
                </p>
              </div>
              <p className="md:hidden text-[12px] font-medium text-ink">
                {state === "current" ? `Phase ${n} of 3 · ${label}` : ""}
              </p>
              {i < PHASES.length - 1 && (
                <div className="hidden md:block flex-1 h-px bg-ink/10 mx-1" />
              )}
            </div>
          );
        })}
        <div className="ml-auto hidden md:block text-[11px] text-ink-400 whitespace-nowrap">
          Phase {currentIdx + 1} of 3
        </div>
      </div>
    </div>
  );
}

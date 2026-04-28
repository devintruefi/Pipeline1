import { Quote } from "lucide-react";

/**
 * Sunday memo. the Pipeline Manager's weekly synthesis. Treated as
 * editorial content: warm paper background, serif italic pull-quote
 * styling, generous leading. Empty state nudges toward Run tick.
 */
export function SundayMemo({ notes }: { notes: string | null }) {
  const lines = (notes ?? "")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <section className="rounded-xl border border-ink/10 bg-paper-50 p-6 grain">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Sunday memo</p>
          <h3 className="h-meta mt-1">From the Pipeline Manager</h3>
        </div>
        <Quote className="h-5 w-5 text-accent rotate-180 shrink-0" strokeWidth={1.5} />
      </header>

      {lines.length === 0 ? (
        <p className="mt-5 text-[13px] text-ink-500 leading-relaxed">
          The Pipeline Manager publishes a synthesis every Sunday. what's working, what's not,
          and the one or two things you should change next week. Run a tick to generate this week's.
        </p>
      ) : (
        <div className="mt-5 space-y-3.5">
          {lines.slice(0, 6).map((line, i) => {
            const isHeading = /^#+\s/.test(line);
            const clean = line.replace(/^#+\s*/, "").replace(/^[-•*]\s*/, "");
            if (isHeading) {
              return (
                <p key={i} className="font-display italic text-[18px] leading-snug text-ink tracking-tightish text-balance">
                  {clean}
                </p>
              );
            }
            return (
              <p key={i} className="text-[13.5px] leading-relaxed text-ink-700 text-pretty">
                {clean}
              </p>
            );
          })}
          {lines.length > 6 && (
            <button className="mt-2 text-[12.5px] text-ink-700 hover:text-ink underline underline-offset-4">
              Read full memo →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

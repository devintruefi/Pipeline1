import { Sparkline } from "@/components/primitives/Sparkline";

/**
 * Single metric tile used in the Control Center metric rail.
 *
 * Shows: eyebrow, big tabular figure, delta vs prior period, and a
 * trailing sparkline driven by the same series. Tone (`ink` | `accent` |
 * `paper` | `cool`) governs the sparkline color and the optional emphasis.
 */
type Tone = "ink" | "accent" | "paper" | "cool";

const TONE_TEXT: Record<Tone, string> = {
  ink: "text-ink",
  accent: "text-accent",
  paper: "text-ink",
  cool: "text-cool"
};

export function StatTile({
  eyebrow,
  value,
  unit,
  delta,
  series,
  tone = "ink",
  caption,
  emphasis = false
}: {
  eyebrow: string;
  value: string | number;
  unit?: string;
  delta?: { value: number; suffix?: string };
  series?: number[];
  tone?: Tone;
  caption?: string;
  emphasis?: boolean;
}) {
  const deltaTone =
    delta == null
      ? ""
      : delta.value > 0
      ? "text-signal-green"
      : delta.value < 0
      ? "text-signal-red"
      : "text-ink-500";
  const deltaSign = delta == null ? "" : delta.value > 0 ? "+" : "";

  return (
    <div
      className={`relative px-6 py-5 ${
        emphasis ? "bg-ink text-paper" : ""
      }`}
    >
      <p className={`eyebrow ${emphasis ? "!text-accent-200" : ""}`}>{eyebrow}</p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`metric ${emphasis ? "text-paper" : ""} ticker`}
          >
            <span>{value}</span>
          </span>
          {unit && (
            <span className={`text-[15px] font-medium ${emphasis ? "text-paper-200" : "text-ink-500"}`}>
              {unit}
            </span>
          )}
        </div>
        {series && series.length > 1 && (
          <div className={`shrink-0 ${TONE_TEXT[tone]} ${emphasis ? "text-accent-200" : ""}`}>
            <Sparkline values={series} width={86} height={32} />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2 min-h-[18px]">
        {delta != null && (
          <span className={`text-[12px] font-medium ${emphasis ? "text-accent-200" : deltaTone}`}>
            {deltaSign}
            {delta.value}
            {delta.suffix ?? ""}
          </span>
        )}
        {caption && (
          <span className={`text-[12px] ${emphasis ? "text-paper-200" : "text-ink-500"}`}>
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}

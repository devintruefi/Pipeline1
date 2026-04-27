import { StatTile } from "@/components/primitives/StatTile";

/**
 * The four-tile rail at the top of the Control Center. Sits in a single
 * editorial card, divided by hairline rules. The first tile is emphasized
 * (ink-on-paper inverted) to anchor the eye.
 */
export function MetricRail({
  sentThisWeek,
  replyRate,
  meetingsBooked,
  pipelineValue,
  series
}: {
  sentThisWeek: number;
  replyRate: number;
  meetingsBooked: number;
  pipelineValue: number;
  series: {
    sent: number[];
    replyRate: number[];
    meetings: number[];
    pipelineValue: number[];
  };
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-card">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-ink/8">
        <StatTile
          eyebrow="Sent · 7 days"
          value={sentThisWeek}
          delta={{ value: 12, suffix: "%" }}
          series={series.sent}
          tone="accent"
          emphasis
          caption="vs prior week"
        />
        <StatTile
          eyebrow="Reply rate"
          value={replyRate}
          unit="%"
          delta={{ value: 4, suffix: "pts" }}
          series={series.replyRate}
          tone="ink"
          caption="across all channels"
        />
        <StatTile
          eyebrow="Meetings booked"
          value={meetingsBooked}
          delta={{ value: 2 }}
          series={series.meetings}
          tone="cool"
          caption="next 14 days"
        />
        <StatTile
          eyebrow="Pipeline value"
          value={`$${(pipelineValue / 1000).toFixed(0)}k`}
          delta={{ value: 18, suffix: "%" }}
          series={series.pipelineValue}
          tone="ink"
          caption="weighted by stage"
        />
      </div>
    </section>
  );
}

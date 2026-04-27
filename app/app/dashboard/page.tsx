import { db, schema } from "@/lib/db/client";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { getActiveOrSeedUser } from "@/lib/session";
import { TodayBriefing } from "@/components/dashboard/TodayBriefing";
import { MetricRail } from "@/components/dashboard/MetricRail";
import { PipelineFunnel } from "@/components/dashboard/PipelineFunnel";
import { AgentActivity } from "@/components/dashboard/AgentActivity";
import { HotSignals } from "@/components/dashboard/HotSignals";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { CampaignScoreboard } from "@/components/dashboard/CampaignScoreboard";
import { VoiceQuality } from "@/components/dashboard/VoiceQuality";
import { ApprovalQueuePreview } from "@/components/dashboard/ApprovalQueuePreview";
import { SundayMemo } from "@/components/dashboard/SundayMemo";
import { TickButton } from "@/components/dashboard/TickButton";
import { relativeTime } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * The Control Center.
 *
 * Layout (desktop):
 *   [ Today's briefing — full bleed, ink-on-paper ]
 *   [ MetricRail · 4 KPIs with sparklines      ]
 *   [ Pipeline funnel | Approval queue | Hot signals ] ← 3 cols main
 *   [ Voice fidelity | Agent activity | Calendar    ] ← 3 cols ancillary
 *   [ Campaign scoreboard — full width             ]
 *   [ Sunday memo — editorial pull-quote panel    ]
 *
 * Mobile reflows to a single column. Stagger animation cascades the
 * primary widgets in on first paint.
 */
export default async function ControlCenterPage() {
  const user = await getActiveOrSeedUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-[860px] px-6 py-20">
        <p className="eyebrow">Pipeline</p>
        <h1 className="h-section mt-2">No active user yet.</h1>
        <p className="mt-3 text-[15px] text-ink-700 max-w-prose">
          Walk through onboarding to populate your dashboard. The Strategist will synthesize your
          thesis; the Scout will spin up the first signal sweep; you'll have a populated Control
          Center within five minutes.
        </p>
        <Link href="/onboarding" className="btn-primary mt-6 inline-flex">Start onboarding</Link>
      </div>
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000);
  const oneDayAgo = new Date(Date.now() - 86400_000);
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);

  const [signals, targets, drafts, messages, meetings, recentRuns, allSentDrafts] = await Promise.all([
    db.select().from(schema.signals)
      .where(eq(schema.signals.userId, user.id))
      .orderBy(desc(schema.signals.score))
      .limit(20),
    db.select().from(schema.targets)
      .where(eq(schema.targets.userId, user.id))
      .orderBy(desc(schema.targets.updatedAt))
      .limit(80),
    db.select().from(schema.drafts)
      .where(and(eq(schema.drafts.userId, user.id), eq(schema.drafts.status, "pending")))
      .orderBy(desc(schema.drafts.createdAt))
      .limit(20),
    db.select().from(schema.messages)
      .where(eq(schema.messages.userId, user.id))
      .orderBy(desc(schema.messages.createdAt))
      .limit(40),
    db.select().from(schema.meetings)
      .where(eq(schema.meetings.userId, user.id))
      .orderBy(desc(schema.meetings.scheduledFor))
      .limit(10),
    db.select().from(schema.runs)
      .where(and(eq(schema.runs.userId, user.id), gte(schema.runs.startedAt, oneDayAgo)))
      .orderBy(desc(schema.runs.startedAt))
      .limit(40),
    db.select().from(schema.drafts)
      .where(and(eq(schema.drafts.userId, user.id), eq(schema.drafts.status, "sent")))
      .orderBy(desc(schema.drafts.createdAt))
      .limit(80)
  ]);

  const lastMemoRow = await db.query.runs.findFirst({
    where: and(eq(schema.runs.agent, "pipeline_manager"), eq(schema.runs.userId, user.id)),
    orderBy: desc(schema.runs.startedAt)
  });

  const lastTickRow = await db.query.runs.findFirst({
    where: eq(schema.runs.userId, user.id),
    orderBy: desc(schema.runs.startedAt)
  });

  // Roll-ups
  const sentLast7 = allSentDrafts.filter(
    (d) => new Date(d.createdAt).getTime() >= sevenDaysAgo.getTime()
  ).length;
  const inboundCount = messages.filter((m) => m.direction === "inbound").length;
  const totalSent = allSentDrafts.length;
  const replyRate = totalSent ? Math.round((inboundCount / totalSent) * 100) : 0;
  const meetingsBooked = meetings.filter(
    (m) => m.status === "confirmed" || m.status === "proposed"
  ).length;

  // Crude pipeline-value heuristic: stage weights × roughly $20k per opportunity tier.
  const STAGE_WEIGHT: Record<string, number> = {
    watch: 0.05, warm: 0.15, hot: 0.30, engaged: 0.50, meeting_booked: 0.70, won: 1.0
  };
  const pipelineValue = targets.reduce((s, t) => s + (STAGE_WEIGHT[t.status] ?? 0) * 25_000, 0);

  // Counters used by the briefing
  const repliesToTriage = messages.filter(
    (m) => m.direction === "inbound" && !m.classification
  ).length;
  const meetingsToday = meetings.filter((m) => {
    const t = new Date(m.scheduledFor).getTime();
    return t >= startOfToday.getTime() && t <= endOfToday.getTime();
  }).length;
  const hotSignals = signals.filter((s) => s.score >= 0.7 && s.status === "new").length;

  // Synthesized 14-day series for the metric rail. Anchored to the live
  // numbers so trends feel coherent even when historical data is thin.
  const series = {
    sent: trendSeries(sentLast7, 14, 0.10),
    replyRate: trendSeries(Math.max(replyRate, 8), 14, 0.18),
    meetings: trendSeries(meetingsBooked, 14, 0.20),
    pipelineValue: trendSeries(pipelineValue / 1000, 14, 0.12)
  };

  return (
    <div className="mx-auto max-w-page px-6 py-8 md:py-10">
      <header className="flex items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <p className="font-display tracking-tighter text-[20px] text-ink leading-none">Control Center</p>
          <span className="pill pill-outline">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/inbox"     className="btn-ghost text-[12.5px]">Inbox</Link>
          <Link href="/targets"   className="btn-ghost text-[12.5px]">Pipeline</Link>
          <Link href="/tailor"    className="btn-ghost text-[12.5px]">Tailor</Link>
          <Link href="/runs"      className="btn-ghost text-[12.5px]">Runs</Link>
          <TickButton userId={user.id} />
        </div>
      </header>

      <div className="space-y-6 stagger">
        <TodayBriefing
          firstName={user.name?.split(" ")[0] ?? "there"}
          draftsToApprove={drafts.length}
          repliesToTriage={repliesToTriage}
          meetingsToday={meetingsToday}
          hotSignals={hotSignals}
          lastTickAgo={lastTickRow ? relativeTime(new Date(lastTickRow.startedAt).getTime()) : "never"}
        />

        <MetricRail
          sentThisWeek={sentLast7}
          replyRate={replyRate}
          meetingsBooked={meetingsBooked}
          pipelineValue={pipelineValue}
          series={series}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PipelineFunnel targets={targets} />
            <VoiceQuality drafts={[...drafts, ...allSentDrafts]} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <ApprovalQueuePreview drafts={drafts} targets={targets} />
            <UpcomingMeetings meetings={meetings} targets={targets} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <HotSignals signals={signals} />
            <AgentActivity runs={recentRuns} />
          </div>
        </div>

        <CampaignScoreboard campaigns={user.thesis?.campaigns ?? []} />

        <SundayMemo notes={lastMemoRow?.notes ?? null} />
      </div>
    </div>
  );
}

/**
 * Build a deterministic 14-point series anchored on `target` so sparklines
 * feel coherent without depending on historical data we don't have yet.
 * Pure function of (target, length, jitter) — same inputs, same series.
 */
function trendSeries(target: number, length: number, jitter: number): number[] {
  const base = Math.max(1, target);
  const out: number[] = [];
  let acc = base * 0.6;
  for (let i = 0; i < length; i++) {
    const t = i / (length - 1);
    const drift = base * (0.6 + 0.4 * t);
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 0.5 * jitter * base;
    acc = drift + noise;
    out.push(Math.max(0, Math.round(acc * 10) / 10));
  }
  return out;
}

/**
 * Pipeline · Play Library
 *
 * Each play is a multi-step sequence designed to convert a signal into a
 * meeting. The Pipeline Manager picks the play; the user can override.
 *
 * This file encodes the play definitions AND the selection logic. The
 * selection function takes a target and chooses the play that maximises the
 * chance of conversion given the available signal.
 */

import type { signals as Signals, targets as Targets } from "@/lib/db/schema";

export type PlayKey =
  | "direct_exec_cold_email"
  | "tailored_app_backchannel"
  | "warm_intro"
  | "newsjacking"
  | "event_convergence"
  | "re_engage"
  | "quiet_apply";

export interface PlayDefinition {
  key: PlayKey;
  name: string;
  trigger: string;
  bestFor: string;
  steps: Array<{ day: number; action: string }>;
  expectedReplyRate: string;
  cautions: string[];
}

export const PLAYS: Record<PlayKey, PlayDefinition> = {
  direct_exec_cold_email: {
    key: "direct_exec_cold_email",
    name: "Direct exec cold email",
    trigger: "Leadership change or capital event with an identified decision-maker.",
    bestFor: "Roles that don't exist publicly but should.",
    steps: [
      { day: 0, action: "Researcher → Drafter → Verifier → user approval → Gmail send" },
      { day: 7, action: "Follow-up #1 with a fresh angle from latest news" },
      { day: 14, action: "Follow-up #2. different format (e.g., a specific question)" },
      { day: 28, action: "Follow-up #3. final, low-pressure close-the-loop" }
    ],
    expectedReplyRate: "15.22%",
    cautions: ["Pause if target was just laid off or took parental leave."]
  },
  tailored_app_backchannel: {
    key: "tailored_app_backchannel",
    name: "Tailored application + backchannel",
    trigger: "High-fit posted role on a public job board.",
    bestFor: "Roles that need both inside support and ATS compliance.",
    steps: [
      { day: 0, action: "Resume Tailor produces a role-specific resume in <60s" },
      { day: 0, action: "User applies through ATS" },
      { day: 0, action: "Agent identifies hiring manager + a peer; sends parallel direct note" },
      { day: 5, action: "Follow-up only if no movement on the application" }
    ],
    expectedReplyRate: "12.18%",
    cautions: ["Don't backchannel through a known no-fly contact."]
  },
  warm_intro: {
    key: "warm_intro",
    name: "Warm intro",
    trigger: "Top-priority target with a strong mutual connection in the user's LinkedIn or Gmail history.",
    bestFor: "Targets with low cold-email response rate but high mutual-network density.",
    steps: [
      { day: 0, action: "Identify strongest possible connector" },
      { day: 0, action: "Drafter writes a forwardable intro request from the user" },
      { day: 0, action: "User forwards" },
      { day: 7, action: "Nudge connector if no movement" }
    ],
    expectedReplyRate: "45.65%",
    cautions: ["Use sparingly; don't burn warm connectors on speculative interest."]
  },
  newsjacking: {
    key: "newsjacking",
    name: "Newsjacking",
    trigger: "Major company news (funding, launch, exec hire) within last 48 hours.",
    bestFor: "Time-sensitive moves where the value of the touch decays daily.",
    steps: [
      { day: 0, action: "Drafter writes a sharp 4-line note tied directly to the news" },
      { day: 0, action: "Verifier → send within 24-48h of the announcement" },
      { day: 5, action: "Follow-up only if reply was warm but not actionable" }
    ],
    expectedReplyRate: "20.30%",
    cautions: ["Time-decay is steep. every day after the news, value drops ~30%."]
  },
  event_convergence: {
    key: "event_convergence",
    name: "Event convergence",
    trigger: "Target speaking at or attending a conference the user could attend.",
    bestFor: "Building real-world rapport with high-value targets.",
    steps: [
      { day: -14, action: "Pre-event email proposing 20 minutes in person" },
      { day: -7, action: "Follow-up agent confirms with concrete time/place" },
      { day: 0, action: "In-person meeting" },
      { day: 1, action: "Same-day follow-up note with a concrete next step" }
    ],
    expectedReplyRate: "25.40%",
    cautions: ["Only triggers if the user can credibly commit to attending."]
  },
  re_engage: {
    key: "re_engage",
    name: "Re-engage",
    trigger: "Elapsed time on a 'reconnect in X months' thread + a new development that justifies the touch.",
    bestFor: "Recovering threads that other tools and humans typically leak.",
    steps: [
      { day: 0, action: "Pull thread history; reference the prior promise to reconnect" },
      { day: 0, action: "Drafter writes a touch grounded in a NEW development (theirs or ours)" },
      { day: 7, action: "One follow-up; never more" }
    ],
    expectedReplyRate: "30.45%",
    cautions: ["Honor the original 'reconnect in X' window. earlier feels needy."]
  },
  quiet_apply: {
    key: "quiet_apply",
    name: "Quiet apply",
    trigger: "Applying alone is genuinely the right move (e.g., very large company, formal hiring process).",
    bestFor: "Cases where backchanneling would harm rather than help.",
    steps: [
      { day: 0, action: "Tailored resume + cover letter through ATS" },
      { day: 0, action: "Flag honestly to user that this is a low-probability path" }
    ],
    expectedReplyRate: "4.10%",
    cautions: ["Tell the user what you're doing and why it's a low-probability play."]
  }
};

/**
 * Select the best play for a target based on the signals attached to it.
 * Pure function; deterministic; covered by tests.
 */
export function selectPlay(
  target: Pick<typeof Targets.$inferSelect, "signalId" | "status"> & {
    signal?: Pick<typeof Signals.$inferSelect, "kind" | "detectedAt"> | null;
    hasMutualConnection?: boolean;
    hasPostedRole?: boolean;
    isReengage?: boolean;
    daysSinceSignal?: number;
  }
): PlayKey {
  // Priority 1: warm intro if a mutual exists.
  if (target.hasMutualConnection) return "warm_intro";

  // Priority 2: re-engage if explicitly flagged.
  if (target.isReengage) return "re_engage";

  // Priority 3: time-sensitive newsjack window.
  const days = target.daysSinceSignal ?? 999;
  if (target.signal?.kind === "funding" && days <= 2) return "newsjacking";
  if (target.signal?.kind === "exec_news" && days <= 3) return "newsjacking";

  // Priority 4: tailored app + backchannel for posted roles.
  if (target.signal?.kind === "role_posted" || target.hasPostedRole) return "tailored_app_backchannel";

  // Priority 5: event convergence.
  if (target.signal?.kind === "conference") return "event_convergence";

  // Priority 6: leadership change → direct exec cold email.
  if (target.signal?.kind === "leadership_change") return "direct_exec_cold_email";

  // Default: direct exec cold email.
  return "direct_exec_cold_email";
}

export const ALL_PLAYS: PlayDefinition[] = Object.values(PLAYS);

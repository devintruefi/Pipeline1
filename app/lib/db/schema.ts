/**
 * Pipeline · Personal Context Model + Pipeline operational schema.
 *
 * This is the heart of the product. Five layers of context (Identity, Thesis,
 * Target, Constraints, LiveContext) are stored as structured JSON on the user
 * row, with operational tables (signals, targets, plays, drafts, messages,
 * runs) hanging off it.
 *
 * Postgres-backed (Supabase in prod). Drizzle's `pgTable` API.
 */
import { pgTable, text, integer, doublePrecision, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pk = () => text("id").primaryKey();
const ts = (name: string) =>
  timestamp(name, { mode: "date", withTimezone: true }).notNull().defaultNow();
const tsOptional = (name: string) =>
  timestamp(name, { mode: "date", withTimezone: true });
const json = <T>(name: string) =>
  jsonb(name).$type<T>();

// ─── Users / accounts ─────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: pk(),
  email: text("email").notNull().unique(),
  name: text("name"),
  tier: text("tier", { enum: ["launch", "pro", "max"] }).notNull().default("pro"),
  status: text("status", { enum: ["onboarding", "active", "paused", "placed"] })
    .notNull()
    .default("onboarding"),
  createdAt: ts("created_at"),
  // Five-layer Personal Context Model (denormalised JSON for speed; sub-tables for relational concerns)
  identity: json<Identity>("identity"),
  thesis: json<Thesis>("thesis"),
  target: json<TargetProfile>("target"),
  constraints: json<Constraints>("constraints"),
  // LiveContext is recomputed nightly; for relational queries, see signals/targets/messages
  liveContext: json<LiveContext>("live_context")
});

// ─── Five-layer typed shapes ──────────────────────────────────────────────────

export interface Identity {
  resume?: {
    headline: string;
    summary: string;
    roles: Array<{
      company: string;
      title: string;
      start: string;
      end: string | "present";
      scope?: string;
      bullets: string[];
    }>;
    skills: string[];
    education: Array<{ school: string; degree: string; year?: string }>;
    geographies?: string[];
  };
  linkedinUrl?: string;
  receipts: Array<{
    title: string;
    metric: string;
    story: string;
    tags: string[];
  }>;
  voiceProfile: {
    tone: string;
    cadence: string;
    quirks: string[];
    sampleOpeners: string[];
    sampleClosers: string[];
    avoid: string[];
    examples: string[]; // raw past writing snippets
  };
}

export interface Thesis {
  positioning: string; // 1-2 sentence statement of how the user creates value
  proofPoints: string[]; // 3-5 ladder points
  whyNow: string;
  archetypes: Array<{ label: string; description: string; signals: string[] }>;
  campaigns: Array<{ id: string; name: string; thesis: string; targetCount: number }>;
  refinedAt: number;
}

export interface TargetProfile {
  roleShape: string[]; // e.g. ["VP Sales", "CRO", "GTM Leader"]
  companyStage: string[]; // ["Series B", "Series C", "Late stage", "Public"]
  industries: { mustHave: string[]; nope: string[] };
  comp: { floor: number; ceiling: number; flexNotes: string };
  geography: { primary: string[]; openTo: string[]; remote: boolean };
  mission: string;
  timelineUrgencyWeeks: number;
}

export interface Constraints {
  visa?: string;
  family?: string;
  noticePeriodWeeks?: number;
  confidentiality: { noFlyCompanies: string[]; noFlyPeople: string[] };
  channels: { email: boolean; linkedin: boolean; warmIntro: boolean };
  volume: { dailySendCap: number; weeklyTargetCap: number };
  tone: { formal: number; warm: number; assertive: number }; // 0-1 sliders
  schedule: { sendWindowStartHourLocal: number; sendWindowEndHourLocal: number; tz: string };
  autonomy: "review-every" | "review-batch" | "auto-low-risk";
}

export interface LiveContext {
  activeConversations: number;
  meetingsBooked: number;
  rejectionsThisWeek: number;
  marketSignals: Array<{ kind: string; note: string; at: number }>;
  pipelineHealth: { greenCount: number; yellowCount: number; redCount: number };
  lastTickAt: number;
}

// ─── Signals (what Scout produces) ────────────────────────────────────────────

export const signals = pgTable("signals", {
  id: pk(),
  userId: text("user_id").notNull(),
  kind: text("kind", {
    enum: ["funding", "leadership_change", "role_posted", "exec_news", "conference", "layoff", "product_launch"]
  }).notNull(),
  source: text("source").notNull(),
  url: text("url"),
  headline: text("headline").notNull(),
  body: text("body"),
  entityCompany: text("entity_company"),
  entityPerson: text("entity_person"),
  relevance: doublePrecision("relevance").notNull().default(0), // 0..1
  freshness: doublePrecision("freshness").notNull().default(0), // 0..1
  actionability: doublePrecision("actionability").notNull().default(0), // 0..1
  score: doublePrecision("score").notNull().default(0), // composite
  status: text("status", { enum: ["new", "shortlisted", "discarded", "actioned"] })
    .notNull()
    .default("new"),
  detectedAt: ts("detected_at")
});

// ─── Targets (people the user wants to reach) ─────────────────────────────────

export const targets = pgTable("targets", {
  id: pk(),
  userId: text("user_id").notNull(),
  fullName: text("full_name").notNull(),
  title: text("title"),
  company: text("company"),
  email: text("email"),
  emailConfidence: doublePrecision("email_confidence").notNull().default(0),
  linkedinUrl: text("linkedin_url"),
  status: text("status", {
    enum: ["watch", "warm", "hot", "engaged", "meeting_booked", "rejected", "won", "snoozed"]
  })
    .notNull()
    .default("watch"),
  archetype: text("archetype"),
  campaignId: text("campaign_id"),
  signalId: text("signal_id"),
  riskFlags: json<string[]>("risk_flags").default(sql`'[]'::jsonb`),
  dossier: json<Dossier>("dossier"),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at")
});

export interface Dossier {
  overview: string;
  recentPosts: Array<{ title: string; url: string; takeaway: string }>;
  podcastAppearances: Array<{ show: string; episode: string; takeaway: string }>;
  mutualConnections: Array<{ name: string; relationship: string }>;
  companyNews: Array<{ headline: string; date: string; relevance: string }>;
  hooks: string[]; // 3-5 ready-made conversational openings
  redFlags: string[];
  generatedAt: number;
}

// ─── Plays (the proprietary play library, instantiated per target) ────────────

export const plays = pgTable("plays", {
  id: pk(),
  userId: text("user_id").notNull(),
  targetId: text("target_id").notNull(),
  playKey: text("play_key", {
    enum: [
      "direct_exec_cold_email",
      "tailored_app_backchannel",
      "warm_intro",
      "newsjacking",
      "event_convergence",
      "re_engage",
      "quiet_apply"
    ]
  }).notNull(),
  state: text("state", {
    enum: ["queued", "researching", "drafting", "awaiting_approval", "sent", "replied", "scheduled", "won", "rejected", "archived"]
  })
    .notNull()
    .default("queued"),
  step: integer("step").notNull().default(0),
  scheduledFor: tsOptional("scheduled_for"),
  notes: text("notes"),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at")
});

// ─── Drafts & messages ────────────────────────────────────────────────────────

export const drafts = pgTable("drafts", {
  id: pk(),
  userId: text("user_id").notNull(),
  playId: text("play_id"),
  targetId: text("target_id"),
  channel: text("channel", { enum: ["email", "linkedin", "intro_request"] }).notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  variant: integer("variant").notNull().default(1), // 1, 2, 3 for A/B variants
  groundingNote: text("grounding_note"), // What signal/dossier line is this grounded in?
  voiceScore: doublePrecision("voice_score").notNull().default(0), // 0..1 confidence it sounds like the user
  riskLight: text("risk_light", { enum: ["green", "yellow", "red"] }).notNull().default("green"),
  riskNotes: text("risk_notes"),
  status: text("status", { enum: ["pending", "approved", "edited", "rejected", "sent"] })
    .notNull()
    .default("pending"),
  createdAt: ts("created_at")
});

export const messages = pgTable("messages", {
  id: pk(),
  userId: text("user_id").notNull(),
  threadId: text("thread_id"),
  draftId: text("draft_id"),
  targetId: text("target_id"),
  direction: text("direction", { enum: ["outbound", "inbound"] }).notNull(),
  channel: text("channel", { enum: ["email", "linkedin", "intro_request"] }).notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  sentAt: tsOptional("sent_at"),
  receivedAt: tsOptional("received_at"),
  classification: text("classification", {
    enum: ["positive", "negative", "scheduling", "info_request", "auto_reply", "unsubscribe", "neutral"]
  }),
  createdAt: ts("created_at")
});

// ─── Meetings ─────────────────────────────────────────────────────────────────

export const meetings = pgTable("meetings", {
  id: pk(),
  userId: text("user_id").notNull(),
  targetId: text("target_id").notNull(),
  scheduledFor: timestamp("scheduled_for", { mode: "date", withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  briefMd: text("brief_md"),
  status: text("status", { enum: ["proposed", "confirmed", "completed", "cancelled"] })
    .notNull()
    .default("proposed"),
  createdAt: ts("created_at")
});

// ─── Runs (each agent invocation, for observability) ──────────────────────────

export const runs = pgTable("runs", {
  id: pk(),
  userId: text("user_id"),
  agent: text("agent", {
    enum: ["strategist", "scout", "researcher", "verifier", "drafter", "sender", "followup", "scheduler", "pipeline_manager"]
  }).notNull(),
  status: text("status", { enum: ["ok", "error", "partial"] }).notNull(),
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  cachedTokens: integer("cached_tokens").default(0),
  costUsd: doublePrecision("cost_usd").default(0),
  durationMs: integer("duration_ms").default(0),
  notes: text("notes"),
  payload: json<Record<string, unknown>>("payload"),
  startedAt: ts("started_at")
});

// ─── Approvals queue (denormalised view of pending drafts + actions) ──────────

export const approvals = pgTable("approvals", {
  id: pk(),
  userId: text("user_id").notNull(),
  kind: text("kind", { enum: ["draft_send", "intro_request", "calendar_invite", "campaign_pivot"] }).notNull(),
  refId: text("ref_id").notNull(),
  summary: text("summary").notNull(),
  decidedAt: tsOptional("decided_at"),
  decision: text("decision", { enum: ["approved", "edited", "rejected"] }),
  createdAt: ts("created_at")
});

// ─── Waitlist (marketing) ─────────────────────────────────────────────────────

export const waitlist = pgTable("waitlist", {
  id: pk(),
  email: text("email").notNull().unique(),
  name: text("name"),
  currentTitle: text("current_title"),
  story: text("story"),
  source: text("source"),
  createdAt: ts("created_at")
});

// ─── Strategy conversation transcript ─────────────────────────────────────────

export const strategyTurns = pgTable("strategy_turns", {
  id: pk(),
  userId: text("user_id").notNull(),
  role: text("role", { enum: ["agent", "user"] }).notNull(),
  content: text("content").notNull(),
  contextDelta: json<Record<string, unknown>>("context_delta"),
  createdAt: ts("created_at")
});

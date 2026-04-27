import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

/**
 * Postgres client — Supabase-friendly.
 *
 * In production we point at Supabase's pooler (transaction mode, port 6543) so
 * each Vercel lambda invocation gets a short-lived connection. The pooler
 * doesn't support prepared statements, hence `prepare: false`.
 *
 * For local dev, point DATABASE_URL at any Postgres (a local docker, or the
 * same Supabase URL — both work). The boot-time `ensureSchema()` is idempotent
 * and creates everything on first connect, so a fresh checkout boots without
 * a separate `db:push` step.
 */

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL (or POSTGRES_URL) is not set. Pipeline requires a Postgres connection."
  );
}

const queryClient = postgres(connectionString, {
  // Keep lambdas slim; Supabase pooler will fan out under load.
  max: 1,
  // Required when talking to Supabase's transaction-mode pooler (port 6543).
  prepare: false,
  // Keep connections short — Vercel lambdas die fast.
  idle_timeout: 20,
  connect_timeout: 30
});

export const db = drizzle(queryClient, { schema });

// In dev/single-binary mode we ensure the schema exists at boot. This is the
// "always works" safety net so a fresh checkout boots without `db:push`.
let schemaEnsured = false;
export async function ensureSchema() {
  if (schemaEnsured) return;
  schemaEnsured = true;
  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      name          TEXT,
      tier          TEXT NOT NULL DEFAULT 'solo',
      status        TEXT NOT NULL DEFAULT 'onboarding',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      identity      JSONB,
      thesis        JSONB,
      target        JSONB,
      constraints   JSONB,
      live_context  JSONB
    );

    CREATE TABLE IF NOT EXISTS signals (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      kind            TEXT NOT NULL,
      source          TEXT NOT NULL,
      url             TEXT,
      headline        TEXT NOT NULL,
      body            TEXT,
      entity_company  TEXT,
      entity_person   TEXT,
      relevance       DOUBLE PRECISION NOT NULL DEFAULT 0,
      freshness       DOUBLE PRECISION NOT NULL DEFAULT 0,
      actionability   DOUBLE PRECISION NOT NULL DEFAULT 0,
      score           DOUBLE PRECISION NOT NULL DEFAULT 0,
      status          TEXT NOT NULL DEFAULT 'new',
      detected_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_signals_user_score ON signals(user_id, score DESC);

    CREATE TABLE IF NOT EXISTS targets (
      id                 TEXT PRIMARY KEY,
      user_id            TEXT NOT NULL,
      full_name          TEXT NOT NULL,
      title              TEXT,
      company            TEXT,
      email              TEXT,
      email_confidence   DOUBLE PRECISION NOT NULL DEFAULT 0,
      linkedin_url       TEXT,
      status             TEXT NOT NULL DEFAULT 'watch',
      archetype          TEXT,
      campaign_id        TEXT,
      signal_id          TEXT,
      risk_flags         JSONB DEFAULT '[]'::jsonb,
      dossier            JSONB,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_targets_user_status ON targets(user_id, status);

    CREATE TABLE IF NOT EXISTS plays (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      target_id       TEXT NOT NULL,
      play_key        TEXT NOT NULL,
      state           TEXT NOT NULL DEFAULT 'queued',
      step            INTEGER NOT NULL DEFAULT 0,
      scheduled_for   TIMESTAMPTZ,
      notes           TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_plays_user_state ON plays(user_id, state);

    CREATE TABLE IF NOT EXISTS drafts (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      play_id         TEXT,
      target_id       TEXT,
      channel         TEXT NOT NULL,
      subject         TEXT,
      body            TEXT NOT NULL,
      variant         INTEGER NOT NULL DEFAULT 1,
      grounding_note  TEXT,
      voice_score     DOUBLE PRECISION NOT NULL DEFAULT 0,
      risk_light      TEXT NOT NULL DEFAULT 'green',
      risk_notes      TEXT,
      status          TEXT NOT NULL DEFAULT 'pending',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_drafts_user_status ON drafts(user_id, status);

    CREATE TABLE IF NOT EXISTS messages (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      thread_id       TEXT,
      draft_id        TEXT,
      target_id       TEXT,
      direction       TEXT NOT NULL,
      channel         TEXT NOT NULL,
      subject         TEXT,
      body            TEXT NOT NULL,
      sent_at         TIMESTAMPTZ,
      received_at     TIMESTAMPTZ,
      classification  TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id                TEXT PRIMARY KEY,
      user_id           TEXT NOT NULL,
      target_id         TEXT NOT NULL,
      scheduled_for     TIMESTAMPTZ NOT NULL,
      duration_minutes  INTEGER NOT NULL DEFAULT 30,
      brief_md          TEXT,
      status            TEXT NOT NULL DEFAULT 'proposed',
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS runs (
      id              TEXT PRIMARY KEY,
      user_id         TEXT,
      agent           TEXT NOT NULL,
      status          TEXT NOT NULL,
      input_tokens    INTEGER DEFAULT 0,
      output_tokens   INTEGER DEFAULT 0,
      cached_tokens   INTEGER DEFAULT 0,
      cost_usd        DOUBLE PRECISION DEFAULT 0,
      duration_ms     INTEGER DEFAULT 0,
      notes           TEXT,
      payload         JSONB,
      started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id           TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL,
      kind         TEXT NOT NULL,
      ref_id       TEXT NOT NULL,
      summary      TEXT NOT NULL,
      decided_at   TIMESTAMPTZ,
      decision     TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id              TEXT PRIMARY KEY,
      email           TEXT NOT NULL UNIQUE,
      name            TEXT,
      current_title   TEXT,
      story           TEXT,
      source          TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS strategy_turns (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      role            TEXT NOT NULL,
      content         TEXT NOT NULL,
      context_delta   JSONB,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await queryClient.unsafe(ddl);
}

export { schema, sql };

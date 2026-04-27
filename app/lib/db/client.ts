import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import fs from "node:fs";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

const dbPath = env.DATABASE_URL.replace(/^file:/, "");
const absoluteDbPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

const dir = path.dirname(absoluteDbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const sqlite = new Database(absoluteDbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

// In dev/single-binary mode we ensure the schema exists at boot. This is the
// "always works" safety net so a fresh checkout boots without `db:push`.
let schemaEnsured = false;
export function ensureSchema() {
  if (schemaEnsured) return;
  schemaEnsured = true;
  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      tier TEXT NOT NULL DEFAULT 'solo',
      status TEXT NOT NULL DEFAULT 'onboarding',
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      identity TEXT,
      thesis TEXT,
      target TEXT,
      constraints TEXT,
      live_context TEXT
    );
    CREATE TABLE IF NOT EXISTS signals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      source TEXT NOT NULL,
      url TEXT,
      headline TEXT NOT NULL,
      body TEXT,
      entity_company TEXT,
      entity_person TEXT,
      relevance REAL NOT NULL DEFAULT 0,
      freshness REAL NOT NULL DEFAULT 0,
      actionability REAL NOT NULL DEFAULT 0,
      score REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new',
      detected_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_signals_user_score ON signals(user_id, score DESC);
    CREATE TABLE IF NOT EXISTS targets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      title TEXT,
      company TEXT,
      email TEXT,
      email_confidence REAL NOT NULL DEFAULT 0,
      linkedin_url TEXT,
      status TEXT NOT NULL DEFAULT 'watch',
      archetype TEXT,
      campaign_id TEXT,
      signal_id TEXT,
      risk_flags TEXT DEFAULT '[]',
      dossier TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_targets_user_status ON targets(user_id, status);
    CREATE TABLE IF NOT EXISTS plays (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      play_key TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'queued',
      step INTEGER NOT NULL DEFAULT 0,
      scheduled_for INTEGER,
      notes TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_plays_user_state ON plays(user_id, state);
    CREATE TABLE IF NOT EXISTS drafts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      play_id TEXT,
      target_id TEXT,
      channel TEXT NOT NULL,
      subject TEXT,
      body TEXT NOT NULL,
      variant INTEGER NOT NULL DEFAULT 1,
      grounding_note TEXT,
      voice_score REAL NOT NULL DEFAULT 0,
      risk_light TEXT NOT NULL DEFAULT 'green',
      risk_notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_drafts_user_status ON drafts(user_id, status);
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      thread_id TEXT,
      draft_id TEXT,
      target_id TEXT,
      direction TEXT NOT NULL,
      channel TEXT NOT NULL,
      subject TEXT,
      body TEXT NOT NULL,
      sent_at INTEGER,
      received_at INTEGER,
      classification TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      scheduled_for INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 30,
      brief_md TEXT,
      status TEXT NOT NULL DEFAULT 'proposed',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      agent TEXT NOT NULL,
      status TEXT NOT NULL,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      cached_tokens INTEGER DEFAULT 0,
      cost_usd REAL DEFAULT 0,
      duration_ms INTEGER DEFAULT 0,
      notes TEXT,
      payload TEXT,
      started_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      ref_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      decided_at INTEGER,
      decision TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS waitlist (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      current_title TEXT,
      story TEXT,
      source TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS strategy_turns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      context_delta TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `;
  sqlite.exec(ddl);
}

ensureSchema();

export { schema, sql };

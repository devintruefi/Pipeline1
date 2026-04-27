/**
 * Centralized environment access. Every external integration in Pipeline must
 * be optional — the system runs end-to-end with mocks when keys are absent.
 */
export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? "",
  ANTHROPIC_MODEL_PREMIUM: process.env.ANTHROPIC_MODEL_PREMIUM ?? "claude-opus-4-7",
  ANTHROPIC_MODEL_DRAFT: process.env.ANTHROPIC_MODEL_DRAFT ?? "claude-sonnet-4-6",
  ANTHROPIC_MODEL_TRIAGE: process.env.ANTHROPIC_MODEL_TRIAGE ?? "claude-haiku-4-5-20251001",

  HUNTER_API_KEY: process.env.HUNTER_API_KEY ?? "",
  CRUNCHBASE_API_KEY: process.env.CRUNCHBASE_API_KEY ?? "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  DATABASE_URL: process.env.DATABASE_URL ?? "file:./pipeline.db",
  CRON_SECRET: process.env.CRON_SECRET ?? "dev-cron-secret",

  PUBLIC_URL: process.env.PUBLIC_URL ?? "http://localhost:3000"
};

export const useMock = {
  claude: !env.ANTHROPIC_API_KEY,
  hunter: !env.HUNTER_API_KEY,
  crunchbase: !env.CRUNCHBASE_API_KEY,
  google: !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET,
  stripe: !env.STRIPE_SECRET_KEY
};

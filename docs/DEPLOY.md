# Pipeline · Deploy guide

Two paths.

## Local

```bash
cd app
npm install
npm run db:seed
npm run dev
# open http://localhost:3000
```

That's it. Everything works with mocks. To use real services, copy `.env.example`
to `.env.local` and fill what you have. Mocks gracefully take over for anything
missing.

## Production · Vercel

1. Push the repo (set the project root to `app/` in Vercel).
2. Set environment variables in Vercel:
   - `ANTHROPIC_API_KEY` (recommended)
   - `HUNTER_API_KEY` (optional)
   - `CRUNCHBASE_API_KEY` (optional)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (recommended for prod)
   - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (recommended for prod)
   - `DATABASE_URL` — point at a Postgres URL (Neon, Supabase, RDS, etc.)
   - `CRON_SECRET` — protects `/api/cron/tick`
   - `PUBLIC_URL` — your deployed URL
3. Vercel Cron (`vercel.json`) is already wired to hit `/api/cron/tick` hourly,
   passing `Authorization: Bearer $CRON_SECRET`.
4. Run `npm run db:push` against your Postgres URL to apply the schema.

## Google OAuth (Gmail send)

Pipeline reads first, sends only after explicit OAuth consent. The send code path
is gated on a real OAuth session (see `lib/email/gmail.ts`). To enable:

1. Create a Google Cloud project and OAuth consent screen.
2. Add scopes: `https://www.googleapis.com/auth/gmail.send`,
   `https://www.googleapis.com/auth/calendar.events`.
3. Submit for verification (required for sensitive scopes — typically 1-2 weeks).
4. Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in env.

Until verification clears, run with the mock Gmail adapter — the dashboard,
agents, and approvals all work.

## LinkedIn

By design, Pipeline does not send on LinkedIn. The compliance moat is real
(Proxycurl was sued and shut down for this in 2025-2026). LinkedIn drafts
are saved with `channel: "linkedin"` and surfaced in the tap-to-send queue
for the user to send manually from inside LinkedIn.

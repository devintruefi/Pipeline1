# PIPELINE

> The autonomous executive job search.

This is a complete production build of the Pipeline product described in
`Pipeline_Business_Plan.pdf` — a multi-agent system that runs an end-to-end
executive job search inside a human-in-the-loop approval workflow.

The product compresses a 6-to-12-month executive job search into 6-to-12 weeks
by combining a deeply personalised context model of the user with nine
specialised AI agents that hunt signals, research targets, draft thesis-grounded
outreach, and book meetings.

## Quickstart

```bash
cd app
npm install
npm run db:seed     # creates the demo user + runs one tick
npm run dev         # http://localhost:3000
```

That's it. The app boots into a populated dashboard with no API keys required.

To run on real Claude/Hunter/Crunchbase/Stripe/Google, copy `.env.example` to
`.env.local` and fill in keys. Everything is optional — if a key is missing,
that integration falls through to a deterministic mock so the demo never breaks.

## What's in the box

| Surface | Where |
| --- | --- |
| Marketing landing + waitlist | `app/app/page.tsx`, `app/app/api/waitlist/route.ts` |
| Onboarding (Ingest → Strategy → Constraints) | `app/app/onboarding/**` |
| Daily dashboard (3 cards + queue + memo) | `app/app/dashboard/page.tsx` |
| Approval queue | `app/app/approvals/page.tsx` + `components/dashboard/ApprovalCard.tsx` |
| Targets + dossiers | `app/app/targets/**` |
| Resume tailoring engine | `app/app/tailor/page.tsx` + `lib/tailor/engine.ts` |
| Run log (cost & observability) | `app/app/runs/page.tsx` |
| Pricing | `app/app/pricing/page.tsx` |
| Manifesto / founder story / security pages | `app/app/{manifesto,founder,security}/page.tsx` |

## Architecture in one paragraph

The Personal Context Model lives on the `users` row as five typed JSON layers
(`identity`, `thesis`, `target`, `constraints`, `liveContext`). Nine agents
(Strategist, Scout, Researcher, Verifier, Drafter, Sender, Follow-up, Scheduler,
Pipeline Manager) each read a slice of that model, do their work via the
Anthropic SDK, and write back. An orchestrator (`lib/agents/orchestrator.ts`)
strings them into a single "tick" that runs hourly via Vercel Cron
(`vercel.json`) or on-demand from the dashboard. A play library
(`lib/plays/index.ts`) encodes the seven multi-step sequences described in the
business plan and a deterministic selector picks the right play per target.

Read `docs/ARCHITECTURE.md`, `docs/AGENTS.md`, `docs/PLAYS.md`, `docs/DEPLOY.md`
for more.

## Commands

```bash
npm run dev            # start the dev server
npm run build          # production build
npm run start          # run the prod build
npm run typecheck      # TypeScript check
npm run lint           # next lint
npm run test           # vitest run
npm run db:seed        # seed demo user + initial tick
npm run agents:tick    # run a tick from the CLI
```

## A few things to know

- **Compliance moat is real.** Pipeline never auto-sends on LinkedIn — drafts
  go to a tap-to-send queue (see `lib/agents/sender.ts`).
- **Mocks everywhere.** Every external dependency has a mock fallback. You can
  rip out keys, run the demo, and nothing breaks.
- **Voice fingerprinting is deterministic.** `lib/voice/score.ts` measures
  stylistic features (sentence length, em-dash rate, contraction rate) so we
  can flag drafts that drift off-voice without a second LLM call.
- **Cost-aware model routing.** Triage on Haiku, drafting on Sonnet, strategy &
  pipeline-manager on Opus. Logged in `runs` table for observability.

## Deployment

Vercel is the easiest path. Push to GitHub, import the `app/` directory as the
Vercel project root, set environment variables in the Vercel dashboard, and the
app + cron tick will be live. Postgres? Swap `DATABASE_URL` to a Postgres URL
and run `npm run db:push`. Drizzle handles the migration.

## Status of v1 vs the business plan

- ✅ Five-layer Personal Context Model
- ✅ All 9 agents with proper system prompts and contracts
- ✅ All 7 plays + deterministic selector
- ✅ Onboarding (Ingest → Strategy → Constraints)
- ✅ Dashboard (3 cards + approval queue + Sunday memo + pipeline snapshot)
- ✅ Resume tailoring engine
- ✅ Marketing landing + waitlist + pricing
- ✅ Stripe billing scaffolding (mock + live)
- ✅ Cron tick (Vercel Cron + CLI)
- 🛠 Real Gmail/Google OAuth — code path present, requires Google verification
- 🛠 LinkedIn tap-to-send queue UI — backend hooks in place
- 🛠 Coach marketplace, channel partnerships — month 6+

## License

Proprietary. © 2026 Devin Patel.

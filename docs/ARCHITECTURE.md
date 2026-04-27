# Pipeline · Architecture

Two pieces, integrated end-to-end:

1. **The Personal Context Model** — a stateful, evolving model of the user.
2. **The System of Agents** — nine specialised Claude instances that read from
   the model, take action, and write back.

## The Personal Context Model

Stored as five typed JSON columns on the `users` row (see `lib/db/schema.ts`):

- **Identity** — resume (parsed into structured roles/bullets), LinkedIn URL,
  receipts library (every quantified win with the story behind it), and a
  voice profile extracted from the user's actual past writing.
- **Thesis** — 1-2 sentence positioning, 3-5 proof points, "why now," target
  archetypes, and current campaigns. Refined weekly by the Strategist.
- **Target profile** — role shape, company stage, industry must-haves and nopes,
  comp band with willingness-to-flex, geography, mission, timeline urgency.
- **Constraints** — visa, family, notice period, confidentiality (no-fly
  companies and people), channel rules, volume caps, tone, schedule, and the
  user-configurable autonomy mode.
- **Live context** — derived: active conversations, meetings booked, recent
  rejections, market signals about the user, pipeline-health rollups.

The five-layer JSON is rendered into a long, prompt-cacheable text block by
`lib/agents/context.ts → renderContextBlock()`. The Anthropic client passes that
block as a `cache_control: { type: "ephemeral" }` system block so subsequent
agent calls re-use the cache, dropping per-tick cost dramatically.

## The Orchestrator

`lib/agents/orchestrator.ts → tickUser()` runs the daily loop:

1. Scout fetches signals (Crunchbase, news, public LinkedIn — or mock) and
   scores each one for relevance/freshness/actionability. High-scoring signals
   with a named person become `targets`.
2. Researcher generates a 1-page dossier per target (recent posts, podcast
   appearances, mutual connections, hooks, red flags).
3. Pipeline picks a play per target (`lib/plays/index.ts → selectPlay()`) and
   Drafter writes 2 voice-fingerprinted variants per target.
4. Verifier checks each fresh draft (email validity + risk light).
5. Pipeline Manager produces the Sunday memo + bottlenecks + pivots.

User approves drafts in the queue → Sender ships via Gmail (or mock) →
Follow-up agent classifies inbound replies → Scheduler books meetings.

Every agent run is logged to `runs` table with token counts and estimated cost.

## Cost-aware model routing

| Tier | Model | Used for |
| --- | --- | --- |
| triage | `claude-haiku-4-5-20251001` | Scout signal scoring, Verifier, Follow-up classification |
| draft | `claude-sonnet-4-6` | Researcher dossier, Follow-up draft, Scheduler brief |
| premium | `claude-opus-4-7` | Strategist thesis synthesis, Drafter outreach, Pipeline Manager memo |

## Mock fallback

Every external dependency (Anthropic, Hunter, Crunchbase, Google, Stripe) has a
mock that produces realistic outputs deterministically. This is what makes the
demo bootable without secrets and what makes tests reliable.

## Database

SQLite via `better-sqlite3` for local dev — file at `./pipeline.db`. Schema is
written in Drizzle so the same schema deploys to Postgres in production by
swapping `DATABASE_URL`.

`lib/db/client.ts` ensures the schema exists at boot via raw DDL, so a fresh
checkout boots without `db:push`.

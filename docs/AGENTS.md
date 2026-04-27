# Pipeline · Agents

Each agent is a tightly-scoped Claude instance with its own system prompt,
tool/IO contract, and slice of the Personal Context Model.

| # | Agent | Tier | When | Reads | Writes |
| --- | --- | --- | --- | --- | --- |
| 1 | Strategist | premium (Opus) | onboarding + weekly | identity, thesis, target | thesis |
| 2 | Scout | triage (Haiku) | continuous | thesis, target, constraints | signals, targets |
| 3 | Researcher | draft (Sonnet) | per-target | thesis, target | targets.dossier |
| 4 | Verifier | triage (Haiku) | pre-send | drafts, targets | drafts.riskLight, targets.emailConfidence |
| 5 | Drafter | premium (Opus) | per-target | identity, thesis, target, dossier | drafts |
| 6 | Sender | n/a (Gmail) | continuous | drafts, targets | messages, drafts.status |
| 7 | Follow-up | draft (Sonnet) | daily | identity, messages | drafts (replies) |
| 8 | Scheduler | draft (Sonnet) | on agreement | constraints, dossier | meetings |
| 9 | Pipeline Manager | premium (Opus) | daily + weekly | everything | runs.notes (memo), liveContext |

## File map

```
lib/agents/
  contracts.ts          ← shared types
  context.ts            ← load + render the 5-layer context block
  orchestrator.ts       ← tickUser() — the daily loop
  strategist.ts
  scout.ts
  researcher.ts
  verifier.ts
  drafter.ts
  sender.ts
  followup.ts
  scheduler.ts
  pipeline-manager.ts
```

Every agent passes the user's full context as a `cache_control: ephemeral`
system block so prompt caching works for all subsequent calls inside a tick.

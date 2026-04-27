# Pipeline · Play library

Seven multi-step sequences. The Pipeline Manager picks one per target; the
user can override.

| Play | Trigger | Best for | Expected reply |
| --- | --- | --- | --- |
| `direct_exec_cold_email` | leadership change or capital event with named decision-maker | roles that don't exist publicly but should | 15-22% |
| `tailored_app_backchannel` | high-fit posted role | roles that need both ATS compliance and inside support | 12-18% |
| `warm_intro` | top-priority target with strong mutual | high-value targets where cold under-converts | 45-65% |
| `newsjacking` | major company news in last 48h | time-sensitive moves | 20-30% |
| `event_convergence` | target speaking at a conference user could attend | building real-world rapport with high-value targets | 25-40% |
| `re_engage` | "reconnect in X" thread + new development | recovering threads other tools leak | 30-45% |
| `quiet_apply` | applying alone is genuinely the right move | very large companies, formal processes | 4-10% |

## Selection logic

Implemented in `lib/plays/index.ts → selectPlay()`. Pure function, deterministic,
covered by `tests/plays.test.ts`. Priority order:

1. Mutual connection → warm intro
2. Re-engage flag → re-engage
3. Fresh funding (≤2d) or fresh exec news (≤3d) → newsjacking
4. Posted role → tailored app + backchannel
5. Conference signal → event convergence
6. Leadership change → direct exec cold email
7. Default → direct exec cold email

## Why this is a moat

Wonsulting is a coaching company; they don't build software. Jobright is a
job board. Legacy automation tools optimise for volume. The encoded knowledge
of which signal triggers which sequence in which order — that's what nobody
else has.

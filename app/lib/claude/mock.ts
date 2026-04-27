/**
 * Deterministic mock for the Claude wrapper.
 *
 * Produces convincing, agent-specific outputs from the user prompt + a hash
 * seed so the entire Pipeline product is demonstrable without an API key.
 *
 * Real-world callers should prefer the live API path; this exists so that:
 *   1. The product boots with zero secrets.
 *   2. Tests run deterministically.
 *   3. Devin can demo to a design partner offline.
 */

import type { CallResult } from "./client";

interface MockArgs {
  agent: string;
  user: string;
  jsonMode?: boolean;
}

export function runMock(args: MockArgs): CallResult {
  const out = produce(args);
  return {
    text: out,
    json: args.jsonMode ? safeJson(out) : null,
    toolCalls: [],
    usage: { input: 800, output: 400, cached: 0 },
    costUsd: 0,
    durationMs: 35,
    mocked: true
  };
}

function produce(args: MockArgs): string {
  switch (args.agent) {
    case "strategist":
      return strategist(args);
    case "scout":
      return scout(args);
    case "researcher":
      return researcher(args);
    case "verifier":
      return verifier(args);
    case "drafter":
      return drafter(args);
    case "followup":
      return followup(args);
    case "scheduler":
      return scheduler(args);
    case "pipeline_manager":
      return pipelineManager(args);
    default:
      return "{}";
  }
}

function safeJson(s: string): unknown | null {
  try {
    return JSON.parse(s);
  } catch {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(s.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ── Strategist ────────────────────────────────────────────────────────────────

function strategist(_args: MockArgs): string {
  return JSON.stringify({
    positioning:
      "I help post-Series-B SaaS companies turn a stalled GTM motion into a repeatable revenue engine — without breaking the team that built it.",
    proofPoints: [
      "Took ARR from $14M → $42M in 22 months at Helix by re-architecting the AE/SE pairing and rebuilding ICP scoring.",
      "Closed two of the three largest deals in company history (>$1.4M ACV each) by inserting a CFO-grade business case into the late-stage motion.",
      "Built and retained a 28-person commercial team through a 19% RIF — zero regrettable attrition in the 12 months that followed.",
      "Shipped a partner-sourced channel that grew from 3% to 31% of new logo bookings in 14 months.",
      "Operator-coach reputation: three of my former AEs are now VPs running their own orgs."
    ],
    whyNow:
      "Two cycles of building inside other people's GTM systems. Ready to own a full commercial P&L at a Series B/C company that's already proven the wedge and needs the system around it.",
    archetypes: [
      {
        label: "Series B/C SaaS · GTM rebuild",
        description: "Founder-led sales hit a ceiling; needs a CRO who can build the system without breaking the room.",
        signals: ["recent Series B/C raise", "CRO/VP Sales departure in last 90 days", "engineering-heavy team adding go-to-market"]
      },
      {
        label: "Late-stage carve-out / spin-co",
        description: "Mature business unit being spun into independent company. Needs full commercial leadership wired in from day one.",
        signals: ["public spin-co announcement", "private equity carve-out", "board-led leadership search"]
      },
      {
        label: "Vertical SaaS scale-up",
        description: "$30-100M ARR vertical SaaS company growing into adjacent buyer personas. Needs experienced GTM operator.",
        signals: ["recent expansion into new vertical", "VP Sales with no enterprise experience", "expansion-rev plateau"]
      }
    ],
    campaigns: [
      { id: "camp_gtm_rebuild", name: "GTM Rebuild — recent CRO departures", thesis: "Re-architect the AE/SE motion to unlock stuck pipeline", targetCount: 24 },
      { id: "camp_carveout", name: "Carve-out commercial leadership", thesis: "Stand up a full GTM org from day one", targetCount: 9 },
      { id: "camp_vertical_scale", name: "Vertical SaaS scale-up", thesis: "Move from founder-led to repeatable enterprise motion", targetCount: 12 }
    ],
    refinedAt: Date.now()
  });
}

// ── Scout ─────────────────────────────────────────────────────────────────────

function scout(args: MockArgs): string {
  return JSON.stringify({
    relevance: round(0.55 + (hash(args.user) % 35) / 100),
    freshness: round(0.62 + (hash(args.user + "f") % 30) / 100),
    actionability: round(0.58 + (hash(args.user + "a") % 35) / 100),
    rationale:
      "Recent Series C announcement matches the GTM-rebuild archetype. Their CRO left 6 weeks ago — Reid spent 3 years at a comparable-stage SaaS and has the partner motion they're missing. Window closes when they backfill internally."
  });
}

// ── Researcher ────────────────────────────────────────────────────────────────

function researcher(args: MockArgs): string {
  const seed = hash(args.user);
  return JSON.stringify({
    overview:
      "Three-time CFO, currently at Augury (industrial AI, post-Series E). Background pattern: joins a vertical AI company at $30-60M ARR, helps it cross $100M, exits. Public on the topic of capital efficiency in industrial software; spoke at SaaStr 2025 about capital allocation in long-cycle B2B.",
    recentPosts: [
      {
        title: "What I look for in a Head of FP&A in 2026",
        url: "https://www.linkedin.com/posts/example-1",
        takeaway:
          "Wants someone who can build a planning model from raw data — not just operate someone else's. Hot button: hates 'process for process's sake.'"
      },
      {
        title: "Capital efficiency is a culture, not a spreadsheet",
        url: "https://www.linkedin.com/posts/example-2",
        takeaway: "Frames cap-ef as a leadership problem, not a finance one. Strong signal he respects operators who think like owners."
      }
    ],
    podcastAppearances: [
      {
        show: "20VC",
        episode: "S6E14 · The CFO's job in the AI era",
        takeaway: "Repeatedly describes the modern CFO as a 'pattern-matching machine across capital, talent, and product.'"
      }
    ],
    mutualConnections: [
      { name: "Sasha Levin (Series B at Augury, now angel)", relationship: "First boss; wrote a recommendation in 2022." },
      { name: "Marcus Wong (Operating Partner @ Lightspeed)", relationship: "Co-presented at the 2024 SaaS GTM summit." }
    ],
    companyNews: [
      {
        headline: "Augury announces new CPTO from Snowflake",
        date: "5 days ago",
        relevance:
          "Major leadership change at the executive layer. Likely triggers org rethink in adjacent functions, including FP&A and BizOps."
      }
    ],
    hooks: [
      "Open with the CPTO move — most outreach he gets right now ignores it. Tie his SaaStr 2025 capital-allocation point directly to what a CPTO transition demands of finance.",
      "Reference the Sasha Levin connection only if it lands organically — don't lead with name-dropping.",
      "Avoid 'I'd love to chat' phrasing; he's been public about hating it. Lead with a concrete observation."
    ],
    redFlags: [
      "Posted last month about being inundated with recruiter outreach. Generic notes will get auto-archived.",
      seed % 5 === 0 ? "Just got back from paternity leave (per Aug 14 LinkedIn post) — soften the urgency." : "None observed."
    ],
    generatedAt: Date.now()
  });
}

// ── Verifier ──────────────────────────────────────────────────────────────────

function verifier(args: MockArgs): string {
  const seed = hash(args.user);
  const lights = ["green", "green", "green", "yellow", "red"];
  const light = lights[seed % lights.length];
  return JSON.stringify({
    light,
    emailConfidence: light === "green" ? 0.94 : light === "yellow" ? 0.71 : 0.42,
    notes:
      light === "green"
        ? "Email validated via SMTP probe. No risk signals in the past 30 days."
        : light === "yellow"
        ? "Email validated but target posted publicly about high outreach volume — recommend a sharper hook than the current draft."
        : "Risk: target announced parental leave 4 days ago. Defer 6-8 weeks or skip."
  });
}

// ── Drafter ───────────────────────────────────────────────────────────────────

function drafter(args: MockArgs): string {
  // Two voicey variants. The mock uses a tone signature that mirrors the
  // user-style examples in the prompt.
  const variants = [
    {
      subject: "Augury's CPTO move + the FP&A question it raises",
      body: `Reid —

Saw the announcement on the new CPTO this morning. Congrats — that's a real signal about where you're taking the platform next.

The reason I'm writing: every CPTO transition I've watched at this stage forces a quiet recalibration in FP&A — new product bets, new build/buy framing, a different kind of business case in front of the board. Most finance leaders treat that as a reporting change. I treat it as a leadership shift.

Last cycle I helped a Series E vertical-AI company rebuild their planning motion through exactly that transition; we shifted from quarterly forecast misses to a board-ready 3-year operating plan in two cycles. I'd love 20 minutes to compare notes — even if there's no role today, I think the way you framed capital allocation at SaaStr last year is the cleanest articulation of what I want to be working on next.

Worth a quick conversation?

— Marcus`,
      groundingNote: "CPTO announcement (5 days ago) + Reid's SaaStr 2025 capital allocation talk. Both pulled from dossier; both surfaceable in his recent public footprint."
    },
    {
      subject: "20 minutes on FP&A through a CPTO transition",
      body: `Reid —

Quick note — your team's CPTO announcement triggered a thought I wanted to put in front of you before I overthought it.

I've spent the last two cycles doing finance leadership at Series D/E SaaS companies through major exec transitions on the product side. The FP&A motion that worked — and the one that quietly broke — became one of the most underrated leverage points I've ever owned. I'd value 20 minutes to compare notes, with no expectation of a role on the table.

If useful, I'll send a 1-page summary of how I think about it ahead of time so you're not paying interest on the meeting.

— Marcus`,
      groundingNote: "Same CPTO trigger; tighter format. Tests whether short-form outperforms in this segment."
    }
  ];
  return JSON.stringify({ variants, voiceScore: 0.88 });
}

// ── Follow-up ─────────────────────────────────────────────────────────────────

function followup(args: MockArgs): string {
  const classes = ["positive", "scheduling", "info_request", "neutral", "negative"] as const;
  const cls = classes[hash(args.user) % classes.length];
  const replies: Record<typeof cls, string> = {
    positive:
      "Reid — appreciate the fast yes. Thursday or Friday afternoon both work; I'll send three concrete times via the calendar tool. Ahead of the call I'll put together a 1-pager on the FP&A-through-transition framework so we can spend the 20 minutes on what's most useful.",
    scheduling:
      "Reid — Thursday at 3pm PT or Friday at 10am PT both work on my side. Sending a Calendly link — pick whichever fits, and I'll pull the 1-pager together ahead of the time.",
    info_request:
      "Happy to send context. Two things attached: (1) my FP&A scorecard from the last cycle, (2) a one-pager on the operating-plan rebuild I led at the same stage. If either lines up, I'll come prepared with the 20-minute version.",
    neutral:
      "Totally fair — keeping you on my radar. If something shifts on your end I'd be glad to reopen this. In the meantime I'll keep it to one nudge per quarter, no more.",
    negative:
      "Understood, and appreciate the directness. I'll close the loop and won't follow up further unless something materially changes on your side."
  };
  return JSON.stringify({ classification: cls, draftBody: replies[cls] });
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

function scheduler(_args: MockArgs): string {
  const base = Date.now();
  const slots = [3, 4, 5].map((d) => new Date(base + d * 24 * 3600 * 1000).toISOString());
  return JSON.stringify({
    proposedSlots: slots,
    durationMinutes: 30,
    briefMd: `# Pre-meeting brief — Reid Larson (Augury)\n\n**Why we're meeting.** Reid responded positively to the FP&A-through-transition note. He's curious; not actively hiring publicly.\n\n**Three things to bring.**\n1. The 1-page operating-plan framework I referenced.\n2. The Snowflake CPTO transition pattern (he'll know the details).\n3. A clean version of the 'what I want to be working on next' positioning.\n\n**One thing to avoid.** Generic 'tell me about Augury' opener — he hates it.`
  });
}

// ── Pipeline Manager ──────────────────────────────────────────────────────────

function pipelineManager(_args: MockArgs): string {
  return JSON.stringify({
    sundayMemo: `# Pipeline weekly · synthesis\n\n**Where the funnel is.** 47 active targets · 18 in 'engaged' or warmer · 4 first-round meetings booked this week.\n\n**What's working.** The 'GTM Rebuild — recent CRO departures' campaign is now your highest-yield play (28% reply, 11% meeting-booked). Doubling target volume there next week.\n\n**What's not.** 'Vertical SaaS scale-up' is only at 9% reply. The grounding hooks read as too generic — you didn't have enough public surface area on those targets. Recommend Researcher does deeper passes there before drafting resumes.\n\n**The non-obvious move.** Two of your 'rejected' targets posted leadership-change news this week. Re-engage them via the Re-engage play with a fresh angle.\n\n**Decision needed.** Hold or extend the freeze on Health-Tech archetype? You marked it cold 3 weeks ago; market signal has shifted.`,
    bottlenecks: ["Researcher pass on Vertical SaaS targets is too thin", "Hunter.io rate ceiling hit twice this week"],
    pivots: ["Double 'GTM Rebuild' weekly target count from 12 → 24", "Pause 'Health-Tech' archetype until next week's review"]
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

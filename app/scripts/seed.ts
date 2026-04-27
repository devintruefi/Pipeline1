/**
 * Seed script.
 *
 * Creates the demo user, runs the Strategist on him, runs one full orchestrator
 * tick, and prints a summary. The seed user is "Marcus Chen" so the dashboard
 * is immediately demoable to a friend or design partner on a fresh checkout.
 *
 * Idempotent: running twice produces the same demo state.
 */

import { db, schema, ensureSchema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { id } from "@/lib/utils";
import { parseResumeText, extractVoiceProfile } from "@/lib/parsing/resume";
import { runStrategist } from "@/lib/agents/strategist";
import { tickUser } from "@/lib/agents/orchestrator";

const RESUME = `Marcus Chen
VP of Sales · Series B/C SaaS commercial leadership

Summary
Three-time commercial leader. Built and scaled GTM teams at Helix, Brick, and Vellum. Took ARR from $14M to $42M at Helix in 22 months by re-architecting the AE/SE pairing.

VP of Sales — Helix (2021 — present)
- Took ARR from $14M to $42M in 22 months
- Closed two of the three largest deals in company history (>$1.4M ACV each)
- Built a 28-person commercial team and retained 100% through a 19% RIF
- Shipped a partner-sourced channel that grew from 3% to 31% of new logo bookings

Director of Sales — Brick (2018 — 2021)
- Grew NA bookings from $4M to $19M
- Hired and developed 12 AEs; 4 are now VPs

Account Executive — Vellum (2014 — 2018)
- President's Club, three consecutive years
- Closed the largest single deal in company history at the time

Skills: Enterprise sales · Commercial leadership · Go-to-market design · Channel · Pricing
Education: Stanford GSB — MBA, 2014`;

const VOICE = [
  `Quick note —

Saw your team's funding announcement this morning. The framing in the press release matched almost exactly what you wrote about "earned distribution" on Substack last quarter. Curious what the AE/SE pairing looks like in your motion now that the partner channel is doing real volume.

Worth a 20-minute conversation?

— Marcus`,
  `Reading your Q3 letter today.

Two things stood out — the deliberate move out of the SMB tier, and the quiet pivot in how you're framing AI as a wedge into the enterprise plan. Both of those are decisions I've watched other teams flinch on.

If it's useful, happy to send a one-pager on how we made the same trade at Helix.`
];

async function main() {
  await ensureSchema();
  const email = "demo@pipeline.app";
  let user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user) {
    const userId = id("usr");
    const resume = parseResumeText(RESUME);
    const voiceProfile = extractVoiceProfile(VOICE);
    await db.insert(schema.users).values({
      id: userId,
      email,
      name: "Marcus Chen",
      tier: "max",
      status: "active",
      identity: {
        resume,
        linkedinUrl: "https://www.linkedin.com/in/marcus-chen-example",
        receipts: [
          { title: "ARR rebuild at Helix", metric: "$14M → $42M in 22 months", story: "Re-architected the AE/SE pairing and rebuilt ICP scoring.", tags: ["arr", "gtm-rebuild"] },
          { title: "Largest deals in company history", metric: "Two >$1.4M ACV each", story: "Inserted a CFO-grade business case into the late-stage motion.", tags: ["enterprise", "deals"] },
          { title: "Retention through RIF", metric: "Zero regrettable attrition over 12mo after 19% RIF", story: "Held the team together with weekly 1:1 cadence and an honest comms plan.", tags: ["leadership", "retention"] },
          { title: "Partner channel build", metric: "3% → 31% of new logo bookings in 14mo", story: "Stood up a partner-sourced channel from scratch.", tags: ["partner", "channel"] }
        ],
        voiceProfile
      },
      target: {
        roleShape: ["VP Sales", "CRO", "GTM Leader"],
        companyStage: ["Series B", "Series C"],
        industries: { mustHave: ["SaaS", "vertical AI", "infrastructure"], nope: ["crypto", "gambling"] },
        comp: { floor: 280000, ceiling: 420000, flexNotes: "Open below floor for the right equity story" },
        geography: { primary: ["SF Bay Area", "NYC"], openTo: ["Remote-first US"], remote: true },
        mission: "Companies that have proven the wedge and need the system around it.",
        timelineUrgencyWeeks: 12
      },
      constraints: {
        confidentiality: { noFlyCompanies: ["Helix"], noFlyPeople: [] },
        channels: { email: true, linkedin: true, warmIntro: true },
        volume: { dailySendCap: 12, weeklyTargetCap: 60 },
        tone: { formal: 0.4, warm: 0.6, assertive: 0.7 },
        schedule: { sendWindowStartHourLocal: 9, sendWindowEndHourLocal: 17, tz: "America/Los_Angeles" },
        autonomy: "review-every"
      },
      thesis: null,
      liveContext: null
    });
    user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
    console.log(`Created demo user ${user!.id}`);
  } else {
    console.log(`Demo user already exists: ${user.id}`);
  }

  if (!user!.thesis) {
    console.log("Running Strategist…");
    await runStrategist(user!.id);
  }

  console.log("Running one orchestrator tick…");
  const r = await tickUser(user!.id);
  console.log("Tick result:", r);

  console.log("\nSeed complete.");
  console.log(`Open http://localhost:3000/dashboard — you'll be auto-routed to the demo user via the seed fallback in /lib/session.ts`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

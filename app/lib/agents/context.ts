import "server-only";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import type { UserContext } from "./contracts";

/** Load the full Personal Context Model for a user, ready to feed an agent. */
export async function loadUserContext(userId: string): Promise<UserContext> {
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!u) throw new Error(`User ${userId} not found`);
  return {
    userId: u.id,
    name: u.name,
    identity: u.identity ?? null,
    thesis: u.thesis ?? null,
    target: u.target ?? null,
    constraints: u.constraints ?? null,
    liveContext: u.liveContext ?? null
  };
}

/** Render the context as a long, cacheable text block for prompt-cached system prompts. */
export function renderContextBlock(ctx: UserContext): string {
  const parts: string[] = [];
  parts.push(`# USER CONTEXT (Personal Context Model)\n\nName: ${ctx.name ?? "—"}\nUserId: ${ctx.userId}`);

  if (ctx.identity) {
    parts.push("\n## Identity");
    if (ctx.identity.resume) {
      parts.push(`**Headline:** ${ctx.identity.resume.headline}\n**Summary:** ${ctx.identity.resume.summary}`);
      parts.push("\n**Roles**");
      for (const r of ctx.identity.resume.roles) {
        parts.push(`- **${r.title}** at ${r.company} (${r.start} – ${r.end}) — ${r.scope ?? ""}`);
        for (const b of r.bullets.slice(0, 4)) parts.push(`  · ${b}`);
      }
      parts.push(`\n**Skills:** ${ctx.identity.resume.skills.join(", ")}`);
    }
    if (ctx.identity.receipts.length) {
      parts.push("\n**Receipts (proof points)**");
      for (const r of ctx.identity.receipts) parts.push(`- ${r.title} — ${r.metric}: ${r.story}`);
    }
    if (ctx.identity.voiceProfile) {
      parts.push(`\n**Voice profile.** Tone: ${ctx.identity.voiceProfile.tone}. Cadence: ${ctx.identity.voiceProfile.cadence}.`);
      if (ctx.identity.voiceProfile.quirks.length)
        parts.push(`Quirks: ${ctx.identity.voiceProfile.quirks.join("; ")}`);
      if (ctx.identity.voiceProfile.avoid.length)
        parts.push(`Always avoid: ${ctx.identity.voiceProfile.avoid.join("; ")}`);
      if (ctx.identity.voiceProfile.examples.length) {
        parts.push("\nVoice examples (the user's actual writing — match this tone, cadence, and rhythm):");
        for (const ex of ctx.identity.voiceProfile.examples.slice(0, 5)) parts.push(`---\n${ex}\n---`);
      }
    }
  }

  if (ctx.thesis) {
    parts.push(`\n## Thesis\n**Positioning:** ${ctx.thesis.positioning}\n**Why now:** ${ctx.thesis.whyNow}`);
    parts.push("**Proof points:**");
    for (const p of ctx.thesis.proofPoints) parts.push(`- ${p}`);
    parts.push("**Target archetypes:**");
    for (const a of ctx.thesis.archetypes)
      parts.push(`- **${a.label}** — ${a.description} (signals: ${a.signals.join(", ")})`);
  }

  if (ctx.target) {
    parts.push("\n## Target profile");
    parts.push(`Roles: ${ctx.target.roleShape.join(", ")}`);
    parts.push(`Stage: ${ctx.target.companyStage.join(", ")}`);
    parts.push(`Industries — must: ${ctx.target.industries.mustHave.join(", ")} | nope: ${ctx.target.industries.nope.join(", ")}`);
    parts.push(`Comp: $${ctx.target.comp.floor.toLocaleString()}–$${ctx.target.comp.ceiling.toLocaleString()} (${ctx.target.comp.flexNotes})`);
    parts.push(`Geography: ${ctx.target.geography.primary.join(", ")} (remote-ok: ${ctx.target.geography.remote})`);
    parts.push(`Mission: ${ctx.target.mission}`);
  }

  if (ctx.constraints) {
    parts.push("\n## Constraints");
    parts.push(`Channels: email=${ctx.constraints.channels.email} li=${ctx.constraints.channels.linkedin} warm=${ctx.constraints.channels.warmIntro}`);
    parts.push(`Daily send cap: ${ctx.constraints.volume.dailySendCap}`);
    parts.push(`No-fly companies: ${ctx.constraints.confidentiality.noFlyCompanies.join(", ") || "—"}`);
    parts.push(`No-fly people: ${ctx.constraints.confidentiality.noFlyPeople.join(", ") || "—"}`);
    parts.push(`Autonomy mode: ${ctx.constraints.autonomy}`);
  }

  return parts.join("\n");
}

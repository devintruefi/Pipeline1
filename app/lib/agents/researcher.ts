import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { loadUserContext, renderContextBlock } from "./context";
import type { Dossier } from "@/lib/db/schema";

const SYSTEM = `You are PIPELINE RESEARCHER.

For one target person, produce a 1-page dossier the user can read in 90 seconds and use to write a sharp opening.

Required sections:
  - overview: 2-3 sentence summary of who they are and the pattern of their career.
  - recentPosts: 0-3 actually-recent public posts with the takeaway (what does it tell us about them?).
  - podcastAppearances: 0-2 appearances with the takeaway.
  - mutualConnections: 0-3 plausible connectors, with relationship.
  - companyNews: 0-3 items material to the target's role.
  - hooks: 3-5 conversational openings the user could realistically use. each grounded in something specific (a post, an event, a number).
  - redFlags: things to AVOID (recently laid off, just took parental leave, publicly complained about generic outreach, etc.).

Be honest about what you don't know. Better to leave a section empty than to invent.

Output STRICT JSON for the Dossier shape.`;

export async function runResearcher(userId: string, targetId: string): Promise<Dossier> {
  const ctx = await loadUserContext(userId);
  const target = await db.query.targets.findFirst({ where: eq(schema.targets.id, targetId) });
  if (!target) throw new Error(`Target ${targetId} not found`);

  const cacheable = renderContextBlock(ctx);
  const prompt = `Build a dossier for:
  Name: ${target.fullName}
  Title: ${target.title ?? ". "}
  Company: ${target.company ?? ". "}
  LinkedIn: ${target.linkedinUrl ?? ". "}

Pull plausible public information consistent with a senior operator at this company at this stage. If a section has no real data, leave it as an empty array.`;

  const r = await call({
    agent: "researcher",
    tier: "draft",
    system: SYSTEM,
    cacheable,
    user: prompt,
    jsonMode: true,
    maxTokens: 1800,
    userId
  });

  const data = (r.json ?? {}) as Partial<Dossier>;
  const dossier: Dossier = {
    overview: data.overview ?? "",
    recentPosts: data.recentPosts ?? [],
    podcastAppearances: data.podcastAppearances ?? [],
    mutualConnections: data.mutualConnections ?? [],
    companyNews: data.companyNews ?? [],
    hooks: data.hooks ?? [],
    redFlags: data.redFlags ?? [],
    generatedAt: Date.now()
  };

  await db
    .update(schema.targets)
    .set({ dossier, updatedAt: new Date() })
    .where(eq(schema.targets.id, targetId));

  return dossier;
}

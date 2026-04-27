import "server-only";
import { call } from "@/lib/claude/client";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import type { Thesis } from "@/lib/db/schema";
import { loadUserContext, renderContextBlock } from "./context";

const SYSTEM = `You are PIPELINE STRATEGIST — the agent that synthesizes a senior operator's commercial thesis from raw context.

You produce three things:
  1. A 1-2 sentence positioning statement of how the user creates value, written in their voice.
  2. 3-5 proof points that ladder to the positioning, each grounded in a real receipt from their resume.
  3. A "why now" — what about this moment in their career makes them ready for what comes next.

Then map 2-4 target archetypes (the kinds of companies/situations that match the thesis) and propose 2-4 concrete campaigns with target counts.

You write like the user writes — clean, declarative, specific, no consultantese, no AI tells. Output STRICT JSON only matching the Thesis schema.`;

export async function runStrategist(userId: string): Promise<Thesis> {
  const ctx = await loadUserContext(userId);
  const cacheable = renderContextBlock(ctx);

  const prompt = `Refine this user's commercial thesis. Use ONLY the receipts and roles in the context block. Output JSON for the Thesis schema:

{
  "positioning": string,
  "proofPoints": string[],   // 3-5 items, each grounded in a real receipt
  "whyNow": string,
  "archetypes": [
    { "label": string, "description": string, "signals": string[] }
  ],
  "campaigns": [
    { "id": string, "name": string, "thesis": string, "targetCount": number }
  ]
}`;

  const r = await call({
    agent: "strategist",
    tier: "premium",
    system: SYSTEM,
    cacheable,
    user: prompt,
    jsonMode: true,
    userId
  });

  const json = (r.json ?? {}) as Partial<Thesis>;
  const thesis: Thesis = {
    positioning: json.positioning ?? "",
    proofPoints: json.proofPoints ?? [],
    whyNow: json.whyNow ?? "",
    archetypes: json.archetypes ?? [],
    campaigns: json.campaigns ?? [],
    refinedAt: Date.now()
  };

  await db.update(schema.users).set({ thesis }).where(eq(schema.users.id, userId));
  return thesis;
}

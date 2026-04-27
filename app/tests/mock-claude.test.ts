import { describe, it, expect } from "vitest";
import { runMock } from "@/lib/claude/mock";

describe("Claude mock", () => {
  it("strategist returns thesis JSON", () => {
    const r = runMock({ agent: "strategist", user: "synthesize", jsonMode: true });
    const j = r.json as { positioning: string; archetypes: unknown[] };
    expect(j.positioning).toMatch(/.+/);
    expect(j.archetypes.length).toBeGreaterThan(0);
  });

  it("scout returns numeric scores", () => {
    const r = runMock({ agent: "scout", user: "score this", jsonMode: true });
    const j = r.json as { relevance: number; freshness: number; actionability: number };
    expect(j.relevance).toBeGreaterThanOrEqual(0);
    expect(j.freshness).toBeGreaterThanOrEqual(0);
    expect(j.actionability).toBeGreaterThanOrEqual(0);
  });

  it("drafter returns 2 variants and a voice score", () => {
    const r = runMock({ agent: "drafter", user: "write something", jsonMode: true });
    const j = r.json as { variants: { subject: string; body: string }[]; voiceScore: number };
    expect(j.variants.length).toBeGreaterThanOrEqual(2);
    expect(j.voiceScore).toBeGreaterThan(0);
  });

  it("verifier returns a light", () => {
    const r = runMock({ agent: "verifier", user: "check", jsonMode: true });
    const j = r.json as { light: string };
    expect(["green", "yellow", "red"]).toContain(j.light);
  });

  it("pipeline_manager returns memo + bottlenecks + pivots", () => {
    const r = runMock({ agent: "pipeline_manager", user: "review", jsonMode: true });
    const j = r.json as { sundayMemo: string; bottlenecks: string[]; pivots: string[] };
    expect(j.sundayMemo).toMatch(/Pipeline weekly/);
    expect(Array.isArray(j.bottlenecks)).toBe(true);
    expect(Array.isArray(j.pivots)).toBe(true);
  });
});

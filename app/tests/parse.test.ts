import { describe, it, expect } from "vitest";
import { parseResumeText, extractVoiceProfile } from "@/lib/parsing/resume";

describe("parseResumeText", () => {
  it("extracts role with bullets in dash format", () => {
    const txt = `Marcus Chen\n\nVP of Sales — Helix (2021 — present)\n- Took ARR from $14M to $42M\n- Closed largest deals\n\nSkills: Enterprise sales, Channel`;
    const r = parseResumeText(txt);
    expect(r?.roles[0]?.title).toBe("VP of Sales");
    expect(r?.roles[0]?.company).toBe("Helix");
    expect(r?.roles[0]?.bullets.length).toBe(2);
    expect(r?.skills).toContain("Enterprise sales");
  });
});

describe("extractVoiceProfile", () => {
  it("returns avoid list and examples", () => {
    const v = extractVoiceProfile(["sample 1", "sample 2"]);
    expect(v.avoid.length).toBeGreaterThan(0);
    expect(v.examples.length).toBe(2);
  });
});

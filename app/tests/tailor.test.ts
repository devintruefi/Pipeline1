import { describe, it, expect } from "vitest";
import { tailorResume } from "@/lib/tailor/engine";

const RESUME = {
  headline: "VP Sales · Series B/C SaaS",
  summary: "Three-time commercial leader.",
  roles: [
    {
      company: "Helix",
      title: "VP of Sales",
      start: "2021",
      end: "present" as const,
      bullets: [
        "Took ARR from $14M to $42M in 22 months",
        "Built a partner-sourced channel that grew from 3% to 31% of new logo bookings",
        "Closed two of the three largest deals in company history",
        "Hired and retained 28-person commercial team through a 19% RIF"
      ]
    },
    {
      company: "Brick",
      title: "Director of Sales",
      start: "2018",
      end: "2021",
      bullets: ["Grew NA bookings from $4M to $19M", "Hired 12 AEs"]
    }
  ],
  skills: ["Enterprise", "Channel"],
  education: [{ school: "Stanford GSB", degree: "MBA" }]
};

describe("tailorResume", () => {
  it("orders bullets by JD relevance", () => {
    const jd = "We need a VP of Sales who can build a partner channel and rebuild the AE/SE motion.";
    const out = tailorResume({ jdText: jd, resume: RESUME });
    const helixBullets = out.rolesOrdered[0].bullets;
    expect(helixBullets[0]).toMatch(/partner/);
  });

  it("returns markdown that contains role and bullets", () => {
    const out = tailorResume({ jdText: "partner channel", resume: RESUME });
    expect(out.markdown).toContain("Helix");
    expect(out.markdown).toContain("partner-sourced channel");
  });

  it("computes keyword coverage", () => {
    const out = tailorResume({ jdText: "partner channel sales arr motion", resume: RESUME });
    expect(out.keywordCoverage.covered).toContain("partner");
  });
});

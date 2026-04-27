import type { UserContext } from "@/lib/agents/contracts";
import type { RawSignal } from "./index";

/**
 * High-fidelity mock signal stream so the dashboard always has something to do
 * when API keys are absent. The signals are crafted to align with the typical
 * archetypes a Series-B-to-pre-IPO operator would target.
 */
export function mockSignals(_ctx: UserContext): RawSignal[] {
  const now = Date.now();
  const day = 24 * 3600 * 1000;
  return [
    {
      kind: "leadership_change",
      source: "TheInformation",
      url: "https://example.com/augury-cpto",
      headline: "Augury appoints former Snowflake exec as new CPTO",
      body: "Augury, the industrial AI company, announced this morning that former Snowflake VP of product Reid Larson has joined as Chief Product & Technology Officer. The hire follows the company's $75M Series E round in Q1.",
      entityCompany: "Augury",
      entityPerson: "Reid Larson",
      detectedAt: now - 5 * day
    },
    {
      kind: "funding",
      source: "Crunchbase",
      url: "https://example.com/torque-series-c",
      headline: "Torque raises $58M Series C led by Lightspeed",
      body: "Torque, a vertical SaaS platform for industrial maintenance, has raised $58M led by Lightspeed Venture Partners. CEO Marisol Vega indicated the company will be expanding its commercial leadership team.",
      entityCompany: "Torque",
      entityPerson: "Marisol Vega",
      detectedAt: now - 1 * day
    },
    {
      kind: "leadership_change",
      source: "LinkedIn",
      url: "https://example.com/helix-cro-departure",
      headline: "Helix CRO departs after 4 years",
      body: "Helix, a workflow automation company, announced via LinkedIn post that CRO Daniel Park is stepping down to pursue an operating role. The company is conducting a search for his successor.",
      entityCompany: "Helix",
      entityPerson: "Daniel Park",
      detectedAt: now - 2 * day
    },
    {
      kind: "role_posted",
      source: "LinkedIn Jobs",
      url: "https://example.com/upwave-vp-sales",
      headline: "Upwave is hiring a VP of Sales",
      body: "Upwave, a Series B SaaS company, posted a VP of Sales role yesterday. The job description emphasises rebuilding the AE/SE motion and partner channel.",
      entityCompany: "Upwave",
      entityPerson: "Hiring Manager — TBD",
      detectedAt: now - 1 * day
    },
    {
      kind: "exec_news",
      source: "Bloomberg",
      url: "https://example.com/marigold-spin",
      headline: "Marigold to spin out enterprise unit",
      body: "Marigold announced plans to spin its enterprise SaaS unit into an independent company. New leadership will be needed across commercial, finance, and product.",
      entityCompany: "Marigold Spin-Co",
      entityPerson: "TBD — search underway",
      detectedAt: now - 3 * day
    },
    {
      kind: "funding",
      source: "TechCrunch",
      url: "https://example.com/lattice-series-d",
      headline: "Lattice closes $90M Series D, signals enterprise push",
      body: "Lattice raised $90M to fund expansion into the enterprise tier. CEO has publicly noted the need for a CFO transition.",
      entityCompany: "Lattice",
      entityPerson: "Jack Altman",
      detectedAt: now - 4 * day
    },
    {
      kind: "leadership_change",
      source: "Substack",
      url: "https://example.com/thrive-vpgtm",
      headline: "Thrive's VP GTM exits in surprise move",
      body: "Thrive Health's VP of GTM exited yesterday, leaving the company actively seeking a senior commercial leader.",
      entityCompany: "Thrive Health",
      entityPerson: "Hiring Manager — CEO Anna Reeves",
      detectedAt: now - 6 * day
    },
    {
      kind: "conference",
      source: "SaaStr",
      url: "https://example.com/saastr-2026",
      headline: "SaaStr Annual 2026 — speakers announced",
      body: "Multiple commercial leaders from companies in the user's archetype list are speaking at SaaStr Annual next month.",
      entityCompany: "SaaStr",
      entityPerson: "Multiple",
      detectedAt: now - 8 * day
    },
    {
      kind: "product_launch",
      source: "TechCrunch",
      url: "https://example.com/heron-launch",
      headline: "Heron launches enterprise tier — first GTM hire to follow",
      body: "Heron's new enterprise tier launched today. The company has indicated it will hire a head of enterprise sales next quarter.",
      entityCompany: "Heron",
      entityPerson: "Founder — Maya Aiyer",
      detectedAt: now - 12 * day
    },
    {
      kind: "layoff",
      source: "TheLayoff",
      url: "https://example.com/quill-layoff",
      headline: "Quill announces 12% workforce reduction",
      body: "Quill is reducing headcount; existing CRO is staying. Reduces near-term fit but worth tracking for re-engagement in 6 months.",
      entityCompany: "Quill",
      entityPerson: "—",
      detectedAt: now - 1 * day
    }
  ];
}

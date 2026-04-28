export type PlanId = "launch" | "pro" | "max";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  audience: string;
  monthly: number;
  successFee: number; // contingent fee on accepted offer; 0 = no success fee
  features: string[];
  cadence: string;          // how often the agents tick
  modelTier: string;        // user-facing description of which Claude tier powers it
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "launch",
    name: "Pipeline Launch",
    tagline: "Your first job, on rails.",
    audience: "Students, new grads, internships, first-time job seekers.",
    monthly: 19,
    successFee: 0,
    cadence: "Daily tick + on-demand from the dashboard",
    modelTier: "Haiku-tier · cost-tuned for high-volume early-career outreach",
    features: [
      "Resume + cover letter that adapts per role",
      "ATS-optimized application flow",
      "Alumni-finder for warm intros",
      "Interview prep with role-specific question prompts",
      "30 active targets · 60 sends / month",
      "Tap-to-send LinkedIn queue"
    ]
  },
  {
    id: "pro",
    name: "Pipeline Pro",
    tagline: "For mid-career transitions and laid-off pros.",
    audience: "Senior ICs, managers, directors. anyone with receipts.",
    monthly: 79,
    successFee: 0,
    cadence: "Hourly tick + on-demand · weekly Sunday memo",
    modelTier: "Sonnet primary · Opus reserved for strategy + Sunday memo",
    highlight: true,
    features: [
      "Full multi-agent system (Strategist, Scout, Researcher, Drafter…)",
      "Voice fingerprinting on every draft",
      "Funding + leadership-change signal alerts",
      "Warm-intro routing through your network",
      "Resume tailoring per target with receipt swap",
      "100 active targets · unlimited sends",
      "Gmail + Calendar integration",
      "Pipeline Manager Sunday memo"
    ]
  },
  {
    id: "max",
    name: "Pipeline Max",
    tagline: "The autonomous executive job search.",
    audience: "VPs, CROs, GMs, founders. Executive moves where one warm intro beats a hundred cold sends.",
    monthly: 299,
    successFee: 1500,
    cadence: "Hourly tick · real-time signal alerts · daily Sunday memo",
    modelTier: "Opus on Strategist / Drafter / Pipeline Manager · full agent depth",
    features: [
      "Everything in Pro",
      "Unlimited targets",
      "Real-time signal alerts (funding, leadership change, board moves)",
      "Custom thesis development each quarter",
      "Live human coach (1 hr / month)",
      "Negotiation prep + offer-sequencing playbook",
      "Priority compute on Opus-tier agents",
      "12-month re-engagement guarantee on accepted offer"
    ]
  }
];

export const PLAN_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<PlanId, Plan>;

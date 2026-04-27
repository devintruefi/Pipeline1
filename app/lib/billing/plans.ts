export interface Plan {
  id: "solo" | "plus" | "concierge";
  name: string;
  monthly: number;
  successFee: number;
  features: string[];
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Pipeline",
    monthly: 149,
    successFee: 1500,
    features: [
      "Full multi-agent system",
      "100 targets / month",
      "Unlimited approvals",
      "Resume tailoring",
      "Gmail + Calendar integration",
      "Tap-to-send LinkedIn queue"
    ]
  },
  {
    id: "plus",
    name: "Pipeline+",
    monthly: 249,
    successFee: 1500,
    highlight: true,
    features: [
      "Everything in Solo",
      "Unlimited targets",
      "Weekly strategy synthesis",
      "Real-time signal alerts",
      "Priority compute",
      "Live human coach (1 hr / month)"
    ]
  },
  {
    id: "concierge",
    name: "Concierge",
    monthly: 0,
    successFee: 3000,
    features: [
      "White-glove onboarding",
      "Custom thesis development",
      "Senior coach pairing",
      "Negotiation support",
      "12-month re-engagement guarantee",
      "Available to vetted candidates"
    ]
  }
];

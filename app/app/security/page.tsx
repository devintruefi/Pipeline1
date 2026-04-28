import { Lock, ShieldCheck, EyeOff, Ban, CheckCircle2, KeyRound } from "lucide-react";

const COMMITMENTS = [
  {
    icon: Ban,
    title: "Never auto-send on LinkedIn.",
    body:
      "All LinkedIn drafts go to a tap-to-send queue. The user clicks Send inside LinkedIn itself. Zero risk of an account ban from the platform."
  },
  {
    icon: KeyRound,
    title: "Gmail integration is read-first.",
    body:
      "Send scope requires a separate, explicit opt-in. Tokens are stored encrypted at rest. Revocable in one click from Settings."
  },
  {
    icon: EyeOff,
    title: "No LinkedIn scraping.",
    body:
      "Pipeline does not maintain a profile database. Public-data sources only. Crunchbase, news, company sites, public posts."
  },
  {
    icon: ShieldCheck,
    title: "No-fly lists are enforced at the agent layer.",
    body:
      "Confidentiality boundaries. current employer's customers, friends, ex-colleagues. are enforced inside the Drafter prompt. The agent literally cannot draft to a no-fly target."
  },
  {
    icon: CheckCircle2,
    title: "Approval queue, not autopilot.",
    body:
      "Every send waits for explicit human approval unless the user has opted into a low-risk auto mode for follow-ups. Default is review-every."
  },
  {
    icon: Lock,
    title: "Voice profile lives in your account.",
    body:
      "Your past writing samples are used only to score voice fidelity on outbound drafts. They are not used to train shared models. Export and delete in one click."
  }
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow eyebrow-dot">Security &amp; compliance</p>
        <h1 className="mt-4 font-display text-[44px] md:text-[60px] tracking-tightest leading-[1.0] font-medium text-ink text-balance">
          Built like an executive's inbox is sacred. because it is.
        </h1>
        <p className="mt-5 text-[16.5px] leading-[1.65] text-ink-700 text-pretty max-w-prose">
          Pipeline runs in a regulated channel surrounded by reputational risk. Six commitments
          define the safety posture. Read them carefully. they are why we built the product the way
          we did.
        </p>
      </header>

      <ul className="mt-14 grid md:grid-cols-2 gap-4 stagger">
        {COMMITMENTS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="card p-6 grid grid-cols-[44px_1fr] gap-5 items-start">
            <span className="grid place-items-center h-11 w-11 rounded-md bg-ink text-paper">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-[16px] tracking-tightish font-medium text-ink leading-snug">
                {title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-700 text-pretty">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-14 rounded-xl bg-ink text-paper p-7 md:p-9 grain">
        <p className="eyebrow !text-accent-200">Audit trail</p>
        <p className="mt-3 font-display text-[22px] md:text-[26px] tracking-tightish leading-snug text-paper text-balance max-w-2xl">
          Every agent invocation is logged in your account. You can see what each agent did, what it
          read, what it cost, and why. across all nine roles, indefinitely.
        </p>
        <p className="mt-3 text-[13.5px] text-paper-200 max-w-prose">
          The run log is a first-class surface, not a hidden table. Visit{" "}
          <code className="font-mono text-paper">/runs</code> from the Control Center to inspect.
        </p>
      </section>
    </div>
  );
}

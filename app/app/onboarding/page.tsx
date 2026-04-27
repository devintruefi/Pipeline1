import Link from "next/link";

export default function OnboardingIntro() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-16">
      <p className="eyebrow">Onboarding · 30 minutes, once</p>
      <h1 className="h-section mt-2">Three phases. One sitting.</h1>
      <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-ink-700">
        We'll ingest your background, walk through a 10-minute strategy conversation, and set your
        constraints. By the end, you'll have your first 20 targets and 5 drafts queued.
      </p>

      <ol className="mt-10 space-y-3">
        <PhaseRow num={1} title="Ingest" body="Resume, LinkedIn URL, Gmail (read), and 3-5 voice samples." />
        <PhaseRow num={2} title="Strategy Conversation" body="A 10-minute conversation that surfaces your thesis, archetypes, and proof points." />
        <PhaseRow num={3} title="Constraints" body="Comp floor, geography, channels, no-fly list, autonomy mode." />
      </ol>

      <div className="mt-10 flex gap-3">
        <Link href="/onboarding/ingest" className="btn-primary">Begin onboarding</Link>
        <Link href="/dashboard" className="btn-secondary">Skip and explore the dashboard</Link>
      </div>
    </div>
  );
}

function PhaseRow({ num, title, body }: { num: number; title: string; body: string }) {
  return (
    <li className="card p-5 flex items-start gap-5">
      <span className="text-ink-300 font-semibold tracking-tighter text-[28px] tabular-nums">0{num}</span>
      <div>
        <p className="font-semibold tracking-tightish text-ink">{title}</p>
        <p className="mt-1 text-[14px] text-ink-700">{body}</p>
      </div>
    </li>
  );
}

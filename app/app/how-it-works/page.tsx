import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-14">
      <p className="eyebrow">How it works</p>
      <h1 className="h-section mt-2">From sign-up to first meeting in under 7 days.</h1>

      <h2 className="text-[20px] font-semibold tracking-tightish text-ink mt-12">Onboarding · 30 minutes, once.</h2>
      <ol className="mt-4 space-y-5 text-[15px] leading-relaxed text-ink-700 list-decimal pl-5">
        <li>
          <span className="font-medium text-ink">Phase 1 — Ingest.</span> Resume upload. LinkedIn URL.
          Connect Gmail (read first, send later). Optionally upload past resumes, blog posts, or 3–5
          emails you're proud of for voice training. The agent extracts everything in the background.
        </li>
        <li>
          <span className="font-medium text-ink">Phase 2 — Strategy Conversation.</span> A single
          10-minute Claude conversation that opens with a synthesis of your background and asks the
          right 8–12 questions. You can see your context model filling in on the right side as you talk.
        </li>
        <li>
          <span className="font-medium text-ink">Phase 3 — Constraints.</span> Quick-fire setup of comp
          floor, geography, channels, volume rules, no-fly list. Calibration: "show me 3 sample targets
          you'd want and 3 you wouldn't." The agent says: <em>I'll have your first 20 targets and 5 drafts
          ready within 6 hours.</em>
        </li>
      </ol>

      <h2 className="text-[20px] font-semibold tracking-tightish text-ink mt-14">The daily loop · 5–10 minutes.</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-700 max-w-[68ch]">
        You open the app once a day. Three cards. Approve, edit, or reject. The agents do the rest.
      </p>

      <h2 className="text-[20px] font-semibold tracking-tightish text-ink mt-14">Resume tailoring engine.</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-700 max-w-[68ch]">
        Most AI resume tools do keyword stuffing — caught by both ATS systems and humans. Pipeline reorders
        rather than rewrites: foregrounds bullets that map to the role's emphasis, mirrors the JD's
        vocabulary where you have authentic experience, rewrites the headline as a thesis-for-this-role
        paragraph in your voice, and outputs a clean, ATS-parseable PDF. Speed is a feature: when a role
        drops at 9am, you have a tailored resume and an outreach plan by 9:05am.
      </p>

      <div className="mt-12 flex gap-3">
        <Link href="/onboarding" className="btn-primary">Start now</Link>
        <Link href="/plays" className="btn-secondary">See the plays</Link>
      </div>
    </div>
  );
}

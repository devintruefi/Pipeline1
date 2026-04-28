const CLAUSES: Array<[string, string]> = [
  ["Pipeline acts as your delegated assistant, not as your employer or recruiter.", "We send what you approve, in your voice, from your accounts. Decision authority remains with you on every send."],
  ["You retain full ownership of all outreach.", "Drafts written by Pipeline are yours. We hold no claim to the content you approve and ship from your inbox."],
  ["Success fee is owed on offer accepted.", "Owed on offer acceptance from any company first-touched through Pipeline within the engagement window. Disputes resolve in your favor by default."],
  ["Pipeline never auto-sends on LinkedIn.", "All LinkedIn drafts go to a tap-to-send queue. The user clicks Send inside LinkedIn itself. Compliance is non-negotiable."],
  ["Pause, export, and delete with no friction.", "You can pause the system, export your data as JSON, and delete your account at any time from Settings."]
];

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
      <p className="eyebrow eyebrow-dot">Terms of service · Draft</p>
      <h1 className="mt-5 font-display text-[40px] md:text-[52px] tracking-tightest leading-[1.04] font-medium text-ink text-balance">
        Terms. design partner cohort.
      </h1>

      <p className="mt-5 text-[16px] leading-[1.65] text-ink-700 text-pretty max-w-prose">
        These terms apply to the design partner cohort. Final terms will be agreed prior to charging
        any success fee. By using Pipeline, you agree:
      </p>

      <ol className="mt-10 space-y-1">
        {CLAUSES.map(([title, body], i) => (
          <li key={title} className="grid grid-cols-[48px_1fr] gap-5 items-start py-5 border-b border-ink/8 last:border-b-0">
            <span className="font-display tabular text-[24px] tracking-tightest text-accent leading-none">
              §{i + 1}
            </span>
            <div>
              <p className="font-display text-[17px] tracking-tightish font-medium text-ink leading-snug text-balance">{title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-700 text-pretty">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-12 text-[12.5px] text-ink-500">
        Last updated April 2026 · This is a draft document for the founding cohort and will be replaced with formal terms before paid plans launch.
      </p>
    </article>
  );
}

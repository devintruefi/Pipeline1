const TENETS: Array<[string, string]> = [
  ["Encrypted at rest", "Resume, voice samples, and connected-account tokens are encrypted at rest using a managed KMS key."],
  ["Never sold, never shared", "Your data is never sold or shared with third parties. There is no data broker integration. There never will be."],
  ["Used only for your search", "Email content read by Pipeline is used only to classify and draft replies for you. It is not used to train shared models."],
  ["Export and delete, one click", "You can export everything as JSON and delete your account from Settings → Privacy. The deletion is hard, not soft."],
  ["Audit log per agent", "Every agent run logs to your account so you can audit what the system did and why. input tokens, output tokens, cost, and notes."]
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
      <p className="eyebrow eyebrow-dot">Privacy</p>
      <h1 className="mt-5 font-display text-[44px] md:text-[56px] tracking-tightest leading-[1.0] font-medium text-ink text-balance">
        Your inbox is sacred.
      </h1>
      <p className="mt-5 text-[16px] leading-[1.65] text-ink-700 text-pretty max-w-prose">
        Five tenets. The product is built around them. not the other way around.
      </p>

      <ol className="mt-10 space-y-1">
        {TENETS.map(([title, body], i) => (
          <li key={title} className="grid grid-cols-[48px_1fr] gap-5 items-start py-5 border-b border-ink/8 last:border-b-0">
            <span className="font-display tabular text-[28px] tracking-tightest text-accent leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-display text-[18px] tracking-tightish font-medium text-ink leading-snug">{title}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-700 text-pretty">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-12 text-[12.5px] text-ink-500">
        Last updated April 2026 · Questions? <a href="mailto:devin@truefi.ai" className="text-ink-700 hover:text-ink underline-offset-4 hover:underline">devin@truefi.ai</a>
      </p>
    </article>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-14 text-[14px] leading-relaxed text-ink-700">
      <p className="eyebrow">Privacy</p>
      <h1 className="h-section mt-2">Your inbox is sacred.</h1>
      <ul className="mt-3 list-disc pl-5 space-y-2">
        <li>Resume, voice samples, and connected-account tokens are stored encrypted at rest.</li>
        <li>We never sell or share your data with third parties.</li>
        <li>Email content read by Pipeline is used only to classify and draft replies for you.</li>
        <li>You can export and delete everything in one click.</li>
        <li>We log every agent run in your account so you can audit what the system did and why.</li>
      </ul>
    </div>
  );
}

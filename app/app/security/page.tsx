export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-14 text-[15px] leading-relaxed text-ink-700">
      <p className="eyebrow">Security &amp; compliance</p>
      <h1 className="h-section mt-2">Built like an executive's inbox is sacred — because it is.</h1>
      <ul className="mt-8 space-y-4">
        <li>
          <span className="font-semibold text-ink">Never auto-send on LinkedIn.</span> All LinkedIn
          drafts go to a tap-to-send queue. The user clicks "Send" inside LinkedIn itself. Zero risk
          of account ban from the platform.
        </li>
        <li>
          <span className="font-semibold text-ink">Gmail integration is read-first.</span> Send scope
          requires a separate, explicit opt-in. Tokens are stored encrypted. Revocable in one click.
        </li>
        <li>
          <span className="font-semibold text-ink">No LinkedIn scraping.</span> Pipeline does not
          maintain a profile database. Public-data sources only — Crunchbase, news, public posts.
        </li>
        <li>
          <span className="font-semibold text-ink">No-fly lists.</span> Confidentiality boundaries
          (current employer's customers, friends, ex-colleagues) are enforced at the Drafter level.
          The agent literally cannot draft to a no-fly target.
        </li>
        <li>
          <span className="font-semibold text-ink">Approval queue, not autopilot.</span> Every send
          waits for an explicit human approval unless the user has opted into a low-risk auto mode
          for follow-ups. Default is review-every.
        </li>
      </ul>
    </div>
  );
}

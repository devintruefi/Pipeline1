"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLE_RESUME = `Marcus Chen
VP of Sales · Series B/C SaaS commercial leadership

Summary
Three-time commercial leader. Built and scaled GTM teams at Helix, Brick, and Vellum. Took ARR from $14M → $42M at Helix in 22 months by re-architecting the AE/SE pairing.

VP of Sales — Helix (2021 — present)
- Took ARR from $14M to $42M in 22 months
- Closed two of the three largest deals in company history (>$1.4M ACV each)
- Built a 28-person commercial team and retained 100% through a 19% RIF
- Shipped a partner-sourced channel that grew from 3% to 31% of new logo bookings

Director of Sales — Brick (2018 — 2021)
- Grew NA bookings from $4M to $19M
- Hired and developed 12 AEs; 4 are now VPs

Account Executive — Vellum (2014 — 2018)
- President's Club, three consecutive years
- Closed the largest single deal in company history at the time

Skills: Enterprise sales · Commercial leadership · Go-to-market design · Channel · Pricing
Education: Stanford GSB — MBA, 2014`;

const SAMPLE_VOICE = `Quick note —

Saw your team's funding announcement this morning. The framing in the press release matched almost exactly what you wrote about "earned distribution" on Substack last quarter. Curious what the AE/SE pairing looks like in your motion now that the partner channel is doing real volume.

Worth a 20-minute conversation?

— Marcus`;

export function IngestForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        const fd = new FormData(e.currentTarget);
        const r = await fetch("/api/onboarding/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd))
        });
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          setErr(j.error ?? "Failed to ingest.");
          setBusy(false);
          return;
        }
        router.push("/onboarding/strategy");
      }}
    >
      <div>
        <label className="text-[12.5px] uppercase tracking-wider text-ink-500">Name</label>
        <input name="name" required defaultValue="Marcus Chen" className="mt-1 w-full" />
      </div>
      <div>
        <label className="text-[12.5px] uppercase tracking-wider text-ink-500">Email</label>
        <input name="email" type="email" required defaultValue="marcus@example.com" className="mt-1 w-full" />
      </div>
      <div>
        <label className="text-[12.5px] uppercase tracking-wider text-ink-500">LinkedIn URL</label>
        <input name="linkedinUrl" type="url" defaultValue="https://www.linkedin.com/in/marcus-chen-example" className="mt-1 w-full" />
      </div>
      <div>
        <label className="text-[12.5px] uppercase tracking-wider text-ink-500">Paste your resume (text)</label>
        <textarea name="resumeText" rows={12} required defaultValue={SAMPLE_RESUME} className="mt-1 w-full font-mono text-[12.5px]" />
        <p className="mt-1 text-[11.5px] text-ink-300">In production, drop a PDF — vision-capable parser handles the rest.</p>
      </div>
      <div>
        <label className="text-[12.5px] uppercase tracking-wider text-ink-500">Voice samples (3–5 emails or posts you're proud of)</label>
        <textarea name="voiceSamples" rows={8} defaultValue={SAMPLE_VOICE} className="mt-1 w-full font-mono text-[12.5px]" />
      </div>
      <div className="card-quiet p-4 text-[13px] text-ink-700 leading-relaxed">
        <p className="font-medium text-ink">Connect Gmail (read-only).</p>
        <p>For the live demo, the system uses a mock Gmail adapter. Drop in real Google OAuth credentials in <code>.env</code> to flip to live.</p>
      </div>
      {err && <p className="text-[13px] text-signal-red">{err}</p>}
      <button disabled={busy} className="btn-primary w-full">{busy ? "Ingesting…" : "Continue to strategy conversation →"}</button>
    </form>
  );
}

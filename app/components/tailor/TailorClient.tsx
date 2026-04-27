"use client";
import { useState } from "react";

const SAMPLE_JD = `VP of Sales — Series C SaaS, GTM rebuild

We're hiring a VP of Sales to rebuild our AE/SE motion as we move from founder-led sales into a repeatable enterprise commercial system. Recent Series C; 30 quota carriers across NA and EMEA. The successful candidate will:

- Re-architect the AE/SE pairing and quota model
- Stand up an enterprise account-based motion (ABM)
- Build a partner channel from scratch
- Coach VP of Customer Success and Solutions Engineering peers
- Own forecasting and the commercial business case to the board

You bring 10+ years of experience scaling a Series B/C SaaS commercial org, demonstrated experience taking ARR from $20M to $50M+, and a clear point of view on capital efficiency and partner-led growth.`;

interface Result {
  headline: string;
  rolesOrdered: { company: string; title: string; bullets: string[]; start: string; end: string }[];
  bulletScores: { company: string; bullet: string; score: number; matchedTerms: string[] }[];
  keywordCoverage: { covered: string[]; missing: string[] };
  markdown: string;
}

export function TailorClient({ hasUser }: { hasUser: boolean }) {
  const [jd, setJd] = useState(SAMPLE_JD);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [t0, setT0] = useState<number>(0);

  const submit = async () => {
    if (!hasUser) {
      alert("Walk through onboarding first so we have your resume.");
      return;
    }
    setBusy(true);
    setT0(Date.now());
    const r = await fetch("/api/tailor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText: jd })
    });
    const data = await r.json();
    setResult(data);
    setBusy(false);
  };

  return (
    <div className="mt-6 grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-3">
        <p className="eyebrow">Job description</p>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={20}
          className="w-full font-mono text-[12.5px]"
        />
        <button onClick={submit} disabled={busy} className="btn-primary w-full">
          {busy ? "Tailoring…" : "Tailor resume"}
        </button>
        {result && (
          <p className="text-[12px] text-ink-500">Done in {Date.now() - t0}ms · keyword coverage {result.keywordCoverage.covered.length}/{result.keywordCoverage.covered.length + result.keywordCoverage.missing.length}</p>
        )}
      </div>
      <div className="lg:col-span-7">
        {result ? (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-ink/10 bg-paper-50 flex items-center gap-3">
              <p className="font-medium text-ink text-[13px]">Tailored output</p>
              <button
                onClick={() => navigator.clipboard.writeText(result.markdown)}
                className="ml-auto btn-ghost text-[12px]"
              >
                Copy markdown
              </button>
              <a
                href={`data:text/markdown;charset=utf-8,${encodeURIComponent(result.markdown)}`}
                download="resume-tailored.md"
                className="btn-secondary text-[12px]"
              >
                Download .md
              </a>
            </div>
            <div className="p-5 space-y-6 text-[13.5px] leading-relaxed text-ink-700">
              <div>
                <p className="eyebrow">Tailored headline</p>
                <p className="mt-1 text-ink font-medium">{result.headline}</p>
              </div>
              <div>
                <p className="eyebrow">Bullets · ordered by JD match</p>
                <ul className="mt-2 space-y-2">
                  {result.bulletScores.slice(0, 8).map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="tabular-nums text-ink-300 w-12">{Math.round(b.score * 100)}%</span>
                      <span><span className="text-ink-500">{b.company}.</span> {b.bullet}{b.matchedTerms.length > 0 && <span className="ml-2 text-ink-300 text-[11px]">[{b.matchedTerms.slice(0, 4).join(", ")}]</span>}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">Keyword coverage</p>
                <p className="mt-1"><span className="text-signal-green">{result.keywordCoverage.covered.length}</span> covered · <span className="text-signal-amber">{result.keywordCoverage.missing.length}</span> missing</p>
                <p className="mt-2 text-[12px] text-ink-500">Missing: {result.keywordCoverage.missing.slice(0, 10).join(", ")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center text-ink-500 text-[14px]">Tailored resume preview will appear here.</div>
        )}
      </div>
    </div>
  );
}

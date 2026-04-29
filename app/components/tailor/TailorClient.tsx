"use client";
import { useState } from "react";
import { Loader2, FileText, ScrollText } from "lucide-react";
import { toast } from "@/lib/toast";

const SAMPLE_JD = `VP of Sales. Series C SaaS, GTM rebuild

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

/**
 * The tailor client. Two-pane on desktop (JD on the left, tailored resume
 * on the right), tab toggle on mobile so each pane gets the full width
 * when the user is actually reading or comparing.
 *
 * Surfaces failure clearly: a 5xx response no longer crashes the JSON
 * parse, the error toast carries a Retry, and the loading state shows a
 * skeleton instead of an empty pane.
 */
export function TailorClient({ hasUser }: { hasUser: boolean }) {
  const [jd, setJd] = useState(SAMPLE_JD);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [t0, setT0] = useState<number>(0);
  // On mobile, choose which pane is in view. On desktop, both render.
  const [pane, setPane] = useState<"jd" | "result">("jd");

  const submit = async () => {
    if (!hasUser) {
      toast({
        type: "error",
        message: "No resume on file",
        detail: "Walk through onboarding first so we have your receipts."
      });
      return;
    }
    setBusy(true);
    setT0(Date.now());
    const id = "tailor";
    toast({ id, type: "pending", message: "Tailoring…", detail: "Scoring bullets against the JD." });
    try {
      const r = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText: jd })
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        throw new Error(detail || `Server returned ${r.status}`);
      }
      const data = (await r.json()) as Result;
      setResult(data);
      setPane("result");
      toast({
        id,
        type: "success",
        message: "Resume tailored",
        detail: `${data.keywordCoverage.covered.length} keywords matched · ${data.keywordCoverage.missing.length} missing.`
      });
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Could not tailor",
        detail: err instanceof Error ? err.message : "Try again in a moment.",
        action: { label: "Retry", onClick: () => submit() }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6">
      {/* Mobile tab toggle. Hidden at lg+ where both panes render side-by-side. */}
      <div className="lg:hidden mb-3 flex items-center gap-1 rounded-full border border-ink/10 bg-paper-50 p-1 w-fit">
        <button
          onClick={() => setPane("jd")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] transition-colors ${
            pane === "jd" ? "bg-ink text-paper" : "text-ink-700"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Job description
        </button>
        <button
          onClick={() => setPane("result")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] transition-colors ${
            pane === "result" ? "bg-ink text-paper" : "text-ink-700"
          }`}
        >
          <ScrollText className="h-3.5 w-3.5" />
          Tailored resume
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-5 space-y-3 ${pane === "jd" ? "" : "hidden lg:block"}`}>
          <p className="eyebrow">Job description</p>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={20}
            className="w-full font-mono text-[12.5px]"
          />
          <button onClick={submit} disabled={busy} className="btn-primary w-full">
            {busy ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Tailoring…
              </>
            ) : (
              "Tailor resume"
            )}
          </button>
          {result && (
            <p className="text-[12px] text-ink-500">
              Done in {Date.now() - t0}ms · keyword coverage{" "}
              {result.keywordCoverage.covered.length}/
              {result.keywordCoverage.covered.length + result.keywordCoverage.missing.length}
            </p>
          )}
        </div>

        <div className={`lg:col-span-7 ${pane === "result" ? "" : "hidden lg:block"}`}>
          {busy && !result && <TailorSkeleton />}
          {result && !busy && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-ink/10 bg-paper-50 flex items-center gap-3">
                <p className="font-medium text-ink text-[13px]">Tailored output</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.markdown);
                    toast({ type: "success", message: "Copied to clipboard" });
                  }}
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
                        <span>
                          <span className="text-ink-500">{b.company}.</span> {b.bullet}
                          {b.matchedTerms.length > 0 && (
                            <span className="ml-2 text-ink-300 text-[11px]">
                              [{b.matchedTerms.slice(0, 4).join(", ")}]
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">Keyword coverage</p>
                  <p className="mt-1">
                    <span className="text-signal-green">{result.keywordCoverage.covered.length}</span> covered ·{" "}
                    <span className="text-signal-amber">{result.keywordCoverage.missing.length}</span> missing
                  </p>
                  <p className="mt-2 text-[12px] text-ink-500">
                    Missing: {result.keywordCoverage.missing.slice(0, 10).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}
          {!result && !busy && (
            <div className="card p-8 text-center text-ink-500 text-[14px]">
              <p className="font-display italic text-[20px] text-ink-700">Side-by-side comparison.</p>
              <p className="mt-3 max-w-prose mx-auto">
                Paste a JD on the left, and the tailored output will land here. We re-order your bullets,
                rewrite the headline for the role, and flag missing keywords without inventing experience
                you don't have.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TailorSkeleton() {
  return (
    <div className="card overflow-hidden animate-fade-in">
      <div className="px-5 py-3 border-b border-ink/10 bg-paper-50 flex items-center gap-3">
        <div className="skeleton h-3.5 w-32" />
        <div className="ml-auto skeleton h-6 w-24" />
        <div className="skeleton h-6 w-24" />
      </div>
      <div className="p-5 space-y-5">
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-24" />
          <div className="skeleton h-4 w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-32" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="skeleton h-3 w-10" />
              <div className="skeleton h-3 flex-1" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-24" />
          <div className="skeleton h-3 w-1/2" />
          <div className="skeleton h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

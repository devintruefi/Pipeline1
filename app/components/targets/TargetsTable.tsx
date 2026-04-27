"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { targets } from "@/lib/db/schema";
import { Search as SearchIcon, X, Rows3, AlignJustify } from "lucide-react";

type Target = typeof targets.$inferSelect;

const STATUS_TONE: Record<string, string> = {
  watch: "pill-outline",
  warm: "pill-amber",
  hot: "pill-accent",
  engaged: "pill-cool",
  meeting_booked: "pill-green",
  won: "pill-ink",
  rejected: "pill-outline",
  snoozed: "pill-outline"
};

type Density = "comfy" | "compact";

/**
 * Targets table with live client-side search and a density toggle.
 *
 * The page hands us all rows already filtered by status; we further
 * narrow by free-text query against name / title / company. The query
 * is preserved in the URL via the search input but search is local —
 * no server round-trip per keystroke.
 */
export function TargetsTable({ targets: rows }: { targets: Target[] }) {
  const [q, setQ] = useState("");
  const [density, setDensity] = useState<Density>("comfy");

  // Persist density in localStorage so a reload doesn't reset it.
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("pipeline.density") : null;
    if (stored === "compact" || stored === "comfy") setDensity(stored);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("pipeline.density", density);
  }, [density]);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((t) => {
      return (
        t.fullName.toLowerCase().includes(needle) ||
        (t.title ?? "").toLowerCase().includes(needle) ||
        (t.company ?? "").toLowerCase().includes(needle)
      );
    });
  }, [rows, q]);

  const padY = density === "compact" ? "!py-2" : "!py-3";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-500 pointer-events-none" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, title, or company…"
            className="w-full !pl-9 !pr-9"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-md text-ink-500 hover:text-ink hover:bg-paper-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <span className="text-[12px] text-ink-500 tabular shrink-0">
          {filtered.length} of {rows.length}
        </span>
        <div
          role="radiogroup"
          aria-label="Row density"
          className="inline-flex items-center rounded-md border border-ink/10 bg-paper-50 p-0.5"
        >
          <button
            type="button"
            role="radio"
            aria-checked={density === "comfy"}
            onClick={() => setDensity("comfy")}
            className={`px-2 py-1.5 rounded text-[12px] flex items-center gap-1.5 transition-colors duration-fast ${
              density === "comfy" ? "bg-white shadow-card text-ink" : "text-ink-500 hover:text-ink"
            }`}
            title="Comfortable rows"
          >
            <AlignJustify className="h-3.5 w-3.5" /> Comfy
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={density === "compact"}
            onClick={() => setDensity("compact")}
            className={`px-2 py-1.5 rounded text-[12px] flex items-center gap-1.5 transition-colors duration-fast ${
              density === "compact" ? "bg-white shadow-card text-ink" : "text-ink-500 hover:text-ink"
            }`}
            title="Compact rows"
          >
            <Rows3 className="h-3.5 w-3.5" /> Compact
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[820px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title · company</th>
                <th>Status</th>
                <th>Email</th>
                <th className="text-right">Verifier</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center !py-12 text-ink-500 text-[13px]">
                    {q ? `No matches for "${q}".` : "Nothing in this filter."}
                  </td>
                </tr>
              )}
              {filtered.map((t) => {
                const conf = Math.round(t.emailConfidence * 100);
                return (
                  <tr key={t.id}>
                    <td className={padY}>
                      <Link
                        href={`/targets/${t.id}`}
                        className="font-medium text-ink hover:underline underline-offset-4"
                      >
                        {highlight(t.fullName, q)}
                      </Link>
                    </td>
                    <td className={padY}>
                      <p className="text-ink truncate max-w-[260px]">{highlight(t.title ?? "", q)}</p>
                      {density === "comfy" && (
                        <p className="text-ink-500 text-[12px]">{highlight(t.company ?? "", q)}</p>
                      )}
                      {density === "compact" && t.company && (
                        <span className="text-ink-500 text-[12px]"> · {highlight(t.company, q)}</span>
                      )}
                    </td>
                    <td className={padY}>
                      <span className={`pill ${STATUS_TONE[t.status] ?? "pill-outline"}`}>
                        {t.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className={`${padY} font-mono text-[12px] text-ink-700`}>{t.email ?? "—"}</td>
                    <td className={`${padY} text-right`}>
                      <div className="inline-flex items-center gap-2">
                        <div className="h-1 w-14 rounded-full bg-paper-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-slow ease-out ${
                              conf >= 85 ? "bg-signal-green" : conf >= 60 ? "bg-signal-amber" : "bg-signal-red"
                            }`}
                            style={{ width: `${conf}%` }}
                          />
                        </div>
                        <span className="tabular text-[12px] text-ink-700">{conf}%</span>
                      </div>
                    </td>
                    <td className={`${padY} text-[12px] text-ink-500 tabular`}>
                      {new Date(t.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function highlight(text: string, q: string): React.ReactNode {
  if (!q.trim() || !text) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-ink rounded-[2px] px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

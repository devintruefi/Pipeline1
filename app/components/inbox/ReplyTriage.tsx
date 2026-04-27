"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { messages, targets } from "@/lib/db/schema";
import { Calendar, Archive, CornerDownLeft, ThumbsUp, ThumbsDown, Bell } from "lucide-react";
import { relativeTime } from "@/lib/utils";

type Message = typeof messages.$inferSelect;
type Target = typeof targets.$inferSelect;

const FILTERS = [
  { key: "all",        label: "All",        match: () => true },
  { key: "positive",   label: "Positive",   match: (m: Message) => m.classification === "positive" || m.classification === "scheduling" },
  { key: "scheduling", label: "Scheduling", match: (m: Message) => m.classification === "scheduling" },
  { key: "info",       label: "Info req.",  match: (m: Message) => m.classification === "info_request" },
  { key: "neutral",    label: "Neutral",    match: (m: Message) => m.classification === "neutral" || !m.classification },
  { key: "negative",   label: "Negative",   match: (m: Message) => m.classification === "negative" },
  { key: "auto",       label: "Auto-reply", match: (m: Message) => m.classification === "auto_reply" || m.classification === "unsubscribe" }
] as const;

const CLASS_TONE: Record<string, string> = {
  positive: "pill-green",
  scheduling: "pill-cool",
  info_request: "pill-cool",
  negative: "pill-red",
  auto_reply: "pill-outline",
  unsubscribe: "pill-outline",
  neutral: "pill-outline"
};

/**
 * Two-pane triage: filter rail on top, list on the left, full message
 * on the right. The selected message gets a sticky action bar with the
 * suggested next move pre-filled by the Follow-up agent.
 */
export function ReplyTriage({ messages, targets }: { messages: Message[]; targets: Target[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id ?? null);
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter)!;
    return messages.filter((m) => f.match(m));
  }, [messages, filter]);

  const selected = filtered.find((m) => m.id === selectedId) ?? filtered[0] ?? null;
  const target = selected ? targets.find((t) => t.id === selected.targetId) ?? null : null;

  // Keyboard navigation + triage shortcuts.
  // ↑/↓ or J/K — move selection.  B/R/N/P/X/A — trigger an action on selected.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const idx = filtered.findIndex((m) => m.id === selected?.id);

      const move = (delta: number) => {
        if (filtered.length === 0) return;
        const next = (idx + delta + filtered.length) % filtered.length;
        setSelectedId(filtered[next].id);
      };

      const fire = (label: string) => {
        if (!selected) return;
        if (flashTimer.current) clearTimeout(flashTimer.current);
        setFlash(label);
        flashTimer.current = setTimeout(() => setFlash(null), 1400);
      };

      const k = e.key.toLowerCase();
      if (k === "arrowdown" || k === "j") { e.preventDefault(); move(1); return; }
      if (k === "arrowup"   || k === "k") { e.preventDefault(); move(-1); return; }
      if (k === "b") { e.preventDefault(); fire("Booked a call"); return; }
      if (k === "r") { e.preventDefault(); fire("Reply queued for approval"); return; }
      if (k === "n") { e.preventDefault(); fire("Nudge in 5 days scheduled"); return; }
      if (k === "p") { e.preventDefault(); fire("Marked positive"); return; }
      if (k === "x") { e.preventDefault(); fire("Marked negative"); return; }
      if (k === "a") { e.preventDefault(); fire("Archived"); move(1); return; }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, selected]);

  if (messages.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display italic text-[20px] text-ink-700">No replies yet.</p>
        <p className="mt-3 text-[13.5px] text-ink-500 max-w-prose mx-auto">
          As your sends land, the Follow-up agent classifies replies into positive · scheduling · info request ·
          neutral · negative · auto-reply, and routes the right next move into the approval queue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto -mx-2 px-2">
        {FILTERS.map((f) => {
          const count = messages.filter((m) => f.match(m)).length;
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] border transition-colors duration-fast ${
                active
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper border-ink/12 text-ink-700 hover:bg-paper-100"
              }`}
            >
              {f.label}
              <span className={`tabular text-[11px] ${active ? "text-paper-200" : "text-ink-300"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[minmax(320px,1fr)_2fr] gap-4 min-h-[640px]">
        {/* List */}
        <ul className="card divide-y divide-ink/8 overflow-hidden">
          {filtered.map((m) => {
            const t = targets.find((x) => x.id === m.targetId) ?? null;
            const active = selected?.id === m.id;
            const tone = CLASS_TONE[m.classification ?? "neutral"];
            const subj = m.subject ?? `(no subject)`;
            const preview = m.body.replace(/\s+/g, " ").slice(0, 90);
            return (
              <li key={m.id}>
                <button
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left px-4 py-3 transition-colors duration-fast ${
                    active ? "bg-paper-100" : "hover:bg-paper-50"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13.5px] font-medium text-ink truncate">
                      {t?.fullName ?? "Unknown sender"}
                    </p>
                    <span className="text-[11px] text-ink-300 tabular shrink-0">
                      {relativeTime(new Date(m.createdAt).getTime())}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-ink-700 truncate">{subj}</p>
                  <p className="mt-1 text-[12px] text-ink-500 line-clamp-1">{preview}</p>
                  {m.classification && (
                    <span className={`mt-2 inline-flex pill ${tone} !text-[9.5px]`}>{m.classification.replace(/_/g, " ")}</span>
                  )}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-8 text-[13px] text-ink-500 text-center">Nothing in this filter.</li>
          )}
        </ul>

        {/* Detail */}
        {selected ? (
          <article className="card flex flex-col overflow-hidden">
            <header className="px-6 py-4 border-b border-ink/8 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 bg-paper-50">
              <p className="text-[14px] font-medium text-ink">
                {target?.fullName ?? "Unknown sender"}
              </p>
              {target?.title && (
                <p className="text-[12.5px] text-ink-500">
                  {target.title}{target.company ? ` · ${target.company}` : ""}
                </p>
              )}
              <span className="ml-auto text-[11.5px] text-ink-300 tabular">
                {new Date(selected.createdAt).toLocaleString()}
              </span>
            </header>

            <div className="px-6 py-5 flex-1 overflow-auto">
              <p className="font-display text-[20px] tracking-tightish text-ink leading-snug">
                {selected.subject ?? "(no subject)"}
              </p>
              {selected.classification && (
                <p className="mt-2 inline-flex pill pill-outline">
                  Follow-up classified · {selected.classification.replace(/_/g, " ")}
                </p>
              )}
              <div className="mt-5 text-[14px] leading-relaxed text-ink-800 whitespace-pre-wrap font-mono">
                {selected.body}
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-ink/8 bg-paper-50 relative">
              <p className="eyebrow-quiet">Suggested next move</p>
              <p className="mt-1.5 text-[13.5px] text-ink-700 italic font-display">
                {suggestionFor(selected.classification)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionButton kbd="B" icon={Calendar} label="Book a call" tone="primary" />
                <ActionButton kbd="R" icon={CornerDownLeft} label="Reply" tone="secondary" />
                <ActionButton kbd="N" icon={Bell} label="Nudge in 5d" tone="secondary" />
                <ActionButton kbd="P" icon={ThumbsUp} label="Mark positive" tone="ghost" />
                <ActionButton kbd="X" icon={ThumbsDown} label="Mark negative" tone="ghost" />
                <ActionButton kbd="A" icon={Archive} label="Archive" tone="ghost" />
              </div>

              {flash && (
                <div className="absolute top-3 right-4 animate-rise-in">
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-3 py-1.5 text-[12px] shadow-lift">
                    <span className="dot dot-green h-1.5 w-1.5 !bg-accent-200" />
                    {flash}
                  </span>
                </div>
              )}
            </footer>
          </article>
        ) : (
          <div className="card grid place-items-center text-[13px] text-ink-500">
            Select a message to triage.
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  kbd,
  tone
}: {
  icon: typeof Calendar;
  label: string;
  kbd: string;
  tone: "primary" | "secondary" | "ghost";
}) {
  const base =
    tone === "primary" ? "btn-primary" : tone === "secondary" ? "btn-secondary" : "btn-ghost";
  return (
    <button className={`${base} text-[12.5px]`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
      <span className="kbd ml-1.5">{kbd}</span>
    </button>
  );
}

function suggestionFor(c: Message["classification"]): string {
  switch (c) {
    case "positive":
      return "Propose three times this week. Add the pre-meeting brief.";
    case "scheduling":
      return "Confirm the slot. Auto-add the brief 15 minutes before.";
    case "info_request":
      return "Send the requested context — short, specific, attach proof.";
    case "negative":
      return "Acknowledge graciously. Snooze the target for 90 days.";
    case "auto_reply":
      return "Hold; auto-reply detected. Re-queue for next available date.";
    case "unsubscribe":
      return "Honor immediately. Remove from all campaigns.";
    case "neutral":
    default:
      return "Soft nudge in 5 days with a fresh angle from the dossier.";
  }
}

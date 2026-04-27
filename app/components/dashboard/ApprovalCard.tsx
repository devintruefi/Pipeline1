"use client";
import { useState } from "react";
import type { drafts, targets } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { Mail, Linkedin, Users, AlertTriangle, Sparkles, Check, X } from "lucide-react";

type Draft = typeof drafts.$inferSelect;
type Target = typeof targets.$inferSelect;

/**
 * The approval card.
 *
 * Three regions, no nested cards:
 *   1) Header strip — target identity + channel + risk light
 *   2) Body — subject + draft body (mono, generous leading)
 *   3) Footer — single decisive primary, danger secondary, metadata trailing
 */
export function ApprovalCard({ draft, target }: { draft: Draft; target: Target | null }) {
  const router = useRouter();
  const [body, setBody] = useState(draft.body);
  const [subject, setSubject] = useState(draft.subject ?? "");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);

  const action = async (kind: "approve" | "reject") => {
    setBusy(kind);
    await fetch(`/api/drafts/${draft.id}/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, subject })
    });
    router.refresh();
  };

  const ChannelIcon =
    draft.channel === "email" ? Mail : draft.channel === "linkedin" ? Linkedin : Users;

  const riskTone =
    draft.riskLight === "green" ? "green" : draft.riskLight === "yellow" ? "amber" : "red";
  const voicePct = Math.round(draft.voiceScore * 100);
  const voiceTone = voicePct >= 88 ? "text-signal-green" : voicePct >= 78 ? "text-signal-amber" : "text-signal-red";

  return (
    <article className="card overflow-hidden card-interactive animate-rise-in">
      <header className="px-5 py-3 border-b border-ink/8 flex flex-wrap items-center gap-x-3 gap-y-2 bg-paper-50">
        <span className={`dot dot-${riskTone}`} title={draft.riskNotes ?? "Verifier check"} />
        <p className="text-[13.5px] font-medium text-ink truncate">
          {target?.fullName ?? "Unknown target"}
        </p>
        {target?.title && (
          <span className="text-[12.5px] text-ink-500 truncate">
            · {target.title}{target.company ? ` at ${target.company}` : ""}
          </span>
        )}
        <span className="ml-auto pill pill-outline">
          <ChannelIcon className="h-3 w-3" />
          {draft.channel}
        </span>
        <span className="pill pill-outline">v{draft.variant}</span>
        <span className={`pill pill-outline ${voiceTone}`}>
          <Sparkles className="h-3 w-3" /> {voicePct}%
        </span>
      </header>

      <div className="px-5 py-5 space-y-4">
        <div>
          <label className="eyebrow-quiet">Subject</label>
          <input
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setEditing(true); }}
            className="mt-1.5 w-full"
          />
        </div>
        <div>
          <label className="eyebrow-quiet">Body</label>
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value); setEditing(true); }}
            rows={10}
            className="mt-1.5 w-full font-mono text-[13px] leading-relaxed"
            spellCheck
          />
        </div>

        {(draft.groundingNote || (draft.riskNotes && draft.riskLight !== "green")) && (
          <div className="grid sm:grid-cols-2 gap-3">
            {draft.groundingNote && (
              <p className="text-[12px] text-ink-500 leading-relaxed">
                <span className="text-ink-700 font-medium">Grounded in — </span>
                {draft.groundingNote}
              </p>
            )}
            {draft.riskNotes && draft.riskLight !== "green" && (
              <p className="text-[12px] text-signal-amber leading-relaxed inline-flex gap-1.5 items-start">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{draft.riskNotes}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="px-5 py-3 border-t border-ink/8 flex flex-wrap items-center gap-2 bg-paper-50">
        <button
          onClick={() => action("approve")}
          disabled={!!busy}
          className="btn-accent text-[13px]"
        >
          <Check className="h-3.5 w-3.5" />
          {editing
            ? busy === "approve"
              ? "Sending…"
              : "Approve & send (edited)"
            : busy === "approve"
            ? "Sending…"
            : "Approve & send"}
        </button>
        <button
          onClick={() => action("reject")}
          disabled={!!busy}
          className="btn-danger text-[13px]"
        >
          <X className="h-3.5 w-3.5" />
          {busy === "reject" ? "Rejecting…" : "Reject"}
        </button>
        <span className="ml-auto text-[11px] text-ink-300 font-mono">id · {draft.id.slice(0, 14)}</span>
      </footer>
    </article>
  );
}

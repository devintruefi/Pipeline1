"use client";
import { useState } from "react";
import type { drafts, targets } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { Mail, Linkedin, Users, AlertTriangle, Sparkles, Check, X } from "lucide-react";
import { toast, dismissToast } from "@/lib/toast";

type Draft = typeof drafts.$inferSelect;
type Target = typeof targets.$inferSelect;

/**
 * The approval card.
 *
 * Three regions, no nested cards:
 *   1) Header strip. target identity + channel + risk light + voice score
 *   2) Body. subject + draft body (mono, generous leading)
 *   3) Footer. single decisive primary, danger secondary, metadata trailing
 *
 * Mutating actions surface confirmation + retry through the global toast.
 */
export function ApprovalCard({
  draft,
  target,
  index
}: {
  draft: Draft;
  target: Target | null;
  index?: number;
}) {
  const router = useRouter();
  const [body, setBody] = useState(draft.body);
  const [subject, setSubject] = useState(draft.subject ?? "");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);

  const action = async (kind: "approve" | "reject") => {
    setBusy(kind);
    const toastId = `draft-${draft.id}-${kind}`;
    toast({
      id: toastId,
      type: "pending",
      message: kind === "approve" ? "Sending…" : "Rejecting…",
      detail: target?.fullName
        ? `${target.fullName}${target.company ? ` at ${target.company}` : ""}`
        : undefined
    });
    try {
      const r = await fetch(`/api/drafts/${draft.id}/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, subject })
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        throw new Error(detail || `Server returned ${r.status}`);
      }
      toast({
        id: toastId,
        type: "success",
        message: kind === "approve" ? "Sent" : "Rejected",
        detail:
          kind === "approve" && target?.email
            ? `Out to ${target.email}. You'll see it in Sent.`
            : kind === "approve"
            ? "Out from your inbox. You'll see it in Sent."
            : "Removed from queue. The Drafter will not retry this variant."
      });
      router.refresh();
    } catch (err) {
      toast({
        id: toastId,
        type: "error",
        message: kind === "approve" ? "Send failed" : "Reject failed",
        detail: err instanceof Error ? err.message : "Try again in a moment.",
        action: { label: "Retry", onClick: () => action(kind) }
      });
    } finally {
      setBusy(null);
    }
  };

  const ChannelIcon =
    draft.channel === "email" ? Mail : draft.channel === "linkedin" ? Linkedin : Users;

  const riskTone =
    draft.riskLight === "green" ? "green" : draft.riskLight === "yellow" ? "amber" : "red";
  const riskLabel =
    draft.riskLight === "green"
      ? "Verifier passed"
      : draft.riskLight === "yellow"
      ? "Review carefully"
      : "Do not send without rewrite";
  const voicePct = Math.round(draft.voiceScore * 100);
  const voiceTone = voicePct >= 88 ? "text-signal-green" : voicePct >= 78 ? "text-signal-amber" : "text-signal-red";

  return (
    <article
      id={draft.id}
      data-draft-id={draft.id}
      data-draft-risk={draft.riskLight}
      data-draft-index={index ?? 0}
      className="card overflow-hidden card-interactive animate-rise-in scroll-mt-24"
    >
      <header className="px-5 py-3 border-b border-ink/8 flex flex-wrap items-center gap-x-3 gap-y-2 bg-paper-50">
        <span className={`dot dot-${riskTone}`} title={riskLabel} aria-label={riskLabel} />
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
        <span
          className={`pill pill-outline ${voiceTone}`}
          title={`Voice score · ${voicePct}%. Measures how closely this draft matches your past writing (sentence length, contractions, opener/closer pattern). 88+ is a confident match.`}
        >
          <Sparkles className="h-3 w-3" /> Sounds like you · {voicePct}%
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
                <span className="text-ink-700 font-medium">Why this draft. </span>
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
          data-approve
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
          data-reject
          onClick={() => action("reject")}
          disabled={!!busy}
          className="btn-danger text-[13px]"
        >
          <X className="h-3.5 w-3.5" />
          {busy === "reject" ? "Rejecting…" : "Reject"}
        </button>
        <span className="hidden md:inline-flex items-center gap-1.5 ml-2 text-[11px] text-ink-400">
          <kbd className="kbd">A</kbd> approve · <kbd className="kbd">R</kbd> reject · <kbd className="kbd">J</kbd>/<kbd className="kbd">K</kbd> next/prev
        </span>
        <span className="ml-auto text-[11px] text-ink-300 font-mono">id · {draft.id.slice(0, 14)}</span>
      </footer>
    </article>
  );
}

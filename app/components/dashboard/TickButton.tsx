"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

/**
 * Run tick: kicks the orchestrator. The button rotates the icon during
 * the round-trip and adopts the accent fill once the call returns, then
 * relaxes back. Keyboard shortcut "T" is registered globally.
 *
 * Surfaces a pending toast immediately, then a success toast that names
 * what changed (new signals, new dossiers, new drafts), or an error toast
 * with a Retry action.
 */
export function TickButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    const id = "tick";
    toast({
      id,
      type: "pending",
      message: "Running tick…",
      detail: "Scout sweeping signals. Researcher building dossiers. Drafter writing in your voice."
    });
    try {
      const r = await fetch("/api/agents/tick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        throw new Error(detail || `Server returned ${r.status}`);
      }
      const summary = (await r.json().catch(() => null)) as
        | { signals?: number; targets?: number; drafts?: number; dossiers?: number }
        | null;
      const parts: string[] = [];
      if (summary?.signals) parts.push(`${summary.signals} new signal${summary.signals === 1 ? "" : "s"}`);
      if (summary?.dossiers) parts.push(`${summary.dossiers} dossier${summary.dossiers === 1 ? "" : "s"}`);
      if (summary?.drafts) parts.push(`${summary.drafts} draft${summary.drafts === 1 ? "" : "s"}`);
      toast({
        id,
        type: "success",
        message: "Tick complete",
        detail:
          parts.length > 0
            ? parts.join(" · ") + ". Refreshing dashboard."
            : "Dashboard refreshed."
      });
      router.refresh();
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Tick failed",
        detail: err instanceof Error ? err.message : "Try again in a moment.",
        action: { label: "Retry", onClick: () => run() }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={run} disabled={busy} className="btn-accent disabled:opacity-70">
      {busy ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Running tick…</span>
        </>
      ) : (
        <>
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Run tick</span>
          <span className="kbd ml-1.5 !bg-paper/15 !border-paper/20 !text-paper-200">T</span>
        </>
      )}
    </button>
  );
}

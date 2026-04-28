"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Loader2 } from "lucide-react";

/**
 * Run tick: kicks the orchestrator. The button rotates the icon during
 * the round-trip and adopts the accent fill once the call returns, then
 * relaxes back. Keyboard shortcut "T" is registered globally.
 */
export function TickButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        await fetch("/api/agents/tick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        router.refresh();
        setBusy(false);
      }}
      disabled={busy}
      className="btn-accent disabled:opacity-70"
    >
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

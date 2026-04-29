"use client";
import { useState } from "react";
import { Section, Field } from "./Section";
import { Pause, Play, Download, Mail, Crown } from "lucide-react";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  tier: "launch" | "pro" | "max";
  status: "onboarding" | "active" | "paused" | "placed";
}

const TIER_LABEL = {
  launch: "Pipeline Launch",
  pro: "Pipeline Pro",
  max: "Pipeline Max"
} as const;

const STATUS_LABEL = {
  onboarding: "Onboarding",
  active: "Active",
  paused: "Paused",
  placed: "Placed"
} as const;

export function AccountSection({ tier, status: initialStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Props["status"]>(initialStatus);
  const [busy, setBusy] = useState<null | "pause" | "export">(null);

  const togglePause = async () => {
    const nextPaused = status !== "paused";
    setBusy("pause");
    const id = "profile-pause";
    toast({
      id,
      type: "pending",
      message: nextPaused ? "Pausing Pipeline…" : "Resuming Pipeline…"
    });
    try {
      const r = await fetch("/api/user/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused: nextPaused })
      });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      const { status: newStatus } = (await r.json()) as { status: Props["status"] };
      setStatus(newStatus);
      toast({
        id,
        type: "success",
        message: nextPaused ? "Pipeline paused" : "Pipeline resumed",
        detail: nextPaused
          ? "All sends are gated. Resume any time."
          : "Sender is unlocked. Next tick will run normally."
      });
      router.refresh();
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Could not change status",
        detail: err instanceof Error ? err.message : "Try again.",
        action: { label: "Retry", onClick: togglePause }
      });
    } finally {
      setBusy(null);
    }
  };

  const exportData = () => {
    setBusy("export");
    toast({ type: "pending", id: "profile-export", message: "Preparing export…" });
    // Use a real download by navigating to the endpoint. The Content-Disposition
    // header on the response tells the browser to save it.
    window.location.href = "/api/user/export";
    window.setTimeout(() => {
      toast({
        id: "profile-export",
        type: "success",
        message: "Export started",
        detail: "Your browser is downloading a JSON file with everything we hold for you."
      });
      setBusy(null);
    }, 600);
  };

  return (
    <Section
      eyebrow="05 · Account"
      title="Plan, status, privacy"
      description="Pause Pipeline if you need a beat. Export everything as JSON whenever you want. Account deletion is human-handled to make sure nothing is removed by accident."
    >
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-ink/8 bg-paper-50 px-4 py-3 flex items-center gap-3">
            <Crown className="h-4 w-4 text-accent" />
            <div>
              <p className="eyebrow !text-ink-500 !mt-0">Plan</p>
              <p className="mt-0.5 text-[13.5px] text-ink font-medium">{TIER_LABEL[tier]}</p>
            </div>
            <Link href="/pricing" className="ml-auto btn-ghost text-[12px]">Compare tiers →</Link>
          </div>
          <div className="rounded-lg border border-ink/8 bg-paper-50 px-4 py-3 flex items-center gap-3">
            <span
              className={
                "h-2 w-2 rounded-full " +
                (status === "active"
                  ? "bg-signal-green"
                  : status === "paused"
                  ? "bg-signal-amber"
                  : "bg-ink-300")
              }
            />
            <div>
              <p className="eyebrow !text-ink-500 !mt-0">Status</p>
              <p className="mt-0.5 text-[13.5px] text-ink font-medium">{STATUS_LABEL[status]}</p>
            </div>
            <button
              onClick={togglePause}
              disabled={busy === "pause"}
              className="ml-auto btn-secondary text-[12px]"
            >
              {status === "paused" ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </>
              )}
            </button>
          </div>
        </div>

        <Field label="Privacy" hint="Export everything as JSON. Or contact us to permanently delete.">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportData}
              disabled={busy === "export"}
              className="btn-secondary text-[12.5px]"
            >
              <Download className="h-3.5 w-3.5" />
              {busy === "export" ? "Preparing…" : "Export my data (JSON)"}
            </button>
            <a
              href="mailto:privacy@pipeline.app?subject=Account%20deletion%20request"
              className="btn-ghost text-[12.5px]"
            >
              <Mail className="h-3.5 w-3.5" />
              Request account deletion
            </a>
          </div>
        </Field>
      </div>
    </Section>
  );
}

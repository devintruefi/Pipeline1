"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { Section, Field } from "./Section";
import { toast } from "@/lib/toast";

interface Props {
  email: boolean;
  linkedin: boolean;
  warmIntro: boolean;
  noFlyCompanies: string[];
  noFlyPeople: string[];
  dailySendCap: number;
  sendStartHour: number;
  sendEndHour: number;
  tz: string;
  autonomy: "review-every" | "review-batch" | "auto-low-risk";
}

const join = (a: string[]) => a.join(", ");
const split = (s: string) => s.split(/[,;]/).map((t) => t.trim()).filter(Boolean);

export function OperationsSection(initial: Props) {
  const [email, setEmail] = useState(initial.email);
  const [linkedin, setLinkedin] = useState(initial.linkedin);
  const [warmIntro, setWarmIntro] = useState(initial.warmIntro);
  const [noFlyCompanies, setNoFlyCompanies] = useState(join(initial.noFlyCompanies));
  const [noFlyPeople, setNoFlyPeople] = useState(join(initial.noFlyPeople));
  const [dailySendCap, setDailySendCap] = useState(String(initial.dailySendCap));
  const [sendStart, setSendStart] = useState(String(initial.sendStartHour));
  const [sendEnd, setSendEnd] = useState(String(initial.sendEndHour));
  const [tz, setTz] = useState(initial.tz);
  const [autonomy, setAutonomy] = useState(initial.autonomy);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const id = "profile-ops";
    toast({ id, type: "pending", message: "Saving operations…" });
    try {
      const cap = Math.max(1, Number(dailySendCap) || 0);
      const r = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constraints: {
            channels: { email, linkedin, warmIntro },
            confidentiality: {
              noFlyCompanies: split(noFlyCompanies),
              noFlyPeople: split(noFlyPeople)
            },
            volume: { dailySendCap: cap, weeklyTargetCap: cap * 5 },
            schedule: {
              sendWindowStartHourLocal: Number(sendStart) || 9,
              sendWindowEndHourLocal: Number(sendEnd) || 17,
              tz
            },
            autonomy
          }
        })
      });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      toast({
        id,
        type: "success",
        message: "Operations saved",
        detail: "Sender will use the new window and channel rules on the next batch."
      });
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Could not save operations",
        detail: err instanceof Error ? err.message : "Try again.",
        action: { label: "Retry", onClick: save }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      eyebrow="03 · How agents operate"
      title="Channels, no-fly, send window"
      description="The rules of engagement. Pipeline strictly respects these — anything off the list never gets surfaced or sent."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Allowed channels">
          <div className="space-y-1.5">
            <Toggle checked={email} onChange={setEmail} label="Email" />
            <Toggle checked={linkedin} onChange={setLinkedin} label="LinkedIn (tap-to-send)" />
            <Toggle checked={warmIntro} onChange={setWarmIntro} label="Warm intro" />
          </div>
        </Field>
        <Field label="Autonomy" hint="How tightly you want to gate sends.">
          <select
            value={autonomy}
            onChange={(e) => setAutonomy(e.target.value as Props["autonomy"])}
            className="w-full"
          >
            <option value="review-every">Review every draft (default)</option>
            <option value="review-batch">Review in batches</option>
            <option value="auto-low-risk">Auto-send green drafts</option>
          </select>
        </Field>
        <Field
          label="No-fly companies"
          hint="Companies Pipeline must never reach out to. Comma-separated."
        >
          <input
            value={noFlyCompanies}
            onChange={(e) => setNoFlyCompanies(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="No-fly people" hint="Specific people to avoid by name.">
          <input
            value={noFlyPeople}
            onChange={(e) => setNoFlyPeople(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="Daily send cap" hint="Hard limit per day. Pipeline will queue beyond.">
          <input
            type="number"
            min={1}
            value={dailySendCap}
            onChange={(e) => setDailySendCap(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="Timezone" hint="IANA name. Used for the send window.">
          <input value={tz} onChange={(e) => setTz(e.target.value)} className="w-full" />
        </Field>
        <Field label="Send window · start hour" hint="0–23 in your local time.">
          <input
            type="number"
            min={0}
            max={23}
            value={sendStart}
            onChange={(e) => setSendStart(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="Send window · end hour">
          <input
            type="number"
            min={0}
            max={23}
            value={sendEnd}
            onChange={(e) => setSendEnd(e.target.value)}
            className="w-full"
          />
        </Field>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={busy} className="btn-primary text-[13px]">
          <Save className="h-3.5 w-3.5" />
          {busy ? "Saving…" : "Save operations"}
        </button>
      </div>
    </Section>
  );
}

function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-ink-700">
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={
          "relative inline-block h-5 w-9 rounded-full transition-colors duration-fast " +
          (checked ? "bg-accent" : "bg-ink/15")
        }
      >
        <span
          className={
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-fast " +
            (checked ? "translate-x-4" : "translate-x-0")
          }
        />
      </span>
      <span>{label}</span>
    </label>
  );
}

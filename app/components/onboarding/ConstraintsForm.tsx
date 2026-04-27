"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConstraintsForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const fd = new FormData(e.currentTarget);
        await fetch("/api/onboarding/constraints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...Object.fromEntries(fd) })
        });
        // Kick the orchestrator once so the dashboard has fresh content.
        await fetch("/api/agents/tick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        router.push("/dashboard");
      }}
    >
      <Section title="Target shape">
        <Row label="Roles you want">
          <input name="roleShape" defaultValue="VP Sales, CRO, GTM Leader" className="w-full" />
        </Row>
        <Row label="Company stage">
          <input name="companyStage" defaultValue="Series B, Series C" className="w-full" />
        </Row>
        <Row label="Industries — must">
          <input name="industriesMust" defaultValue="SaaS, vertical AI, infrastructure" className="w-full" />
        </Row>
        <Row label="Industries — nope">
          <input name="industriesNope" defaultValue="crypto, gambling" className="w-full" />
        </Row>
      </Section>

      <Section title="Compensation">
        <Row label="Floor (USD)">
          <input name="compFloor" type="number" defaultValue={250000} className="w-full" />
        </Row>
        <Row label="Ceiling (USD)">
          <input name="compCeiling" type="number" defaultValue={400000} className="w-full" />
        </Row>
        <Row label="Flex notes">
          <input name="compFlex" defaultValue="Open below floor for the right equity story" className="w-full" />
        </Row>
      </Section>

      <Section title="Geography">
        <Row label="Primary">
          <input name="geoPrimary" defaultValue="SF Bay Area, NYC" className="w-full" />
        </Row>
        <Row label="Open to">
          <input name="geoOpen" defaultValue="Remote-first US" className="w-full" />
        </Row>
        <Row label="Remote OK">
          <select name="geoRemote" defaultValue="true" className="w-full">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Row>
      </Section>

      <Section title="Confidentiality">
        <Row label="No-fly companies">
          <input name="noFlyCompanies" defaultValue="Helix (current employer)" className="w-full" />
        </Row>
        <Row label="No-fly people">
          <input name="noFlyPeople" defaultValue="" className="w-full" />
        </Row>
      </Section>

      <Section title="Channels & volume">
        <Row label="Channels">
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" name="chEmail" defaultChecked /> Email</label>
            <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" name="chLinkedIn" defaultChecked /> LinkedIn (tap-to-send)</label>
            <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" name="chWarm" defaultChecked /> Warm intros</label>
          </div>
        </Row>
        <Row label="Daily send cap">
          <input name="dailySendCap" type="number" defaultValue={12} className="w-full" />
        </Row>
        <Row label="Autonomy">
          <select name="autonomy" defaultValue="review-every" className="w-full">
            <option value="review-every">Review every send</option>
            <option value="review-batch">Review in daily batches</option>
            <option value="auto-low-risk">Auto-send low-risk follow-ups</option>
          </select>
        </Row>
      </Section>

      <button disabled={busy} className="btn-primary w-full">
        {busy ? "Wiring up agents…" : "Open dashboard →"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <div className="mt-2 card divide-y divide-ink/10">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4 px-4 py-3">
      <p className="text-[13px] text-ink-700">{label}</p>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

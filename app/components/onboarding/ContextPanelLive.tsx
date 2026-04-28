"use client";
import { useEffect, useState } from "react";

interface CtxSnapshot {
  identityFilled: boolean;
  thesis?: { positioning: string; whyNow: string; proofPoints: string[]; archetypes: { label: string }[] };
  target?: { roleShape: string[]; companyStage: string[] };
  constraints?: { autonomy: string };
}

export function ContextPanelLive({ userId }: { userId: string }) {
  const [snap, setSnap] = useState<CtxSnapshot>({ identityFilled: true });
  useEffect(() => {
    let on = true;
    const tick = async () => {
      const r = await fetch(`/api/context/snapshot?userId=${userId}`);
      if (!r.ok) return;
      const json = (await r.json()) as CtxSnapshot;
      if (on) setSnap(json);
    };
    tick();
    const int = setInterval(tick, 2500);
    return () => {
      on = false;
      clearInterval(int);
    };
  }, [userId]);

  return (
    <div className="card p-6 sticky top-20">
      <p className="eyebrow">Personal context model</p>
      <p className="text-[12.5px] text-ink-500 mt-1">Filling in as we talk.</p>

      <Block label="01 · Identity" filled={snap.identityFilled}>
        <p className="text-[13px] text-ink-700">Resume, voice samples ingested.</p>
      </Block>

      <Block label="02 · Thesis" filled={!!snap.thesis}>
        {snap.thesis ? (
          <div className="space-y-2">
            <p className="text-[13.5px] text-ink leading-relaxed">{snap.thesis.positioning}</p>
            <p className="text-[12px] text-ink-500"><span className="text-ink-700">Why now. </span> {snap.thesis.whyNow}</p>
            {snap.thesis.proofPoints?.length > 0 && (
              <ul className="text-[12.5px] text-ink-700 space-y-1 mt-2">
                {snap.thesis.proofPoints.slice(0, 3).map((p, i) => <li key={i}>· {p}</li>)}
              </ul>
            )}
            <p className="text-[12px] text-ink-500 mt-2">Archetypes: {snap.thesis.archetypes?.map((a) => a.label).join(" · ") || ". "}</p>
          </div>
        ) : (
          <p className="text-[12.5px] text-ink-300 italic">. synthesised on final turn. </p>
        )}
      </Block>

      <Block label="03 · Target profile" filled={!!snap.target}>
        {snap.target ? (
          <p className="text-[12.5px] text-ink-700">{snap.target.roleShape?.join(", ") || ". "} · {snap.target.companyStage?.join(", ") || ". "}</p>
        ) : (
          <p className="text-[12.5px] text-ink-300 italic">. set in constraints step. </p>
        )}
      </Block>

      <Block label="04 · Constraints" filled={!!snap.constraints}>
        {snap.constraints ? (
          <p className="text-[12.5px] text-ink-700">Autonomy: {snap.constraints.autonomy}</p>
        ) : (
          <p className="text-[12.5px] text-ink-300 italic">. set in constraints step. </p>
        )}
      </Block>

      <Block label="05 · Live context" filled={false}>
        <p className="text-[12.5px] text-ink-300 italic">. populated once Scout starts running. </p>
      </Block>
    </div>
  );
}

function Block({ label, filled, children }: { label: string; filled: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-ink-700 font-semibold">{label}</p>
        <span className={`text-[10px] uppercase tracking-wider ${filled ? "text-signal-green" : "text-ink-300"}`}>{filled ? "Filled" : "Pending"}</span>
      </div>
      <div className="mt-1.5 border-l-2 pl-3 border-ink/10">{children}</div>
    </div>
  );
}

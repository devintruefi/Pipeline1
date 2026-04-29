"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

interface Turn {
  role: "agent" | "user";
  content: string;
}

const OPENING_QUESTIONS = [
  "Reading your resume, the throughline I see is taking $10.20M ARR companies past $40M by re-architecting the AE/SE pairing. does that match how you'd describe yourself?",
  "What's the moment in the last 24 months you're proudest of, and what made it possible?",
  "What kind of company shape do you want to walk into next, and what shape do you want to avoid?",
  "What's a reasonable comp floor below which you'd say no? And what would make you say yes anyway?",
  "Are there companies, founders, or sectors where you absolutely should not be reaching out. confidentiality, friends, ex-customers?",
  "Last one. What's one thing about you that you've never had a good way of putting on a resume but that always shows up in interviews?"
];

export function StrategyConversation({ userId }: { userId: string }) {
  const [turns, setTurns] = useState<Turn[]>([{ role: "agent", content: OPENING_QUESTIONS[0] }]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const submit = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setBusy(true);
    const newTurns: Turn[] = [...turns, { role: "user", content: userInput }];
    setTurns(newTurns);
    setInput("");

    try {
      const tr = await fetch("/api/onboarding/strategy/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "user", content: userInput })
      });
      if (!tr.ok) throw new Error(`Turn save returned ${tr.status}`);

      const next = step + 1;
      if (next < OPENING_QUESTIONS.length) {
        const nextQ = OPENING_QUESTIONS[next];
        setTurns((t) => [...t, { role: "agent", content: nextQ }]);
        const ar = await fetch("/api/onboarding/strategy/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, role: "agent", content: nextQ })
        });
        if (!ar.ok) throw new Error(`Agent turn save returned ${ar.status}`);
        setStep(next);
      } else {
        const r = await fetch("/api/onboarding/strategy/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        if (!r.ok) throw new Error(`Synthesize returned ${r.status}`);
        setTurns((t) => [...t, { role: "agent", content: "Got it. I've drafted your commercial thesis on the right. Take thirty seconds to scan it, then onward." }]);
        setDone(true);
        toast({
          type: "success",
          message: "Thesis drafted",
          detail: "Phase 2 of 3 done. Constraints next."
        });
      }
    } catch (err) {
      toast({
        type: "error",
        message: "Strategist hit a snag",
        detail: err instanceof Error ? err.message : "Try sending again.",
        action: { label: "Retry", onClick: () => { setInput(userInput); } }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card flex flex-col h-[640px]">
      <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-4">
        {turns.map((t, i) => (
          <div key={i} className={t.role === "agent" ? "text-ink" : "text-ink-700"}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mb-1">{t.role === "agent" ? "Strategist" : "You"}</p>
            <p className="text-[15px] leading-relaxed">{t.content}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10 p-4">
        {!done ? (
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={2}
              placeholder="Type your answer…"
              className="flex-1 resize-none"
              disabled={busy}
            />
            <button onClick={submit} disabled={busy || !input.trim()} className="btn-primary">
              {busy ? "…" : "Send"}
            </button>
          </div>
        ) : (
          <button onClick={() => router.push("/onboarding/constraints")} className="btn-primary w-full">
            Continue to constraints →
          </button>
        )}
      </div>
    </div>
  );
}

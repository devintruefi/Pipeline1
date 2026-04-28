/**
 * AgentsOnline. a quiet, animated indicator that the nine agents are running.
 *
 * Shows a row of nine pulsing dots that fire in sequence, with a small
 * "Live" label and a count. The animation is sub-3% of the screen's visual
 * weight but adds a subtle sense that the product is alive. Perfect for the
 * landing hero, where it implies "this isn't a static landing page demo.
 * the system is actually running."
 */

const AGENTS = [
  "Strategist",
  "Scout",
  "Researcher",
  "Verifier",
  "Drafter",
  "Sender",
  "Follow up",
  "Scheduler",
  "Pipeline Manager"
];

export function AgentsOnline() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-paper-50 px-4 py-2 shadow-card">
      <span className="dot dot-live" aria-hidden />
      <span className="text-[12px] font-medium text-ink-700 tabular">
        9 agents online
      </span>
      <span className="hidden md:inline-flex items-center gap-[3px]" aria-hidden>
        {AGENTS.map((name, i) => (
          <span
            key={name}
            title={name}
            className="block h-1.5 w-1.5 rounded-full bg-accent/30"
            style={{
              animation: `agentPulse 2.4s ${i * 220}ms cubic-bezier(0.4, 0, 0.2, 1) infinite`
            }}
          />
        ))}
      </span>
      <span className="text-[11px] text-ink-500">Last tick 4m ago</span>

      <style>{`
        @keyframes agentPulse {
          0%, 100% { background: rgb(67 56 202 / 0.30); transform: scale(1); }
          50% { background: rgb(79 70 229 / 1); transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

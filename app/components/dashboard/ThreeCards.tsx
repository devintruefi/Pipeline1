import type { signals, drafts, meetings } from "@/lib/db/schema";
import { relativeTime } from "@/lib/utils";

type Signal = typeof signals.$inferSelect;
type Draft = typeof drafts.$inferSelect;
type Meeting = typeof meetings.$inferSelect;

export function ThreeCards({
  signals,
  drafts,
  meetings,
  replyRate,
  campaigns
}: {
  signals: Signal[];
  drafts: Draft[];
  meetings: Meeting[];
  replyRate: number;
  campaigns: Array<{ id: string; name: string; targetCount: number }>;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* What happened */}
      <div className="bg-ink text-paper rounded-md p-6 border border-ink">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-paper-200 font-semibold">What happened</p>
        <p className="mt-3 text-[13px] text-paper-200">{signals.length} new triggering events overnight.</p>
        <ul className="mt-4 space-y-2 text-[13px] text-paper">
          {signals.slice(0, 4).map((s) => (
            <li key={s.id} className="flex gap-2">
              <span className="tag bg-paper/10 text-paper border border-paper/20 uppercase text-[10px]">{s.kind.replace(/_/g, " ")}</span>
              <span className="leading-snug">{s.headline}</span>
            </li>
          ))}
          {signals.length === 0 && <li className="text-paper-200 italic">No fresh signals yet — run a tick.</li>}
        </ul>
      </div>

      {/* What's ready */}
      <div className="bg-accent/15 rounded-md p-6 border border-accent/30">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-accent-600 font-semibold">What's ready</p>
        <p className="mt-3 text-[13px] text-ink-700">{drafts.length} drafts in your approval queue.</p>
        <ul className="mt-4 space-y-2 text-[13px] text-ink">
          {drafts.slice(0, 4).map((d) => (
            <li key={d.id} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${d.riskLight === "green" ? "bg-signal-green" : d.riskLight === "yellow" ? "bg-signal-amber" : "bg-signal-red"}`} />
              <span className="truncate">{d.subject ?? "(no subject)"}</span>
            </li>
          ))}
          {drafts.length === 0 && <li className="text-ink-500 italic">Queue empty — hit "Run tick" above.</li>}
        </ul>
      </div>

      {/* What's next */}
      <div className="bg-white rounded-md p-6 border border-ink/10">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-accent font-semibold">What's next</p>
        <p className="mt-3 text-[13px] text-ink-700">Reply rate this week: <span className="text-ink font-semibold">{replyRate}%</span></p>
        <ul className="mt-4 space-y-2 text-[13px] text-ink-700">
          {meetings.slice(0, 2).map((m) => (
            <li key={m.id}>📅 {new Date(m.scheduledFor).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} — {m.briefMd ? m.briefMd.split("\n")[0].replace(/^#\s*/, "") : "Meeting"}</li>
          ))}
          {campaigns.slice(0, 2).map((c) => (
            <li key={c.id}>🎯 Campaign: <span className="text-ink">{c.name}</span> — {c.targetCount} targets</li>
          ))}
          {meetings.length === 0 && campaigns.length === 0 && <li className="text-ink-300 italic">Nothing on the calendar yet.</li>}
        </ul>
      </div>
    </div>
  );
}

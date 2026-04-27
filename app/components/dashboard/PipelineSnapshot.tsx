import type { targets } from "@/lib/db/schema";
import Link from "next/link";

type Target = typeof targets.$inferSelect;

const COLS: Array<{ key: Target["status"]; label: string }> = [
  { key: "watch", label: "Watch" },
  { key: "warm", label: "Warm" },
  { key: "hot", label: "Hot" },
  { key: "engaged", label: "Engaged" },
  { key: "meeting_booked", label: "Meeting" },
  { key: "won", label: "Won" }
];

export function PipelineSnapshot({ targets }: { targets: Target[] }) {
  const counts = COLS.map((c) => ({ ...c, n: targets.filter((t) => t.status === c.key).length }));
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Pipeline</p>
        <Link href="/targets" className="text-[12px] text-ink-700 hover:text-ink">Open →</Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {counts.map((c) => (
          <div key={c.key} className="rounded-md border border-ink/10 p-3">
            <p className="text-[10.5px] uppercase tracking-wider text-ink-500">{c.label}</p>
            <p className="text-[22px] font-semibold tracking-tighter text-ink">{c.n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

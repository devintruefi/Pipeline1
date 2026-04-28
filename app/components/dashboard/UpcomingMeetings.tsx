import type { meetings, targets } from "@/lib/db/schema";
import { Video, MapPin } from "lucide-react";
import Link from "next/link";

type Meeting = typeof meetings.$inferSelect;
type Target = typeof targets.$inferSelect;

/**
 * Calendar widget: a tight week view of confirmed and proposed meetings.
 * Each entry shows day-strip, time, target, and a one-line brief preview.
 * Empty state nudges the user toward booking.
 */
export function UpcomingMeetings({
  meetings: rows,
  targets
}: {
  meetings: Meeting[];
  targets: Target[];
}) {
  return (
    <section id="calendar" className="card p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">On the calendar</p>
          <h3 className="h-meta mt-1">{rows.length === 0 ? "Nothing booked" : `${rows.length} upcoming`}</h3>
        </div>
        <button className="text-[12.5px] text-ink-700 hover:text-ink underline-offset-4 hover:underline">
          Connect calendar →
        </button>
      </header>

      {rows.length === 0 ? (
        <p className="mt-5 text-[13px] text-ink-500 leading-relaxed">
          When a positive reply lands, the Scheduler will propose times that respect your send window
          and add a pre-meeting brief here.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.slice(0, 4).map((m) => {
            const t = targets.find((x) => x.id === m.targetId) ?? null;
            const date = new Date(m.scheduledFor);
            const headline = m.briefMd
              ? m.briefMd.split("\n")[0].replace(/^#+\s*/, "")
              : t
              ? `Intro · ${t.fullName}`
              : "Meeting";
            const isToday = isSameDay(date, new Date());
            return (
              <li
                key={m.id}
                className={`group grid grid-cols-[64px_1fr_auto] gap-3 rounded-lg p-3 -mx-3 hover:bg-paper-50 transition-colors duration-fast ${
                  isToday ? "bg-accent/5" : ""
                }`}
              >
                <div className="text-center rounded-md border border-ink/10 bg-paper-50 py-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">
                    {date.toLocaleDateString(undefined, { month: "short" })}
                  </p>
                  <p className="font-display text-[22px] tracking-tighter text-ink leading-none mt-0.5">
                    {date.getDate()}
                  </p>
                  <p className="text-[10px] text-ink-500 mt-0.5 tabular">
                    {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-ink truncate">{headline}</p>
                  {t && (
                    <p className="text-[12px] text-ink-500 mt-0.5 truncate">
                      {t.title}{t.company ? ` · ${t.company}` : ""}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-500">
                    <span className={`pill ${m.status === "confirmed" ? "pill-green" : "pill-amber"} !text-[9.5px]`}>
                      {m.status}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Video className="h-3 w-3" /> {m.durationMinutes} min
                    </span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast text-[12px] text-ink-700 hover:text-ink self-start mt-1">
                  Brief →
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

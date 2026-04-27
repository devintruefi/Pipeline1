import { db, schema } from "@/lib/db/client";
import { desc, eq } from "drizzle-orm";
import { getActiveOrSeedUser } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  watch: "pill-outline",
  warm: "pill-amber",
  hot: "pill-accent",
  engaged: "pill-cool",
  meeting_booked: "pill-green",
  won: "pill-ink",
  rejected: "pill-outline",
  snoozed: "pill-outline"
};

const STATUSES: Array<{ key: string; label: string }> = [
  { key: "all",            label: "All" },
  { key: "hot",            label: "Hot" },
  { key: "engaged",        label: "Engaged" },
  { key: "meeting_booked", label: "Meeting" },
  { key: "warm",           label: "Warm" },
  { key: "watch",          label: "Watch" }
];

export default async function TargetsPage({
  searchParams
}: {
  searchParams: { status?: string };
}) {
  const user = await getActiveOrSeedUser();
  if (!user) return null;
  const targets = await db.select().from(schema.targets)
    .where(eq(schema.targets.userId, user.id))
    .orderBy(desc(schema.targets.updatedAt));

  const filter = searchParams.status ?? "all";
  const visible = filter === "all" ? targets : targets.filter((t) => t.status === filter);
  const counts = Object.fromEntries(STATUSES.map((s) => [s.key, s.key === "all" ? targets.length : targets.filter((t) => t.status === s.key).length]));

  return (
    <div className="mx-auto max-w-page px-6 py-10">
      <header className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="eyebrow">Pipeline · targets</p>
          <h1 className="mt-2 font-display text-[36px] md:text-[48px] tracking-tightest leading-[1.04] font-medium text-ink">
            {targets.length} on the radar.
          </h1>
          <p className="mt-3 text-[14.5px] text-ink-700 max-w-prose">
            Status flows: watch → warm → hot → engaged → meeting → won. Click any row for the full
            dossier: recent posts, mutual connections, and the agent's drafted hooks.
          </p>
        </div>
        <Link href="/dashboard" className="btn-ghost text-[12.5px] hidden md:inline-flex">
          ← Control Center
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {STATUSES.map((s) => {
          const active = filter === s.key;
          return (
            <Link
              key={s.key}
              href={s.key === "all" ? "/targets" : `/targets?status=${s.key}`}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] border transition-colors duration-fast ${
                active
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper border-ink/12 text-ink-700 hover:bg-paper-100"
              }`}
            >
              {s.label}
              <span className={`tabular text-[11px] ${active ? "text-paper-200" : "text-ink-300"}`}>{counts[s.key] ?? 0}</span>
            </Link>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[820px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title · company</th>
                <th>Status</th>
                <th>Email</th>
                <th className="text-right">Verifier</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center !py-12 text-ink-500 text-[13px]">
                    Nothing in this filter.
                  </td>
                </tr>
              )}
              {visible.map((t) => {
                const conf = Math.round(t.emailConfidence * 100);
                return (
                  <tr key={t.id}>
                    <td>
                      <Link href={`/targets/${t.id}`} className="font-medium text-ink hover:underline underline-offset-4">
                        {t.fullName}
                      </Link>
                    </td>
                    <td>
                      <p className="text-ink truncate max-w-[260px]">{t.title}</p>
                      <p className="text-ink-500 text-[12px]">{t.company}</p>
                    </td>
                    <td>
                      <span className={`pill ${STATUS_TONE[t.status] ?? "pill-outline"}`}>
                        {t.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="font-mono text-[12px] text-ink-700">{t.email ?? "—"}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="h-1 w-14 rounded-full bg-paper-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-slow ease-out ${
                              conf >= 85 ? "bg-signal-green" : conf >= 60 ? "bg-signal-amber" : "bg-signal-red"
                            }`}
                            style={{ width: `${conf}%` }}
                          />
                        </div>
                        <span className="tabular text-[12px] text-ink-700">{conf}%</span>
                      </div>
                    </td>
                    <td className="text-[12px] text-ink-500 tabular">
                      {new Date(t.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

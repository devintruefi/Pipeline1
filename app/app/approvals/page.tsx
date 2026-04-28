import { db, schema } from "@/lib/db/client";
import { and, eq, desc } from "drizzle-orm";
import { getActiveOrSeedUser } from "@/lib/session";
import { ApprovalCard } from "@/components/dashboard/ApprovalCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const user = await getActiveOrSeedUser();
  if (!user) return null;
  const drafts = await db.select().from(schema.drafts)
    .where(and(eq(schema.drafts.userId, user.id), eq(schema.drafts.status, "pending")))
    .orderBy(desc(schema.drafts.createdAt));
  const targets = await db.select().from(schema.targets).where(eq(schema.targets.userId, user.id));

  const greenCount = drafts.filter((d) => d.riskLight === "green").length;
  const amberCount = drafts.filter((d) => d.riskLight === "yellow").length;
  const redCount = drafts.filter((d) => d.riskLight === "red").length;

  return (
    <div className="mx-auto max-w-[960px] px-6 py-10">
      <header className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="eyebrow">Approval queue</p>
          <h1 className="mt-2 font-display text-[36px] md:text-[48px] tracking-tightest leading-[1.04] font-medium text-ink">
            {drafts.length === 0 ? "Queue empty." : `${drafts.length} drafts pending.`}
          </h1>
          <p className="mt-3 text-[14.5px] text-ink-700 max-w-prose leading-relaxed">
            Approve, edit-then-approve, or reject. Pipeline never sends without a green from you.
            Sender batches at 9.11 AM in your local timezone.
          </p>
        </div>
        <Link href="/dashboard" className="btn-ghost text-[12.5px] hidden md:inline-flex">
          ← Control Center
        </Link>
      </header>

      {drafts.length > 0 && (
        <div className="rounded-xl border border-ink/10 bg-paper-50 p-5 mb-6 grid grid-cols-3 divide-x divide-ink/10">
          <RiskTile count={greenCount} label="Green" tone="green" caption="Verifier passed" />
          <RiskTile count={amberCount} label="Amber" tone="amber" caption="Review carefully" />
          <RiskTile count={redCount}   label="Red"   tone="red"   caption="Risk flag set" />
        </div>
      )}

      <div className="space-y-4">
        {drafts.length === 0 && (
          <div className="card p-10 text-center">
            <p className="font-display italic text-[20px] text-ink-700">All clear.</p>
            <p className="mt-3 text-[13.5px] text-ink-500 max-w-prose mx-auto">
              Nothing waiting on you. The next tick will refill the queue with drafts grounded in fresh signals.
            </p>
          </div>
        )}
        {drafts.map((d) => (
          <div id={d.id} key={d.id} className="scroll-mt-24">
            <ApprovalCard draft={d} target={targets.find((t) => t.id === d.targetId) ?? null} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskTile({
  count,
  label,
  tone,
  caption
}: {
  count: number;
  label: string;
  tone: "green" | "amber" | "red";
  caption: string;
}) {
  return (
    <div className="px-5">
      <div className="flex items-center gap-2">
        <span className={`dot dot-${tone}`} />
        <p className="eyebrow-quiet">{label}</p>
      </div>
      <p className="mt-2 font-display text-[34px] leading-none tracking-tightest text-ink tabular">
        {count}
      </p>
      <p className="mt-1 text-[12px] text-ink-500">{caption}</p>
    </div>
  );
}

import { db, schema } from "@/lib/db/client";
import { desc, eq, and } from "drizzle-orm";
import { getActiveOrSeedUser } from "@/lib/session";
import { ReplyTriage } from "@/components/inbox/ReplyTriage";

export const dynamic = "force-dynamic";

/**
 * Inbox · Reply triage.
 *
 * Inbound messages classified by Follow-up agent. Each row offers a
 * keystroke action: B for "book a call", N for "nudge", A for "archive",
 * etc. The classification is what the agent thinks; the user can override.
 */
export default async function InboxPage() {
  const user = await getActiveOrSeedUser();
  if (!user) return null;

  const [messages, targets] = await Promise.all([
    db.select().from(schema.messages)
      .where(and(eq(schema.messages.userId, user.id), eq(schema.messages.direction, "inbound")))
      .orderBy(desc(schema.messages.createdAt))
      .limit(60),
    db.select().from(schema.targets).where(eq(schema.targets.userId, user.id))
  ]);

  return (
    <div className="mx-auto max-w-page px-6 py-10">
      <header className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">Inbox · reply triage</p>
          <h1 className="font-display text-[34px] md:text-[42px] font-medium tracking-tightest text-ink leading-[1.05] mt-2">
            {messages.length === 0
              ? "Inbox is quiet."
              : `${messages.length} repl${messages.length === 1 ? "y" : "ies"} from your targets.`}
          </h1>
          <p className="mt-2 text-[14px] text-ink-700 max-w-prose">
            Classification is from the Follow-up agent. Override with a single keystroke; the right next move
            is queued for your approval automatically.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[12px] text-ink-500">
          <span className="kbd">B</span> book ·
          <span className="kbd">N</span> nudge ·
          <span className="kbd">A</span> archive ·
          <span className="kbd">R</span> reply
        </div>
      </header>

      <ReplyTriage messages={messages} targets={targets} />
    </div>
  );
}

/**
 * CLI entry: `npm run agents:tick -- <userId?>`
 * Runs a single orchestrator tick. useful for cron from any external runner.
 */
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { tickUser } from "@/lib/agents/orchestrator";

async function main() {
  const arg = process.argv[2];
  let userIds: string[];
  if (arg) {
    userIds = [arg];
  } else {
    const users = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.status, "active"));
    userIds = users.map((u) => u.id);
  }
  console.log(`Ticking ${userIds.length} user(s)…`);
  for (const id of userIds) {
    const r = await tickUser(id);
    console.log(`  ${id} →`, r);
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

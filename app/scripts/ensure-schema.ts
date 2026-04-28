/**
 * Standalone schema bootstrap.
 *
 *   npm run db:ensure
 *
 * Runs the boot-time DDL against DATABASE_URL. Idempotent. every CREATE is
 * `IF NOT EXISTS`, so it's safe to run on every deploy. Useful as a Vercel
 * "Build Command" prefix or a one-shot CI step.
 */
import { ensureSchema } from "@/lib/db/client";

async function main() {
  await ensureSchema();
  console.log("Schema ensured.");
  process.exit(0);
}

main().catch((e) => {
  console.error("ensureSchema failed:", e);
  process.exit(1);
});

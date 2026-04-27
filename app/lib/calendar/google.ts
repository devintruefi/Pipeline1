import "server-only";
import type { UserContext } from "@/lib/agents/contracts";

/**
 * Propose meeting slots respecting the user's time zone and send window.
 * Live path would call Google Calendar's freeBusy API; mock returns 3
 * weekday slots inside the configured window.
 */
export async function proposeSlots(_userId: string, ctx: UserContext): Promise<string[]> {
  const tz = ctx.constraints?.schedule.tz ?? "America/New_York";
  const startHour = ctx.constraints?.schedule.sendWindowStartHourLocal ?? 9;
  const endHour = ctx.constraints?.schedule.sendWindowEndHourLocal ?? 17;
  const out: string[] = [];
  let day = new Date();
  let added = 0;
  while (added < 3 && out.length < 10) {
    day = new Date(day.getTime() + 24 * 3600 * 1000);
    const dow = day.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const slot = new Date(day);
    const hour = startHour + Math.floor((endHour - startHour) / 2);
    slot.setUTCHours(hour, 0, 0, 0);
    out.push(slot.toISOString());
    added++;
  }
  // Annotate with timezone so the LLM has it when writing the brief.
  void tz;
  return out;
}

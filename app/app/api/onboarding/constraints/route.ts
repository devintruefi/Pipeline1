import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

const Body = z.object({
  userId: z.string(),
  roleShape: z.string(),
  companyStage: z.string(),
  industriesMust: z.string(),
  industriesNope: z.string(),
  compFloor: z.coerce.number(),
  compCeiling: z.coerce.number(),
  compFlex: z.string(),
  geoPrimary: z.string(),
  geoOpen: z.string(),
  geoRemote: z.string(),
  noFlyCompanies: z.string(),
  noFlyPeople: z.string(),
  chEmail: z.string().optional(),
  chLinkedIn: z.string().optional(),
  chWarm: z.string().optional(),
  dailySendCap: z.coerce.number(),
  autonomy: z.enum(["review-every", "review-batch", "auto-low-risk"])
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;
  const split = (s: string) => s.split(/[,;]/).map((t) => t.trim()).filter(Boolean);

  await db
    .update(schema.users)
    .set({
      target: {
        roleShape: split(d.roleShape),
        companyStage: split(d.companyStage),
        industries: { mustHave: split(d.industriesMust), nope: split(d.industriesNope) },
        comp: { floor: d.compFloor, ceiling: d.compCeiling, flexNotes: d.compFlex },
        geography: { primary: split(d.geoPrimary), openTo: split(d.geoOpen), remote: d.geoRemote === "true" },
        mission: "",
        timelineUrgencyWeeks: 12
      },
      constraints: {
        confidentiality: { noFlyCompanies: split(d.noFlyCompanies), noFlyPeople: split(d.noFlyPeople) },
        channels: { email: !!d.chEmail, linkedin: !!d.chLinkedIn, warmIntro: !!d.chWarm },
        volume: { dailySendCap: d.dailySendCap, weeklyTargetCap: d.dailySendCap * 5 },
        tone: { formal: 0.4, warm: 0.6, assertive: 0.7 },
        schedule: { sendWindowStartHourLocal: 9, sendWindowEndHourLocal: 17, tz: "America/Los_Angeles" },
        autonomy: d.autonomy
      },
      status: "active"
    })
    .where(eq(schema.users.id, d.userId));
  return NextResponse.json({ ok: true });
}

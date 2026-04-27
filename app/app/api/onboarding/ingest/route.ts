import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { id } from "@/lib/utils";
import { parseResumeText, extractVoiceProfile } from "@/lib/parsing/resume";
import { setActiveUser } from "@/lib/session";
import { eq } from "drizzle-orm";

const Body = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  resumeText: z.string().min(40),
  voiceSamples: z.string().optional()
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

  const resume = parseResumeText(parsed.data.resumeText);
  const voiceSamples = (parsed.data.voiceSamples ?? "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const voiceProfile = extractVoiceProfile(voiceSamples);

  const userId = id("usr");
  const existing = await db.query.users.findFirst({ where: eq(schema.users.email, parsed.data.email) });
  const targetUserId = existing?.id ?? userId;

  if (existing) {
    await db
      .update(schema.users)
      .set({
        name: parsed.data.name,
        identity: {
          resume,
          linkedinUrl: parsed.data.linkedinUrl || undefined,
          receipts: [],
          voiceProfile
        }
      })
      .where(eq(schema.users.id, existing.id));
  } else {
    await db.insert(schema.users).values({
      id: userId,
      email: parsed.data.email,
      name: parsed.data.name,
      tier: "solo",
      status: "onboarding",
      identity: {
        resume,
        linkedinUrl: parsed.data.linkedinUrl || undefined,
        receipts: [],
        voiceProfile
      },
      thesis: null,
      target: null,
      constraints: null,
      liveContext: null
    });
  }

  await setActiveUser(targetUserId);
  return NextResponse.json({ ok: true, userId: targetUserId });
}

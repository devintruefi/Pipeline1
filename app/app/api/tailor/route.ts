import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveOrSeedUser } from "@/lib/session";
import { tailorResume } from "@/lib/tailor/engine";

const Body = z.object({ jdText: z.string().min(20) });

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await getActiveOrSeedUser();
  if (!user?.identity?.resume) return NextResponse.json({ error: "No resume on file" }, { status: 400 });

  const result = tailorResume({
    jdText: parsed.data.jdText,
    resume: user.identity.resume,
    thesisLine: user.thesis?.positioning
  });
  return NextResponse.json(result);
}

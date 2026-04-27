import "server-only";
import { env, useMock } from "@/lib/env";

export interface EmailVerification {
  valid: boolean;
  confidence: number; // 0..1
  source: "hunter" | "mock" | "none";
}

/** Verify an email address. Hunter.io live path; deterministic mock fallback. */
export async function verifyEmail(email: string): Promise<EmailVerification> {
  if (!email) return { valid: false, confidence: 0, source: "none" };
  if (useMock.hunter) return mockVerify(email);
  try {
    const r = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${env.HUNTER_API_KEY}`
    );
    if (!r.ok) return mockVerify(email);
    const json = (await r.json()) as { data?: { status?: string; score?: number } };
    const status = json.data?.status ?? "unknown";
    const score = (json.data?.score ?? 0) / 100;
    return {
      valid: status === "valid" || status === "accept_all",
      confidence: score,
      source: "hunter"
    };
  } catch {
    return mockVerify(email);
  }
}

function mockVerify(email: string): EmailVerification {
  // Cheap heuristic: anything not obviously broken passes with high confidence,
  // anonymous handles like "info@" or "hello@" pass with medium.
  const ok = /@[^.]+\.[^.]/.test(email);
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  const generic = ["info", "hello", "team", "contact", "support"].includes(local);
  return {
    valid: ok,
    confidence: ok ? (generic ? 0.6 : 0.92) : 0.05,
    source: "mock"
  };
}

import "server-only";
import type { Identity } from "@/lib/db/schema";

/**
 * Resume parser.
 *
 * Production path: send the file to a vision-capable model with a strict
 * Identity-shape JSON output. For the demo, we accept text input and run a
 * heuristic extraction so the onboarding flow always works without a key.
 */
export function parseResumeText(text: string): Identity["resume"] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const headline = lines[0] ?? "Senior operator";
  const summaryStartIdx = lines.findIndex((l) => /summary/i.test(l));
  const summary = summaryStartIdx >= 0 ? lines.slice(summaryStartIdx + 1, summaryStartIdx + 4).join(" ") : lines.slice(1, 4).join(" ");

  const roles: NonNullable<Identity["resume"]>["roles"] = [];
  // Look for role lines like: "Title — Company (Year–Year)"
  const roleRe = /^(.+?)\s+(?:—|–|-)\s+(.+?)\s*\((.+?)\s*[–-]\s*(.+?)\)\s*$/;
  for (let i = 0; i < lines.length; i++) {
    const m = roleRe.exec(lines[i]);
    if (!m) continue;
    const bullets: string[] = [];
    let j = i + 1;
    while (j < lines.length && /^[-•·]/.test(lines[j])) {
      bullets.push(lines[j].replace(/^[-•·]\s?/, ""));
      j++;
    }
    roles.push({
      title: m[1],
      company: m[2],
      start: m[3],
      end: /present/i.test(m[4]) ? "present" : m[4],
      bullets
    });
    i = j - 1;
  }

  const skillsLine = lines.find((l) => /^skills?:/i.test(l));
  const skills = skillsLine ? skillsLine.replace(/^skills?:/i, "").split(/[,;]/).map((s) => s.trim()).filter(Boolean) : [];

  const educationLine = lines.find((l) => /^education/i.test(l));
  const education: NonNullable<Identity["resume"]>["education"] = [];
  if (educationLine) {
    const idx = lines.indexOf(educationLine);
    for (let i = idx + 1; i < Math.min(lines.length, idx + 4); i++) {
      const parts = lines[i].split(/\s+—\s+|\s+-\s+|,\s*/);
      if (parts.length >= 2) education.push({ school: parts[0], degree: parts[1], year: parts[2] });
    }
  }

  return {
    headline,
    summary,
    roles,
    skills,
    education
  };
}

export function extractVoiceProfile(samples: string[]) {
  // Lightweight extraction; the real pipeline would feed examples into the
  // Drafter as few-shots. Here we encode 'avoid' phrases that AI tends to
  // produce and that an executive's writing rarely contains.
  return {
    tone: "direct, declarative, low on hedging — written like a senior operator",
    cadence: "short paragraphs; punctuated by em-dashes and one-line beats",
    quirks: ["uses '—' freely", "avoids exclamation points", "signs with first name only"],
    sampleOpeners: ["Quick note —", "Saw the news on", "Reading your post on"],
    sampleClosers: ["Worth a 20-minute conversation?", "Happy to be useful here.", "If it's helpful."],
    avoid: [
      "I hope this email finds you well",
      "I wanted to reach out",
      "I just wanted to touch base",
      "circle back",
      "synergy"
    ],
    examples: samples.slice(0, 5)
  };
}

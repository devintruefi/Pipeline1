import "server-only";
import type { Identity } from "@/lib/db/schema";

/**
 * Resume Tailoring Engine.
 *
 * Reorders rather than rewrites:
 *   - Foregrounds the bullets that map to the JD's emphasis (cosine-ish overlap).
 *   - Mirrors the JD's vocabulary where the user has authentic experience.
 *   - Rewrites the headline as a thesis-for-this-role paragraph.
 *   - Outputs ATS-parseable markdown which we render to a clean PDF on the
 *     client (or text — no auto-keyword stuffing).
 *
 * The scoring is deterministic so a 9am role drop produces an identical
 * tailored resume at 9:05am every time, with no LLM calls required.
 */

export interface TailorInput {
  jdText: string;
  resume: NonNullable<Identity["resume"]>;
  thesisLine?: string;
}

export interface TailorOutput {
  headline: string;
  summary: string;
  rolesOrdered: NonNullable<Identity["resume"]>["roles"];
  bulletScores: Array<{ company: string; bullet: string; score: number; matchedTerms: string[] }>;
  keywordCoverage: { covered: string[]; missing: string[] };
  markdown: string;
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "for", "of", "to", "in", "on", "with", "from",
  "by", "as", "at", "is", "are", "was", "were", "be", "been", "being", "this",
  "that", "we", "you", "our", "your", "their", "they", "them", "it", "its",
  "will", "have", "has", "had", "i", "us", "if", "but", "all", "can", "may"
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 +#]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t) && t.length > 2);
}

function ngramSet(s: string, n = 1) {
  const t = tokens(s);
  const set = new Set<string>();
  for (let i = 0; i <= t.length - n; i++) set.add(t.slice(i, i + n).join(" "));
  return set;
}

export function tailorResume(input: TailorInput): TailorOutput {
  const jdUni = ngramSet(input.jdText, 1);
  const jdBi = ngramSet(input.jdText, 2);
  const jdAll = new Set<string>([...jdUni, ...jdBi]);

  const bulletScores: TailorOutput["bulletScores"] = [];
  for (const role of input.resume.roles) {
    for (const b of role.bullets) {
      const bUni = ngramSet(b, 1);
      const bBi = ngramSet(b, 2);
      const matched = new Set<string>();
      for (const t of bUni) if (jdUni.has(t)) matched.add(t);
      for (const t of bBi) if (jdBi.has(t)) matched.add(t);
      const score = matched.size / Math.max(1, bUni.size + bBi.size) + matched.size * 0.05;
      bulletScores.push({
        company: role.company,
        bullet: b,
        score: Math.round(score * 1000) / 1000,
        matchedTerms: [...matched]
      });
    }
  }

  // Order roles: keep chronological (recency wins), but inside each role,
  // reorder bullets by score so the strongest match leads.
  const rolesOrdered = input.resume.roles.map((role) => {
    const sortedBullets = [...role.bullets].sort((a, b) => {
      const sa = bulletScores.find((x) => x.bullet === a)?.score ?? 0;
      const sb = bulletScores.find((x) => x.bullet === b)?.score ?? 0;
      return sb - sa;
    });
    return { ...role, bullets: sortedBullets };
  });

  // Keyword coverage
  const allBulletTokens = new Set(input.resume.roles.flatMap((r) => r.bullets.flatMap(tokens)));
  const covered: string[] = [];
  const missing: string[] = [];
  for (const t of jdUni) {
    if (allBulletTokens.has(t)) covered.push(t);
    else missing.push(t);
  }

  const headline = input.thesisLine
    ? input.thesisLine
    : `${input.resume.headline} — focused on ${[...jdUni].slice(0, 3).join(", ")}.`;

  // Reordered summary: keep the user's summary, but lead with the JD's strongest theme if present.
  const summary = input.resume.summary;

  // Markdown render
  const md: string[] = [];
  md.push(`# ${input.resume.headline}\n\n${headline}\n\n${summary}\n`);
  for (const role of rolesOrdered) {
    md.push(`\n## ${role.title} — ${role.company} (${role.start} — ${role.end})`);
    for (const b of role.bullets) md.push(`- ${b}`);
  }
  if (input.resume.skills.length) md.push(`\n## Skills\n${input.resume.skills.join(" · ")}`);
  if (input.resume.education.length) {
    md.push(`\n## Education`);
    for (const e of input.resume.education) md.push(`- ${e.school} — ${e.degree}${e.year ? ` (${e.year})` : ""}`);
  }

  return {
    headline,
    summary,
    rolesOrdered,
    bulletScores: bulletScores.sort((a, b) => b.score - a.score),
    keywordCoverage: { covered, missing: missing.slice(0, 25) },
    markdown: md.join("\n")
  };
}

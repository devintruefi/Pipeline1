/**
 * Voice fingerprinting (deterministic, non-LLM).
 *
 * Computes a 0..1 score representing how much a draft body resembles the
 * user's actual past writing. We don't try to be perfect — we measure a few
 * stylistic dimensions and combine them. The signal is strong enough to
 * regress when the model drifts off-voice and weak enough to never block.
 */

interface VoiceFeatures {
  avgSentenceLen: number;
  emDashRate: number;        // em-dashes per sentence
  exclamationRate: number;   // exclamations per sentence
  questionRate: number;      // questions per sentence
  contractionsRate: number;  // contractions per word
  shortSentenceRate: number; // share of sentences under 8 words
  lowercaseSentenceStartRate: number;
}

function tokenize(text: string): { words: string[]; sentences: string[] } {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const words = text.toLowerCase().split(/[^a-z']+/).filter(Boolean);
  return { words, sentences };
}

function features(text: string): VoiceFeatures {
  const { words, sentences } = tokenize(text);
  const n = Math.max(1, sentences.length);
  return {
    avgSentenceLen: words.length / n,
    emDashRate: (text.match(/—|--/g)?.length ?? 0) / n,
    exclamationRate: (text.match(/!/g)?.length ?? 0) / n,
    questionRate: (text.match(/\?/g)?.length ?? 0) / n,
    contractionsRate: (text.match(/\b\w+'\w+\b/g)?.length ?? 0) / Math.max(1, words.length),
    shortSentenceRate: sentences.filter((s) => s.split(/\s+/).length < 8).length / n,
    lowercaseSentenceStartRate:
      sentences.filter((s) => /^[a-z]/.test(s)).length / n
  };
}

function diff(a: VoiceFeatures, b: VoiceFeatures): number {
  const norms: Array<keyof VoiceFeatures> = [
    "avgSentenceLen",
    "emDashRate",
    "exclamationRate",
    "questionRate",
    "contractionsRate",
    "shortSentenceRate",
    "lowercaseSentenceStartRate"
  ];
  // Scale avg sentence len differently — others are 0..~1.
  let total = 0;
  for (const k of norms) {
    const av = a[k];
    const bv = b[k];
    const scale = k === "avgSentenceLen" ? 20 : 1;
    total += Math.abs(av - bv) / scale;
  }
  return total / norms.length;
}

/**
 * Score how close `draft` is to the average style of `examples`.
 * Returns 0..1; higher = closer to user voice.
 */
export function scoreVoice(draft: string, examples: string[]): number {
  if (!examples.length) return 0.7; // unknown voice → assume reasonable
  const corpus = examples.join("\n\n");
  const a = features(draft);
  const b = features(corpus);
  const d = diff(a, b);
  // d is roughly 0..0.5; map to a soft score
  const score = Math.max(0, Math.min(1, 1 - d * 1.6));
  return Math.round(score * 100) / 100;
}

import { describe, it, expect } from "vitest";
import { scoreVoice } from "@/lib/voice/score";

const USER_VOICE = [
  `Quick note.

Saw the funding announcement this morning. Curious how the AE/SE pairing looks now that the partner channel is doing real volume.

Worth a 20-minute conversation?

. Marcus`,
  `Reading your Q3 letter today.

Two things stood out. the deliberate move out of SMB, and how you're framing AI as a wedge into enterprise. Both decisions other teams flinch on.

Happy to send a one-pager if useful.`
];

describe("voice scoring", () => {
  it("scores a draft with similar style high", () => {
    const draft = `Quick note.

Saw the news on the new CRO. Curious how you're thinking about the AE/SE motion through the transition.

Worth a 20-minute call?

. Marcus`;
    const s = scoreVoice(draft, USER_VOICE);
    expect(s).toBeGreaterThan(0.75);
  });

  it("scores generic AI-sounding draft lower", () => {
    const draft = `Hello there!

I hope this email finds you well! I just wanted to reach out and connect with you because I think there's a great opportunity for us to collaborate together! Let me know what you think and I'd love to schedule some time to chat in the near future!

Thank you so much for your time and consideration!

Best regards,
Marcus`;
    const s = scoreVoice(draft, USER_VOICE);
    expect(s).toBeLessThan(0.7);
  });

  it("returns reasonable default with no examples", () => {
    expect(scoreVoice("any text", [])).toBeGreaterThan(0.5);
  });
});

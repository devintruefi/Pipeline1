import { Quote } from "lucide-react";

export default function ManifestoPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
      <p className="eyebrow eyebrow-dot">Manifesto</p>
      <h1 className="mt-5 font-display text-[44px] md:text-[64px] tracking-tightest leading-[1.0] font-medium text-ink text-balance">
        The bottleneck is not motivation. It is leverage.
      </h1>

      <div className="rule-thick mt-8 max-w-[260px]" />

      <div className="mt-10 space-y-6 text-[17px] md:text-[18px] leading-[1.7] text-ink-800">
        <p className="drop-cap text-pretty">
          A senior search hasn't changed in thirty years. The candidate writes the resume, hunts for
          the email, sends the note, sets the follow-up reminder, juggles eighty spreadsheet rows. The
          machinery hasn't moved. What moved is the cost — at $300K total comp, every month of
          unemployment burns $25,000 in foregone earnings.
        </p>

        <p className="text-pretty">
          The market has answers. <span className="text-ink">Recruiters</span>,{" "}
          <span className="text-ink">coaches</span>, <span className="text-ink">outplacement firms</span>,{" "}
          <span className="text-ink">LinkedIn Premium</span> — and all of them solve for the wrong
          thing. Recruiters work for the company. Coaches sell mindset. Outplacement is a severance
          deliverable. LinkedIn is a job board.
        </p>

        <figure className="my-12 rounded-xl border-l-2 border-accent bg-paper-50 p-7">
          <Quote className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <blockquote className="mt-3 font-display italic text-[26px] md:text-[30px] leading-[1.2] tracking-tightish text-ink text-balance">
            What an executive in transition needs isn't more applications. It is the right thirty
            conversations to have, at the right moment, with a credible thesis attached.
          </blockquote>
        </figure>

        <p className="text-pretty">
          Three things broke in our favor this year. Frontier LLMs cleared the quality bar for voice
          mimicry and multi-step research. Agentic frameworks matured. And white-collar layoffs
          produced the largest senior talent pool in fifteen years — sophisticated buyers who can
          spot templated AI from across the room.
        </p>

        <p className="text-pretty">
          The thing those buyers actually need is leverage — and someone, or something, to handle the
          operational weight of running a search at scale, in their voice, with their judgment in the
          loop on every send.
        </p>

        <p className="font-display italic text-[24px] tracking-tightish text-ink leading-snug pt-4">
          Pipeline is that thing.
        </p>
      </div>

      <footer className="mt-14 pt-6 border-t border-ink/10 flex items-center justify-between">
        <p className="text-[13px] text-ink-500">— Devin Patel · Founder</p>
        <p className="text-[12px] text-ink-300">v1.0 · April 2026</p>
      </footer>
    </article>
  );
}

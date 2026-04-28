import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ManifestoPage() {
  return (
    <div className="bg-paper">
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-[72ch] px-6 py-20">
          <p className="eyebrow">Manifesto. v1.6</p>
          <h1 className="mt-4 font-display text-[48px] md:text-[64px] leading-[0.96] tracking-tightest text-ink">
            The work happens without you. The decisions don't.
          </h1>
          <p className="mt-6 font-display italic text-[20px] text-ink-700 leading-snug max-w-[60ch]">
            "An AI chief of staff for your job search. Nine specialised agents target opportunities,
            draft outreach in your voice, send from your inbox, handle follow ups, and book
            meetings. You approve every move."
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-[68ch] px-6 py-16 prose prose-ink">
        <p className="drop-cap text-[18px] text-ink-700 leading-[1.7] text-pretty">
          A senior leader spends six to twelve months on a search that should take a fraction of that.
          Not because they are not working. Because the work is the wrong shape for one person. Each
          target requires research, dossier building, voice tuned outreach, polite follow ups, a
          calendar dance, a pre meeting brief, a thank you, and a re engagement note. None of it
          rewards being awake at 6am. All of it compounds when you forget. We built Pipeline
          because that motion should not be a thing humans do anymore. The model is happy to do it.
          The human should be doing the parts that compound: the conversations, the interviews,
          the decisions about what to negotiate for.
        </p>

        <h2 className="h-section mt-12">What we believe.</h2>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          <strong className="text-ink">Receipts beat vibes.</strong> The first thing Pipeline asks
          you for is not a resume. It is a list of moments where you did something measurable. A
          paper you co authored. A campaign that drove 14% lift. A 20 person team you held
          together through a layoff. The Drafter does not write your outreach until it can ground
          every line in a specific receipt.
        </p>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          <strong className="text-ink">Voice is a moat.</strong> The reason cold outreach reads as
          cold is that it was written by someone who is not you. Pipeline scores every draft
          against your past writing. Sentence length, contraction rate, how you open and close.
          It refuses to send anything that drifts off voice. That is also why we never auto send
          on LinkedIn. There is a tap to send queue you control. Compliance is a moat too.
        </p>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          <strong className="text-ink">Signals before plays before sends.</strong> Most job search
          tools start at the send. They write more emails, faster, and watch reply rates collapse
          to zero. We start at the signal. Funding rounds, leadership changes, posted roles, alumni
          at companies you would love to work at. Then we pick the right play for each. Only then
          do we generate the draft. Volume is a vanity metric. Signal to send ratio is the real one.
        </p>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          <strong className="text-ink">Tier the cadence, not the dignity.</strong> A college
          student looking for an internship deserves the same architecture as a CRO looking for
          their next role. The agents are the same. What changes is the cadence (daily versus
          hourly), the model tier (Haiku versus Opus), and the kinds of receipts you have available.
          That is why Launch costs $19 and Max costs $299. Not because the underlying product is
          worth less. Because the unit economics demand it.
        </p>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          <strong className="text-ink">Move people up the ladder, not just through it.</strong>{" "}
          Pipeline is not a tool you graduate from. The college senior who lands their first role
          on Launch keeps their context model when they upgrade to Pro three years later. The
          director who got laid off and found a job in six weeks on Pro can move to Max when they
          are hunting for a VP role. The five layer Personal Context Model you spent four hours
          building during onboarding is yours, not ours.
        </p>

        <h2 className="h-section mt-14">What we won&apos;t do.</h2>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          We will not auto spam LinkedIn. We will not sell your data, your dossier, or your
          network to recruiters or brokers. We will not run engagement loops on you the way job
          boards do. We will not pretend that the model can do the work the model cannot do
          (interviewing well, negotiating an offer, deciding what you want next). And we will not
          get out of your way at the moments where the human matters most.
        </p>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          And we will not build a free tier. Free turns the user into the product. Pipeline costs
          $19 a month at the entry tier so we can stay aligned with the only person we work for.
          You.
        </p>

        <h2 className="h-section mt-14">What we hope.</h2>

        <p className="mt-5 text-[16px] text-ink-700 leading-[1.7] text-pretty">
          That a generation of college students stop sending résumés into ATS voids and start
          getting introduced to alumni who actually want to talk to them. That every laid off
          professional has, by Friday, three real interviews instead of two weeks of cover letter
          dread. That the executive job market (quietly the most relationship driven labor market
          in the world) gets a tool worthy of how much agency the people in it actually have. We
          are a long way from any of that. But we know the shape of the product, and we know who
          it is for.
        </p>

        <div className="mt-14 pt-10 border-t border-ink/10 flex flex-wrap items-center gap-3">
          <Link href="/onboarding" className="btn-accent btn-lg glow-accent">
            Start your search <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="btn-secondary btn-lg">
            See the three tiers
          </Link>
          <Link href="/founder" className="btn-ghost btn-lg">
            Read the founder story
          </Link>
        </div>

        <p className="mt-10 text-[12.5px] text-ink-500">
          Devin Patel. Founder, Pipeline. April 2026.
        </p>
      </article>
    </div>
  );
}

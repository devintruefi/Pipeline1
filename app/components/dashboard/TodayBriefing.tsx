import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2, MessageSquare, Calendar, Sparkles } from "lucide-react";

/**
 * Today's briefing — the editorial "what to do right now" panel that sits
 * at the top of the Control Center. The tone is ink-inverted so the user's
 * eye lands here first. Each row is a discrete decision with a single
 * primary action; we never stack multiple CTAs in one row.
 */
type Item = {
  kind: "approval" | "reply" | "meeting" | "signal";
  title: string;
  context: string;
  href: string;
  count?: number;
  urgent?: boolean;
};

export function TodayBriefing({
  firstName,
  draftsToApprove,
  repliesToTriage,
  meetingsToday,
  hotSignals,
  lastTickAgo
}: {
  firstName: string;
  draftsToApprove: number;
  repliesToTriage: number;
  meetingsToday: number;
  hotSignals: number;
  lastTickAgo: string;
}) {
  const items: Item[] = [];
  if (meetingsToday > 0) {
    items.push({
      kind: "meeting",
      title: `${meetingsToday} meeting${meetingsToday > 1 ? "s" : ""} today`,
      context: "Review the pre-meeting brief 15 min before each call.",
      href: "/dashboard#calendar",
      count: meetingsToday,
      urgent: true
    });
  }
  if (draftsToApprove > 0) {
    items.push({
      kind: "approval",
      title: `${draftsToApprove} draft${draftsToApprove > 1 ? "s" : ""} ready for review`,
      context: "Approve, edit-then-send, or reject. Sender ships at 9–11 AM.",
      href: "/approvals",
      count: draftsToApprove,
      urgent: draftsToApprove >= 5
    });
  }
  if (repliesToTriage > 0) {
    items.push({
      kind: "reply",
      title: `${repliesToTriage} repl${repliesToTriage > 1 ? "ies" : "y"} need triage`,
      context: "Classify intent and pick the next move with one keystroke.",
      href: "/inbox",
      count: repliesToTriage
    });
  }
  if (hotSignals > 0) {
    items.push({
      kind: "signal",
      title: `${hotSignals} hot signal${hotSignals > 1 ? "s" : ""} from overnight`,
      context: "Funding, leadership change, or product launch — high relevance.",
      href: "/dashboard#signals",
      count: hotSignals
    });
  }

  const totalActions = draftsToApprove + repliesToTriage + meetingsToday;
  const greeting = greetingForHour();

  return (
    <section className="rounded-xl bg-ink text-paper overflow-hidden grain">
      <div className="px-7 py-7 md:px-9 md:py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow !text-accent-200">{greeting} · {today()}</p>
            <h1 className="mt-2 font-display font-medium tracking-tightest text-paper text-[34px] md:text-[44px] leading-[1.0] text-balance">
              {totalActions === 0
                ? `Nothing on your plate, ${firstName}.`
                : `${firstName}, ${humanizeTotal(totalActions)}.`}
            </h1>
            <p className="mt-3 text-paper-200 text-[14.5px] leading-relaxed max-w-prose">
              {totalActions === 0
                ? "Your agents are running. Run a tick to pull fresh signals or open the pipeline to see what's brewing."
                : "Your agents have prepared the day. Each decision below is one keystroke away from done."}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="eyebrow-quiet !text-paper-200">Last tick</p>
            <p className="mt-1 font-display text-[20px] tracking-tighter text-paper">{lastTickAgo}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-paper-200 justify-end">
              <span className="dot dot-live h-1.5 w-1.5" /> 9 agents online
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <ul className="mt-7 divide-y divide-paper/10 stagger">
            {items.map((it) => (
              <BriefingRow key={it.kind} item={it} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function BriefingRow({ item }: { item: Item }) {
  const Icon =
    item.kind === "approval"
      ? CheckCircle2
      : item.kind === "reply"
      ? MessageSquare
      : item.kind === "meeting"
      ? Calendar
      : Sparkles;

  return (
    <li>
      <Link
        href={item.href}
        className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 hover:bg-paper/5 transition-colors duration-fast -mx-2 px-2 rounded-md"
      >
        <span
          className={`relative h-9 w-9 rounded-md grid place-items-center ${
            item.urgent ? "bg-accent text-paper" : "bg-paper/10 text-paper"
          }`}
        >
          <Icon className="h-4 w-4" />
          {item.urgent && <AlertCircle className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-accent-200 text-ink" />}
        </span>
        <div>
          <p className="text-[15px] font-medium text-paper">
            {item.title}
          </p>
          <p className="text-[12.5px] text-paper-200 mt-0.5">{item.context}</p>
        </div>
        <span className="flex items-center gap-2 text-[12.5px] text-paper-200 group-hover:text-paper transition-colors">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-fast group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}

function greetingForHour() {
  const h = new Date().getHours();
  if (h < 5) return "Late shift";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function today() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function humanizeTotal(n: number) {
  if (n === 1) return "one decision is waiting";
  return `${n} decisions are waiting`;
}

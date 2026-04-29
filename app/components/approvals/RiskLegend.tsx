/**
 * Risk + voice legend. A small, always-visible block at the top of /approvals
 * that explains what the green / amber / red dots mean and what the voice
 * percentage measures. Without this, the queue feels arbitrary; with it, the
 * user understands the rules in a single glance.
 */
import { ShieldCheck, Eye, AlertTriangle, Sparkles } from "lucide-react";

export function RiskLegend() {
  return (
    <details className="rounded-xl border border-ink/8 bg-paper-50 mb-6 group">
      <summary className="cursor-pointer list-none px-5 py-3 flex items-center gap-3 text-[12.5px] text-ink-700 select-none">
        <span className="eyebrow !text-ink-500">Legend</span>
        <span className="hidden sm:inline">Risk lights · voice score · what each one means</span>
        <span className="sm:hidden">Tap to read the legend</span>
        <span className="ml-auto text-ink-300 transition-transform duration-fast group-open:rotate-180">▾</span>
      </summary>
      <div className="border-t border-ink/8 px-5 py-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[12.5px] text-ink-700">
        <Item
          icon={ShieldCheck}
          tone="text-signal-green"
          dot="dot-green"
          title="Green · Verifier passed"
          body="Email verified, voice ≥ 0.80, no risk flags. Safe to approve & send."
        />
        <Item
          icon={Eye}
          tone="text-signal-amber"
          dot="dot-amber"
          title="Amber · Review carefully"
          body="One soft warning. Maybe an unverified email, a tone flag, or a claim the Verifier wants you to confirm."
        />
        <Item
          icon={AlertTriangle}
          tone="text-signal-red"
          dot="dot-red"
          title="Red · Do not send without rewrite"
          body="Hard flag. Tone, compliance, claim, or address risk that should be rewritten before approval."
        />
        <Item
          icon={Sparkles}
          tone="text-accent"
          dot="!bg-accent"
          title="Sounds like you · 0–100"
          body="Voice score. Sentence length, contraction rate, opener and closer pattern, em-dash rate, all measured against your samples. 88+ is a confident match. Below 78 the Verifier flags it."
        />
      </div>
    </details>
  );
}

function Item({
  icon: Icon,
  tone,
  dot,
  title,
  body
}: {
  icon: typeof ShieldCheck;
  tone: string;
  dot: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <span className={`dot ${dot} mt-1.5 shrink-0`} />
      <div>
        <p className={`font-medium text-ink inline-flex items-center gap-1.5`}>
          <Icon className={`h-3.5 w-3.5 ${tone}`} />
          {title}
        </p>
        <p className="mt-0.5 text-ink-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

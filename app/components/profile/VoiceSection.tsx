"use client";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Section, Field } from "./Section";
import { toast } from "@/lib/toast";
import Link from "next/link";

interface Props {
  examples: string[];
  tone: string;
  cadence: string;
  hasResume: boolean;
}

export function VoiceSection({ examples, tone, cadence, hasResume }: Props) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const append = async () => {
    const samples = draft
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);
    if (samples.length === 0) {
      toast({
        type: "info",
        message: "Add at least one sample",
        detail: "Each sample should be a real piece of writing of yours, separated by a blank line."
      });
      return;
    }
    setBusy(true);
    const id = "profile-voice";
    toast({ id, type: "pending", message: "Adding voice samples…" });
    try {
      const r = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: { voiceSamplesAppend: samples } })
      });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      toast({
        id,
        type: "success",
        message: `${samples.length} sample${samples.length === 1 ? "" : "s"} added`,
        detail: "Voice fingerprint will refresh on the next draft pass."
      });
      setDraft("");
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Could not add samples",
        detail: err instanceof Error ? err.message : "Try again.",
        action: { label: "Retry", onClick: append }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      eyebrow="04 · Voice & receipts"
      title="How Pipeline writes in your voice"
      description="The Drafter scores every line against these samples — sentence length, contractions, opener and closer pattern. More samples = stronger fingerprint = drafts that read like you."
    >
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-paper-100 px-4 py-3 text-[12.5px] text-ink-700">
            <p className="eyebrow !text-ink-500 !mt-0">Tone</p>
            <p className="mt-1">{tone || "Not yet inferred"}</p>
          </div>
          <div className="rounded-lg bg-paper-100 px-4 py-3 text-[12.5px] text-ink-700">
            <p className="eyebrow !text-ink-500 !mt-0">Cadence</p>
            <p className="mt-1">{cadence || "Not yet inferred"}</p>
          </div>
        </div>

        <Field
          label={`Current samples · ${examples.length}`}
          hint="The first ~80 chars of each. We never send these as-is; only the stylistic markers are used."
        >
          {examples.length === 0 ? (
            <p className="text-[12.5px] text-ink-500 italic">
              No samples on file yet. Drop two or three short emails or posts below.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {examples.slice(0, 6).map((s, i) => (
                <li key={i} className="text-[12.5px] text-ink-700 truncate">
                  <span className="text-ink-300 mr-2 tabular">{String(i + 1).padStart(2, "0")}</span>
                  {s.replace(/\s+/g, " ").slice(0, 100)}
                  {s.length > 100 && "…"}
                </li>
              ))}
              {examples.length > 6 && (
                <li className="text-[11.5px] text-ink-400">
                  + {examples.length - 6} more
                </li>
              )}
            </ul>
          )}
        </Field>

        <Field
          label="Add more samples"
          hint="Paste two or three short emails or posts you wrote. Separate them with a blank line."
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            placeholder="Each sample on its own paragraph block, separated by a blank line."
            className="w-full font-mono text-[12.5px]"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-ink/8">
          <button
            onClick={append}
            disabled={busy || draft.trim().length === 0}
            className="btn-primary text-[13px]"
          >
            <Plus className="h-3.5 w-3.5" />
            {busy ? "Adding…" : "Add to voice profile"}
          </button>
          <span className="text-[12px] text-ink-500 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Lift typically takes effect on the next batch of drafts.
          </span>
          {!hasResume && (
            <Link href="/onboarding/ingest" className="ml-auto btn-ghost text-[12.5px]">
              Re-do receipts ingest →
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}

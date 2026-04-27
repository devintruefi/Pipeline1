"use client";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export function WaitlistForm() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="rounded-xl bg-white border border-ink/10 shadow-editorial p-7 space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("loading");
        setError(null);
        const fd = new FormData(e.currentTarget);
        const r = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd))
        });
        if (r.ok) {
          setState("ok");
          (e.target as HTMLFormElement).reset();
        } else {
          const json = await r.json().catch(() => ({}));
          setError(json.error ?? "Something went wrong.");
          setState("err");
        }
      }}
    >
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">Apply for cohort 01</p>
        <span className="pill pill-outline">25 seats</span>
      </div>
      <h3 className="font-display text-[24px] tracking-tightish font-medium text-ink leading-snug text-balance">
        Tell us about your search.
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="name" label="Name" placeholder="Your name" required />
        <Field name="email" label="Email" type="email" placeholder="you@firm.com" required />
      </div>
      <Field name="currentTitle" label="Current title" placeholder="VP Sales · Operating Partner · …" required />
      <div>
        <label className="eyebrow-quiet">A sentence about your search</label>
        <textarea
          name="story"
          rows={3}
          placeholder="Where are you in your transition? What kind of role are you looking for?"
          className="mt-1.5 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary w-full text-[14px] btn-lg"
      >
        {state === "loading" ? "Submitting…" : "Apply for the founding cohort"}
        <ArrowRight className="h-4 w-4" />
      </button>

      {state === "ok" && (
        <p className="flex items-start gap-2 text-[13px] text-signal-green">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          Thanks. Devin will personally review your application within 48 hours.
        </p>
      )}
      {state === "err" && (
        <p className="flex items-start gap-2 text-[13px] text-signal-red">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      <p className="text-[11.5px] text-ink-500 leading-relaxed pt-3 border-t border-ink/8">
        Pipeline never auto-sends on LinkedIn. Email integrations are read-only until you explicitly enable send.
        Your data is never used to train models.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="eyebrow-quiet">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full"
      />
    </div>
  );
}

"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { Section, Field } from "./Section";
import { toast } from "@/lib/toast";

interface Props {
  name: string;
  email: string;
  linkedinUrl: string;
}

export function IdentitySection({ name: initialName, email, linkedinUrl: initialLinkedin }: Props) {
  const [name, setName] = useState(initialName);
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedin);
  const [busy, setBusy] = useState(false);

  const dirty = name !== initialName || linkedinUrl !== initialLinkedin;

  const save = async () => {
    setBusy(true);
    const id = "profile-identity";
    toast({ id, type: "pending", message: "Saving identity…" });
    try {
      const r = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, identity: { linkedinUrl } })
      });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      toast({ id, type: "success", message: "Identity saved" });
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Could not save identity",
        detail: err instanceof Error ? err.message : "Try again.",
        action: { label: "Retry", onClick: save }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      eyebrow="01 · Identity"
      title="Who you are"
      description="The essentials. Email is read-only because it's how Pipeline finds you across sessions; everything else can change."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
        </Field>
        <Field label="Email" hint="Read-only. Contact us to change.">
          <input value={email} disabled className="w-full !bg-paper-100 !text-ink-500" />
        </Field>
        <Field label="LinkedIn URL" hint="Used by the Researcher when building dossiers about you.">
          <input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/…"
            className="w-full"
            type="url"
          />
        </Field>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={!dirty || busy} className="btn-primary text-[13px]">
          <Save className="h-3.5 w-3.5" />
          {busy ? "Saving…" : "Save identity"}
        </button>
      </div>
    </Section>
  );
}

"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { Section, Field } from "./Section";
import { toast } from "@/lib/toast";

interface Props {
  roleShape: string[];
  companyStage: string[];
  industriesMust: string[];
  industriesNope: string[];
  compFloor: number;
  compCeiling: number;
  compFlex: string;
  geoPrimary: string[];
  geoOpen: string[];
  remote: boolean;
}

const join = (a: string[]) => a.join(", ");
const split = (s: string) => s.split(/[,;]/).map((t) => t.trim()).filter(Boolean);

export function TargetSection(initial: Props) {
  const [roleShape, setRoleShape] = useState(join(initial.roleShape));
  const [companyStage, setCompanyStage] = useState(join(initial.companyStage));
  const [industriesMust, setIndustriesMust] = useState(join(initial.industriesMust));
  const [industriesNope, setIndustriesNope] = useState(join(initial.industriesNope));
  const [compFloor, setCompFloor] = useState(String(initial.compFloor));
  const [compCeiling, setCompCeiling] = useState(String(initial.compCeiling));
  const [compFlex, setCompFlex] = useState(initial.compFlex);
  const [geoPrimary, setGeoPrimary] = useState(join(initial.geoPrimary));
  const [geoOpen, setGeoOpen] = useState(join(initial.geoOpen));
  const [remote, setRemote] = useState(initial.remote);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const id = "profile-target";
    toast({ id, type: "pending", message: "Saving search target…" });
    try {
      const r = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: {
            roleShape: split(roleShape),
            companyStage: split(companyStage),
            industries: { mustHave: split(industriesMust), nope: split(industriesNope) },
            comp: {
              floor: Number(compFloor) || 0,
              ceiling: Number(compCeiling) || 0,
              flexNotes: compFlex
            },
            geography: { primary: split(geoPrimary), openTo: split(geoOpen), remote }
          }
        })
      });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      toast({
        id,
        type: "success",
        message: "Search target updated",
        detail: "Scout will weight signals against the new shape on the next tick."
      });
    } catch (err) {
      toast({
        id,
        type: "error",
        message: "Could not save search target",
        detail: err instanceof Error ? err.message : "Try again.",
        action: { label: "Retry", onClick: save }
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      eyebrow="02 · What you want"
      title="The shape of your next role"
      description="Scout, Researcher, and Drafter all read these fields. Tighten them when you've got a clearer picture; they ripple into the next batch of signals automatically."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Roles you want" hint="Comma-separated. e.g. VP Sales, CRO, GTM Leader.">
          <input value={roleShape} onChange={(e) => setRoleShape(e.target.value)} className="w-full" />
        </Field>
        <Field label="Company stage" hint="Comma-separated. Series B, Series C, Late stage, Public.">
          <input value={companyStage} onChange={(e) => setCompanyStage(e.target.value)} className="w-full" />
        </Field>
        <Field label="Industries · must">
          <input
            value={industriesMust}
            onChange={(e) => setIndustriesMust(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="Industries · nope" hint="Pipeline will not surface signals from these.">
          <input
            value={industriesNope}
            onChange={(e) => setIndustriesNope(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="Comp floor (USD)">
          <input
            type="number"
            value={compFloor}
            onChange={(e) => setCompFloor(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field label="Comp ceiling (USD)">
          <input
            type="number"
            value={compCeiling}
            onChange={(e) => setCompCeiling(e.target.value)}
            className="w-full"
          />
        </Field>
        <Field
          label="Flex notes"
          hint="Anything to share about how you'd flex on comp. Equity story, joining bonus, etc."
        >
          <input value={compFlex} onChange={(e) => setCompFlex(e.target.value)} className="w-full" />
        </Field>
        <Field label="Geography · primary">
          <input value={geoPrimary} onChange={(e) => setGeoPrimary(e.target.value)} className="w-full" />
        </Field>
        <Field label="Geography · open to">
          <input value={geoOpen} onChange={(e) => setGeoOpen(e.target.value)} className="w-full" />
        </Field>
        <Field label="Remote OK?">
          <select
            value={remote ? "true" : "false"}
            onChange={(e) => setRemote(e.target.value === "true")}
            className="w-full"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={busy} className="btn-primary text-[13px]">
          <Save className="h-3.5 w-3.5" />
          {busy ? "Saving…" : "Save search target"}
        </button>
      </div>
    </Section>
  );
}

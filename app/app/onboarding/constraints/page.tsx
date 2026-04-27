import { ConstraintsForm } from "@/components/onboarding/ConstraintsForm";
import { getActiveOrSeedUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ConstraintsPage() {
  const user = await getActiveOrSeedUser();
  if (!user) redirect("/onboarding/ingest");
  return (
    <div className="mx-auto max-w-[860px] px-6 py-12">
      <p className="eyebrow">Phase 3 · Constraints</p>
      <h1 className="h-section mt-2">Set the rules of engagement.</h1>
      <p className="mt-3 max-w-[64ch] text-[15px] text-ink-700">
        Comp floor, geography, channels, no-fly list. The agent will operate strictly inside these.
      </p>
      <div className="mt-8">
        <ConstraintsForm userId={user.id} />
      </div>
    </div>
  );
}

import { StrategyConversation } from "@/components/onboarding/StrategyConversation";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { getActiveOrSeedUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function StrategyPage() {
  const user = await getActiveOrSeedUser();
  if (!user) redirect("/onboarding/ingest");
  return (
    <>
    <OnboardingProgress phase="strategy" />
    <div className="mx-auto max-w-[1240px] px-6 py-12">
      <p className="eyebrow">Phase 2 · Strategy conversation</p>
      <h1 className="h-section mt-2">Let's surface your thesis.</h1>
      <p className="mt-2 max-w-[64ch] text-[15px] text-ink-700">
        A 10-minute conversation. Watch your context model fill in on the right.
      </p>
      <div className="mt-8 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <StrategyConversation userId={user.id} />
        </div>
        <div className="lg:col-span-5">
          <ContextPanelLive userId={user.id} />
        </div>
      </div>
    </div>
    </>
  );
}

import { ContextPanelLive } from "@/components/onboarding/ContextPanelLive";

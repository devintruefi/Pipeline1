import { IngestForm } from "@/components/onboarding/IngestForm";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

export default function IngestPage() {
  return (
    <>
    <OnboardingProgress phase="ingest" />
    <div className="mx-auto max-w-[860px] px-6 py-12">
      <p className="eyebrow">Phase 1 · Ingest</p>
      <h1 className="h-section mt-2">Drop in your background.</h1>
      <p className="mt-3 max-w-[60ch] text-[15px] text-ink-700">
        We extract everything in the background. You keep moving.
      </p>
      <div className="mt-8">
        <IngestForm />
      </div>
    </div>
    </>
  );
}

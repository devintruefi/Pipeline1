import { TailorClient } from "@/components/tailor/TailorClient";
import { getActiveOrSeedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TailorPage() {
  const user = await getActiveOrSeedUser();
  return (
    <div className="mx-auto max-w-[1240px] px-6 py-10">
      <p className="eyebrow">Resume tailor</p>
      <h1 className="h-section mt-1">Drop a JD. Get a tailored resume in under 60 seconds.</h1>
      <p className="mt-2 max-w-[68ch] text-[13px] text-ink-500">
        We <span className="text-ink">reorder</span>, not rewrite. Foreground the bullets that map. Mirror vocabulary you already have. Output stays ATS-parseable.
      </p>
      <TailorClient hasUser={!!user} />
    </div>
  );
}

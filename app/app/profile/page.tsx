import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getActiveOrSeedUser } from "@/lib/session";
import { IdentitySection } from "@/components/profile/IdentitySection";
import { TargetSection } from "@/components/profile/TargetSection";
import { OperationsSection } from "@/components/profile/OperationsSection";
import { VoiceSection } from "@/components/profile/VoiceSection";
import { ThesisSection } from "@/components/profile/ThesisSection";
import { AccountSection } from "@/components/profile/AccountSection";

export const dynamic = "force-dynamic";

/**
 * /profile — the user's editable surface.
 *
 * Six sections, each its own form, each posting to /api/user/update with
 * just its own slice of the user record. The agents read these fields on
 * every tick, so any edit ripples into the next batch automatically with
 * no manual rebuild.
 */
export default async function ProfilePage() {
  const user = await getActiveOrSeedUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-20 text-center">
        <p className="eyebrow">Profile</p>
        <h1 className="mt-2 font-display text-[36px] tracking-tightest leading-tight text-ink">
          Sign in to edit your profile.
        </h1>
        <p className="mt-3 text-[14px] text-ink-700 max-w-prose mx-auto">
          The profile is per user. Walk through onboarding and your editable
          settings live here.
        </p>
        <Link href="/onboarding" className="btn-primary mt-6 inline-flex">
          Start onboarding
        </Link>
      </div>
    );
  }

  const identity = user.identity ?? null;
  const target = user.target ?? null;
  const constraints = user.constraints ?? null;
  const thesis = user.thesis ?? null;

  return (
    <div className="mx-auto max-w-[860px] px-6 py-10 page-enter">
      <header className="mb-8">
        <Link
          href="/dashboard"
          className="text-[12.5px] text-ink-500 hover:text-ink inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Control Center
        </Link>
        <p className="eyebrow mt-4">Profile</p>
        <h1 className="mt-2 font-display text-[36px] md:text-[44px] tracking-tightest leading-[1.04] font-medium text-ink">
          What Pipeline knows about you.
        </h1>
        <p className="mt-3 text-[14.5px] text-ink-700 max-w-prose leading-relaxed">
          Every field below is read by the Strategist, Scout, Researcher, and Drafter on every tick.
          Edits ripple into the next batch automatically — no rebuild required. Email is read-only;
          everything else can change.
        </p>
      </header>

      <div className="space-y-6">
        <IdentitySection
          name={user.name ?? ""}
          email={user.email}
          linkedinUrl={identity?.linkedinUrl ?? ""}
        />

        <TargetSection
          roleShape={target?.roleShape ?? []}
          companyStage={target?.companyStage ?? []}
          industriesMust={target?.industries?.mustHave ?? []}
          industriesNope={target?.industries?.nope ?? []}
          compFloor={target?.comp?.floor ?? 0}
          compCeiling={target?.comp?.ceiling ?? 0}
          compFlex={target?.comp?.flexNotes ?? ""}
          geoPrimary={target?.geography?.primary ?? []}
          geoOpen={target?.geography?.openTo ?? []}
          remote={target?.geography?.remote ?? true}
        />

        <OperationsSection
          email={constraints?.channels?.email ?? true}
          linkedin={constraints?.channels?.linkedin ?? true}
          warmIntro={constraints?.channels?.warmIntro ?? true}
          noFlyCompanies={constraints?.confidentiality?.noFlyCompanies ?? []}
          noFlyPeople={constraints?.confidentiality?.noFlyPeople ?? []}
          dailySendCap={constraints?.volume?.dailySendCap ?? 12}
          sendStartHour={constraints?.schedule?.sendWindowStartHourLocal ?? 9}
          sendEndHour={constraints?.schedule?.sendWindowEndHourLocal ?? 17}
          tz={constraints?.schedule?.tz ?? "America/Los_Angeles"}
          autonomy={constraints?.autonomy ?? "review-every"}
        />

        <VoiceSection
          examples={identity?.voiceProfile?.examples ?? []}
          tone={identity?.voiceProfile?.tone ?? ""}
          cadence={identity?.voiceProfile?.cadence ?? ""}
          hasResume={!!identity?.resume}
        />

        <ThesisSection thesis={thesis} />

        <AccountSection tier={user.tier} status={user.status} />
      </div>
    </div>
  );
}

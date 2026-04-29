/** Generic onboarding loading. */
export default function OnboardingLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <div className="skeleton h-3 w-44 mb-3" />
      <div className="skeleton h-9 w-2/3 max-w-xl mb-8" />
      <div className="card p-8 space-y-4 max-w-xl">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-9 w-full" />
          </div>
        ))}
        <div className="skeleton h-10 w-full mt-4" />
      </div>
    </div>
  );
}

/**
 * Dashboard loading. Mirrors the real layout so the page doesn't reflow
 * dramatically when data arrives. Header, briefing, metric rail, three
 * columns of cards, scoreboard, memo. Subtle shimmer keeps the eye
 * anchored without strobing.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-8 md:py-10 animate-fade-in">
      <header className="flex items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="skeleton h-5 w-40" />
          <div className="skeleton h-5 w-12" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-7 w-16" />)}
          <div className="skeleton h-9 w-28" />
        </div>
      </header>

      <div className="space-y-6">
        <SkelCard h="h-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkelCard key={i} h="h-32" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6"><SkelCard h="h-72" /><SkelCard h="h-44" /></div>
          <div className="space-y-6"><SkelCard h="h-60" /><SkelCard h="h-60" /></div>
          <div className="space-y-6"><SkelCard h="h-60" /><SkelCard h="h-72" /></div>
        </div>
        <SkelCard h="h-40" />
        <SkelCard h="h-36" />
      </div>
    </div>
  );
}

function SkelCard({ h }: { h: string }) {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-3 w-24" />
      <div className={`skeleton ${h} w-full`} />
    </div>
  );
}

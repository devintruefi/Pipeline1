/** Strategy conversation loading. Two-column shell. */
export default function StrategyLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <header className="mb-6 space-y-3">
        <div className="skeleton h-3 w-44" />
        <div className="skeleton h-9 w-2/3 max-w-xl" />
      </header>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card h-[640px] p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-3/4" />
            </div>
          ))}
        </div>
        <div className="card h-[640px] p-6 space-y-3">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-3 w-full mt-4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

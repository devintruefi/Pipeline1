/** Runs page loading. */
export default function RunsLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <header className="mb-6 space-y-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-9 w-48" />
      </header>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card px-5 py-4 flex items-center gap-4">
            <div className="skeleton h-2 w-2 rounded-full" />
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-3 w-28" />
            <div className="ml-auto skeleton h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

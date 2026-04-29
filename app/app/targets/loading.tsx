/** Targets loading. Table skeleton. */
export default function TargetsLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <header className="mb-6">
        <div className="skeleton h-3 w-16 mb-3" />
        <div className="skeleton h-9 w-48" />
      </header>
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-ink/8 flex gap-4 bg-paper-100">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-3 w-24" />)}
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="px-5 py-3 border-b border-ink/6 flex gap-4 items-center">
            <div className="skeleton h-3.5 w-40" />
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-3 w-24" />
            <div className="ml-auto skeleton h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

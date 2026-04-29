/** Approvals loading. List of card-shaped skeletons. */
export default function ApprovalsLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <header className="flex items-end justify-between mb-6">
        <div>
          <div className="skeleton h-3 w-24 mb-3" />
          <div className="skeleton h-9 w-64" />
        </div>
        <div className="skeleton h-10 w-32" />
      </header>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-ink/8 bg-paper-50 flex gap-3 items-center">
              <div className="skeleton h-2 w-2 rounded-full" />
              <div className="skeleton h-3.5 w-48" />
              <div className="ml-auto flex gap-2">
                <div className="skeleton h-5 w-16" />
                <div className="skeleton h-5 w-12" />
                <div className="skeleton h-5 w-32" />
              </div>
            </div>
            <div className="px-5 py-5 space-y-3">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-9 w-full" />
              <div className="skeleton h-3 w-12" />
              <div className="skeleton h-32 w-full" />
            </div>
            <div className="px-5 py-3 border-t border-ink/8 bg-paper-50 flex gap-2">
              <div className="skeleton h-9 w-44" />
              <div className="skeleton h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

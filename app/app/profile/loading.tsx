/** Profile loading. Six section skeletons. */
export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-10 animate-fade-in">
      <header className="mb-8 space-y-3">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-9 w-2/3 max-w-md" />
        <div className="skeleton h-3 w-3/4 max-w-prose" />
      </header>
      <div className="space-y-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="px-6 py-5 border-b border-ink/8 bg-paper-50 space-y-2">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-5 w-1/2" />
            </div>
            <div className="px-6 py-6 grid sm:grid-cols-2 gap-5">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-9 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

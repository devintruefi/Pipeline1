/** Inbox loading. Filter rail + list + detail pane. */
export default function InboxLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <header className="mb-6">
        <div className="skeleton h-3 w-16 mb-3" />
        <div className="skeleton h-9 w-48" />
      </header>
      <div className="flex gap-2 mb-4">
        {[...Array(7)].map((_, i) => <div key={i} className="skeleton h-7 w-20 rounded-full" />)}
      </div>
      <div className="grid lg:grid-cols-[minmax(320px,1fr)_2fr] gap-4 min-h-[640px]">
        <div className="card divide-y divide-ink/8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-3.5 w-32" />
                <div className="skeleton h-3 w-10" />
              </div>
              <div className="skeleton h-3 w-3/4" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
        <div className="card p-6 space-y-4">
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-3 w-1/4" />
          <div className="space-y-2 mt-4">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

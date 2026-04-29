/** Tailor loading. JD pane + result pane skeletons. */
export default function TailorLoading() {
  return (
    <div className="mx-auto max-w-page px-6 py-10 animate-fade-in">
      <header className="mb-6">
        <div className="skeleton h-3 w-16 mb-3" />
        <div className="skeleton h-9 w-64" />
      </header>
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-72 w-full" />
          <div className="skeleton h-10 w-full" />
        </div>
        <div className="lg:col-span-7">
          <div className="card p-8 space-y-3">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-3 w-32 mt-4" />
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-3 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

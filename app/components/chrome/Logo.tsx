/**
 * The Pipeline mark.
 *
 * Three editorial bars representing the funnel: watch → engaged → won.
 * The accent (top bar) is the active stage; ink bars are committed history.
 * Sized in em so it scales with the surrounding text.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex flex-col gap-[2px] items-end ${className}`}
      style={{ height: "1.05em" }}
    >
      <span className="block bg-accent rounded-[1px]" style={{ width: "0.95em", height: "0.20em" }} />
      <span className="block bg-ink rounded-[1px]" style={{ width: "0.70em", height: "0.20em" }} />
      <span className="block bg-ink rounded-[1px]" style={{ width: "0.45em", height: "0.20em" }} />
    </span>
  );
}

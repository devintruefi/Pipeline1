import type { ReactNode } from "react";

/**
 * Profile section shell. Editorial card with eyebrow, title, supporting
 * paragraph, and a body slot. All five profile sections sit inside one
 * of these so the page reads as a single document.
 */
export function Section({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <header className="px-6 py-5 border-b border-ink/8 bg-paper-50">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-[22px] tracking-tightish leading-tight text-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[13px] text-ink-500 leading-relaxed max-w-prose">
            {description}
          </p>
        )}
      </header>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium uppercase tracking-eyebrow text-ink-500">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[11.5px] text-ink-400">{hint}</p>}
    </div>
  );
}

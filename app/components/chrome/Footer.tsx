import Link from "next/link";
import { Logo } from "@/components/chrome/Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="mx-auto max-w-page px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5 space-y-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="font-display font-medium tracking-tighter text-ink text-[18px] leading-none">
                Pipeline
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-ink-500 text-pretty">
              An AI chief of staff for your job search. Nine agents target, draft, send, follow
              up, and book meetings. You approve every move.
            </p>
            <p className="font-display italic text-[15px] text-ink-700 leading-snug max-w-[34ch]">
              "The work happens without you. The decisions don't."
            </p>
          </div>

          <FooterCol title="Product" links={[
            ["How it works", "/how-it-works"],
            ["Plays", "/plays"],
            ["Pricing", "/pricing"],
            ["Open dashboard", "/dashboard"]
          ]} />

          <FooterCol title="Company" links={[
            ["Manifesto", "/manifesto"],
            ["Founder story", "/founder"],
            ["Security & compliance", "/security"]
          ]} />

          <FooterCol title="Legal" links={[
            ["Terms", "/terms"],
            ["Privacy", "/privacy"]
          ]} />
        </div>

        <div className="mt-14 pt-6 border-t border-ink/8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-[12px] text-ink-300">
          <p>© 2026 Pipeline · Devin Patel · All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="dot dot-live h-1.5 w-1.5" />
            Built on the Five-layer Personal Context Model
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div className="col-span-1 md:col-span-2 space-y-3">
      <p className="eyebrow-quiet">{title}</p>
      <ul className="space-y-2 text-[13.5px]">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-ink-700 hover:text-ink transition-colors duration-fast">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/chrome/Logo";

/**
 * The shell adapts:
 *   - On marketing routes (/, /pricing, /how-it-works, /manifesto…) it shows
 *     the public nav and a primary "Open app" CTA.
 *   - On app routes (/dashboard, /approvals, /targets, /tailor, /runs,
 *     /inbox, /onboarding) it shows the in-product nav with a search hint
 *     and a tick affordance.
 */
const APP_PREFIXES = [
  "/dashboard",
  "/approvals",
  "/targets",
  "/tailor",
  "/runs",
  "/inbox",
  "/onboarding",
  "/control"
];

const APP_NAV = [
  { href: "/dashboard",  label: "Today" },
  { href: "/approvals",  label: "Approvals" },
  { href: "/inbox",      label: "Inbox" },
  { href: "/targets",    label: "Pipeline" },
  { href: "/tailor",     label: "Tailor" },
  { href: "/runs",       label: "Runs" }
];

const MARKETING_NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/plays",        label: "Plays" },
  { href: "/pricing",      label: "Pricing" },
  { href: "/manifesto",    label: "Manifesto" }
];

export function Toolbar() {
  const pathname = usePathname() ?? "/";
  const inApp = APP_PREFIXES.some((p) => pathname.startsWith(p));
  const nav = inApp ? APP_NAV : MARKETING_NAV;

  return (
    <header
      className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70"
    >
      <div className="mx-auto max-w-page px-6 h-14 flex items-center gap-6">
        <Link href={inApp ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <Logo />
          <span className="font-display font-medium tracking-tighter text-ink text-[16px] leading-none">
            Pipeline
          </span>
          {!inApp && (
            <span className="hidden sm:inline pill pill-outline ml-1">v1.1</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-5 ml-2">
          {nav.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active ? "true" : "false"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {inApp ? (
            <>
              <button
                type="button"
                aria-label="Open command palette"
                onClick={() =>
                  document.dispatchEvent(new CustomEvent("pipeline:open-command-palette"))
                }
                className="hidden sm:flex items-center gap-2 rounded-md border border-ink/10 bg-paper-50 hover:bg-paper-100 transition-colors px-2.5 py-1.5 text-[12.5px] text-ink-500"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search targets, signals…</span>
                <span className="kbd ml-3">⌘K</span>
              </button>
              <Link href="/onboarding" className="btn-ghost text-[13px]">Settings</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="btn-secondary text-[13px]">
                Open app <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/onboarding" className="btn-primary text-[13px] hidden sm:inline-flex">
                Start your search
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

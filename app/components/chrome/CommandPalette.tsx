"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Inbox,
  Calendar,
  CheckCircle2,
  Compass,
  FileText,
  Layers,
  ListChecks,
  Mail,
  Play,
  Search as SearchIcon,
  Send,
  Sparkles,
  Users,
  Zap,
  type LucideIcon
} from "lucide-react";

/**
 * ⌘K Command palette.
 *
 * Open with ⌘K / ctrl+K, /, or by clicking the search affordance in the
 * Toolbar. Filters all known actions and recent targets fuzzily; ↑/↓
 * navigates, Enter executes, Esc closes. The palette is the single source
 * of truth for "go anywhere, do anything" in the app. every new surface
 * should register a Command here when added.
 */
type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  shortcut?: string;
  run: () => void | Promise<void>;
  keywords?: string[];
};

type RecentTarget = { id: string; fullName: string; title?: string | null; company?: string | null };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [targets, setTargets] = useState<RecentTarget[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle on ⌘K / ctrl+K / "/"
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" opens (only when not focused on an input)
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Listen for an external request (Toolbar click)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener("pipeline:open-command-palette", onOpen);
    return () => document.removeEventListener("pipeline:open-command-palette", onOpen);
  }, []);

  // Lazy-load recent targets when first opened (one fetch, cached)
  useEffect(() => {
    if (!open || targets.length > 0) return;
    fetch("/api/search/targets?limit=12")
      .then((r) => (r.ok ? r.json() : { targets: [] }))
      .then((d) => setTargets(d.targets ?? []))
      .catch(() => setTargets([]));
  }, [open, targets.length]);

  // Reset query when closing; focus when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (path: string) => {
      router.push(path);
      close();
    },
    [router, close]
  );

  const runTick = useCallback(async () => {
    setBusy(true);
    try {
      await fetch("/api/agents/tick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      router.refresh();
    } finally {
      setBusy(false);
      close();
    }
  }, [router, close]);

  // Build the action list
  const baseCommands: Command[] = useMemo(
    () => [
      // Navigate
      { id: "go-control", group: "Navigate", label: "Go to Control Center", icon: Layers, shortcut: "G D", run: () => go("/dashboard"), keywords: ["dashboard", "home", "today"] },
      { id: "go-approvals", group: "Navigate", label: "Open approval queue", icon: CheckCircle2, shortcut: "G A", run: () => go("/approvals"), keywords: ["drafts", "review", "queue"] },
      { id: "go-inbox", group: "Navigate", label: "Open inbox · reply triage", icon: Inbox, shortcut: "G I", run: () => go("/inbox"), keywords: ["replies", "messages", "triage"] },
      { id: "go-targets", group: "Navigate", label: "Open pipeline · targets", icon: Users, shortcut: "G P", run: () => go("/targets"), keywords: ["pipeline", "people", "list"] },
      { id: "go-tailor", group: "Navigate", label: "Tailor a resume", icon: FileText, shortcut: "G T", run: () => go("/tailor"), keywords: ["resume", "cv"] },
      { id: "go-runs", group: "Navigate", label: "View run log", icon: ListChecks, shortcut: "G R", run: () => go("/runs"), keywords: ["observability", "spend", "cost"] },
      { id: "go-plays", group: "Navigate", label: "Browse the play library", icon: Compass, run: () => go("/plays") },
      { id: "go-pricing", group: "Navigate", label: "Pricing", icon: Mail, run: () => go("/pricing") },
      { id: "go-manifesto", group: "Navigate", label: "Manifesto", icon: Sparkles, run: () => go("/manifesto") },
      { id: "go-onboarding", group: "Navigate", label: "Settings · onboarding", icon: Compass, run: () => go("/onboarding") },

      // Actions
      { id: "act-tick", group: "Actions", label: busy ? "Running tick…" : "Run tick now", icon: Play, shortcut: "T", run: runTick, keywords: ["agents", "scout", "drafter"] },
      { id: "act-draft-cold", group: "Actions", label: "Draft cold outreach for top signal", icon: Send, run: () => go("/dashboard#signals") },
      { id: "act-prep-meeting", group: "Actions", label: "Prep next meeting brief", icon: Calendar, run: () => go("/dashboard#calendar") },
      { id: "act-review-voice", group: "Actions", label: "Review voice fidelity report", icon: Sparkles, run: () => go("/dashboard") },

      // Help
      { id: "help-shortcuts", group: "Help", label: "Show all keyboard shortcuts", icon: Zap, run: () => go("/dashboard?shortcuts=1") }
    ],
    [go, runTick, busy]
  );

  const targetCommands: Command[] = useMemo(
    () =>
      targets.map((t) => ({
        id: `tgt-${t.id}`,
        group: "Recent targets",
        label: t.fullName,
        hint: [t.title, t.company].filter(Boolean).join(" · "),
        icon: Users,
        run: () => go(`/targets/${t.id}`),
        keywords: [t.fullName, t.title ?? "", t.company ?? ""]
      })),
    [targets, go]
  );

  const filtered = useMemo(() => {
    const all = [...baseCommands, ...targetCommands];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter((c) => {
      const hay = [c.label, c.hint ?? "", ...(c.keywords ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, baseCommands, targetCommands]);

  // Group for rendering
  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of filtered) {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Keyboard nav within results
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIdx];
        if (cmd) cmd.run();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx]);

  // Reset highlight when query changes
  useEffect(() => setActiveIdx(0), [query]);

  // Scroll active row into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-cmd-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  if (!open) return null;

  let runningIdx = -1;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />
      <div className="relative w-full max-w-[640px] rounded-xl bg-paper border border-ink/12 shadow-lift overflow-hidden animate-rise-in">
        <div className="flex items-center gap-3 px-4 h-12 border-b border-ink/8">
          <SearchIcon className="h-4 w-4 text-ink-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions, targets, pages…"
            className="flex-1 !border-0 !bg-transparent !p-0 text-[15px] text-ink placeholder:text-ink-300 !shadow-none focus:!ring-0"
          />
          <span className="kbd">esc</span>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {grouped.length === 0 && (
            <p className="px-4 py-10 text-center text-[13px] text-ink-500">
              No matches. Try{" "}
              <span className="text-ink-700">"approvals"</span>,{" "}
              <span className="text-ink-700">"tick"</span>, or a target name.
            </p>
          )}
          {grouped.map(([group, items]) => (
            <div key={group} className="mb-1">
              <p className="eyebrow-quiet px-4 py-2">{group}</p>
              <ul>
                {items.map((c) => {
                  runningIdx += 1;
                  const idx = runningIdx;
                  const active = idx === activeIdx;
                  const Icon = c.icon;
                  return (
                    <li key={c.id}>
                      <button
                        data-cmd-idx={idx}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => c.run()}
                        className={`w-full text-left grid grid-cols-[24px_1fr_auto] items-center gap-3 px-4 py-2.5 transition-colors duration-fast ${
                          active ? "bg-paper-100" : "hover:bg-paper-50"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-accent" : "text-ink-500"}`} />
                        <span className="min-w-0">
                          <span className="block text-[13.5px] text-ink truncate">{c.label}</span>
                          {c.hint && (
                            <span className="block text-[12px] text-ink-500 truncate">{c.hint}</span>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {c.shortcut && <span className="kbd">{c.shortcut}</span>}
                          <ArrowRight
                            className={`h-3.5 w-3.5 transition-opacity duration-fast ${
                              active ? "opacity-100 text-ink-700" : "opacity-0"
                            }`}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between px-4 py-2.5 border-t border-ink/8 bg-paper-50 text-[11px] text-ink-500">
          <span className="flex items-center gap-3">
            <span><span className="kbd">↑</span> <span className="kbd">↓</span> navigate</span>
            <span><span className="kbd">↵</span> select</span>
          </span>
          <span><span className="kbd">⌘</span><span className="kbd">K</span> toggle</span>
        </footer>
      </div>
    </div>
  );
}

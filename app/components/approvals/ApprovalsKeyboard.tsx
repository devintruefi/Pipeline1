"use client";
/**
 * ApprovalsKeyboard. Mounts a global keydown listener on the /approvals page
 * and turns the daily ritual from "click each card" into "fly through with
 * keystrokes."
 *
 *   J / ↓        next draft
 *   K / ↑        prev draft
 *   A            approve current
 *   R            reject current
 *   E            focus current draft body for inline edit
 *   ⇧A           approve every green draft on the page
 *   ?            toggle a tiny help overlay
 *
 * The card components (ApprovalCard) carry data-draft-id, data-draft-risk,
 * data-approve, and data-reject hooks. This wrapper just orchestrates them.
 */
import { useEffect, useState, useCallback } from "react";
import { toast } from "@/lib/toast";

export function ApprovalsKeyboard() {
  const [showHelp, setShowHelp] = useState(false);

  const focusedCard = useCallback((): HTMLElement | null => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-draft-id]"));
    if (cards.length === 0) return null;
    const focused = cards.find((c) => c.getAttribute("data-focused") === "true");
    return focused ?? cards[0];
  }, []);

  const setFocused = useCallback((card: HTMLElement | null) => {
    if (!card) return;
    document
      .querySelectorAll<HTMLElement>("[data-draft-id][data-focused='true']")
      .forEach((el) => el.removeAttribute("data-focused"));
    card.setAttribute("data-focused", "true");
    card.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const move = useCallback(
    (delta: number) => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-draft-id]"));
      if (cards.length === 0) return;
      const current = focusedCard();
      const idx = current ? cards.indexOf(current) : 0;
      const next = (idx + delta + cards.length) % cards.length;
      setFocused(cards[next]);
    },
    [focusedCard, setFocused]
  );

  const click = useCallback(
    (selector: "[data-approve]" | "[data-reject]") => {
      const card = focusedCard();
      if (!card) return;
      const btn = card.querySelector<HTMLButtonElement>(selector);
      if (btn && !btn.disabled) btn.click();
    },
    [focusedCard]
  );

  const focusEdit = useCallback(() => {
    const card = focusedCard();
    if (!card) return;
    const ta = card.querySelector<HTMLTextAreaElement>("textarea");
    ta?.focus();
  }, [focusedCard]);

  const approveAllGreen = useCallback(() => {
    const greens = Array.from(
      document.querySelectorAll<HTMLElement>("[data-draft-id][data-draft-risk='green']")
    );
    if (greens.length === 0) {
      toast({ type: "info", message: "No green drafts to approve." });
      return;
    }
    toast({
      id: "bulk-approve",
      type: "pending",
      message: `Approving ${greens.length} green draft${greens.length === 1 ? "" : "s"}…`,
      detail: "Sending in sequence so retries are clean."
    });
    greens.forEach((card, i) => {
      const btn = card.querySelector<HTMLButtonElement>("[data-approve]");
      if (btn) {
        window.setTimeout(() => btn.click(), i * 250);
      }
    });
    window.setTimeout(() => {
      toast({
        id: "bulk-approve",
        type: "success",
        message: `Sent ${greens.length} green draft${greens.length === 1 ? "" : "s"}`,
        detail: "Pipeline is processing each through Sender."
      });
    }, greens.length * 250 + 200);
  }, []);

  useEffect(() => {
    function isTyping() {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      return tag === "input" || tag === "textarea";
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isTyping()) {
        (document.activeElement as HTMLElement | null)?.blur();
        return;
      }
      if (isTyping()) return;
      const k = e.key.toLowerCase();
      if (k === "j" || k === "arrowdown") { e.preventDefault(); move(1); return; }
      if (k === "k" || k === "arrowup")   { e.preventDefault(); move(-1); return; }
      if (k === "a" && e.shiftKey)        { e.preventDefault(); approveAllGreen(); return; }
      if (k === "a")                      { e.preventDefault(); click("[data-approve]"); return; }
      if (k === "r")                      { e.preventDefault(); click("[data-reject]"); return; }
      if (k === "e")                      { e.preventDefault(); focusEdit(); return; }
      if (k === "?")                      { e.preventDefault(); setShowHelp((s) => !s); return; }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [move, click, focusEdit, approveAllGreen]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-draft-id]"));
    if (cards.length > 0 && !cards.some((c) => c.getAttribute("data-focused") === "true")) {
      cards[0].setAttribute("data-focused", "true");
    }
  }, []);

  if (!showHelp) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 card p-4 shadow-lift max-w-xs animate-rise-in">
      <p className="eyebrow mb-2">Keyboard</p>
      <ul className="text-[12.5px] text-ink-700 space-y-1.5">
        <li><kbd className="kbd">J</kbd> / <kbd className="kbd">K</kbd> next / prev</li>
        <li><kbd className="kbd">A</kbd> approve current</li>
        <li><kbd className="kbd">R</kbd> reject current</li>
        <li><kbd className="kbd">E</kbd> edit body</li>
        <li><kbd className="kbd">⇧</kbd>+<kbd className="kbd">A</kbd> approve all green</li>
        <li><kbd className="kbd">?</kbd> toggle this</li>
      </ul>
    </div>
  );
}

"use client";
/**
 * Global Toaster. Listens to "pipeline:toast" CustomEvents on document and
 * renders a stack in the bottom-right. Each toast slides in, sits for its
 * duration, then slides out. Supports a primary action (retry / undo) and
 * an "id" so an in-flight pending toast can be replaced by its outcome
 * without stacking.
 */
import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Info,
  X
} from "lucide-react";
import { TOAST_EVENT, type ToastPayload } from "@/lib/toast";

interface Item extends ToastPayload {
  id: string;
  enteredAt: number;
}

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  pending: Loader2,
  info: Info
} as const;

const TONE = {
  success: "border-signal-green/40 text-signal-green",
  error: "border-signal-red/40 text-signal-red",
  pending: "border-accent/30 text-accent",
  info: "border-ink/12 text-ink-700"
} as const;

let _idSeq = 0;

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    function onEvent(e: Event) {
      const ce = e as CustomEvent<ToastPayload & { dismiss?: true }>;
      const payload = ce.detail;
      if (!payload) return;

      if ((payload as { dismiss?: boolean }).dismiss && payload.id) {
        remove(payload.id);
        return;
      }

      const id = payload.id ?? `t${++_idSeq}`;
      const duration = payload.duration ?? (payload.type === "pending" ? 0 : 4500);

      setItems((prev) => {
        const existing = prev.findIndex((t) => t.id === id);
        const next: Item = { ...payload, id, enteredAt: Date.now() };
        if (existing >= 0) {
          const cp = [...prev];
          cp[existing] = next;
          return cp;
        }
        return [...prev, next];
      });

      if (duration > 0) {
        window.setTimeout(() => remove(id), duration);
      }
    }
    document.addEventListener(TOAST_EVENT, onEvent as EventListener);
    return () => document.removeEventListener(TOAST_EVENT, onEvent as EventListener);
  }, [remove]);

  if (items.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-[380px] pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {items.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl border bg-paper-50 shadow-lift backdrop-blur-sm flex items-start gap-3 px-3.5 py-3 animate-rise-in ${TONE[t.type]}`}
          >
            <Icon
              className={`h-4 w-4 mt-0.5 shrink-0 ${
                t.type === "pending" ? "animate-spin" : ""
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink leading-snug">
                {t.message}
              </p>
              {t.detail && (
                <p className="mt-0.5 text-[12px] text-ink-500 leading-snug">
                  {t.detail}
                </p>
              )}
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.onClick();
                    remove(t.id);
                  }}
                  className="mt-2 text-[12px] font-medium text-accent hover:text-accent-700 underline-offset-2 hover:underline"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => remove(t.id)}
              className="shrink-0 rounded p-1 text-ink-400 hover:text-ink-700 hover:bg-ink/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

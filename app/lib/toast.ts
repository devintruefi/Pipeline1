/**
 * Tiny global toast bus.
 *
 * Any client component can fire toast({type, message, action?}) and the
 * <Toaster /> mounted in the root layout will render it. We use a CustomEvent
 * on `document` so we don't need a context provider, and components don't
 * need to import a hook.
 *
 * Reduce-motion users get the toast without the slide-in animation.
 */

export type ToastType = "success" | "error" | "info" | "pending";

export interface ToastPayload {
  type: ToastType;
  message: string;
  /** Optional secondary line, e.g. "Sent to maya@helix.io at 9:47 AM" */
  detail?: string;
  /** Optional retry / undo action surfaced as a small button on the toast. */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** ms before auto-dismiss. 0 keeps it open until dismissed manually. */
  duration?: number;
  /** Optional id so a follow-up toast (success after pending) can replace
   *  an in-flight one without stacking. */
  id?: string;
}

export const TOAST_EVENT = "pipeline:toast";

export function toast(payload: ToastPayload) {
  if (typeof document === "undefined") return;
  document.dispatchEvent(
    new CustomEvent<ToastPayload>(TOAST_EVENT, { detail: payload })
  );
}

export function dismissToast(id: string) {
  if (typeof document === "undefined") return;
  document.dispatchEvent(
    new CustomEvent<{ id: string; dismiss: true }>(TOAST_EVENT, {
      detail: { id, dismiss: true } as never
    })
  );
}

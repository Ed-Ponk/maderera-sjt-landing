"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

const FOCUSABLES =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  mensaje: string;
  confirmarLabel: string;
  advertencia?: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  mensaje,
  confirmarLabel,
  advertencia,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLES)
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    cancelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = overflow;
      previousFocus?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 md:p-10">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby="confirm-dialog-mensaje"
        tabIndex={-1}
        className="w-full max-w-md bg-surface-container-lowest border-2 border-outline-variant shadow-plate-lg outline-none mt-24 md:mt-32"
      >
        <div className="flex items-center gap-3 border-b-2 border-error px-6 py-4">
          <AlertTriangle className="w-5 h-5 text-error shrink-0" />
          <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
            {title}
          </h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p id="confirm-dialog-mensaje" className="font-sans text-sm text-on-surface leading-relaxed">
            {mensaje}
          </p>
          {advertencia && (
            <p className="border-2 border-error/40 bg-error/10 px-3 py-2 font-sans text-sm text-error">
              {advertencia}
            </p>
          )}
          {error && (
            <p className="font-sans text-sm text-error" role="alert">
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="border-2 border-outline-variant font-sans text-sm font-bold uppercase tracking-wide py-2 px-5 text-on-surface hover:border-primary disabled:opacity-60 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="bg-error text-on-error font-sans text-sm font-bold uppercase tracking-wide py-2 px-5 disabled:opacity-60 cursor-pointer"
            >
              {busy ? "Eliminando…" : confirmarLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

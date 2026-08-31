"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const FOCUSABLES =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const ModalContext = createContext<(() => void) | null>(null);

export function useModalClose(): (() => void) | null {
  return useContext(ModalContext);
}

export function Modal({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        router.back();
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
  return () => {
    window.removeEventListener("keydown", handleKey);
    document.body.style.overflow = overflow;
    previousFocus?.focus?.();
  };
}, [router]);

  const close = () => {
    router.back();
    router.refresh();
  };

  return (
    <ModalContext.Provider value={close}>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 md:p-10">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-surface-container-lowest border-2 border-outline-variant shadow-plate-lg outline-none"
        >
          <div className="flex items-center justify-between border-b-2 border-primary px-6 py-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              {title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </ModalContext.Provider>
  );
}

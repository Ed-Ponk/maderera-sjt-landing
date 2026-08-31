"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE } from "@/admin/lib/pagination";

export function Pagination({ page, total }: { page: number; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (pages <= 1) return null;

  function go(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    router.push(`?${params.toString()}`);
  }

  const buttons: number[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) buttons.push(p);
  }

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-1 font-mono text-sm"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="flex items-center gap-1 px-3 py-1.5 border-2 border-outline-variant text-on-surface hover:border-secondary disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-3 py-1.5 border-2 border-outline-variant text-on-surface-variant">
        Página {page} de {pages}
      </span>
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pages}
        aria-label="Página siguiente"
        className="flex items-center gap-1 px-3 py-1.5 border-2 border-outline-variant text-on-surface hover:border-secondary disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

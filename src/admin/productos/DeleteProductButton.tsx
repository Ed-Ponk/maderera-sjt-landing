"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProducto } from "./actions";
import { ConfirmDialog } from "@/admin/ui/ConfirmDialog";

export function DeleteProductButton({
  productoId,
  nombre,
}: {
  productoId: string;
  nombre: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    const res = await deleteProducto(productoId);
    if (res.ok) {
      setConfirmOpen(false);
      router.refresh();
    } else {
      setBusy(false);
      setError(res.message ?? "No se pudo eliminar");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="text-error hover:opacity-80 cursor-pointer"
        aria-label={`Eliminar ${nombre}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        mensaje={`¿Eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`}
        confirmarLabel="Eliminar"
        busy={busy}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!busy) {
            setConfirmOpen(false);
            setError(null);
          }
        }}
      />
    </>
  );
}

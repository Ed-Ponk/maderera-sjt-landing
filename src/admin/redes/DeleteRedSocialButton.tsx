"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteRedSocial } from "./actions";
import { ConfirmDialog } from "@/admin/ui/ConfirmDialog";

export function DeleteRedSocialButton({
  redId,
  nombre,
}: {
  redId: string;
  nombre: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    const res = await deleteRedSocial(redId);
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
        title="Eliminar red social"
        mensaje={`¿Eliminar la red social "${nombre}"? Esta acción no se puede deshacer.`}
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

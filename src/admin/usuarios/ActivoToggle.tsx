"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setActivo } from "./actions";

export function ActivoToggle({
  usuarioId,
  activo,
  esUltimoAdmin,
}: {
  usuarioId: string;
  activo: boolean;
  esUltimoAdmin: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={activo}
          disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            setError(null);
            const res = await setActivo(usuarioId, e.target.checked);
            setBusy(false);
            if (res.ok) {
              router.refresh();
            } else {
              setError(res.message ?? "No se pudo actualizar");
            }
          }}
          className="w-4 h-4"
          aria-label={`Activo ${activo ? "on" : "off"}`}
        />
        <span className="font-sans text-sm text-on-surface">
          {activo ? "Activo" : "Inactivo"}
        </span>
      </label>
      {esUltimoAdmin && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-error">
          Único admin activo
        </span>
      )}
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

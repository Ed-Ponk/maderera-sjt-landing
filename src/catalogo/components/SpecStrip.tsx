import React from "react";
import { TipoProducto } from "@/shared/lib/types";
import { Ruler, Droplets, Box, TreePine } from "lucide-react";

interface SpecStripProps {
  tipoProducto: TipoProducto;
  tipoMadera?: string | null;
  densidad?: string | null;
  humedad?: string | null;
  medidasDisplay?: string | null;
}

export function SpecStrip({
  tipoProducto,
  tipoMadera,
  densidad,
  humedad,
  medidasDisplay,
}: SpecStripProps) {
  // REGLA DE NEGOCIO: Omitir tipoMadera completamente si el producto es un tablero procesado o si tipoMadera es nulo
  const showTipoMadera =
    tipoProducto !== "TABLERO_PROCESADO" &&
    tipoMadera !== null &&
    tipoMadera !== undefined &&
    tipoMadera.trim().length > 0;

  const rows: { icon: typeof Ruler; label: string; value: string }[] = [];

  if (medidasDisplay) {
    rows.push({ icon: Ruler, label: "Medidas", value: medidasDisplay });
  }
  if (showTipoMadera) {
    rows.push({ icon: TreePine, label: "Especie", value: tipoMadera! });
  }
  if (densidad) {
    rows.push({ icon: Box, label: "Densidad", value: densidad });
  }
  if (humedad) {
    rows.push({ icon: Droplets, label: "Humedad", value: humedad });
  }

  if (rows.length === 0) return null;

  return (
    <dl className="flex flex-col divide-y divide-outline-variant border-y border-outline-variant">
      {rows.map((r) => {
        const Icon = r.icon;
        return (
          <div key={r.label} className="flex items-center justify-between gap-3 py-1.5">
            <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              <Icon className="w-3.5 h-3.5 text-accent-deep shrink-0" strokeWidth={2} />
              {r.label}
            </dt>
            <dd className="font-mono text-xs font-semibold text-on-surface text-right">
              {r.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

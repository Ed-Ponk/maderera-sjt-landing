"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductFiltersProps {
  maderasDisponibles: string[];
}

export function ProductFilters({ maderasDisponibles }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMadera = searchParams.get("madera") || "";
  const currentEspesorMin = searchParams.get("espesorMin") || "";
  const currentEspesorMax = searchParams.get("espesorMax") || "";

  const [madera, setMadera] = useState(currentMadera);
  const [espesorMin, setEspesorMin] = useState(currentEspesorMin);
  const [espesorMax, setEspesorMax] = useState(currentEspesorMax);

  useEffect(() => {
    setMadera(searchParams.get("madera") || "");
    setEspesorMin(searchParams.get("espesorMin") || "");
    setEspesorMax(searchParams.get("espesorMax") || "");
  }, [searchParams]);

  const applyFilters = (newMadera?: string, newEspMin?: string, newEspMax?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const finalMadera = newMadera !== undefined ? newMadera : madera;
    const finalEspMin = newEspMin !== undefined ? newEspMin : espesorMin;
    const finalEspMax = newEspMax !== undefined ? newEspMax : espesorMax;

    if (finalMadera) params.set("madera", finalMadera);
    else params.delete("madera");

    if (finalEspMin) params.set("espesorMin", finalEspMin);
    else params.delete("espesorMin");

    if (finalEspMax) params.set("espesorMax", finalEspMax);
    else params.delete("espesorMax");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setMadera("");
    setEspesorMin("");
    setEspesorMax("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("madera");
    params.delete("espesorMin");
    params.delete("espesorMax");
    router.push(`${pathname}?${params.toString()}`);
  };

  const inputCls =
    "w-full bg-surface-container-lowest border-2 border-outline-variant text-on-surface text-xs font-semibold py-2 px-3 focus:outline-none focus:border-secondary transition-colors";

  return (
    <div className="bg-surface-container-lowest p-4 md:p-6 border-2 border-outline-variant shadow-plate flex flex-col gap-5">
      <div className="flex justify-between items-center pb-2 border-b-2 border-primary">
        <div className="flex items-center gap-2 font-display text-xl uppercase tracking-wide text-primary">
          <SlidersHorizontal className="w-5 h-5 text-accent-deep" strokeWidth={2} />
          <span>Filtros de Catálogo</span>
        </div>
        {(currentMadera || currentEspesorMin || currentEspesorMax) && (
          <button
            onClick={handleReset}
            className="text-xs text-on-surface-variant hover:text-secondary flex items-center gap-1 cursor-pointer transition-colors font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
        {maderasDisponibles.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Especie de Madera
            </label>
            <select
              value={madera}
              onChange={(e) => {
                const val = e.target.value;
                setMadera(val);
                applyFilters(val);
              }}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="">Todas las especies</option>
              {maderasDisponibles.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Espesor Mín. (mm)
          </label>
          <input
            type="number"
            placeholder="Ej. 20"
            value={espesorMin}
            onChange={(e) => setEspesorMin(e.target.value)}
            onBlur={() => applyFilters()}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Espesor Máx. (mm)
          </label>
          <input
            type="number"
            placeholder="Ej. 60"
            value={espesorMax}
            onChange={(e) => setEspesorMax(e.target.value)}
            onBlur={() => applyFilters()}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

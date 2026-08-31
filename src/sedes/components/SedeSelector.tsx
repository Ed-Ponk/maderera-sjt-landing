"use client";

import { useSedeStore } from "@/sedes/store/useSedeStore";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { SedeOption } from "@/shared/lib/types";

interface SedeSelectorProps {
  sedes: SedeOption[];
  withLabel?: boolean;
}

export function SedeSelector({ sedes, withLabel = false }: SedeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeSedeSlug, setActiveSedeSlug } = useSedeStore();

  const currentSedeFromUrl = searchParams.get("sede") || activeSedeSlug || "";
  const validSlugs = new Set(sedes.map((s) => s.slug));
  const effectiveSedeSlug = validSlugs.has(currentSedeFromUrl)
    ? currentSedeFromUrl
    : (sedes[0]?.slug ?? "");

  useEffect(() => {
    if (effectiveSedeSlug !== activeSedeSlug) {
      setActiveSedeSlug(effectiveSedeSlug);
    }
  }, [effectiveSedeSlug, activeSedeSlug, setActiveSedeSlug]);

  const handleChange = (newSlug: string) => {
    setActiveSedeSlug(newSlug);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sede", newSlug);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {withLabel && (
        <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Filtrar por sede
        </span>
      )}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-accent-deep shrink-0" />
        <div className="relative">
          <select
            value={effectiveSedeSlug}
            onChange={(e) => handleChange(e.target.value)}
            className="appearance-none bg-surface-container-lowest border-2 border-outline-variant text-on-surface font-mono text-sm font-semibold py-2 pl-3 pr-9 focus:outline-none focus:border-secondary cursor-pointer transition-colors"
            aria-label="Seleccionar Sede"
          >
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.slug}>
                Sede {sede.nombre} {sede.esProximamente ? "(Próximamente)" : ""}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

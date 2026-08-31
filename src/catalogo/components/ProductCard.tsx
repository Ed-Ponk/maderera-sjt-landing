"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { TipoProducto, EstadoDisponibilidad } from "@/shared/lib/types";
import { SpecStrip } from "./SpecStrip";
import { CTAButton, CTAState, resolveCTAState } from "@/cotizacion/components/CTAButton";
import { useCartStore } from "@/cotizacion/store/useCartStore";
import { cn } from "@/shared/lib/utils";

export interface ProductCardData {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imagenUrl: string;
  tipoProducto: TipoProducto;
  destacado: boolean;
  tipoMadera?: string | null;
  densidad?: string | null;
  humedad?: string | null;
  medidasDisplay?: string | null;
  sedes?: {
    id: string;
    estado: EstadoDisponibilidad;
  }[];
}

interface ProductCardProps {
  producto: ProductCardData;
  activeSede: {
    id: string;
    nombre: string;
    slug: string;
    esProximamente: boolean;
  };
}

function StockStamp({ ctaState }: { ctaState: CTAState }) {
  const label =
    ctaState === "DISPONIBLE"
      ? "Disponible"
      : ctaState === "A_PEDIDO"
        ? "A Pedido"
        : ctaState === "NO_DISPONIBLE"
          ? "No disponible"
          : "Próximamente";

  return (
    <span
      className={cn(
        "absolute top-3 left-3 z-10 font-sans font-bold uppercase text-sm tracking-wide px-3 py-1.5 -rotate-3 shadow-plate",
        ctaState === "DISPONIBLE" && "bg-secondary text-on-secondary",
        ctaState === "A_PEDIDO" && "bg-primary text-on-primary",
        ctaState === "NO_DISPONIBLE" &&
          "bg-surface-container-lowest border-2 border-outline-variant text-on-surface-variant",
        ctaState === "PROXIMAMENTE" &&
          "bg-surface-container-lowest border-2 border-dashed border-tertiary text-tertiary"
      )}
    >
      {label}
    </span>
  );
}

export function ProductCard({ producto, activeSede }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // UNWRAP SEGURO DE RELACIÓN PRODUCTO-SEDE:
  // producto.sedes contiene las filas filtradas para la sede activa (0 o 1 elemento).
  const productSedeRelation = producto.sedes?.[0];

  // Lógica unificada de estado de CTA
  const ctaState = resolveCTAState(activeSede, productSedeRelation);

  const handleAddToCart = () => {
    addItem({
      productoId: producto.id,
      productoNombre: producto.nombre,
      medidasDisplay: producto.medidasDisplay,
    });
  };

  return (
    <article className="bg-surface-container-lowest border-2 border-outline-variant shadow-plate hover:border-secondary transition-colors flex flex-col h-full">
      <Link
        href={`/producto/${producto.slug}`}
        className="group relative block w-full aspect-[4/3] bg-surface-variant overflow-hidden"
      >
        <StockStamp ctaState={ctaState} />
        {producto.destacado && (
          <div className="absolute top-3 right-3 z-10 bg-background text-primary font-sans font-bold uppercase text-xs tracking-wide py-1 px-2.5 border border-outline-variant shadow-sm flex items-center gap-1">
            <BadgeCheck className="w-3 h-3 text-accent-deep" />
            <span>Calidad Premium</span>
          </div>
        )}
        <Image
          src={producto.imagenUrl}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow justify-between gap-4 border-t-2 border-primary">
        <div className="flex flex-col gap-3">
          <Link href={`/producto/${producto.slug}`} className="hover:text-secondary transition-colors">
            <h3 className="font-display text-2xl uppercase tracking-wide text-on-surface leading-tight line-clamp-1">
              {producto.nombre}
            </h3>
          </Link>

          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
            {producto.descripcion}
          </p>

          <SpecStrip
            tipoProducto={producto.tipoProducto}
            tipoMadera={producto.tipoMadera}
            densidad={producto.densidad}
            humedad={producto.humedad}
            medidasDisplay={producto.medidasDisplay}
          />
        </div>

        <div className="pt-1">
          <CTAButton ctaState={ctaState} onAddToCart={handleAddToCart} />
        </div>
      </div>
    </article>
  );
}

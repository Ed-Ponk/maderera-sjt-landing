"use client";

import React from "react";
import {
  ShoppingBag,
  CalendarClock,
  HelpCircle,
  CircleSlash,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { EstadoDisponibilidad } from "@/shared/lib/types";

export type CTAState =
  "DISPONIBLE" | "A_PEDIDO" | "NO_DISPONIBLE" | "PROXIMAMENTE";

export function resolveCTAState(
  activeSede: { esProximamente: boolean },
  productSedeRelation?: { estado: EstadoDisponibilidad },
): CTAState {
  // REGLA CLAVE: Chiclayo (esProximamente === true) activa el estado PROXIMAMENTE a TODOS los productos
  if (activeSede.esProximamente) {
    return "PROXIMAMENTE";
  }

  if (productSedeRelation?.estado === "DISPONIBLE") {
    return "DISPONIBLE";
  }

  if (productSedeRelation?.estado === "NO_DISPONIBLE") {
    return "NO_DISPONIBLE";
  }

  return "A_PEDIDO";
}

interface CTAButtonProps {
  ctaState: CTAState;
  onAddToCart: () => void;
  className?: string;
}

export function CTAButton({
  ctaState,
  onAddToCart,
  className,
}: CTAButtonProps) {
  switch (ctaState) {
    case "DISPONIBLE":
      return (
        <button
          type="button"
          onClick={onAddToCart}
          className={cn(
            "w-full bg-secondary text-on-secondary hover:brightness-95 font-display text-lg uppercase tracking-wide py-3 px-4 shadow-plate transition-[filter] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]",
            className,
          )}
          aria-label="Cotizar producto disponible"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          <span>Cotizar ahora</span>
        </button>
      );

    case "A_PEDIDO":
      return (
        <button
          type="button"
          onClick={onAddToCart}
          className={cn(
            "w-full border-2 border-primary text-primary hover:bg-primary hover:text-on-primary font-display text-lg uppercase tracking-wide py-[10px] px-4 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]",
            className,
          )}
          aria-label="Consultar disponibilidad de producto a pedido"
        >
          <HelpCircle className="w-4 h-4" strokeWidth={2} />
          <span>Consultar disponibilidad</span>
        </button>
      );

    case "NO_DISPONIBLE":
      return (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={cn(
            "w-full border-2 border-outline/30 bg-surface-container-low text-on-surface-variant/60 font-display text-lg uppercase tracking-wide py-[10px] px-4 flex items-center justify-center gap-2 cursor-not-allowed select-none",
            className,
          )}
          aria-label="Producto no disponible en esta sede"
        >
          <CircleSlash className="w-4 h-4" strokeWidth={2} />
          <span>No disponible</span>
        </button>
      );

    case "PROXIMAMENTE":
      return (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={cn(
            "w-full border-2 border-outline-variant bg-surface-container text-on-surface-variant/70 font-display text-lg uppercase tracking-wide py-[10px] px-4 flex items-center justify-center gap-2 cursor-not-allowed select-none",
            className,
          )}
          aria-label="Sede en apertura próxima"
        >
          <CalendarClock className="w-4 h-4 text-accent" strokeWidth={2} />
          <span>Sede próximamente</span>
        </button>
      );

    default:
      return null;
  }
}

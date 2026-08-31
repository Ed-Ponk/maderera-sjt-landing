"use client";

import React from "react";
import { CTAButton, resolveCTAState } from "@/cotizacion/components/CTAButton";
import { useCartStore } from "@/cotizacion/store/useCartStore";
import { EstadoDisponibilidad } from "@/shared/lib/types";

interface ProductDetailCTAProps {
  producto: {
    id: string;
    nombre: string;
    medidasDisplay?: string | null;
  };
  activeSede: {
    esProximamente: boolean;
  };
  productSedeRelation?: {
    estado: EstadoDisponibilidad;
  };
}

export function ProductDetailCTA({
  producto,
  activeSede,
  productSedeRelation,
}: ProductDetailCTAProps) {
  const addItem = useCartStore((state) => state.addItem);

  const ctaState = resolveCTAState(activeSede, productSedeRelation);

  const handleAddToCart = () => {
    addItem({
      productoId: producto.id,
      productoNombre: producto.nombre,
      medidasDisplay: producto.medidasDisplay,
    });
  };

  return (
    <div className="w-full">
      <CTAButton ctaState={ctaState} onAddToCart={handleAddToCart} className="py-4 text-sm" />
    </div>
  );
}

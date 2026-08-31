import React from "react";
import { ProductCard, ProductCardData } from "./ProductCard";

interface ProductGridProps {
  productos: ProductCardData[];
  activeSede: {
    id: string;
    nombre: string;
    slug: string;
    esProximamente: boolean;
  };
}

export function ProductGrid({ productos, activeSede }: ProductGridProps) {
  if (productos.length === 0) {
    return (
      <div className="w-full py-16 px-6 text-center bg-surface-container-lowest border-2 border-outline-variant">
        <h3 className="font-display text-3xl uppercase tracking-wide text-primary mb-3">
          No se encontraron productos
        </h3>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Prueba ajustando o limpiando los filtros de madera y dimensiones seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          activeSede={activeSede}
        />
      ))}
    </div>
  );
}

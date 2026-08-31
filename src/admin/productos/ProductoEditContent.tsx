import { prisma } from "@/shared/lib/prisma";
import { ProductForm } from "./ProductForm";
import type { ProductoFormValues } from "./schema";
import { effectiveImages } from "@/admin/lib/effective-images";

export async function ProductoEditContent({ id }: { id: string }) {
  const [producto, categorias, sedes] = await Promise.all([
    prisma.producto.findUnique({
      where: { id },
      include: {
        imagenes: { orderBy: { orden: "asc" } },
        sedes: { include: { sede: { select: { slug: true } } } },
      },
    }),
    prisma.categoria.findMany({
      orderBy: { orden: "asc" },
      select: { id: true, nombre: true },
    }),
    prisma.sede.findMany({
      where: { activa: true },
      select: { id: true, nombre: true, slug: true, esProximamente: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  if (!producto) return null;

  const initial: ProductoFormValues = {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    tipoProducto: producto.tipoProducto,
    categoriaId: producto.categoriaId,
    destacado: producto.destacado,
    tipoMadera: producto.tipoMadera ?? null,
    densidad: producto.densidad ?? null,
    humedad: producto.humedad ?? null,
    espesorMm: producto.espesorMm ?? null,
    anchoMm: producto.anchoMm ?? null,
    largoMm: producto.largoMm ?? null,
    medidasDisplay: producto.medidasDisplay ?? null,
    imagenes: effectiveImages(
      producto.imagenes.map((i) => i.url),
      producto.imagenUrl
    ),
    estadosPorSede: Object.fromEntries(
      producto.sedes.map((ps) => [ps.sede.slug, ps.estado])
    ),
  };

  return (
    <ProductForm
      categorias={categorias}
      sedes={sedes}
      initial={initial}
      productoId={producto.id}
    />
  );
}

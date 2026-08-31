import { prisma } from "@/shared/lib/prisma";

export interface ContentImageKey {
  key: string;
  label: string;
  fallback: string;
  hint?: string;
}

export const CONTENT_IMAGE_KEYS: ContentImageKey[] = [
  {
    key: "inicio_hero_imagen",
    label: "Inicio — Imagen hero",
    hint: "Fondo de la portada principal del home.",
    fallback: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80",
  },
  {
    key: "inicio_categoria_madera_imagen",
    label: "Inicio — Categoría Maderas en Tablones",
    fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  },
  {
    key: "inicio_categoria_tablero_imagen",
    label: "Inicio — Categoría Triplays y Tableros",
    fallback: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=900&q=80",
  },
  {
    key: "inicio_categoria_acabados_imagen",
    label: "Inicio — Categoría Acabados y Complementos",
    fallback: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=1200&q=80",
  },
  {
    key: "nosotros_imagen_1",
    label: "Nosotros — Imagen principal",
    hint: "Imagen del encabezado de la página Nosotros.",
    fallback: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  },
  {
    key: "nosotros_imagen_2",
    label: "Nosotros — Imagen de historia",
    hint: "Imagen de la sección Raíces Profundas.",
    fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80",
  },
];

/**
 * Devuelve un mapa key -> value con los contenidos almacenados.
 * Las claves ausentes no aparecen: los consumidores usan su fallback.
 */
export async function getContentImages(): Promise<Record<string, string>> {
  const keys = CONTENT_IMAGE_KEYS.map((c) => c.key);
  const rows = await prisma.siteContent.findMany({
    where: { key: { in: keys } },
  });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

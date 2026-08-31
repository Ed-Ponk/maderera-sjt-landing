import { prisma } from "@/shared/lib/prisma";

/**
 * Sede por defecto del sitio: la primera sede activa por `orden asc`.
 * Reemplaza cualquier slug fijo ("talara") en el fallback público, de modo
 * que si la sede principal queda inactiva, el sitio cae a la siguiente.
 */
export async function getDefaultSede() {
  return prisma.sede.findFirst({
    where: { activa: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });
}

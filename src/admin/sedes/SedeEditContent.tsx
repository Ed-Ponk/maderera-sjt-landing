import { prisma } from "@/shared/lib/prisma";
import { SedeForm } from "./SedeForm";
import type { SedeFormValues } from "./schema";
import { effectiveImages } from "@/admin/lib/effective-images";

export async function SedeEditContent({ id }: { id: string }) {
  const sede = await prisma.sede.findUnique({
    where: { id },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  if (!sede) return null;

  const initial: SedeFormValues = {
    nombre: sede.nombre,
    direccion: sede.direccion,
    telefono: sede.telefono,
    esProximamente: sede.esProximamente,
    activa: sede.activa,
    imagenes: effectiveImages(
      sede.imagenes.map((i) => i.url),
      sede.imagenUrl
    ),
  };

  return <SedeForm initial={initial} sedeId={sede.id} />;
}

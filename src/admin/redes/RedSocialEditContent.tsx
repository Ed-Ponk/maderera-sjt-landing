import { prisma } from "@/shared/lib/prisma";
import { RedSocialForm } from "./RedSocialForm";

export async function RedSocialEditContent({ id }: { id: string }) {
  const red = await prisma.redSocial.findUnique({ where: { id } });

  if (!red) {
    return (
      <p className="font-sans text-sm text-error">
        Red social no encontrada.
      </p>
    );
  }

  return (
    <RedSocialForm
      redSocialId={red.id}
      initial={{
        nombre: red.nombre,
        url: red.url,
        icono: red.icono,
        activo: red.activo,
        orden: red.orden,
      }}
    />
  );
}

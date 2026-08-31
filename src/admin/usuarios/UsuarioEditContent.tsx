import { prisma } from "@/shared/lib/prisma";
import { UserForm } from "./UserForm";

export async function UsuarioEditContent({ id }: { id: string }) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  });

  if (!usuario) return null;

  return (
    <UserForm
      initial={{
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
      }}
      usuarioId={usuario.id}
    />
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { UsuarioEditContent } from "@/admin/usuarios/UsuarioEditContent";

export const dynamic = "force-dynamic";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { nombre: true },
  });

  if (!usuario) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Usuario no encontrado
        </h1>
        <Link href="/admin/usuarios" className="text-sm text-on-surface-variant hover:underline">
          Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/usuarios"
        className="flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-on-surface w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Usuarios
      </Link>
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Editar usuario
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          {usuario.nombre}
        </p>
      </div>
      <UsuarioEditContent id={id} />
    </div>
  );
}

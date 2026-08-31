import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { ContactoEditContent } from "@/admin/contactos/ContactoEditContent";

export const dynamic = "force-dynamic";

export default async function EditarContactoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const contacto = await prisma.contacto.findUnique({
    where: { id },
    select: { nombre: true },
  });

  if (!contacto) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Contacto no encontrado
        </h1>
        <Link href="/admin/contactos" className="text-sm text-on-surface-variant hover:underline">
          Volver a contactos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/contactos"
        className="flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-on-surface w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Contactos
      </Link>
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Editar contacto
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          {contacto.nombre}
        </p>
      </div>
      <ContactoEditContent id={id} />
    </div>
  );
}

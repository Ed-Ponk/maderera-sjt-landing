import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { RedSocialEditContent } from "@/admin/redes/RedSocialEditContent";

export const dynamic = "force-dynamic";

export default async function EditarRedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const red = await prisma.redSocial.findUnique({
    where: { id },
    select: { nombre: true },
  });

  if (!red) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Red social no encontrada
        </h1>
        <Link href="/admin/redes" className="text-sm text-on-surface-variant hover:underline">
          Volver a redes sociales
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/redes"
        className="flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-on-surface w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Redes sociales
      </Link>
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Editar red social
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          {red.nombre}
        </p>
      </div>
      <RedSocialEditContent id={id} />
    </div>
  );
}

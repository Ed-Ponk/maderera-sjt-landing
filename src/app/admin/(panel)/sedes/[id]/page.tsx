import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { SedeEditContent } from "@/admin/sedes/SedeEditContent";

export const dynamic = "force-dynamic";

export default async function EditarSedePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const sede = await prisma.sede.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!sede) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Sede no encontrada
        </h1>
        <Link href="/admin/sedes" className="text-sm text-on-surface-variant hover:underline">
          Volver a sedes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/sedes"
        className="flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-on-surface w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Sedes
      </Link>
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Editar sede
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          {sede.slug}
        </p>
      </div>
      <SedeEditContent id={id} />
    </div>
  );
}

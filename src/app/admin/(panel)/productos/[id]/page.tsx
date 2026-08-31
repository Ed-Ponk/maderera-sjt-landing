import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { ProductoEditContent } from "@/admin/productos/ProductoEditContent";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!producto) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Producto no encontrado
        </h1>
        <Link href="/admin/productos" className="text-sm text-on-surface-variant hover:underline">
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/productos"
        className="flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-on-surface w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Productos
      </Link>
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Editar producto
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          {producto.slug}
        </p>
      </div>
      <ProductoEditContent id={id} />
    </div>
  );
}

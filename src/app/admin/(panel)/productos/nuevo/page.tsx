import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { ProductForm } from "@/admin/productos/ProductForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [categorias, sedes] = await Promise.all([
    prisma.categoria.findMany({
      orderBy: { orden: "asc" },
      select: { id: true, nombre: true },
    }),
    prisma.sede.findMany({
      where: { activa: true },
      select: {
        id: true,
        nombre: true,
        slug: true,
        esProximamente: true,
      },
      orderBy: { nombre: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Nuevo producto
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          Catálogo público
        </p>
      </div>
      <ProductForm categorias={categorias} sedes={sedes} />
    </div>
  );
}

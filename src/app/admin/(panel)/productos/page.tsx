import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { DeleteProductButton } from "@/admin/productos/DeleteProductButton";
import { Pagination } from "@/admin/ui/Pagination";
import { PAGE_SIZE, clampPage } from "@/admin/lib/pagination";

export const dynamic = "force-dynamic";

const TIPO_LABEL: Record<string, string> = {
  MADERA_TABLON: "Madera",
  TABLERO_PROCESADO: "Tablero",
  ACABADO: "Acabado",
};

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { page: rawPage } = await searchParams;
  const total = await prisma.producto.count();
  const page = clampPage(rawPage, total);

  const productos = await prisma.producto.findMany({
    include: {
      categoria: { select: { nombre: true } },
      sedes: {
        include: { sede: { select: { nombre: true, slug: true, esProximamente: true } } },
      },
    },
    orderBy: { nombre: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
            Productos
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
            {total} productos
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-secondary text-on-secondary font-display text-base uppercase tracking-wide py-2 px-5 flex items-center gap-2 transition-colors hover:brightness-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-on-surface-variant">Aún no hay productos.</p>
      ) : (
        <div className="bg-surface-container-lowest border-2 border-outline-variant overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-primary font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Estado por sede</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.imagenUrl ? (
                        <img
                          src={p.imagenUrl}
                          alt=""
                          className="w-12 h-12 object-cover border border-outline-variant"
                        />
                      ) : (
                        <span className="w-12 h-12 border border-outline-variant flex items-center justify-center font-mono text-xs text-outline">
                          —
                        </span>
                      )}
                      <div>
                        <p className="font-sans text-sm font-bold text-on-surface">
                          {p.nombre}
                        </p>
                        <p className="font-mono text-xs text-on-surface-variant">
                          {p.slug}
                        </p>
                        {p.destacado && (
                          <span className="font-mono text-xs text-accent-deep">
                            ★ Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-on-surface">
                    {p.categoria.nombre}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-on-surface-variant">
                    {TIPO_LABEL[p.tipoProducto]}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.sedes.map((ps) => (
                        <span
                          key={ps.sedeId}
                          className={
                            "border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider " +
                            (ps.estado === "DISPONIBLE"
                              ? "border-secondary text-on-surface"
                              : "border-outline-variant text-on-surface-variant")
                          }
                        >
                          {ps.sede.nombre}:{" "}
                          {ps.estado === "DISPONIBLE" ? "Disp." : "A pedido"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-on-surface-variant hover:text-secondary cursor-pointer"
                        aria-label={`Editar ${p.nombre}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton
                        productoId={p.id}
                        nombre={p.nombre}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} total={total} />
    </div>
  );
}

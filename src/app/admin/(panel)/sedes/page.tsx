import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { DeleteSedeButton } from "@/admin/sedes/DeleteSedeButton";
import { Pagination } from "@/admin/ui/Pagination";
import { PAGE_SIZE, clampPage } from "@/admin/lib/pagination";

export const dynamic = "force-dynamic";

export default async function AdminSedesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { page: rawPage } = await searchParams;
  const total = await prisma.sede.count();
  const page = clampPage(rawPage, total);

  const sedes = await prisma.sede.findMany({
    orderBy: { nombre: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
            Sedes
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
            {total} sedes
          </p>
        </div>
        <Link
          href="/admin/sedes/nuevo"
          className="bg-secondary text-on-secondary font-display text-base uppercase tracking-wide py-2 px-5 flex items-center gap-2 transition-colors hover:brightness-95"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </Link>
      </div>

      {sedes.length === 0 ? (
        <p className="text-on-surface-variant">Aún no hay sedes.</p>
      ) : (
        <div className="bg-surface-container-lowest border-2 border-outline-variant overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-primary font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Sede</th>
                <th className="px-4 py-3 font-medium">Dirección</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sedes.map((s) => (
                <tr key={s.id} className="border-b border-outline-variant last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {s.imagenUrl ? (
                        <img
                          src={s.imagenUrl}
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
                          {s.nombre}
                        </p>
                        <p className="font-mono text-xs text-on-surface-variant">
                          {s.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-on-surface">
                    {s.direccion}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface">
                    {s.telefono}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {!s.activa && (
                        <span className="border-2 border-outline-variant px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                          Inactiva
                        </span>
                      )}
                      <span
                        className={
                          "border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider " +
                          (s.esProximamente
                            ? "border-tertiary text-tertiary"
                            : "border-secondary text-on-surface")
                        }
                      >
                        {s.esProximamente ? "Próximamente" : "Operativa"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/sedes/${s.id}`}
                        className="text-on-surface-variant hover:text-secondary cursor-pointer"
                        aria-label={`Editar ${s.nombre}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteSedeButton sedeId={s.id} nombre={s.nombre} />
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

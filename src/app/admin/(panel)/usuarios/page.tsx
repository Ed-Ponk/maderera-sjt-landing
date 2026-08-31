import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { ActivoToggle } from "@/admin/usuarios/ActivoToggle";
import { DeleteUserButton } from "@/admin/usuarios/DeleteUserButton";
import { Pagination } from "@/admin/ui/Pagination";
import { PAGE_SIZE, clampPage } from "@/admin/lib/pagination";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { page: rawPage } = await searchParams;

  const [total, activeAdminCount] = await Promise.all([
    prisma.usuario.count(),
    prisma.usuario.count({ where: { rol: "ADMIN", activo: true } }),
  ]);
  const page = clampPage(rawPage, total);

  const usuarios = await prisma.usuario.findMany({
    orderBy: { email: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
            Usuarios
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
            Acceso al panel · rol y activación en tiempo real
          </p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="bg-secondary text-on-secondary font-display text-base uppercase tracking-wide py-2 px-5 flex items-center gap-2 transition-colors hover:brightness-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </Link>
      </div>

      <div className="bg-surface-container-lowest border-2 border-outline-variant overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-primary font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const esUltimoAdmin =
                u.rol === "ADMIN" && u.activo && activeAdminCount === 1;
              return (
                <tr key={u.id} className="border-b border-outline-variant last:border-b-0">
                  <td className="px-4 py-3 font-sans text-sm font-bold text-on-surface">
                    {u.nombre}
                    {u.id === user.id && (
                      <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                        (vos)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider " +
                        (u.rol === "ADMIN"
                          ? "border-tertiary text-on-surface"
                          : "border-outline-variant text-on-surface-variant")
                      }
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ActivoToggle
                      usuarioId={u.id}
                      activo={u.activo}
                      esUltimoAdmin={esUltimoAdmin}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/usuarios/${u.id}`}
                        className="text-on-surface-variant hover:text-secondary cursor-pointer"
                        aria-label={`Editar ${u.nombre}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteUserButton usuarioId={u.id} nombre={u.nombre} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} />
    </div>
  );
}

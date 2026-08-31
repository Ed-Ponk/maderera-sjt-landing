import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { DeleteRedSocialButton } from "@/admin/redes/DeleteRedSocialButton";
import { ICONOS_REDES } from "@/admin/redes/schema";

export const dynamic = "force-dynamic";

export default async function AdminRedesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const redes = await prisma.redSocial.findMany({
    orderBy: [{ activo: "desc" }, { orden: "asc" }, { nombre: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
            Redes sociales
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
            Enlaces del footer del sitio
          </p>
        </div>
        <Link
          href="/admin/redes/nuevo"
          className="bg-secondary text-on-secondary font-display text-base uppercase tracking-wide py-2 px-5 flex items-center gap-2 transition-colors hover:brightness-95"
        >
          <Plus className="w-4 h-4" />
          Nueva red
        </Link>
      </div>

      {redes.length === 0 ? (
        <p className="text-on-surface-variant">
          Aún no hay redes sociales. Creá las redes que se mostrarán en el footer.
        </p>
      ) : (
        <div className="bg-surface-container-lowest border-2 border-outline-variant overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-primary font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium">Icono</th>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {redes.map((r) => (
                <tr key={r.id} className="border-b border-outline-variant last:border-b-0">
                  <td className="px-4 py-3 font-sans text-sm font-bold text-on-surface">
                    {r.nombre}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-on-surface-variant">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {r.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-on-surface-variant">
                    {ICONOS_REDES.find((i) => i.value === r.icono)?.label ?? r.icono}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-on-surface">{r.orden}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider " +
                        (r.activo
                          ? "border-secondary text-on-surface"
                          : "border-outline-variant text-on-surface-variant")
                      }
                    >
                      {r.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/redes/${r.id}`}
                        className="text-on-surface-variant hover:text-secondary cursor-pointer"
                        aria-label={`Editar ${r.nombre}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteRedSocialButton redId={r.id} nombre={r.nombre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

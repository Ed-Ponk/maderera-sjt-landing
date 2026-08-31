import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { formatWhatsAppNumber } from "@/cotizacion/lib/whatsapp";
import { DeleteContactoButton } from "@/admin/contactos/DeleteContactoButton";
import { Pagination } from "@/admin/ui/Pagination";
import { PAGE_SIZE, clampPage } from "@/admin/lib/pagination";

export const dynamic = "force-dynamic";

export default async function AdminContactosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { page: rawPage } = await searchParams;
  const total = await prisma.contacto.count();
  const page = clampPage(rawPage, total);

  const contactos = await prisma.contacto.findMany({
    orderBy: { nombre: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
            Contactos
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
            Líneas generales para recibir cotizaciones
          </p>
        </div>
        <Link
          href="/admin/contactos/nuevo"
          className="bg-secondary text-on-secondary font-display text-base uppercase tracking-wide py-2 px-5 flex items-center gap-2 transition-colors hover:brightness-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </Link>
      </div>

      {contactos.length === 0 ? (
        <p className="text-on-surface-variant">
          Aún no hay contactos. El cotizador usará los números de la configuración (env) como respaldo.
        </p>
      ) : (
        <div className="bg-surface-container-lowest border-2 border-outline-variant overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-primary font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Cargo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((c) => (
                <tr key={c.id} className="border-b border-outline-variant last:border-b-0">
                  <td className="px-4 py-3 font-sans text-sm font-bold text-on-surface">
                    {c.nombre}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface">
                    {formatWhatsAppNumber(c.whatsapp)}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-on-surface-variant">
                    {c.cargo ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider " +
                        (c.activo
                          ? "border-secondary text-on-surface"
                          : "border-outline-variant text-on-surface-variant")
                      }
                    >
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/contactos/${c.id}`}
                        className="text-on-surface-variant hover:text-secondary cursor-pointer"
                        aria-label={`Editar ${c.nombre}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteContactoButton contactoId={c.id} nombre={c.nombre} />
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

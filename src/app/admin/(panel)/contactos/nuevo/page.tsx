import { redirect } from "next/navigation";
import { getCurrentUser } from "@/admin/auth/current-user";
import { ContactoForm } from "@/admin/contactos/ContactoForm";

export const dynamic = "force-dynamic";

export default async function NuevoContactoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Nuevo contacto
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          Línea de cotización
        </p>
      </div>
      <ContactoForm />
    </div>
  );
}

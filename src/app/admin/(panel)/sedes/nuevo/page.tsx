import { redirect } from "next/navigation";
import { getCurrentUser } from "@/admin/auth/current-user";
import { SedeForm } from "@/admin/sedes/SedeForm";

export const dynamic = "force-dynamic";

export default async function NuevaSedePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Nueva sede
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          Puntos de atención
        </p>
      </div>
      <SedeForm />
    </div>
  );
}

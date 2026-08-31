import { redirect } from "next/navigation";
import { getAuthState } from "@/admin/auth/current-user";
import { AdminShell } from "@/admin/layout/AdminShell";

export default async function AdminLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const state = await getAuthState();

  if (state.kind === "anonymous") redirect("/admin/login");
  if (state.kind === "expired") redirect("/admin/login?expired=1");

  return (
    <>
      <AdminShell usuario={{ nombre: state.user.nombre, rol: state.user.rol }}>
        {children}
      </AdminShell>
      {modal}
    </>
  );
}

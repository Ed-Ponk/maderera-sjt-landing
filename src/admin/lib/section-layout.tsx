import { redirect } from "next/navigation";
import { getAuthState } from "@/admin/auth/current-user";

export default async function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = await getAuthState();
  if (state.kind === "anonymous") redirect("/admin/login");
  if (state.kind === "expired") redirect("/admin/login?expired=1");
  if (state.user.rol !== "ADMIN") redirect("/admin/productos");
  return <>{children}</>;
}

import { auth } from "@/admin/auth/auth";
import { prisma } from "@/shared/lib/prisma";
import type { Rol } from "@prisma/client";

export interface CurrentUser {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
}

export type AuthState =
  | { kind: "authenticated"; user: CurrentUser }
  | { kind: "anonymous" }
  | { kind: "expired" };

/**
 * Autoridad de cada request server-side. El JWT solo identifica;
 * el rol y el campo activo se releen de la BD en tiempo real, de modo
 * que desactivar un usuario revoca su sesión en el siguiente request.
 * "expired" = hay sesión pero el usuario ya no es válido/activo.
 */
export async function getAuthState(): Promise<AuthState> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return { kind: "anonymous" };

  const user = await prisma.usuario.findUnique({ where: { id } });
  if (!user || !user.activo) return { kind: "expired" };

  return {
    kind: "authenticated",
    user: { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
  };
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const state = await getAuthState();
  return state.kind === "authenticated" ? state.user : null;
}

export async function requireRole(rol: Rol): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autenticado");
  if (user.rol !== rol) throw new Error("Acceso restringido");
  return user;
}

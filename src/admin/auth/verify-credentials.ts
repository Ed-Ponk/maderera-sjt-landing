import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";

/**
 * Ejecuta SOLO en runtime Node (no edge). Valida credenciales contra la BD:
 * el JWT no tiene autoridad; aquí se re-chequea activo en cada login.
 */
export async function verifyCredentials(
  credentials: Partial<Record<"email" | "password", unknown>>
) {
  const email =
    typeof credentials?.email === "string"
      ? credentials.email.toLowerCase().trim()
      : "";
  const password =
    typeof credentials?.password === "string" ? credentials.password.trim() : "";

  if (!email || !password) return null;

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user || !user.activo) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.nombre,
    rol: user.rol,
  };
}

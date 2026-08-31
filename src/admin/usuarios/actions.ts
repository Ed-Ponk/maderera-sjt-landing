"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireRole } from "@/admin/auth/current-user";
import { hashPassword } from "@/admin/auth/password";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  type UpdateUsuarioValues,
  type UsuarioFormFieldErrors,
  type UsuarioFormValues,
} from "./schema";

export type UsuarioActionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: UsuarioFormFieldErrors };

function flattenErrors(error: z.ZodError): UsuarioFormFieldErrors {
  const result: UsuarioFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof UsuarioFormValues;
    if (!result[key]) result[key] = [];
    result[key]!.push(issue.message);
  }
  return result;
}

function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
}

async function authorizeUsuarioEditor() {
  try {
    return await requireRole("ADMIN");
  } catch {
    redirect("/admin/login");
  }
}

/**
 * Protección anti auto-bloqueo: no se puede desactivar, borrar ni degradar
 * (a VENDEDOR) al ÚLTIMO admin activo del sistema. Devuelve un mensaje de error
 * o null si la operación es segura.
 */
async function ensureNotLastActiveAdmin(
  targetId: string
): Promise<string | null> {
  const target = await prisma.usuario.findUnique({
    where: { id: targetId },
    select: { rol: true, activo: true },
  });
  if (!target || target.rol !== "ADMIN" || !target.activo) return null;

  const others = await prisma.usuario.count({
    where: { rol: "ADMIN", activo: true, id: { not: targetId } },
  });
  if (others === 0) {
    return "No se puede desactivar/eliminar al único admin activo del sistema";
  }
  return null;
}

export async function createUsuario(
  input: UsuarioFormValues
): Promise<UsuarioActionResult> {
  await authorizeUsuarioEditor();

  const parsed = createUsuarioSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: parsed.data.nombre,
        email: parsed.data.email.toLowerCase(),
        passwordHash: await hashPassword(parsed.data.password),
        rol: parsed.data.rol,
        activo: parsed.data.activo,
      },
      select: { id: true },
    });

    revalidatePath("/admin/usuarios");
    return { ok: true };
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, fieldErrors: { email: ["Ya existe un usuario con ese email"] } };
    }
    throw e;
  }
}

export async function updateUsuario(
  id: string,
  input: UpdateUsuarioValues
): Promise<UsuarioActionResult> {
  await authorizeUsuarioEditor();

  const parsed = updateUsuarioSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const exists = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return { ok: false, message: "Usuario no encontrado" };

  // Protección: un rol degradado a VENDEDOR o un admin desactivado reduce el
  // número de admins activos; no permitirlo si sería el último.
  if (parsed.data.rol !== "ADMIN" || parsed.data.activo === false) {
    const blocked = await ensureNotLastActiveAdmin(id);
    if (blocked) return { ok: false, message: blocked };
  }

  try {
    await prisma.usuario.update({
      where: { id },
      data: {
        nombre: parsed.data.nombre,
        email: parsed.data.email.toLowerCase(),
        rol: parsed.data.rol,
        activo: parsed.data.activo,
        ...(parsed.data.password
          ? { passwordHash: await hashPassword(parsed.data.password) }
          : {}),
      },
    });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, fieldErrors: { email: ["Ya existe un usuario con ese email"] } };
    }
    throw e;
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function setActivo(
  id: string,
  activo: boolean
): Promise<UsuarioActionResult> {
  await authorizeUsuarioEditor();

  const exists = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return { ok: false, message: "Usuario no encontrado" };

  if (!activo) {
    const blocked = await ensureNotLastActiveAdmin(id);
    if (blocked) return { ok: false, message: blocked };
  }

  await prisma.usuario.update({ where: { id }, data: { activo } });

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function deleteUsuario(
  id: string
): Promise<UsuarioActionResult> {
  await authorizeUsuarioEditor();

  const exists = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return { ok: false, message: "Usuario no encontrado" };

  const blocked = await ensureNotLastActiveAdmin(id);
  if (blocked) return { ok: false, message: blocked };

  await prisma.usuario.delete({ where: { id } });

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

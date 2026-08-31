"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireRole } from "@/admin/auth/current-user";
import {
  redSocialFormSchema,
  type RedSocialFormFieldErrors,
  type RedSocialFormValues,
} from "./schema";

export type RedSocialActionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: RedSocialFormFieldErrors };

function flattenErrors(error: z.ZodError): RedSocialFormFieldErrors {
  const result: RedSocialFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof RedSocialFormValues;
    if (!result[key]) result[key] = [];
    result[key]!.push(issue.message);
  }
  return result;
}

async function authorizeRedesEditor() {
  try {
    return await requireRole("ADMIN");
  } catch {
    redirect("/admin/login");
  }
}

export async function createRedSocial(
  input: RedSocialFormValues
): Promise<RedSocialActionResult> {
  await authorizeRedesEditor();

  const parsed = redSocialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  await prisma.redSocial.create({
    data: {
      nombre: parsed.data.nombre,
      url: parsed.data.url,
      icono: parsed.data.icono,
      activo: parsed.data.activo,
      orden: parsed.data.orden,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/redes");
  return { ok: true };
}

export async function updateRedSocial(
  id: string,
  input: RedSocialFormValues
): Promise<RedSocialActionResult> {
  await authorizeRedesEditor();

  const parsed = redSocialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const exists = await prisma.redSocial.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return { ok: false, message: "Red social no encontrada" };

  await prisma.redSocial.update({
    where: { id },
    data: {
      nombre: parsed.data.nombre,
      url: parsed.data.url,
      icono: parsed.data.icono,
      activo: parsed.data.activo,
      orden: parsed.data.orden,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/redes");
  return { ok: true };
}

export async function deleteRedSocial(id: string): Promise<RedSocialActionResult> {
  await authorizeRedesEditor();

  const exists = await prisma.redSocial.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return { ok: false, message: "Red social no encontrada" };

  await prisma.redSocial.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/redes");
  return { ok: true };
}

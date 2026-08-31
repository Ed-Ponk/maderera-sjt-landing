"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireRole } from "@/admin/auth/current-user";
import {
  contactoFormSchema,
  type ContactoFormFieldErrors,
  type ContactoFormValues,
} from "./schema";

export type ContactoActionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: ContactoFormFieldErrors };

function flattenErrors(error: z.ZodError): ContactoFormFieldErrors {
  const result: ContactoFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactoFormValues;
    if (!result[key]) result[key] = [];
    result[key]!.push(issue.message);
  }
  return result;
}

async function authorizeContactoEditor() {
  try {
    return await requireRole("ADMIN");
  } catch {
    redirect("/admin/login");
  }
}

export async function createContacto(
  input: ContactoFormValues
): Promise<ContactoActionResult> {
  await authorizeContactoEditor();

  const parsed = contactoFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const contacto = await prisma.contacto.create({
    data: {
      nombre: parsed.data.nombre,
      whatsapp: parsed.data.whatsapp,
      cargo: parsed.data.cargo ?? null,
      activo: parsed.data.activo,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/contactos");
  return { ok: true };
}

export async function updateContacto(
  id: string,
  input: ContactoFormValues
): Promise<ContactoActionResult> {
  await authorizeContactoEditor();

  const parsed = contactoFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const exists = await prisma.contacto.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return { ok: false, message: "Contacto no encontrado" };

  await prisma.contacto.update({
    where: { id },
    data: {
      nombre: parsed.data.nombre,
      whatsapp: parsed.data.whatsapp,
      cargo: parsed.data.cargo ?? null,
      activo: parsed.data.activo,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/contactos");
  return { ok: true };
}

export async function deleteContacto(id: string): Promise<ContactoActionResult> {
  await authorizeContactoEditor();

  const exists = await prisma.contacto.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return { ok: false, message: "Contacto no encontrado" };

  await prisma.contacto.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/contactos");
  return { ok: true };
}

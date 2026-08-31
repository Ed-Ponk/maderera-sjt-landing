"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireRole } from "@/admin/auth/current-user";
import { uniqueSlug } from "@/admin/lib/unique-slug";
import {
  sedeFormSchema,
  type SedeFormFieldErrors,
  type SedeFormValues,
} from "./schema";

export type SedeActionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: SedeFormFieldErrors };

function flattenErrors(error: z.ZodError): SedeFormFieldErrors {
  const result: SedeFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof SedeFormValues;
    if (!result[key]) result[key] = [];
    result[key]!.push(issue.message);
  }
  return result;
}

async function authorizeSedeEditor() {
  try {
    return await requireRole("ADMIN");
  } catch {
    redirect("/admin/login");
  }
}

function buildSedeData(data: SedeFormValues) {
  return {
    nombre: data.nombre,
    direccion: data.direccion,
    telefono: data.telefono,
    esProximamente: data.esProximamente,
    activa: data.activa,
  };
}

export async function createSede(
  input: SedeFormValues
): Promise<SedeActionResult> {
  await authorizeSedeEditor();

  const parsed = sedeFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.nombre, (s) =>
    prisma.sede.findUnique({ where: { slug: s }, select: { id: true } })
  );

  const imagenes = data.imagenes.length > 0 ? data.imagenes : null;

  const sede = await prisma.sede.create({
    data: {
      ...buildSedeData(data),
      slug,
      imagenUrl: imagenes?.[0] ?? null,
      imagenes: imagenes
        ? { create: imagenes.map((url, i) => ({ url, orden: i })) }
        : undefined,
    },
  });

  revalidatePath("/sedes");
  revalidatePath("/sedes/[sedeSlug]", "page");
  revalidatePath("/producto/[productSlug]", "page");
  revalidatePath("/catalogo/[categorySlug]", "page");
  revalidatePath("/");
  return { ok: true };
}

export async function updateSede(
  id: string,
  input: SedeFormValues
): Promise<SedeActionResult> {
  await authorizeSedeEditor();

  const parsed = sedeFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const data = parsed.data;
  const existing = await prisma.sede.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { ok: false, message: "Sede no encontrada" };

  const slug = await uniqueSlug(
    data.nombre,
    (s) => prisma.sede.findUnique({ where: { slug: s }, select: { id: true } }),
    id
  );

  const imagenes = data.imagenes.length > 0 ? data.imagenes : null;

  await prisma.sede.update({
    where: { id },
    data: {
      ...buildSedeData(data),
      slug,
      imagenUrl: imagenes?.[0] ?? null,
      imagenes: {
        deleteMany: {},
        create: (imagenes ?? []).map((url, i) => ({ url, orden: i })),
      },
    },
  });

  revalidatePath("/sedes");
  revalidatePath("/sedes/[sedeSlug]", "page");
  revalidatePath("/producto/[productSlug]", "page");
  revalidatePath("/catalogo/[categorySlug]", "page");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSede(id: string): Promise<SedeActionResult> {
  await authorizeSedeEditor();

  const exists = await prisma.sede.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return { ok: false, message: "Sede no encontrada" };

  await prisma.sede.delete({ where: { id } });

  revalidatePath("/sedes");
  revalidatePath("/");
  return { ok: true };
}

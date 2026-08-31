"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { uniqueSlug } from "@/admin/lib/unique-slug";
import {
  productoFormSchema,
  type ProductoFormFieldErrors,
  type ProductoFormValues,
} from "./schema";

export type ProductoActionResult =
  | { ok: true }
  | { ok: false; message?: string; fieldErrors?: ProductoFormFieldErrors };

const ALLOWED = ["ADMIN", "VENDEDOR"] as const;

function flattenErrors(error: z.ZodError): ProductoFormFieldErrors {
  const result: ProductoFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ProductoFormValues;
    if (!result[key]) result[key] = [];
    result[key]!.push(issue.message);
  }
  return result;
}

async function authorizeProductoEditor() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!ALLOWED.includes(user.rol as (typeof ALLOWED)[number])) {
    throw new Error("Acceso restringido");
  }
  return user;
}

function buildProductData(data: ProductoFormValues) {
  return {
    nombre: data.nombre,
    descripcion: data.descripcion,
    tipoProducto: data.tipoProducto,
    destacado: data.destacado,
    tipoMadera:
      data.tipoProducto === "TABLERO_PROCESADO" ? null : (data.tipoMadera ?? null),
    densidad: data.densidad ?? null,
    humedad: data.humedad ?? null,
    espesorMm: data.espesorMm ?? null,
    anchoMm: data.anchoMm ?? null,
    largoMm: data.largoMm ?? null,
    medidasDisplay: data.medidasDisplay ?? null,
    categoriaId: data.categoriaId,
  };
}

export async function createProducto(
  input: ProductoFormValues
): Promise<ProductoActionResult> {
  await authorizeProductoEditor();

  const parsed = productoFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.nombre, (s) =>
    prisma.producto.findUnique({ where: { slug: s }, select: { id: true } })
  );

  const imagenes = data.imagenes.length > 0 ? data.imagenes : null;

  const producto = await prisma.producto.create({
    data: {
      ...buildProductData(data),
      slug,
      imagenUrl: imagenes?.[0] ?? "",
      imagenes: imagenes
        ? { create: imagenes.map((url, i) => ({ url, orden: i })) }
        : undefined,
    },
  });

  const sedes = await prisma.sede.findMany({ where: { activa: true } });
  await prisma.productoSede.createMany({
    data: sedes.map((s) => ({
      productoId: producto.id,
      sedeId: s.id,
      estado: data.estadosPorSede[s.slug] ?? "NO_DISPONIBLE",
    })),
  });

  revalidatePath("/producto");
  revalidatePath("/producto/[productSlug]", "page");
  revalidatePath("/catalogo/[categorySlug]", "page");
  revalidatePath("/sedes/[sedeSlug]", "page");
  revalidatePath("/catalogo");
  revalidatePath("/");
  return { ok: true };
}

export async function updateProducto(
  id: string,
  input: ProductoFormValues
): Promise<ProductoActionResult> {
  await authorizeProductoEditor();

  const parsed = productoFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenErrors(parsed.error) };
  }

  const data = parsed.data;
  const existing = await prisma.producto.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { ok: false, message: "Producto no encontrado" };

  const slug = await uniqueSlug(
    data.nombre,
    (s) => prisma.producto.findUnique({ where: { slug: s }, select: { id: true } }),
    id
  );

  const imagenes = data.imagenes.length > 0 ? data.imagenes : null;

  await prisma.producto.update({
    where: { id },
    data: {
      ...buildProductData(data),
      slug,
      imagenUrl: imagenes?.[0] ?? "",
      imagenes: {
        deleteMany: {},
        create: (imagenes ?? []).map((url, i) => ({ url, orden: i })),
      },
    },
  });

  const sedes = await prisma.sede.findMany({ where: { activa: true } });
  for (const s of sedes) {
    const estado = data.estadosPorSede[s.slug] ?? "NO_DISPONIBLE";
    await prisma.productoSede.upsert({
      where: { productoId_sedeId: { productoId: id, sedeId: s.id } },
      create: { productoId: id, sedeId: s.id, estado },
      update: { estado },
    });
  }

  revalidatePath("/producto");
  revalidatePath("/producto/[productSlug]", "page");
  revalidatePath("/catalogo/[categorySlug]", "page");
  revalidatePath("/sedes/[sedeSlug]", "page");
  revalidatePath("/catalogo");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProducto(id: string): Promise<ProductoActionResult> {
  await authorizeProductoEditor();

  const exists = await prisma.producto.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return { ok: false, message: "Producto no encontrado" };

  await prisma.producto.delete({ where: { id } });

  revalidatePath("/catalogo");
  revalidatePath("/");
  return { ok: true };
}

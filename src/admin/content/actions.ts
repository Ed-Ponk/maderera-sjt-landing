"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireRole } from "@/admin/auth/current-user";
import { CONTENT_IMAGE_KEYS } from "./content";

export type ContentActionResult =
  | { ok: true }
  | { ok: false; message?: string };

const schema = z.object({
  key: z
    .string()
    .refine((k) => CONTENT_IMAGE_KEYS.some((c) => c.key === k), "Clave desconocida"),
  value: z.string().trim().min(1, "La URL de la imagen es requerida"),
});

async function authorizeContentEditor() {
  try {
    return await requireRole("ADMIN");
  } catch {
    redirect("/admin/login");
  }
}

export async function updateSiteContent(
  key: string,
  value: string
): Promise<ContentActionResult> {
  await authorizeContentEditor();

  const parsed = schema.safeParse({ key, value });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.siteContent.upsert({
    where: { key: parsed.data.key },
    create: { key: parsed.data.key, value: parsed.data.value },
    update: { value: parsed.data.value },
  });

  revalidatePath("/");
  revalidatePath("/nosotros");
  revalidatePath("/admin/contenido");
  return { ok: true };
}

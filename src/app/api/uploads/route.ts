import { NextResponse } from "next/server";
import { getCurrentUser } from "@/admin/auth/current-user";
import { tooManyAttempts, recordFailure } from "@/admin/auth/rate-limit";
import {
  IMAGE_TARGETS,
  MAX_UPLOAD_BYTES,
  processAndSaveImage,
  type ImageTarget,
} from "@/admin/lib/images";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Rate limiting de uploads: 15 intentos/15min por IP (más permisivo que login)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos de subida. Inténtalo de nuevo en 15 minutos." },
      { status: 429 }
    );
  }
  recordFailure(ip);

  const url = new URL(request.url);
  const target = url.searchParams.get("target") as ImageTarget | null;
  if (!target || !IMAGE_TARGETS.includes(target)) {
    return NextResponse.json({ error: "Destino de imágenes inválido" }, { status: 400 });
  }

  if (user.rol !== "ADMIN" && target !== "productos") {
    return NextResponse.json(
      { error: "Los vendedores solo pueden subir imágenes de productos" },
      { status: 403 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "El archivo supera el máximo de 5 MB" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await processAndSaveImage(buffer, target);
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "No se pudo procesar la imagen";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

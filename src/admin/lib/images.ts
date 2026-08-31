import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

export const IMAGES_ROOT = resolve(
  process.env.IMAGES_ROOT ?? "/var/lib/maderera-sjt/images"
);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_TARGETS = ["productos", "sedes", "contenido"] as const;
export type ImageTarget = (typeof IMAGE_TARGETS)[number];

export const SUPPORTED_FORMATS = ["jpeg", "png", "webp"] as const;

export function resolveWithinImages(...segments: string[]): string | null {
  if (segments.some((s) => s.includes("\0"))) return null;
  const candidate = resolve(IMAGES_ROOT, ...segments);
  if (!candidate.startsWith(IMAGES_ROOT + "/")) return null;
  return candidate;
}

export function mimeForPath(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

export async function processAndSaveImage(
  buffer: Buffer,
  target: ImageTarget
): Promise<string> {
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("El archivo supera el máximo de 5 MB");
  }

  let image;
  try {
    image = sharp(buffer, { failOn: "error" });
  } catch {
    throw new Error("El archivo no es una imagen válida");
  }

  const metadata = await image.metadata();
  if (!metadata.format) {
    throw new Error("Solo se aceptan imágenes JPG, PNG o WebP");
  }
  if (!(SUPPORTED_FORMATS as readonly string[]).includes(metadata.format)) {
    throw new Error("Solo se aceptan imágenes JPG, PNG o WebP");
  }

  const maxWidth = target === "productos" ? 1000 : 1600;
  const outBuffer = await image
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const dir = resolveWithinImages(target);
  if (!dir) throw new Error("Destino de imágenes inválido");
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}.webp`;
  await writeFile(resolve(dir, filename), outBuffer);

  return `/uploads/${target}/${filename}`;
}

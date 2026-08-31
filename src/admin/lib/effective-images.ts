export function effectiveImages(
  relationUrls: string[],
  imagenUrl: string | null
): string[] {
  if (relationUrls.length > 0) return relationUrls;
  return imagenUrl ? [imagenUrl] : [];
}

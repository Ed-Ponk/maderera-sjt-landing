const SITE_SUFFIX = " | Maderera San Judas Tadeo";
const MAX_TITLE_LENGTH = 60;

/**
 * Construye el <title> de un producto manteniendo el nombre y el sitio dentro de
 * 60 caracteres (límite razonable para SERP). Si el nombre ya es largo, se
 * descarta el sufijo de marca; si aún así excede, se trunca el nombre
 * conservando el inicio (la parte más relevante para búsqueda).
 */
export function buildProductTitle(nombre: string): string {
  const full = `${nombre}${SITE_SUFFIX}`;
  if (full.length <= MAX_TITLE_LENGTH) return full;

  if (nombre.length <= MAX_TITLE_LENGTH) return nombre;

  return `${nombre.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
}

import { ActiveSedeInfo } from "@/shared/lib/types";

export interface CartItem {
  productoId: string;
  productoNombre: string;
  medidasDisplay?: string | null;
  cantidad: number;
}

function parseNumberList(
  raw: string | undefined,
  fallback: string[],
): string[] {
  if (!raw) return fallback;
  const list = raw
    .split(",")
    .map((n) => n.replace(/\D/g, ""))
    .filter(Boolean);
  return list.length > 0 ? list : fallback;
}

/**
 * Líneas generales de WhatsApp para recibir cotizaciones.
 * Fallback cuando no hay contactos cargados en base de datos.
 */
export const WHATSAPP_NUMBERS: string[] = parseNumberList(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBERS,
  [
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
      "51933332094",
  ],
);

/**
 * Limpia y formatea cualquier número peruano al formato estándar visual (+51 XXX XXX XXX)
 */
export function formatWhatsAppNumber(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // Si incluye el prefijo internacional 51 al inicio y tiene al menos 11 dígitos, extraer los 9 dígitos locales
  if (digits.startsWith("51") && digits.length === 11) {
    digits = digits.slice(2);
  }

  // Agrupar en formato 3-3-3 (ej. 933 332 094)
  const formattedLocal = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();

  return `+51 ${formattedLocal}`;
}

/**
 * Retorna solo los dígitos limpios asegurando el prefijo 51 para URLs de wa.me
 */
export function cleanWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9) {
    return `51${digits}`;
  }
  return digits;
}

/**
 * Genera la URL de WhatsApp con el mensaje formateado de cotización.
 */
export function generateWhatsAppLink(
  activeSede: ActiveSedeInfo,
  items: CartItem[],
  whatsappNumber: string,
): string {
  const cleanNumber = cleanWhatsAppNumber(
    whatsappNumber || WHATSAPP_NUMBERS[0],
  );

  const sedeTag = activeSede.esProximamente
    ? `${activeSede.nombre} (Próximamente)`
    : activeSede.nombre;

  let text = `*Solicitud de Cotización - Maderera San Judas Tadeo*\n`;
  text += `Sede de preferencia: ${sedeTag}\n\n`;
  text += `*Productos:*\n`;

  items.forEach((item) => {
    const medidasText = item.medidasDisplay ? ` (${item.medidasDisplay})` : "";
    text += `- ${item.cantidad}x ${item.productoNombre}${medidasText}\n`;
  });

  text += `\n*Cliente requiere cotización.*`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

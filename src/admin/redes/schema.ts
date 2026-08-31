import { z } from "zod";

export const ICONOS_REDES = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export const redSocialFormSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es requerido"),
  url: z
    .string()
    .trim()
    .url("Ingresa una URL válida (ej: https://facebook.com/madererasjt)"),
  icono: z.string().trim().min(2, "Selecciona un icono"),
  activo: z.boolean().default(true),
  orden: z.coerce.number().int().min(0).default(0),
});

export type RedSocialFormValues = z.infer<typeof redSocialFormSchema>;

export type RedSocialFormFieldErrors = Partial<
  Record<keyof RedSocialFormValues, string[]>
>;

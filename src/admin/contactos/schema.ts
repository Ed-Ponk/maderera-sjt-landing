import { z } from "zod";

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

export const contactoFormSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es requerido"),
  whatsapp: z
    .string()
    .trim()
    .regex(
      /^\+?[\d\s\-()]{7,20}$/,
      "Ingresa un número válido con código de país (ej: +51 933 332 094)"
    ),
  cargo: z.preprocess(emptyToNull, z.string().trim().nullable()).optional().nullable(),
  activo: z.boolean().default(true),
});

export type ContactoFormValues = z.infer<typeof contactoFormSchema>;

export type ContactoFormFieldErrors = Partial<
  Record<keyof ContactoFormValues, string[]>
>;

import { z } from "zod";

export const sedeFormSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es requerido"),
  direccion: z.string().trim().min(1, "La dirección es requerida"),
  telefono: z.string().trim().min(1, "El teléfono es requerido"),
  esProximamente: z.boolean().default(false),
  activa: z.boolean().default(true),
  imagenes: z.array(z.string().min(1)).default([]),
});

export type SedeFormValues = z.infer<typeof sedeFormSchema>;

export type SedeFormFieldErrors = Partial<
  Record<keyof SedeFormValues, string[]>
>;

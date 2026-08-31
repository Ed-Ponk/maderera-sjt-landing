import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const createUsuarioSchema = z.object({
nombre: z.string().trim().min(2, "El nombre es requerido").max(100, "El nombre es demasiado largo"),
  email: z.string().trim().email("Ingresa un email válido"),
  password: z.string().trim().min(8, "La contraseña debe tener al menos 8 caracteres").max(128, "La contraseña es demasiado larga"),
  activo: z.boolean().default(true),
});

export const updateUsuarioSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es requerido"),
  email: z.string().trim().email("Ingresa un email válido"),
  rol: z.enum(["ADMIN", "VENDEDOR"]),
  password: z
    .preprocess(
      emptyToUndefined,
      z.string().trim().min(8, "La contraseña debe tener al menos 8 caracteres").optional()
    ),
  activo: z.boolean().default(true),
});

export type UsuarioFormValues = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioValues = z.infer<typeof updateUsuarioSchema>;
export type UsuarioFormFieldErrors = Partial<
  Record<keyof UsuarioFormValues, string[]>
>;

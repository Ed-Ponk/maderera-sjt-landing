import { z } from "zod";

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

export const productoFormSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es requerido").max(200, "El nombre es demasiado largo"),
  descripcion: z.string().trim().min(1, "La descripción es requerida").max(2000, "La descripción es demasiado larga"),
  tipoProducto: z.enum(["MADERA_TABLON", "TABLERO_PROCESADO", "ACABADO"]),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  destacado: z.boolean().default(false),
  tipoMadera: z
    .preprocess(emptyToNull, z.string().trim().min(1, "Indica la especie de madera").nullable())
    .optional()
    .nullable(),
  densidad: z.preprocess(emptyToNull, z.string().trim().nullable()).optional().nullable(),
  humedad: z.preprocess(emptyToNull, z.string().trim().nullable()).optional().nullable(),
  espesorMm: z.preprocess(emptyToNull, z.coerce.number().positive("Debe ser mayor a 0").nullable()).optional().nullable(),
  anchoMm: z.preprocess(emptyToNull, z.coerce.number().positive("Debe ser mayor a 0").nullable()).optional().nullable(),
  largoMm: z.preprocess(emptyToNull, z.coerce.number().positive("Debe ser mayor a 0").nullable()).optional().nullable(),
  medidasDisplay: z.preprocess(emptyToNull, z.string().trim().nullable()).optional().nullable(),
  imagenes: z.array(z.string().min(1)).default([]),
  estadosPorSede: z
    .record(z.string(), z.enum(["DISPONIBLE", "A_PEDIDO", "NO_DISPONIBLE"]))
    .default({}),
});

export type ProductoFormValues = z.infer<typeof productoFormSchema>;

export type ProductoFormFieldErrors = Partial<
  Record<keyof ProductoFormValues, string[]>
>;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProducto,
  updateProducto,
  type ProductoActionResult,
} from "./actions";
import type { ProductoFormValues, ProductoFormFieldErrors } from "./schema";
import { ImageUploader } from "./ImageUploader";
import { useModalClose } from "@/admin/ui/Modal";

type TipoProducto = ProductoFormValues["tipoProducto"];
type Estado = "DISPONIBLE" | "A_PEDIDO" | "NO_DISPONIBLE";

interface ProductFormProps {
  categorias: { id: string; nombre: string }[];
  sedes: {
    id: string;
    nombre: string;
    slug: string;
    esProximamente: boolean;
  }[];
  initial?: ProductoFormValues;
  productoId?: string;
}

interface FormState {
  nombre: string;
  descripcion: string;
  tipoProducto: TipoProducto;
  categoriaId: string;
  destacado: boolean;
  tipoMadera: string;
  densidad: string;
  humedad: string;
  espesorMm: string;
  anchoMm: string;
  largoMm: string;
  medidasDisplay: string;
  imagenes: string[];
  estadosPorSede: Record<string, Estado>;
}

function numToStr(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}

function buildState(
  initial: ProductoFormValues | undefined,
  sedes: ProductFormProps["sedes"]
): FormState {
  const estadosIniciales =
    (initial?.estadosPorSede ?? {}) as Record<string, Estado>;
  const estadosPorSede: Record<string, Estado> = {};
  for (const sede of sedes) {
    estadosPorSede[sede.slug] = estadosIniciales[sede.slug] ?? "NO_DISPONIBLE";
  }
  return {
    nombre: initial?.nombre ?? "",
    descripcion: initial?.descripcion ?? "",
    tipoProducto: initial?.tipoProducto ?? "MADERA_TABLON",
    categoriaId: initial?.categoriaId ?? "",
    destacado: initial?.destacado ?? false,
    tipoMadera: initial?.tipoMadera ?? "",
    densidad: initial?.densidad ?? "",
    humedad: initial?.humedad ?? "",
    espesorMm: numToStr(initial?.espesorMm),
    anchoMm: numToStr(initial?.anchoMm),
    largoMm: numToStr(initial?.largoMm),
    medidasDisplay: initial?.medidasDisplay ?? "",
    imagenes: initial?.imagenes ?? [],
    estadosPorSede,
  };
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      {children}
      {error && <span className="text-sm text-error">{error}</span>}
    </label>
  );
}

const inputCls =
  "border-2 border-outline-variant bg-surface-container-lowest px-3 py-2 font-sans text-sm focus:border-secondary outline-none";

export function ProductForm({
  categorias,
  sedes,
  initial,
  productoId,
}: ProductFormProps) {
  const router = useRouter();
  const closeModal = useModalClose();
  const [state, setState] = useState<FormState>(() => buildState(initial, sedes));
  const [fieldErrors, setFieldErrors] = useState<ProductoFormFieldErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function setSedeEstado(slug: string, estado: Estado) {
    set("estadosPorSede", { ...state.estadosPorSede, [slug]: estado });
  }

  const esTableroProcesado = state.tipoProducto === "TABLERO_PROCESADO";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    setServerMessage(null);

    const payload: ProductoFormValues = {
      ...state,
      destacado: state.destacado,
      tipoMadera: state.tipoMadera.trim() === "" ? null : state.tipoMadera,
      densidad: state.densidad.trim() === "" ? null : state.densidad,
      humedad: state.humedad.trim() === "" ? null : state.humedad,
      espesorMm: state.espesorMm === "" ? null : Number(state.espesorMm),
      anchoMm: state.anchoMm === "" ? null : Number(state.anchoMm),
      largoMm: state.largoMm === "" ? null : Number(state.largoMm),
      medidasDisplay:
        state.medidasDisplay.trim() === "" ? null : state.medidasDisplay,
    };

    try {
      const result: ProductoActionResult = productoId
        ? await updateProducto(productoId, payload)
        : await createProducto(payload);

      if (result.ok) {
        if (closeModal) {
          closeModal();
          return;
        }
        router.push("/admin/productos");
        router.refresh();
        return;
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (result.message) setServerMessage(result.message);
    } catch {
      setServerMessage("Ocurrió un error inesperado al guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl flex flex-col gap-6 bg-surface-container-lowest border-2 border-outline-variant p-6"
    >
      {serverMessage && <p className="text-sm text-error">{serverMessage}</p>}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <Field label="Nombre" error={fieldErrors.nombre?.[0]}>
            <input
              required
              value={state.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="w-full sm:w-56">
          <Field label="Categoría" error={fieldErrors.categoriaId?.[0]}>
            <select
              required
              value={state.categoriaId}
              onChange={(e) => set("categoriaId", e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>
                Seleccionar…
              </option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <Field label="Descripción" error={fieldErrors.descripcion?.[0]}>
        <textarea
          required
          rows={3}
          value={state.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          className={inputCls}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <Field label="Tipo de producto">
          <div className="flex gap-2">
            {(["MADERA_TABLON", "TABLERO_PROCESADO", "ACABADO"] as TipoProducto[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tipoProducto", t)}
                  className={
                    "border-2 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors " +
                    (state.tipoProducto === t
                      ? "border-secondary bg-secondary text-on-secondary"
                      : "border-outline-variant text-on-surface-variant hover:border-secondary")
                  }
                >
                  {t === "MADERA_TABLON"
                    ? "Madera"
                    : t === "TABLERO_PROCESADO"
                      ? "Tablero"
                      : "Acabado"}
                </button>
              )
            )}
          </div>
        </Field>
        <label className="flex items-center gap-2 font-sans text-sm text-on-surface cursor-pointer">
          <input
            type="checkbox"
            checked={state.destacado}
            onChange={(e) => set("destacado", e.target.checked)}
            className="w-4 h-4"
          />
          Destacado en el catálogo
        </label>
      </div>

      <fieldset className="border-2 border-outline-variant p-4 flex flex-col gap-4 min-w-0">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Campos técnicos
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!esTableroProcesado && (
            <Field label="Especie (tipo de madera)" error={fieldErrors.tipoMadera?.[0]}>
              <input
                value={state.tipoMadera}
                onChange={(e) => set("tipoMadera", e.target.value)}
                placeholder="Ej: Cachimbo"
                className={inputCls}
              />
            </Field>
          )}
          <Field label="Densidad">
            <input
              value={state.densidad}
              onChange={(e) => set("densidad", e.target.value)}
              placeholder="Ej: 0.68 g/cm³"
              className={inputCls}
            />
          </Field>
          <Field label="Humedad">
            <input
              value={state.humedad}
              onChange={(e) => set("humedad", e.target.value)}
              placeholder="Ej: 12% - 15%"
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Espesor (mm)" error={fieldErrors.espesorMm?.[0]}>
            <input
              type="number"
              step="any"
              min="0"
              value={state.espesorMm}
              onChange={(e) => set("espesorMm", e.target.value)}
              placeholder="Ej: 50.8"
              className={inputCls}
            />
          </Field>
          <Field label="Ancho (mm)" error={fieldErrors.anchoMm?.[0]}>
            <input
              type="number"
              step="any"
              min="0"
              value={state.anchoMm}
              onChange={(e) => set("anchoMm", e.target.value)}
              placeholder="Ej: 203.2"
              className={inputCls}
            />
          </Field>
          <Field label="Largo (mm)" error={fieldErrors.largoMm?.[0]}>
            <input
              type="number"
              step="any"
              min="0"
              value={state.largoMm}
              onChange={(e) => set("largoMm", e.target.value)}
              placeholder="Ej: 3048"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Medidas legibles (opcional)">
          <input
            value={state.medidasDisplay}
            onChange={(e) => set("medidasDisplay", e.target.value)}
            placeholder={'Ej: 2" x 8" x 10\''}
            className={inputCls}
          />
        </Field>

        {esTableroProcesado && (
          <p className="text-sm text-on-surface-variant">
            Los tableros procesados no llevan especie: se omite el campo.
          </p>
        )}
      </fieldset>

      <fieldset className="border-2 border-outline-variant p-4 flex flex-col gap-3 min-w-0">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Disponibilidad por sede
        </legend>
        {sedes.map((sede) => (
          <div
            key={sede.id}
            className="flex items-center justify-between border-b border-outline-variant pb-2 last:border-b-0 last:pb-0"
          >
            <span className="font-sans text-sm text-on-surface">
              {sede.nombre}
              {sede.esProximamente ? " — Próximamente" : ""}
            </span>
            <div className="flex gap-2">
              {(["DISPONIBLE", "A_PEDIDO", "NO_DISPONIBLE"] as Estado[]).map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setSedeEstado(sede.slug, estado)}
                  className={
                    "border-2 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors " +
                    (state.estadosPorSede[sede.slug] === estado
                      ? "border-secondary bg-secondary text-on-secondary"
                      : "border-outline-variant text-on-surface-variant hover:border-secondary")
                  }
                >
                  {estado === "DISPONIBLE"
                    ? "Disponible"
                    : estado === "A_PEDIDO"
                      ? "A pedido"
                      : "No disponible"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="border-2 border-outline-variant p-4 flex flex-col gap-3 min-w-0">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Imágenes
        </legend>
        <ImageUploader images={state.imagenes} onChange={(imgs) => set("imagenes", imgs)} />
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary font-display text-lg uppercase tracking-wide py-3 px-8 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Guardando…" : productoId ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="font-sans text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSede, updateSede, type SedeActionResult } from "./actions";
import type { SedeFormValues, SedeFormFieldErrors } from "./schema";
import { ImageUploader } from "@/admin/productos/ImageUploader";
import { useModalClose } from "@/admin/ui/Modal";

interface SedeFormProps {
  initial?: SedeFormValues;
  sedeId?: string;
}

interface FormState {
  nombre: string;
  direccion: string;
  telefono: string;
  esProximamente: boolean;
  activa: boolean;
  imagenes: string[];
}

function buildState(initial?: SedeFormValues): FormState {
  return {
    nombre: initial?.nombre ?? "",
    direccion: initial?.direccion ?? "",
    telefono: initial?.telefono ?? "",
    esProximamente: initial?.esProximamente ?? false,
    activa: initial?.activa ?? true,
    imagenes: initial?.imagenes ?? [],
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

export function SedeForm({ initial, sedeId }: SedeFormProps) {
  const router = useRouter();
  const closeModal = useModalClose();
  const [state, setState] = useState<FormState>(() => buildState(initial));
  const [fieldErrors, setFieldErrors] = useState<SedeFormFieldErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    setServerMessage(null);

    const payload: SedeFormValues = {
      ...state,
      nombre: state.nombre.trim(),
      direccion: state.direccion.trim(),
      telefono: state.telefono.trim(),
    };

    try {
      const result: SedeActionResult = sedeId
        ? await updateSede(sedeId, payload)
        : await createSede(payload);

      if (result.ok) {
        if (closeModal) {
          closeModal();
          return;
        }
        router.push("/admin/sedes");
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

      <Field label="Nombre de la sede" error={fieldErrors.nombre?.[0]}>
        <input
          required
          value={state.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="Ej: Talara"
          className={inputCls}
        />
      </Field>

      <Field label="Dirección" error={fieldErrors.direccion?.[0]}>
        <input
          required
          value={state.direccion}
          onChange={(e) => set("direccion", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Teléfono" error={fieldErrors.telefono?.[0]}>
        <input
          required
          value={state.telefono}
          onChange={(e) => set("telefono", e.target.value)}
          placeholder="Ej: +51 933 332 094"
          className={inputCls}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 font-sans text-sm text-on-surface cursor-pointer">
          <input
            type="checkbox"
            checked={state.esProximamente}
            onChange={(e) => set("esProximamente", e.target.checked)}
            className="w-4 h-4"
          />
          Sede en apertura próxima (Chiclayo)
        </label>
        <label className="flex items-center gap-2 font-sans text-sm text-on-surface cursor-pointer">
          <input
            type="checkbox"
            checked={state.activa}
            onChange={(e) => set("activa", e.target.checked)}
            className="w-4 h-4"
          />
          Sede activa en el sitio
        </label>
      </div>

      <fieldset className="border-2 border-outline-variant p-4 flex flex-col gap-3 min-w-0">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Imágenes
        </legend>
        <ImageUploader
          target="sedes"
          images={state.imagenes}
          onChange={(imgs) => set("imagenes", imgs)}
        />
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary font-display text-lg uppercase tracking-wide py-3 px-8 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Guardando…" : sedeId ? "Guardar cambios" : "Crear sede"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/sedes")}
          className="font-sans text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

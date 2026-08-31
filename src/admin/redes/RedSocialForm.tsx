"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRedSocial, updateRedSocial, type RedSocialActionResult } from "./actions";
import type { RedSocialFormValues, RedSocialFormFieldErrors } from "./schema";
import { ICONOS_REDES } from "./schema";
import { useModalClose } from "@/admin/ui/Modal";

interface RedSocialFormProps {
  initial?: RedSocialFormValues;
  redSocialId?: string;
}

interface FormState {
  nombre: string;
  url: string;
  icono: string;
  activo: boolean;
  orden: string;
}

function buildState(initial?: RedSocialFormValues): FormState {
  return {
    nombre: initial?.nombre ?? "",
    url: initial?.url ?? "",
    icono: initial?.icono ?? "facebook",
    activo: initial?.activo ?? true,
    orden: String(initial?.orden ?? 0),
  };
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      {children}
      {hint && !error && <span className="text-sm text-on-surface-variant">{hint}</span>}
      {error && <span className="text-sm text-error">{error}</span>}
    </label>
  );
}

const inputCls =
  "border-2 border-outline-variant bg-surface-container-lowest px-3 py-2 font-sans text-sm focus:border-secondary outline-none";

export function RedSocialForm({ initial, redSocialId }: RedSocialFormProps) {
  const router = useRouter();
  const closeModal = useModalClose();
  const [state, setState] = useState<FormState>(() => buildState(initial));
  const [fieldErrors, setFieldErrors] = useState<RedSocialFormFieldErrors>({});
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

    const payload: RedSocialFormValues = {
      ...state,
      nombre: state.nombre.trim(),
      url: state.url.trim(),
      orden: Number(state.orden || 0),
    };

    try {
      const result: RedSocialActionResult = redSocialId
        ? await updateRedSocial(redSocialId, payload)
        : await createRedSocial(payload);

      if (result.ok) {
        if (closeModal) {
          closeModal();
          return;
        }
        router.push("/admin/redes");
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

      <Field label="Nombre" error={fieldErrors.nombre?.[0]}>
        <input
          required
          value={state.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="Ej: Maderera San Judas Tadeo"
          className={inputCls}
        />
      </Field>

      <Field
        label="URL"
        error={fieldErrors.url?.[0]}
        hint="URL pública de la red social"
      >
        <input
          required
          value={state.url}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://facebook.com/madererasjt"
          className={inputCls}
        />
      </Field>

      <Field label="Icono" error={fieldErrors.icono?.[0]}>
        <select
          value={state.icono}
          onChange={(e) => set("icono", e.target.value)}
          className={inputCls}
        >
          {ICONOS_REDES.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Orden" error={fieldErrors.orden?.[0]} hint="Menor = aparece primero">
        <input
          type="number"
          min={0}
          value={state.orden}
          onChange={(e) => set("orden", e.target.value)}
          className={inputCls}
        />
      </Field>

      <label className="flex items-center gap-2 font-sans text-sm text-on-surface cursor-pointer">
        <input
          type="checkbox"
          checked={state.activo}
          onChange={(e) => set("activo", e.target.checked)}
          className="w-4 h-4"
        />
        Red activa en el footer del sitio
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary font-display text-lg uppercase tracking-wide py-3 px-8 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Guardando…" : redSocialId ? "Guardar cambios" : "Crear red"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/redes")}
          className="font-sans text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

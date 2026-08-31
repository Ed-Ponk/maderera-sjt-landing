"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContacto, updateContacto, type ContactoActionResult } from "./actions";
import type { ContactoFormValues, ContactoFormFieldErrors } from "./schema";
import { useModalClose } from "@/admin/ui/Modal";

interface ContactoFormProps {
  initial?: ContactoFormValues;
  contactoId?: string;
}

interface FormState {
  nombre: string;
  whatsapp: string;
  cargo: string;
  activo: boolean;
}

function buildState(initial?: ContactoFormValues): FormState {
  return {
    nombre: initial?.nombre ?? "",
    whatsapp: initial?.whatsapp ?? "",
    cargo: initial?.cargo ?? "",
    activo: initial?.activo ?? true,
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

export function ContactoForm({ initial, contactoId }: ContactoFormProps) {
  const router = useRouter();
  const closeModal = useModalClose();
  const [state, setState] = useState<FormState>(() => buildState(initial));
  const [fieldErrors, setFieldErrors] = useState<ContactoFormFieldErrors>({});
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

    const payload: ContactoFormValues = {
      ...state,
      nombre: state.nombre.trim(),
      whatsapp: state.whatsapp.trim(),
      cargo: state.cargo.trim() === "" ? null : state.cargo.trim(),
    };

    try {
      const result: ContactoActionResult = contactoId
        ? await updateContacto(contactoId, payload)
        : await createContacto(payload);

      if (result.ok) {
        if (closeModal) {
          closeModal();
          return;
        }
        router.push("/admin/contactos");
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
          placeholder="Ej: Ventas Talara"
          className={inputCls}
        />
      </Field>

      <Field
        label="WhatsApp"
        error={fieldErrors.whatsapp?.[0]}
        hint="Formato libre, se normaliza al enviar. Ej: +51 933 332 094"
      >
        <input
          required
          value={state.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
          placeholder="+51 900 000 001"
          className={inputCls}
        />
      </Field>

      <Field label="Cargo (opcional)" error={fieldErrors.cargo?.[0]}>
        <input
          value={state.cargo}
          onChange={(e) => set("cargo", e.target.value)}
          placeholder="Ej: Ventas"
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
        Contacto activo en el selector de cotización
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary font-display text-lg uppercase tracking-wide py-3 px-8 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Guardando…" : contactoId ? "Guardar cambios" : "Crear contacto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/contactos")}
          className="font-sans text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

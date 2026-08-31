"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUsuario, updateUsuario, type UsuarioActionResult } from "./actions";
import type { UsuarioFormFieldErrors, UsuarioFormValues } from "./schema";
import { PasswordInput } from "@/admin/ui/PasswordInput";
import { useModalClose } from "@/admin/ui/Modal";

interface UserFormProps {
  initial?: { nombre: string; email: string; rol: "ADMIN" | "VENDEDOR"; activo: boolean };
  usuarioId?: string;
}

interface FormState {
  nombre: string;
  email: string;
  rol: "ADMIN" | "VENDEDOR";
  password: string;
  activo: boolean;
}

function buildState(initial?: UserFormProps["initial"]): FormState {
  return {
    nombre: initial?.nombre ?? "",
    email: initial?.email ?? "",
    rol: initial?.rol ?? "VENDEDOR",
    password: "",
    activo: initial?.activo ?? true,
  };
}

function Field({
  label,
  children,
  error,
  hint,
  as = "label",
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  as?: "label" | "div";
}) {
  const Tag = as;
  return (
    <Tag className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      {children}
      {hint && !error && <span className="text-sm text-on-surface-variant">{hint}</span>}
      {error && <span className="text-sm text-error">{error}</span>}
    </Tag>
  );
}

const inputCls =
  "border-2 border-outline-variant bg-surface-container-lowest px-3 py-2 font-sans text-sm focus:border-secondary outline-none";

export function UserForm({ initial, usuarioId }: UserFormProps) {
  const router = useRouter();
  const closeModal = useModalClose();
  const [state, setState] = useState<FormState>(() => buildState(initial));
  const [fieldErrors, setFieldErrors] = useState<UsuarioFormFieldErrors>({});
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

    const payload: UsuarioFormValues = {
      nombre: state.nombre.trim(),
      email: state.email.trim(),
      rol: state.rol,
      password: state.password.trim(),
      activo: state.activo,
    };

    try {
      const result: UsuarioActionResult = usuarioId
        ? await updateUsuario(usuarioId, payload)
        : await createUsuario(payload);

      if (result.ok) {
        if (closeModal) {
          closeModal();
          return;
        }
        router.push("/admin/usuarios");
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
          placeholder="Ej: María Pérez"
          className={inputCls}
        />
      </Field>

      <Field label="Email" error={fieldErrors.email?.[0]}>
        <input
          required
          type="email"
          value={state.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="nombre@madererasanjudastadeo.com"
          className={inputCls}
        />
      </Field>

      <Field label="Rol" error={fieldErrors.rol?.[0]}>
        <select
          value={state.rol}
          onChange={(e) => set("rol", e.target.value as "ADMIN" | "VENDEDOR")}
          className={inputCls}
        >
          <option value="VENDEDOR">Vendedor</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </Field>

      <Field
        as="div"
        label={usuarioId ? "Nueva contraseña (opcional)" : "Contraseña"}
        error={fieldErrors.password?.[0]}
        hint={usuarioId ? "Dejá el campo vacío para no cambiar la contraseña actual." : "Mínimo 8 caracteres."}
      >
        <PasswordInput
          value={state.password}
          onChange={(p) => set("password", p)}
          ariaLabel={usuarioId ? "Nueva contraseña (opcional)" : "Contraseña"}
          required={!usuarioId}
          placeholder="••••••••"
          autoComplete="new-password"
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
        Usuario activo (puede iniciar sesión)
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary font-display text-lg uppercase tracking-wide py-3 px-8 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Guardando…" : usuarioId ? "Guardar cambios" : "Crear usuario"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/usuarios")}
          className="font-sans text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

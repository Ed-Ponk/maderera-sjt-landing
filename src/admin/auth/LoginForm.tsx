"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { PasswordInput } from "@/admin/ui/PasswordInput";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: email.trim(),
      password: password.trim(),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Credenciales inválidas o usuario inactivo.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    router.push(
      callbackUrl && callbackUrl.startsWith("/admin")
        ? callbackUrl
        : "/admin/productos"
    );
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-outline-variant bg-surface-container-lowest px-3 py-2 font-sans text-sm focus:border-secondary outline-none"
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Contraseña
        </span>
        <PasswordInput
          value={password}
          onChange={setPassword}
          ariaLabel="Contraseña"
          required
          autoComplete="current-password"
          className="border-2 border-outline-variant bg-surface-container-lowest px-3 py-2 font-sans text-sm focus:border-secondary outline-none"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-secondary text-on-secondary font-display text-lg uppercase tracking-wide py-3 transition-colors disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

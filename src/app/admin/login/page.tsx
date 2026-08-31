import { Suspense } from "react";
import { LoginForm } from "@/admin/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface-container-lowest border-2 border-outline-variant shadow-plate-lg p-8">
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Panel
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1 mb-6">
          Maderera San Judas Tadeo
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

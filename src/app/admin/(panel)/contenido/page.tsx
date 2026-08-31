import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/admin/auth/current-user";
import { CONTENT_IMAGE_KEYS } from "@/admin/content/content";
import { ContentImageCard } from "@/admin/content/ContentImageCard";

export const dynamic = "force-dynamic";

export default async function AdminContenidoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const keys = CONTENT_IMAGE_KEYS.map((c) => c.key);
  const rows = await prisma.siteContent.findMany({
    where: { key: { in: keys } },
  });
  const stored = new Map(rows.map((r) => [r.key, r.value]));

  const entries = CONTENT_IMAGE_KEYS.map((c) => ({
    ...c,
    current: stored.get(c.key) ?? c.fallback,
    customized: stored.has(c.key),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
          Contenido del sitio
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mt-1">
          Imágenes de Inicio y Nosotros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <ContentImageCard key={entry.key} entry={entry} />
        ))}
      </div>
    </div>
  );
}

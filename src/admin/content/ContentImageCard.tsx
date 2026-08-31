"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import { ImageUploader } from "@/admin/productos/ImageUploader";
import { updateSiteContent, type ContentActionResult } from "./actions";

interface ContentImageCardProps {
  entry: {
    key: string;
    label: string;
    hint?: string;
    fallback: string;
    current: string;
    customized: boolean;
  };
}

export function ContentImageCard({ entry }: ContentImageCardProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([entry.current]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pendingUrl = images[images.length - 1];
  const hasChanges = pendingUrl !== entry.current;

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result: ContentActionResult = await updateSiteContent(entry.key, pendingUrl);
    if (result.ok) {
      setMessage("Guardado. La página pública ya muestra esta imagen.");
      router.refresh();
    } else {
      setMessage(result.message ?? "No se pudo guardar");
    }
    setSaving(false);
  }

  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-sans text-sm font-bold text-on-surface">{entry.label}</h3>
          <p className="font-mono text-xs text-on-surface-variant mt-0.5">{entry.key}</p>
          {entry.hint && <p className="text-sm text-on-surface-variant mt-1">{entry.hint}</p>}
        </div>
        {!entry.customized && (
          <span className="border-2 border-dashed border-tertiary text-tertiary font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 shrink-0">
            Valor por defecto
          </span>
        )}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pendingUrl}
        alt={entry.label}
        className="w-full h-40 object-cover border-2 border-outline-variant"
      />

      <ImageUploader target="contenido" images={images} onChange={setImages} />

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving || !hasChanges}
          onClick={handleSave}
          className="bg-secondary text-on-secondary font-display text-base uppercase tracking-wide py-2 px-5 flex items-center gap-2 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {saving ? "Guardando…" : "Guardar imagen"}
        </button>
        {message && <p className="text-sm text-on-surface-variant">{message}</p>}
      </div>
    </div>
  );
}

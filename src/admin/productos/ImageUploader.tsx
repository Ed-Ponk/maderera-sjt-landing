"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, ArrowUp, ArrowDown } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  target?: "productos" | "sedes" | "contenido";
}

export function ImageUploader({ images, onChange, target = "productos" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/uploads?target=${target}`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir la imagen");
        continue;
      }
      uploaded.push(data.url);
    }

    if (uploaded.length > 0) onChange([...images, ...uploaded]);
    setUploading(false);
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...images];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="border-2 border-dashed border-outline-variant px-4 py-6 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:border-secondary transition-colors cursor-pointer"
      >
        <ImagePlus className="w-4 h-4" />
        {uploading ? "Subiendo…" : "Subir imágenes (JPG, PNG, WebP — máx 5 MB)"}
      </button>

      {error && <p className="text-sm text-error">{error}</p>}

      {images.length > 0 && (
        <ul className="flex flex-col gap-2">
          {images.map((url, i) => (
            <li
              key={url}
              className="flex items-center gap-3 border-2 border-outline-variant p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-14 h-14 object-cover border border-outline-variant"
              />
              <span className="font-mono text-xs text-on-surface-variant truncate flex-1 min-w-0">
                {i === 0 ? "Portada — " : ""}
                {url}
              </span>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-on-surface-variant hover:text-secondary disabled:opacity-30 cursor-pointer"
                aria-label="Mover arriba"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                className="text-on-surface-variant hover:text-secondary disabled:opacity-30 cursor-pointer"
                aria-label="Mover abajo"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="text-error hover:opacity-80 cursor-pointer"
                aria-label="Quitar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

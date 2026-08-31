import Link from "next/link";
import { Trees, Layers, Paintbrush, ArrowRight } from "lucide-react";

interface CategoryNavProps {
  activeCategorySlug: string;
}

export function CategoryNav({ activeCategorySlug }: CategoryNavProps) {
  const categories = [
    { name: "Maderas en Tablones", slug: "maderas-en-tablones", icon: Trees, tag: "La Sierra" },
    { name: "Triplays y Tableros", slug: "triplays-y-procesados", icon: Layers, tag: "La Prensa" },
    { name: "Acabados y Complementos", slug: "acabados-y-complementos", icon: Paintbrush, tag: "La Cepilladora" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col p-6 bg-surface-container-lowest border-2 border-outline-variant shadow-plate h-fit">
      <h2 className="font-display text-3xl uppercase tracking-wide text-primary">Catálogo</h2>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        Explorar por línea de trabajo
      </p>

      <nav className="mt-6 flex flex-col border-t-2 border-primary">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.slug === activeCategorySlug;

          return (
            <Link
              key={cat.slug}
              href={`/catalogo/${cat.slug}`}
              className={
                isActive
                  ? "bg-primary text-on-primary px-4 py-4 flex items-center justify-between gap-3"
                  : "text-on-surface-variant hover:bg-surface-container-high px-4 py-4 flex items-center justify-between gap-3 border-b border-outline-variant/70 transition-colors"
              }
            >
              <span className="flex items-center gap-3">
                <Icon className={isActive ? "w-4 h-4 text-accent" : "w-4 h-4 text-outline"} />
                <span className="font-display text-lg uppercase tracking-wide">
                  {cat.name}
                </span>
              </span>
              {isActive && <ArrowRight className="w-4 h-4 text-accent" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

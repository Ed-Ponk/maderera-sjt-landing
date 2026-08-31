import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Store, Headset, MapPin, Trees, Layers, Paintbrush } from "lucide-react";
import { MeasureTape } from "@/shared/components/visual/MeasureTape";
import { RelatedProducts } from "@/catalogo/components/RelatedProducts";
import { JsonLd } from "@/shared/components/JsonLd";
import { toAbsoluteUrl } from "@/shared/lib/site-url";
import { prisma } from "@/shared/lib/prisma";
import { getContentImages } from "@/admin/content/content";

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80";

const SEDE_IMG_FALLBACK =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80";

const CATEGORIES = [
  {
    href: "/catalogo/maderas-en-tablones",
    contentKey: "inicio_categoria_madera_imagen",
    tag: "Linea 01 — La Sierra",
    title: "Maderas en Tablones",
    line: "Tablones estructurales y de carpintería fina, cepillados y dimensionados en el aserradero.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    icon: Trees,
    span: "lg:col-span-7",
  },
  {
    href: "/catalogo/triplays-y-procesados",
    contentKey: "inicio_categoria_tablero_imagen",
    tag: "Linea 02 — La Prensa",
    title: "Triplays y Tableros",
    line: "Tableros fenólicos, marinos y melamínicos para encofrado y mueblería.",
    img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=900&q=80",
    icon: Layers,
    span: "lg:col-span-5",
  },
  {
    href: "/catalogo/acabados-y-complementos",
    contentKey: "inicio_categoria_acabados_imagen",
    tag: "Linea 03 — La Cepilladora",
    title: "Acabados y Complementos",
    line: "Vigas, listones, molduras y accesorios para acabado arquitectónico.",
    img: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=1200&q=80",
    icon: Paintbrush,
    span: "lg:col-span-12",
  },
];

export const metadata: Metadata = {
  title: "Inicio | Maderera San Judas Tadeo",
  description:
    "Aserradero y depósito de madera en el norte del Perú: tablones, triplays y acabados con especificaciones reales y stock verificado por sede en Talara, Paita y Chiclayo.",
  openGraph: {
    title: "Inicio | Maderera San Judas Tadeo",
    description:
      "Aserradero y depósito de madera en el norte del Perú: especificaciones reales y stock verificado por sede en Talara, Paita y Chiclayo.",
    url: "/",
    siteName: "Maderera San Judas Tadeo",
    locale: "es_PE",
    type: "website",
    images: [{ url: HERO_FALLBACK, alt: "Madera estructural apilada en el aserradero" }],
  },
};

const PROMISES = [
  {
    icon: BadgeCheck,
    title: "Calidad Garantizada",
    desc: "Seleccionamos rigurosamente nuestra madera para asegurar durabilidad y belleza en cada pieza de su proyecto.",
  },
  {
    icon: Store,
    title: "Precios de Fábrica",
    desc: "Optimizamos nuestra cadena de suministro para ofrecerte las mejores tarifas competitivas del mercado regional.",
  },
  {
    icon: Headset,
    title: "Atención Personalizada",
    desc: "Asesoramiento experto para constructores, arquitectos y carpinteros en cada etapa de su proyecto constructivo.",
  },
];

export default async function HomePage() {
  const content = await getContentImages();
  const heroImg = content["inicio_hero_imagen"] ?? HERO_FALLBACK;

  const sedes = await prisma.sede.findMany({
    where: { activa: true },
    include: { imagenes: { orderBy: { orden: "asc" } } },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  const activeSede = sedes[0]
    ? {
        id: sedes[0].id,
        nombre: sedes[0].nombre,
        slug: sedes[0].slug,
        esProximamente: sedes[0].esProximamente,
      }
    : null;

  const destacadosBD = activeSede
    ? await prisma.producto.findMany({
        where: { destacado: true },
        include: {
          sedes: { where: { sedeId: activeSede.id } },
        },
        orderBy: [{ destacado: "desc" }, { nombre: "asc" }],
        take: 8,
      })
    : [];

  const destacados = destacadosBD.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    slug: p.slug,
    descripcion: p.descripcion,
    imagenUrl: p.imagenUrl,
    tipoProducto: p.tipoProducto,
    destacado: p.destacado,
    tipoMadera: p.tipoMadera,
    densidad: p.densidad,
    humedad: p.humedad,
    medidasDisplay: p.medidasDisplay,
    sedes: p.sedes.map((s) => ({
      id: s.id,
      estado: s.estado,
    })),
  }));

  return (
    <main className="flex-grow">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Maderera San Judas Tadeo",
          url: toAbsoluteUrl("/"),
          logo: toAbsoluteUrl("/images/logo_maderera_san_judas_tadeo.png"),
          areaServed: ["Talara", "Paita", "Chiclayo", "Piura", "Lambayeque"],
        }}
      />
      {/* 1. Hero — La puerta del patio */}
      <section className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6 bg-background flex flex-col justify-center px-gutter py-16 lg:py-24 lg:pl-[max(24px,calc((100vw-1280px)/2))]">
          <div className="max-w-xl">
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-wide text-primary">
              Forjando Calidad,
              <br />
              Construyendo
              <br />
              Confianza.
            </h1>
            <p className="mt-8 text-lg text-on-surface-variant leading-relaxed max-w-md">
              Tablones, triplays y acabados con especificaciones reales —
              densidad, humedad y medidas — y stock verificado en cada sede.
              Arme su despiece y cotice directo por WhatsApp.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo/maderas-en-tablones"
                className="inline-flex items-center gap-3 bg-secondary text-on-secondary font-display text-xl uppercase tracking-wide px-8 py-4 shadow-plate hover:brightness-95 transition-[filter]"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/sedes/talara"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary font-display text-xl uppercase tracking-wide px-8 py-[14px] hover:bg-primary hover:text-on-primary transition-colors"
              >
                Nuestras Sedes
              </Link>
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              Stock verificado por sede · Despacho a obra y taller
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 relative min-h-[460px] lg:min-h-[640px]">
          <Image
            src={heroImg}
            alt="Madera estructural apilada en el aserradero de Maderera San Judas Tadeo"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-5 right-5 bg-secondary text-on-secondary font-sans font-bold uppercase text-base tracking-wide px-4 py-2 rotate-1 shadow-plate">
            Stock verificado por sede
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <MeasureTape label="TABLÓN CACHIMBO 2&quot; x 8&quot; x 10'" className="w-full h-[72px] block" />
          </div>
        </div>
      </section>

      {/* 2. Categorías — Tres líneas de trabajo */}
      <section className="max-w-container-max mx-auto px-gutter py-20 md:py-28">
        <div className="mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-primary">
            Tres líneas de trabajo, un solo patio
          </h2>
          <p className="mt-4 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Del aserradero al depósito: cada línea procesa su material, mide su
            especificación y la publica. Así, usted compara antes de visitar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const catImg = content[cat.contentKey] ?? cat.img;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`${cat.span} group relative overflow-hidden border-2 border-outline-variant bg-surface-container-lowest shadow-plate hover:border-secondary transition-colors`}
              >
                <div className="relative h-56 md:h-72 overflow-hidden">
                  <Image
                    src={catImg}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    aria-hidden
                  />
                  <div className="absolute top-4 left-4 bg-background text-primary font-sans font-bold uppercase text-sm tracking-wide px-3 py-1.5 border border-outline-variant shadow-sm">
                    {cat.tag}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex items-start justify-between gap-4 border-t-2 border-primary bg-surface-container-lowest">
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl uppercase tracking-wide text-primary">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm text-on-surface-variant max-w-lg leading-relaxed">
                      {cat.line}
                    </p>
                  </div>
                  <div className="w-12 h-12 shrink-0 bg-primary text-on-primary flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Destacados — La vitrina del patio */}
      {destacados.length > 0 && activeSede && (
        <section className="max-w-container-max mx-auto px-gutter py-20 md:py-28">
          <RelatedProducts
            productos={destacados}
            activeSede={activeSede}
            titulo="Productos Destacados"
            tituloClassName="text-4xl md:text-6xl"
          />
        </section>
      )}

      {/* 4. Promesas — Hoja de control del patio */}
      <section className="bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto px-gutter py-20 md:py-28">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-on-primary">
            El control de calidad del patio
          </h2>
          <div className="mt-12 border-t-2 border-primary-container">
            {PROMISES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 border-b border-primary-container"
                >
                  <div className="md:col-span-2 flex items-center gap-4">
                    <span className="w-12 h-12 shrink-0 bg-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-on-secondary" strokeWidth={1.75} />
                    </span>
                    <span className="font-mono text-accent text-xs uppercase tracking-widest">
                      Control {["A", "B", "C"][PROMISES.indexOf(p)]}
                    </span>
                  </div>
                  <h3 className="md:col-span-4 font-display text-3xl uppercase tracking-wide text-on-primary">
                    {p.title}
                  </h3>
                  <p className="md:col-span-6 text-on-primary-container leading-relaxed text-sm">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Sedes — Despacho en el Norte */}
      <section className="max-w-container-max mx-auto px-gutter py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-primary">
              Despacho en el Norte
            </h2>
            <p className="mt-4 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Puntos de despacho oficiales de madera estructural, triplays y
              acabados en la costa norte del Perú.
            </p>
          </div>
          <Link
            href="/sedes/talara"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-display text-lg uppercase tracking-wide px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors shrink-0"
          >
            Ver Ubicaciones
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sedes.map((s) => {
            const operativa = !s.esProximamente;
            const img = s.imagenes[0]?.url ?? s.imagenUrl ?? SEDE_IMG_FALLBACK;
            return (
            <div
              key={s.id}
              className={`flex flex-col ${
                operativa
                  ? "bg-surface-container-lowest border-2 border-outline-variant shadow-plate"
                  : "bg-surface-container-low border-2 border-dashed border-outline"
              }`}
            >
              <div className="relative h-48 overflow-hidden border-b-2 border-primary">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  aria-hidden
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-4 flex-grow">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-4xl uppercase tracking-wide text-primary">
                    {s.nombre}
                  </h3>
                  <span
                    className={`font-sans font-bold uppercase text-sm tracking-wide px-3 py-1.5 ${
                      operativa ? "bg-secondary text-on-secondary" : "bg-transparent border border-outline text-on-surface-variant"
                    }`}
                  >
                    {operativa ? "Operativa" : "Próximamente"}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
                  {s.direccion}
                </p>
                <Link
                  href={`/sedes/${s.slug}`}
                  className="mt-auto inline-flex items-center gap-2 font-display text-lg uppercase tracking-wide text-primary hover:text-secondary transition-colors"
                >
                  Ver despacho
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

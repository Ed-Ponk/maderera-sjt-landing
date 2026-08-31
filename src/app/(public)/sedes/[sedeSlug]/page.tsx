import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/shared/lib/prisma";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { toAbsoluteUrl } from "@/shared/lib/site-url";
import { JsonLd } from "@/shared/components/JsonLd";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const sedes = await prisma.sede.findMany({
    where: { activa: true },
    select: { slug: true },
  });
  return sedes.map((s) => ({ sedeSlug: s.slug }));
}

interface SedePageProps {
  params: Promise<{ sedeSlug: string }>;
}

export async function generateMetadata({ params }: SedePageProps): Promise<Metadata> {
  const { sedeSlug } = await params;
  const sede = await prisma.sede.findUnique({
    where: { slug: sedeSlug, activa: true },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  if (!sede) {
    return { title: "Sede no encontrada | Maderera San Judas Tadeo" };
  }

  const cover =
    sede.imagenes[0]?.url ?? sede.imagenUrl ?? null;

  return {
    title: `Sede ${sede.nombre}${sede.esProximamente ? " (Próximamente)" : ""} | Maderera San Judas Tadeo`,
    description: `Información de contacto, ubicación y catálogo disponible para la Sede ${sede.nombre}.`,
    alternates: { canonical: `/sedes/${sede.slug}` },
    openGraph: {
      title: `Sede ${sede.nombre} | Maderera San Judas Tadeo`,
      description: `${sede.direccion}. Contacto y catálogo disponible en la Sede ${sede.nombre}.`,
      url: `/sedes/${sede.slug}`,
      siteName: "Maderera San Judas Tadeo",
      locale: "es_PE",
      type: "website",
      images: cover ? [{ url: toAbsoluteUrl(cover), alt: `Sede ${sede.nombre}` }] : undefined,
    },
  };
}

export default async function SedeDetailPage({ params }: SedePageProps) {
  const { sedeSlug } = await params;

  const sede = await prisma.sede.findUnique({
    where: { slug: sedeSlug, activa: true },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  if (!sede) {
    notFound();
  }

  const todasLasSedes = await prisma.sede.findMany({
    where: { activa: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  const cover =
    sede.imagenes[0]?.url ?? sede.imagenUrl ?? null;

  const whatsappDigits = (sede.telefono || "").replace(/\D/g, "");
  const whatsappLink = whatsappDigits
    ? `https://wa.me/${whatsappDigits}`
    : null;

  const plates = [
    {
      icon: MapPin,
      label: "Dirección",
      value: sede.direccion,
      href: null as string | null,
    },
    {
      icon: Phone,
      label: "Teléfono y WhatsApp",
      value: sede.telefono,
      href: whatsappLink,
    },
    {
      icon: Clock,
      label: "Estado de Atención",
      value: sede.esProximamente
        ? "Próxima apertura / Cotizaciones en línea"
        : "Atención presencial y despacho",
      href: null as string | null,
    },
  ];

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${toAbsoluteUrl(`/sedes/${sede.slug}`)}#store`,
    name: `Maderera San Judas Tadeo - Sede ${sede.nombre}`,
    url: toAbsoluteUrl(`/sedes/${sede.slug}`),
    image: cover ? toAbsoluteUrl(cover) : undefined,
    telephone: sede.telefono,
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.direccion,
      addressLocality: sede.nombre,
      addressCountry: "PE",
    },
  };

  return (
    <main className="max-w-container-max mx-auto px-gutter py-8 md:py-12 flex flex-col gap-8 w-full">
      <JsonLd data={storeJsonLd} />
      {/* Imagen de portada */}
      {cover && (
        <div className="relative h-64 md:h-96 overflow-hidden border-2 border-outline-variant shadow-plate">
          <Image
            src={cover}
            alt={`Sede ${sede.nombre}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Cabecera de sede */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border-2 border-outline-variant shadow-plate flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wide text-primary">
              Sede {sede.nombre}
            </h1>
            <span
              className={`font-sans font-bold uppercase text-sm tracking-wide px-3 py-1.5 shadow-sm ${
                sede.esProximamente
                  ? "bg-transparent border-2 border-dashed border-tertiary text-tertiary"
                  : "bg-secondary text-on-secondary"
              }`}
            >
              {sede.esProximamente ? "Próximamente" : "Operativa"}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
            {sede.esProximamente
              ? "Próxima apertura física en Chiclayo. Captación de pedidos y distribución directa en coordinación desde Piura."
              : `Punto oficial de despacho de madera estructural, triplays y acabados en ${sede.nombre}.`}
          </p>
        </div>

        <Link
          href={`/catalogo/maderas-en-tablones?sede=${sede.slug}`}
          className="bg-secondary text-on-secondary hover:brightness-95 font-display text-lg uppercase tracking-wide py-3.5 px-6 flex items-center gap-2 shadow-plate transition-[filter] shrink-0"
        >
          <span>Ver productos en {sede.nombre}</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </div>

      {/* Placas de datos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plates.map((p) => {
          const Icon = p.icon;
          const inner = (
            <div className="bg-surface-container-lowest p-6 border-2 border-outline-variant shadow-plate flex flex-col gap-3 h-full">
              <span className="w-11 h-11 bg-primary flex items-center justify-center">
                <Icon className="w-5 h-5 text-on-primary" strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-2xl uppercase tracking-wide text-primary">
                {p.label}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{p.value}</p>
            </div>
          );

          return p.href ? (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:border-secondary transition-colors"
            >
              {inner}
            </a>
          ) : (
            <div key={p.label}>{inner}</div>
          );
        })}
      </div>

      {/* Otras sedes */}
      <div className="mt-4 pt-8 border-t-2 border-primary flex flex-col gap-4">
        <h3 className="font-display text-3xl uppercase tracking-wide text-primary">
          Otras Sedes de Atención
        </h3>
        <div className="flex flex-wrap gap-4">
          {todasLasSedes
            .filter((s) => s.slug !== sede.slug)
            .map((s) => (
              <Link
                key={s.id}
                href={`/sedes/${s.slug}`}
                className="bg-surface-container-lowest hover:border-secondary border-2 border-outline-variant py-3 px-5 font-display text-lg uppercase tracking-wide text-on-surface flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-accent-deep" />
                <span>
                  Sede {s.nombre} {s.esProximamente ? "(Próximamente)" : ""}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

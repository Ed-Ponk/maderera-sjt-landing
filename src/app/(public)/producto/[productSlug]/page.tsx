import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/shared/lib/prisma";
import { SpecStrip } from "@/catalogo/components/SpecStrip";
import { ProductDetailCTA } from "@/catalogo/components/ProductDetailCTA";
import { SedeSelector } from "@/sedes/components/SedeSelector";
import { RelatedProducts } from "@/catalogo/components/RelatedProducts";
import { getDefaultSede } from "@/sedes/lib/default-sede";
import { toAbsoluteUrl } from "@/shared/lib/site-url";
import { buildProductTitle } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/components/JsonLd";
import { MeasureTape } from "@/shared/components/visual/MeasureTape";
import { ChevronRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const productos = await prisma.producto.findMany({
    select: { slug: true },
  });
  return productos.map((p) => ({ productSlug: p.slug }));
}

interface ProductPageProps {
  params: Promise<{ productSlug: string }>;
  searchParams: Promise<{ sede?: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const producto = await prisma.producto.findUnique({
    where: { slug: productSlug },
    include: { categoria: true },
  });

  if (!producto) {
    return { title: "Producto no encontrado | Maderera San Judas Tadeo" };
  }

  const title = buildProductTitle(producto.nombre);

  return {
    title,
    description: `Cotiza ${producto.nombre} (${producto.medidasDisplay || "Medidas personalizadas"}). Venta directa y despacho a Talara, Paita y Chiclayo.`,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      title,
      description: `Cotiza ${producto.nombre} (${producto.medidasDisplay || "Medidas personalizadas"}). Venta directa y despacho a Talara, Paita y Chiclayo.`,
      url: `/producto/${producto.slug}`,
      siteName: "Maderera San Judas Tadeo",
      locale: "es_PE",
      type: "website",
      images: [{ url: toAbsoluteUrl(producto.imagenUrl), alt: producto.nombre }],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: ProductPageProps) {
  const { productSlug } = await params;
  const { sede: sedeSlug = "talara" } = await searchParams;

  const producto = await prisma.producto.findUnique({
    where: { slug: productSlug },
    include: {
      categoria: true,
      sedes: {
        include: { sede: true },
      },
    },
  });

  if (!producto) {
    notFound();
  }

  const activeSedeBD =
    (await prisma.sede.findUnique({
      where: { slug: sedeSlug, activa: true },
    })) ||
    (await getDefaultSede());

  const activeSede = {
    id: activeSedeBD?.id || "",
    nombre: activeSedeBD?.nombre || "Talara",
    slug: activeSedeBD?.slug || "talara",
    esProximamente: activeSedeBD?.esProximamente || false,
  };

  const sedesBD = await prisma.sede.findMany({
    where: { activa: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  const sedes = sedesBD.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    slug: s.slug,
    esProximamente: s.esProximamente,
  }));

  const productSedeRelation = producto.sedes.find((s) => s.sedeId === activeSede.id);

  const relacionadosBD = await prisma.producto.findMany({
    where: {
      categoriaId: producto.categoriaId,
      NOT: { id: producto.id },
    },
    include: {
      sedes: {
        where: { sedeId: activeSede.id },
      },
    },
    orderBy: [{ destacado: "desc" }, { nombre: "asc" }],
    take: 8,
  });

  const relacionados = relacionadosBD.map((p) => ({
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

  const mmRows = [
    { label: "Espesor", value: producto.espesorMm },
    { label: "Ancho", value: producto.anchoMm },
    { label: "Largo", value: producto.largoMm },
  ].filter((r) => r.value);

  const productAbsUrl = toAbsoluteUrl(`/producto/${producto.slug}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    image: [toAbsoluteUrl(producto.imagenUrl)],
    brand: { "@type": "Brand", name: "Maderera San Judas Tadeo" },
    category: producto.categoria.nombre,
    url: productAbsUrl,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: toAbsoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: producto.categoria.nombre,
        item: toAbsoluteUrl(`/catalogo/${producto.categoria.slug}`),
      },
      { "@type": "ListItem", position: 3, name: producto.nombre, item: productAbsUrl },
    ],
  };

  return (
    <main className="max-w-container-max mx-auto px-gutter py-8 md:py-12 flex flex-col gap-8 w-full">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-xs text-on-surface-variant" aria-label="Ruta de navegación">
        <Link href="/" className="hover:text-secondary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-outline" />
        <Link href={`/catalogo/${producto.categoria.slug}`} className="hover:text-secondary transition-colors">
          {producto.categoria.nombre}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-outline" />
        <span className="font-semibold text-primary">{producto.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-surface-container-lowest p-6 md:p-10 border-2 border-outline-variant shadow-plate">
        {/* Despiece visual */}
        <div>
          <div className="relative w-full aspect-square bg-surface-variant overflow-hidden border-2 border-outline-variant">
            <span className="absolute top-4 right-4 z-10 bg-secondary text-on-secondary font-sans font-bold uppercase text-sm tracking-wide px-3 py-1.5 shadow-plate">
              Ficha Técnica
            </span>
            <Image
              src={producto.imagenUrl}
              alt={producto.nombre}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
          {producto.medidasDisplay && (
            <MeasureTape label={producto.medidasDisplay} className="w-full h-12 block mt-4" />
          )}
        </div>

        {/* Detalle y acciones */}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-sans font-bold uppercase text-sm tracking-wide bg-primary text-on-primary px-3 py-1.5">
                {producto.categoria.nombre}
              </span>
              <Suspense
                fallback={
                  <span className="font-mono text-xs font-semibold text-on-surface-variant">
                    Sede {activeSede.nombre} {activeSede.esProximamente ? "(Próximamente)" : ""}
                  </span>
                }
              >
                <SedeSelector sedes={sedes} />
              </Suspense>
            </div>

            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-primary leading-tight">
              {producto.nombre}
            </h1>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {producto.descripcion}
            </p>

            <div className="border-2 border-outline-variant p-5">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent-deep mb-3">
                Ficha Técnica de Especificaciones
              </h3>
              <SpecStrip
                tipoProducto={producto.tipoProducto}
                tipoMadera={producto.tipoMadera}
                densidad={producto.densidad}
                humedad={producto.humedad}
                medidasDisplay={producto.medidasDisplay}
              />
            </div>

            {mmRows.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {mmRows.map((r) => (
                  <div key={r.label} className="border-2 border-outline-variant p-3 flex flex-col gap-1 bg-surface-container-lowest">
                    <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                      {r.label}
                    </span>
                    <span className="font-mono text-lg font-bold text-primary">
                      {r.value} mm
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t-2 border-primary">
            <ProductDetailCTA
              producto={{
                id: producto.id,
                nombre: producto.nombre,
                medidasDisplay: producto.medidasDisplay,
              }}
              activeSede={activeSede}
              productSedeRelation={productSedeRelation}
            />

            <Link
              href={`/catalogo/${producto.categoria.slug}?sede=${activeSede.slug}`}
              className="font-mono text-xs text-on-surface-variant hover:text-secondary flex items-center justify-center gap-1 mt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a {producto.categoria.nombre}</span>
            </Link>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <RelatedProducts
          productos={relacionados}
          activeSede={activeSede}
          categoriaNombre={producto.categoria.nombre}
        />
      )}
    </main>
  );
}

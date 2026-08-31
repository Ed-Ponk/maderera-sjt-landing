import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductGrid } from "@/catalogo/components/ProductGrid";
import { CategoryNav } from "@/catalogo/components/CategoryNav";
import { ProductFilters } from "@/catalogo/components/ProductFilters";
import { SedeSelector } from "@/sedes/components/SedeSelector";
import { getDefaultSede } from "@/sedes/lib/default-sede";
import { toAbsoluteUrl } from "@/shared/lib/site-url";
import { JsonLd } from "@/shared/components/JsonLd";
import type { Metadata } from "next";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categorias = await prisma.categoria.findMany({
    select: { slug: true },
  });
  return categorias.map((c) => ({ categorySlug: c.slug }));
}

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    sede?: string;
    madera?: string;
    espesorMin?: string;
    espesorMax?: string;
    anchoMin?: string;
    anchoMax?: string;
    largoMin?: string;
    largoMax?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoria = await prisma.categoria.findUnique({
    where: { slug: categorySlug },
  });

  if (!categoria) {
    return { title: "Categoría no encontrada | Maderera San Judas Tadeo" };
  }

  const primerProducto = await prisma.producto.findFirst({
    where: { categoriaId: categoria.id },
    select: { imagenUrl: true },
    orderBy: { nombre: "asc" },
  });

  return {
    title: `${categoria.nombre} | Maderera San Judas Tadeo`,
    description: categoria.descripcion || `Explora nuestro catálogo de ${categoria.nombre}. Envíos a Talara, Paita y Chiclayo.`,
    alternates: { canonical: `/catalogo/${categoria.slug}` },
    openGraph: {
      title: `${categoria.nombre} | Maderera San Judas Tadeo`,
      description: categoria.descripcion || `Explora nuestro catálogo de ${categoria.nombre}. Envíos a Talara, Paita y Chiclayo.`,
      url: `/catalogo/${categoria.slug}`,
      siteName: "Maderera San Judas Tadeo",
      locale: "es_PE",
      type: "website",
      images: primerProducto
        ? [{ url: toAbsoluteUrl(primerProducto.imagenUrl), alt: categoria.nombre }]
        : undefined,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  const {
    sede: sedeSlug = "talara",
    madera,
    espesorMin,
    espesorMax,
    anchoMin,
    anchoMax,
    largoMin,
    largoMax,
  } = await searchParams;

  // 1. Obtener la Categoría de la BD
  const categoria = await prisma.categoria.findUnique({
    where: { slug: categorySlug },
  });

  if (!categoria) {
    notFound();
  }

  // 2. Obtener la Sede activa seleccionada (solo sedes visibles en el sitio)
  const activeSedeBD =
    (await prisma.sede.findUnique({
      where: { slug: sedeSlug, activa: true },
    })) ||
    (await getDefaultSede());

  if (!activeSedeBD) {
    notFound();
  }

  const activeSede = {
    id: activeSedeBD.id,
    nombre: activeSedeBD.nombre,
    slug: activeSedeBD.slug,
    esProximamente: activeSedeBD.esProximamente,
  };

  // 2b. Todas las sedes para el filtro de sede del catálogo
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

  // 3. Construir la clausula where para productos
  const where: Prisma.ProductoWhereInput = {
    categoriaId: categoria.id,
    ...(madera ? { tipoMadera: { equals: madera } } : {}),
    ...(espesorMin || espesorMax
      ? {
          espesorMm: {
            gte: espesorMin ? parseFloat(espesorMin) : undefined,
            lte: espesorMax ? parseFloat(espesorMax) : undefined,
          },
        }
      : {}),
    ...(anchoMin || anchoMax
      ? {
          anchoMm: {
            gte: anchoMin ? parseFloat(anchoMin) : undefined,
            lte: anchoMax ? parseFloat(anchoMax) : undefined,
          },
        }
      : {}),
    ...(largoMin || largoMax
      ? {
          largoMm: {
            gte: largoMin ? parseFloat(largoMin) : undefined,
            lte: largoMax ? parseFloat(largoMax) : undefined,
          },
        }
      : {}),
  };

  // 4. Ejecutar la consulta de productos con Prisma incluyendo sedes filtradas
  const productosBD = await prisma.producto.findMany({
    where,
    include: {
      categoria: true,
      sedes: {
        where: { sedeId: activeSede.id },
      },
    },
    orderBy: { nombre: "asc" },
  });

  // 5. Obtener los tipos de madera distintos directamente de la BD para la categoría actual
  const maderasRaw = await prisma.producto.findMany({
    where: {
      categoriaId: categoria.id,
      tipoMadera: { not: null },
    },
    select: { tipoMadera: true },
    distinct: ["tipoMadera"],
  });

  const maderasDisponibles = maderasRaw
    .map((p) => p.tipoMadera)
    .filter((m): m is string => Boolean(m));

  // Mapear productos a formato plano
  const productos = productosBD.map((p) => ({
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
    <main className="max-w-container-max mx-auto px-gutter py-8 md:py-12 flex flex-col lg:flex-row gap-8 w-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: toAbsoluteUrl("/") },
            {
              "@type": "ListItem",
              position: 2,
              name: categoria.nombre,
              item: toAbsoluteUrl(`/catalogo/${categoria.slug}`),
            },
          ],
        }}
      />
      {/* Navegación por Categorías */}
      <CategoryNav activeCategorySlug={categorySlug} />

      {/* Área Principal de Productos */}
      <section className="flex-grow flex flex-col gap-6 w-full">
        {/* Cabecera de Categoría */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-primary pb-6">
          <div>
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wide text-primary">
              {categoria.nombre}
            </h1>
            <p className="text-sm text-on-surface-variant mt-3 max-w-2xl leading-relaxed">
              {categoria.descripcion || `Mostrando ${productos.length} resultados`}
            </p>
          </div>
          <span className="font-sans font-bold uppercase text-sm tracking-wide bg-primary text-on-primary px-4 py-2 shadow-plate shrink-0">
            Sede {activeSede.nombre} {activeSede.esProximamente ? "— Próximamente" : ""}
          </span>
        </div>

        {/* Filtro de sede propio del catálogo */}
        <Suspense fallback={<div className="h-16 w-64 bg-surface-container rounded animate-pulse" />}>
          <SedeSelector sedes={sedes} withLabel />
        </Suspense>

        {/* Bar de Filtros Dinámicos con Suspense Boundary */}
        <Suspense fallback={<div className="h-16 w-full bg-surface-container rounded-xl animate-pulse" />}>
          <ProductFilters maderasDisponibles={maderasDisponibles} />
        </Suspense>

        {/* Grid de Productos */}
        <ProductGrid productos={productos} activeSede={activeSede} />
      </section>
    </main>
  );
}

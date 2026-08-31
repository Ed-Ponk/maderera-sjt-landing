import type { MetadataRoute } from "next";
import { prisma } from "@/shared/lib/prisma";
import { getSiteUrl } from "@/shared/lib/site-url";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const categorias = await prisma.categoria.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { orden: "asc" },
  });

  const productos = await prisma.producto.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { nombre: "asc" },
  });

  const sedes = await prisma.sede.findMany({
    where: { activa: true },
    select: { slug: true, updatedAt: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...categorias.map((c) => ({
      url: `${baseUrl}/catalogo/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...productos.map((p) => ({
      url: `${baseUrl}/producto/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...sedes.map((s) => ({
      url: `${baseUrl}/sedes/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
import type { Metadata } from "next";
import { prisma } from "@/shared/lib/prisma";
import { getDefaultSede } from "@/sedes/lib/default-sede";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Maderera San Judas Tadeo",
  description:
    "Catálogo oficial de maderas estructurales en tablones, triplays marinos y acabados. Sedes en Talara, Paita y Chiclayo.",
  openGraph: {
    title: "Maderera San Judas Tadeo - Catálogo Corporativo",
    description:
      "Venta de madera nacional e importada de alta calidad para construcción y carpintería en el Norte del Perú.",
    siteName: "Maderera San Judas Tadeo",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
        alt: "Maderera San Judas Tadeo",
      },
    ],
  },
};

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sedesBD = await prisma.sede.findMany({
    where: { activa: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  const sedes = sedesBD.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    slug: s.slug,
    esProximamente: s.esProximamente,
    direccion: s.direccion,
    telefono: s.telefono,
  }));

  const defaultSede = await getDefaultSede();
  const defaultSedeSlug = defaultSede?.slug ?? sedes[0]?.slug ?? "talara";

  const contactosBD = await prisma.contacto.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });

  const contactos = contactosBD.map((c) => ({
    nombre: c.nombre,
    whatsapp: c.whatsapp,
  }));

  const redesBD = await prisma.redSocial.findMany({
    where: { activo: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  const redes = redesBD.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    url: r.url,
    icono: r.icono,
  }));

  return (
    <>
      <div
        aria-hidden="true"
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html: `<!--\nimpeccable:contract\nTHESIS: El Aserradero — la maderera donde el catálogo es el despiece de la troza: especificaciones dimensionadas, stock por sede y la cotización como ticket de corte. Rechaza el hero genérico de foto + grilla.\nOWN-WORLD: luz de patio soleado (aserrín #f4ead6), acero carbón #26261f como tinta, madera #7a5230 y naranja de seguridad #e05e16 como acento comprometido. Estarcido (Big Shoulders Stencil) reservado al bloque DESPIECE de la cinta y placas grandes; sellos de stock en Archivo bold para legibilidad, Big Shoulders en titulares condensados, Archivo en lectura, JetBrains Mono en medidas. Llamadas de cota sobre la madera; sellos de DISPONIBLE / A PEDIDO / PRÓXIMAMENTE.\nSTORY: el visitante entiende que compra especificación y stock real, confía en la casa, arma su despiece y lo envía por WhatsApp.\nFIRST VIEWPORT: la puerta del patio: tablón a escala con cotas (espesor/ancho/largo) como héroe, nombre estarcido sobre placa naranja, CTA Ver Catálogo como orden de corte.\nFORM: dirección 4 (aserradero) de la lista; seed 24e32d71.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md\n-->`,
        }}
      />
      <Header sedes={sedes} contactos={contactos} defaultSedeSlug={defaultSedeSlug} />
      <div className="flex-grow">{children}</div>
      <Footer sedes={sedes} redes={redes} />
    </>
  );
}

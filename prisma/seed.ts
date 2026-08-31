import { PrismaClient, TipoProducto, EstadoDisponibilidad, Rol } from "@prisma/client";
import { formatTipoMadera } from "../src/shared/lib/utils";
import { hashPassword } from "../src/admin/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.productoImagen.deleteMany();
  await prisma.sedeImagen.deleteMany();
  await prisma.productoSede.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.sede.deleteMany();
  await prisma.contacto.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Creando sedes reales...");
  const talara = await prisma.sede.create({
    data: {
      nombre: "Talara",
      slug: "talara",
      direccion: "Mza. C Lote 10, Urb. Los Robles, Talara",
      telefono: "+51 933 332 094",
      esProximamente: false,
      activa: true,
      orden: 0,
      imagenUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
    },
  });

  const paita = await prisma.sede.create({
    data: {
      nombre: "Paita",
      slug: "paita",
      direccion: "Urbanización Sol y Mar, Mz. C Lt. 6, Paita, Piura",
      telefono: "+51 933 332 094",
      esProximamente: false,
      activa: true,
      orden: 1,
      imagenUrl: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&q=80",
    },
  });

  const chiclayo = await prisma.sede.create({
    data: {
      nombre: "Chiclayo",
      slug: "chiclayo",
      direccion: "Próxima Apertura - Av. Panamericana Norte, Chiclayo, Lambayeque",
      telefono: "+51 972 345 680",
      esProximamente: true, // Chiclayo siempre disponible para leads con CTA "Próximamente"
      activa: true,
      orden: 2,
      imagenUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
    },
  });

  console.log("Creando categorías...");
  const catTablones = await prisma.categoria.create({
    data: {
      nombre: "Maderas en Tablones",
      slug: "maderas-en-tablones",
      descripcion: "Tablones estructurales y de carpintería fina en maderas nacionales e importadas de primera calidad.",
      orden: 1,
    },
  });

  const catTriplays = await prisma.categoria.create({
    data: {
      nombre: "Triplays y Tableros",
      slug: "triplays-y-procesados",
      descripcion: "Tableros fenólicos, marinos y melamínicos altamente resistentes para encofrado y mueblería.",
      orden: 2,
    },
  });

  const catAcabados = await prisma.categoria.create({
    data: {
      nombre: "Acabados y Complementos",
      slug: "acabados-y-complementos",
      descripcion: "Vigas, listones, molduras y accesorios para construcción y acabado arquitectónico.",
      orden: 3,
    },
  });

  console.log("Creando productos con datos realistas...");
  
  // 1. Tablón Cachimbo
  const pCachimbo = await prisma.producto.create({
    data: {
      nombre: "Tablón Cachimbo",
      slug: "tablon-cachimbo",
      descripcion: "Madera nacional pesada y de excelente estabilidad dimensional. Ideal para estructuras pesadas, vigas, carrocerías y carpintería en general.",
      imagenUrl: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80",
      tipoProducto: TipoProducto.MADERA_TABLON,
      tipoMadera: formatTipoMadera("Cachimbo"),
      densidad: "0.68 g/cm³",
      humedad: "12% - 15% (Secado al aire)",
      espesorMm: 50.8,
      anchoMm: 203.2,
      largoMm: 3048.0,
      medidasDisplay: '2" x 8" x 10\'',
      destacado: true,
      categoriaId: catTablones.id,
    },
  });

  // 2. Tablón Copaiba
  const pCopaiba = await prisma.producto.create({
    data: {
      nombre: "Tablón Copaiba",
      slug: "tablon-copaiba",
      descripcion: "Madera medianamente pesada con excelente resistencia a hongos e insectos. Muy utilizada en encofrados, pisos y marcos de puertas.",
      imagenUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      tipoProducto: TipoProducto.MADERA_TABLON,
      tipoMadera: formatTipoMadera("Copaiba"),
      densidad: "0.72 g/cm³",
      humedad: "12% - 14%",
      espesorMm: 50.8,
      anchoMm: 254.0,
      largoMm: 3048.0,
      medidasDisplay: '2" x 10" x 10\'',
      destacado: true,
      categoriaId: catTablones.id,
    },
  });

  // 3. Tablón Tornillo
  const pTornillo = await prisma.producto.create({
    data: {
      nombre: "Tablón Tornillo",
      slug: "tablon-tornillo",
      descripcion: "La madera estructural por excelencia en el Norte del Perú. Gran facilidad de trabajado y altísima durabilidad natural.",
      imagenUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      tipoProducto: TipoProducto.MADERA_TABLON,
      tipoMadera: formatTipoMadera("Tornillo"),
      densidad: "0.59 g/cm³",
      humedad: "12% - 15%",
      espesorMm: 38.1,
      anchoMm: 152.4,
      largoMm: 3657.6,
      medidasDisplay: '1.5" x 6" x 12\'',
      destacado: true,
      categoriaId: catTablones.id,
    },
  });

  // 4. Tablón Pino Radiata
  const pPino = await prisma.producto.create({
    data: {
      nombre: "Tablón Pino Radiata",
      slug: "tablon-pino-radiata",
      descripcion: "Madera importada tratada en autoclave con Cobre Micronizado. Ideal para encofrados, andamios y carpintería liviana.",
      imagenUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      tipoProducto: TipoProducto.MADERA_TABLON,
      tipoMadera: formatTipoMadera("Pino"),
      densidad: "0.48 g/cm³",
      humedad: "10% - 12%",
      espesorMm: 50.8,
      anchoMm: 101.6,
      largoMm: 3048.0,
      medidasDisplay: '2" x 4" x 10\'',
      destacado: false,
      categoriaId: catTablones.id,
    },
  });

  // 5. Triplay Marino 18mm (Tablero Procesado -> tipoMadera es null)
  const pTriplayMarino = await prisma.producto.create({
    data: {
      nombre: "Triplay Marino Fenólico 18mm",
      slug: "triplay-marino-18mm",
      descripcion: "Tablero fenólico de alta resistencia a la humedad y químicos. Película protectora exterior para múltiples usos de encofrado cara vista.",
      imagenUrl: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80",
      tipoProducto: TipoProducto.TABLERO_PROCESADO,
      tipoMadera: null, // Tablero procesado omite tipoMadera
      densidad: "650 kg/m³",
      humedad: "8% - 10%",
      espesorMm: 18.0,
      anchoMm: 1220.0,
      largoMm: 2440.0,
      medidasDisplay: "1.22m x 2.44m x 18mm",
      destacado: true,
      categoriaId: catTriplays.id,
    },
  });

  // 6. Triplay Film Marrón 15mm (Tablero Procesado -> tipoMadera es null)
  const pTriplayFilm = await prisma.producto.create({
    data: {
      nombre: "Triplay Film Marrón 15mm",
      slug: "triplay-film-marron-15mm",
      descripcion: "Tablero recubierto con película de resina fenólica de 120g/m² por ambas caras. Alta rotabilidad en vaciado de concreto.",
      imagenUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      tipoProducto: TipoProducto.TABLERO_PROCESADO,
      tipoMadera: null,
      densidad: "680 kg/m³",
      humedad: "8% - 10%",
      espesorMm: 15.0,
      anchoMm: 1220.0,
      largoMm: 2440.0,
      medidasDisplay: "1.22m x 2.44m x 15mm",
      destacado: false,
      categoriaId: catTriplays.id,
    },
  });

  console.log("Asociando inventarios por sede (Talara y Paita)...");
  
  // Talara inventario
  await prisma.productoSede.createMany({
    data: [
      { productoId: pCachimbo.id, sedeId: talara.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pCopaiba.id, sedeId: talara.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pTornillo.id, sedeId: talara.id, estado: EstadoDisponibilidad.A_PEDIDO },
      { productoId: pPino.id, sedeId: talara.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pTriplayMarino.id, sedeId: talara.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pTriplayFilm.id, sedeId: talara.id, estado: EstadoDisponibilidad.DISPONIBLE },
    ],
  });

  // Paita inventario
  await prisma.productoSede.createMany({
    data: [
      { productoId: pCachimbo.id, sedeId: paita.id, estado: EstadoDisponibilidad.A_PEDIDO },
      { productoId: pCopaiba.id, sedeId: paita.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pTornillo.id, sedeId: paita.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pPino.id, sedeId: paita.id, estado: EstadoDisponibilidad.A_PEDIDO },
      { productoId: pTriplayMarino.id, sedeId: paita.id, estado: EstadoDisponibilidad.DISPONIBLE },
      { productoId: pTriplayFilm.id, sedeId: paita.id, estado: EstadoDisponibilidad.A_PEDIDO },
    ],
  });

  console.log("Base de datos sembrada con éxito.");

  console.log("Sincronizando galerías de producto (cover)...");
  const allProductos = await prisma.producto.findMany({
    select: { id: true, imagenUrl: true },
  });
  await prisma.productoImagen.createMany({
    data: allProductos.map((p) => ({
      productoId: p.id,
      url: p.imagenUrl,
      orden: 0,
    })),
  });

  console.log("Sincronizando galerías de sede (cover)...");
  const allSedes = await prisma.sede.findMany({
    select: { id: true, imagenUrl: true },
  });
  await prisma.sedeImagen.createMany({
    data: allSedes
      .filter((s) => s.imagenUrl)
      .map((s) => ({
        sedeId: s.id,
        url: s.imagenUrl!,
        orden: 0,
      })),
  });

  console.log("Sembrando contenido editable (SiteContent)...");
  await prisma.siteContent.createMany({
    data: [
      { key: "inicio_hero_imagen", value: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80" },
      { key: "inicio_categoria_madera_imagen", value: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80" },
      { key: "inicio_categoria_tablero_imagen", value: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=900&q=80" },
      { key: "inicio_categoria_acabados_imagen", value: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=1200&q=80" },
      { key: "nosotros_imagen_1", value: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80" },
      { key: "nosotros_imagen_2", value: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80" },
    ],
  });

  console.log("Sembrando contactos ficticios (placeholder)...");
  await prisma.contacto.createMany({
    data: [
      { nombre: "Ventas Talara", whatsapp: "+51 900 000 001", cargo: "Ventas", activo: true },
      { nombre: "Ventas Paita", whatsapp: "+51 900 000 002", cargo: "Ventas", activo: true },
    ],
  });

  console.log("Creando usuarios iniciales...");
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (adminPassword) {
    await prisma.usuario.create({
      data: {
        email: "admin@madererasanjudastadeo.com",
        nombre: "Administrador",
        passwordHash: await hashPassword(adminPassword),
        rol: Rol.ADMIN,
        activo: true,
      },
    });
  } else {
    console.warn("ADMIN_INITIAL_PASSWORD no definido: no se creó el usuario admin.");
  }

  const vendedorPassword = process.env.VENDEDOR_INITIAL_PASSWORD;
  if (vendedorPassword) {
    await prisma.usuario.create({
      data: {
        email: "vendedor@madererasanjudastadeo.com",
        nombre: "Vendedor",
        passwordHash: await hashPassword(vendedorPassword),
        rol: Rol.VENDEDOR,
        activo: true,
      },
    });
  } else {
    console.warn("VENDEDOR_INITIAL_PASSWORD no definido: no se creó el usuario vendedor.");
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

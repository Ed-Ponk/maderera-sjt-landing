import type { Metadata } from "next";
import Image from "next/image";
import {
  Leaf,
  BadgeCheck,
  Handshake,
  Scissors,
  Ruler,
  Wrench,
  Truck,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { MeasureTape } from "@/shared/components/visual/MeasureTape";
import { getContentImages } from "@/admin/content/content";

export const metadata: Metadata = {
  title: "Nosotros y Servicios | Maderera San Judas Tadeo",
  description:
    "Conoce nuestra historia, valores y servicios de valor añadido. Somos el referente regional en maderas nacionales e importadas en el norte del Perú.",
  openGraph: {
    title: "Nosotros y Servicios | Maderera San Judas Tadeo",
    description:
      "Forjando calidad, construyendo confianza. Desde el corazón del bosque hasta su proyecto.",
    url: "/nosotros",
    siteName: "Maderera San Judas Tadeo",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
        alt: "Aserradero Maderera San Judas Tadeo",
      },
    ],
  },
};

const VALUES = [
  {
    icon: Leaf,
    title: "Sostenibilidad",
    desc: "Gestión responsable de los recursos forestales, asegurando un ciclo de vida orgánico y el respeto absoluto por el entorno natural del cual extraemos nuestra fuerza.",
  },
  {
    icon: BadgeCheck,
    title: "Calidad Inflexible",
    desc: "Selección rigurosa y procesos de secado precisos. Proveemos materiales que cumplen con los estándares arquitectónicos más exigentes, garantizando estabilidad estructural.",
  },
  {
    icon: Handshake,
    title: "Tradición de Servicio",
    desc: "Relaciones a largo plazo forjadas en la confianza. Nuestro conocimiento heredado se traduce en asesoría experta para cada uno de sus proyectos constructivos.",
  },
];

const SERVICES = [
  {
    icon: Scissors,
    title: "Corte a Medida",
    desc: "Precisión milimétrica en el despiece de tableros y listones según las especificaciones exactas de sus planos estructurales.",
  },
  {
    icon: Ruler,
    title: "Dimensionado",
    desc: "Cepillado y calibrado industrial para asegurar grosores y anchos uniformes, vital para ensamblajes arquitectónicos perfectos.",
  },
  {
    icon: Wrench,
    title: "Asesoría Técnica",
    desc: "Nuestros especialistas evalúan sus requerimientos de carga, humedad y estética para recomendar la especie maderable idónea.",
  },
  {
    icon: Truck,
    title: "Entregas a Domicilio",
    desc: "Logística especializada para transportar volúmenes pesados directamente a obra, manteniendo la integridad del material.",
  },
];

const WHATSAPP_LINK = "https://wa.me/51933332094";

export default async function NosotrosPage() {
  const content = await getContentImages();
  const imagenPrincipal = content["nosotros_imagen_1"] ?? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80";
  const imagenHistoria = content["nosotros_imagen_2"] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80";

  return (
    <main>
      {/* Hero */}
      <section className="max-w-container-max mx-auto px-gutter py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-wide text-primary">
              Forjando Calidad,
              <br />
              <span className="text-on-surface-variant">
                Construyendo Confianza.
              </span>
            </h1>
            <p className="mt-8 text-lg text-on-surface-variant leading-relaxed max-w-xl">
              Desde el corazón del bosque hasta su proyecto. Somos el puente
              entre la naturaleza cruda y la ingeniería profesional en el norte
              del Perú, ofreciendo maderas de la más alta integridad estructural.
            </p>
          </div>
          <div className="relative h-[420px] lg:h-[560px] overflow-hidden border-2 border-outline-variant shadow-plate-lg">
            <Image
              src={imagenPrincipal}
              alt="Madera apilada en el aserradero de Maderera San Judas Tadeo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <MeasureTape label="TALARA · PAITA · CHICLAYO" className="absolute inset-x-0 bottom-0 w-full h-[52px] block" />
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="bg-surface-container-low border-y-2 border-outline-variant">
        <div className="max-w-container-max mx-auto px-gutter py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative h-[420px] md:h-[620px] border-2 border-outline-variant shadow-plate-lg overflow-hidden">
            <Image
              src={imagenHistoria}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              aria-hidden
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-primary leading-[0.95]">
              Raíces Profundas, Visión Moderna.
            </h2>
            <div className="mt-8 space-y-6 text-base text-on-surface-variant leading-relaxed">
              <p>
                Fundada con el compromiso de proveer los mejores materiales a
                las firmas constructoras y arquitectos de Piura y Chiclayo.
                Maderera San Judas Tadeo comenzó como un aserradero local y ha
                evolucionado hasta convertirse en el referente regional en
                maderas nacionales e importadas.
              </p>
              <p>
                Nuestra filosofía se basa en el respeto por la materia prima y
                la precisión en la entrega. Cada pieza de madera que procesamos
                lleva consigo el peso de nuestra tradición y la garantía de una
                calidad inflexible, diseñada para soportar el paso del tiempo y
                las exigencias de la ingeniería moderna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores — Hoja de control */}
      <section className="max-w-container-max mx-auto px-gutter py-16 md:py-24">
        <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-primary">
          Nuestros Valores Fundamentales
        </h2>
        <div className="mt-12 border-t-2 border-primary">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 border-b border-outline-variant"
              >
                <div className="md:col-span-2 flex items-center gap-4">
                  <span className="w-12 h-12 shrink-0 bg-secondary flex items-center justify-center">
                    <Icon className="w-6 h-6 text-on-secondary" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-accent-deep text-xs uppercase tracking-widest">
                    Control {["A", "B", "C"][i]}
                  </span>
                </div>
                <h3 className="md:col-span-4 font-display text-3xl uppercase tracking-wide text-primary">
                  {v.title}
                </h3>
                <p className="md:col-span-6 text-on-surface-variant leading-relaxed text-sm">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Servicios — Plano de capacidades */}
      <section className="bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto px-gutter py-16 md:py-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-primary-container pb-8">
            <div>
              <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-on-primary">
                Servicios de Valor Añadido
              </h2>
            </div>
            <p className="text-on-primary-container text-sm max-w-md leading-relaxed">
              Optimizamos sus procesos constructivos mediante soluciones a
              medida, ejecutadas con precisión industrial.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-primary-container">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-primary p-8 flex flex-col gap-4">
                  <span className="w-14 h-14 bg-secondary flex items-center justify-center">
                    <Icon className="w-7 h-7 text-on-secondary" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-3xl uppercase tracking-wide text-on-primary">
                    {s.title}
                  </h3>
                  <p className="text-on-primary-container text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="max-w-container-max mx-auto px-gutter py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-2 border-outline-variant bg-surface-container-lowest shadow-plate">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-primary">
              Inicie su Proyecto
            </h2>
            <p className="mt-6 text-on-surface-variant leading-relaxed text-base">
              Póngase en contacto con nuestros especialistas para cotizar
              materiales o solicitar asesoría estructural. Estamos listos para
              proveer la base de su próxima gran obra.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-secondary text-on-secondary font-display text-xl uppercase tracking-wide px-8 py-4 shadow-plate hover:brightness-95 transition-[filter]"
              >
                <Phone className="w-5 h-5" strokeWidth={2} />
                Cotizar por WhatsApp
              </a>

              <div className="border-t-2 border-outline-variant mt-4 pt-4 flex flex-col gap-3">
                <p className="flex items-center gap-3 text-sm text-primary font-semibold">
                  <span className="w-9 h-9 bg-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-on-primary" />
                  </span>
                  Sede Principal: Piura, Perú
                </p>
                <p className="flex items-center gap-3 text-sm text-primary font-semibold">
                  <span className="w-9 h-9 bg-primary flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-primary" />
                  </span>
                  +51 933 332 094
                </p>
                <p className="flex items-center gap-3 text-sm text-primary font-semibold">
                  <span className="w-9 h-9 bg-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-primary" />
                  </span>
                  ventas@madererasanjudastadeo.com
                </p>
              </div>
            </div>
          </div>

          <form className="p-8 md:p-12 bg-surface-container-low border-l-2 border-outline-variant flex flex-col gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-primary mb-2">
                Nombre Completo / Empresa
              </label>
              <input
                className="w-full bg-surface-container-lowest border-2 border-outline-variant px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Ingrese sus datos"
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-primary mb-2">
                  Teléfono
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="+51"
                  type="tel"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-primary mb-2">
                  Correo Electrónico
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="ejemplo@correo.com"
                  type="email"
                />
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <label className="block font-mono text-xs uppercase tracking-widest text-primary mb-2">
                Requerimiento o Consulta
              </label>
              <textarea
                className="w-full flex-grow bg-surface-container-lowest border-2 border-outline-variant px-4 py-3 focus:outline-none focus:border-secondary transition-colors resize-none"
                placeholder="Describa el volumen, especie de madera o servicio requerido..."
                rows={6}
              />
            </div>
            <button
              className="w-full bg-primary text-on-primary hover:bg-primary-container font-display text-xl uppercase tracking-wide px-8 py-4 shadow-plate transition-colors"
              type="submit"
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

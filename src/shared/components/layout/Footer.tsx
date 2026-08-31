import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { MapPin, Phone, Mail, Share2, type LucideIcon } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { IconType } from "react-icons";
import { SedeOption } from "@/shared/lib/types";
import {
  WHATSAPP_NUMBERS,
  formatWhatsAppNumber,
  cleanWhatsAppNumber,
} from "@/cotizacion/lib/whatsapp";

export interface RedSocial {
  id: string;
  nombre: string;
  url: string;
  icono: string;
}

export interface ContactoFooter {
  nombre?: string;
  whatsapp: string;
}

interface FooterProps {
  sedes: (SedeOption & { direccion?: string })[];
  redes?: RedSocial[];
  contactos?: ContactoFooter[];
  email?: string;
}

const SOCIAL_ICONS: Record<string, IconType | LucideIcon> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
};

const DEFAULT_EMAIL = "ventas@madererasanjudastadeo.com";
const CURRENT_YEAR = new Date().getFullYear();

export function Footer({
  sedes,
  redes = [],
  contactos = [],
  email = DEFAULT_EMAIL,
}: FooterProps) {
  // Obtener la lista de números (máximo 2 para mantener la línea limpia)
  const phoneNumbers = (
    contactos.length > 0 ? contactos.map((c) => c.whatsapp) : WHATSAPP_NUMBERS
  ).slice(0, 2);

  return (
    <footer className="bg-primary text-on-primary">
      <div className="max-w-container-max mx-auto px-gutter py-14 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Marca & Contacto */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <Image
            src="/images/logo_maderera_san_judas_tadeo_white.png"
            alt="Logo Maderera San Judas Tadeo"
            width={256}
            height={64}
            className="w-64 h-auto object-contain"
          />

          <div className="flex flex-col gap-2 text-sm">
            {/* Teléfonos con separador | */}
            <div className="inline-flex flex-wrap items-center gap-2 text-on-primary-container">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              {phoneNumbers.map((phone, index) => {
                const cleanPhone = cleanWhatsAppNumber(phone);
                const displayPhone = formatWhatsAppNumber(phone);

                return (
                  <Fragment key={phone}>
                    {index > 0 && (
                      <span className="text-on-primary-container/40 select-none">
                        |
                      </span>
                    )}
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-on-primary transition-colors whitespace-nowrap"
                    >
                      {displayPhone}
                    </a>
                  </Fragment>
                );
              })}
            </div>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-on-primary-container hover:text-on-primary transition-colors w-fit"
            >
              <Mail className="w-4 h-4 text-accent shrink-0" />
              {email}
            </a>
          </div>

          {/* Redes */}
          <div className="flex flex-col gap-3 mt-2">
            <h4 className="font-sans font-bold text-accent uppercase tracking-wide">
              Redes
            </h4>
            <div className="flex items-center gap-3">
              {redes.map((red) => {
                const IconComponent =
                  SOCIAL_ICONS[red.icono.toLowerCase()] ?? Share2;

                return (
                  <a
                    key={red.id}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar nuestro perfil de ${red.nombre}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-on-primary/20 text-on-primary-container hover:text-on-primary hover:border-accent transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Catálogo */}
        <div className="md:col-span-3 flex flex-col gap-3 text-sm">
          <h4 className="font-sans font-bold text-accent uppercase tracking-wide">
            Catálogo
          </h4>
          <Link
            href="/catalogo/maderas-en-tablones"
            className="text-on-primary-container hover:text-on-primary transition-colors w-fit"
          >
            Maderas en Tablones
          </Link>
          <Link
            href="/catalogo/triplays-y-procesados"
            className="text-on-primary-container hover:text-on-primary transition-colors w-fit"
          >
            Triplays y Tableros
          </Link>
          <Link
            href="/catalogo/acabados-y-complementos"
            className="text-on-primary-container hover:text-on-primary transition-colors w-fit"
          >
            Acabados y Complementos
          </Link>
          <Link
            href="/nosotros"
            className="text-on-primary-container hover:text-on-primary transition-colors w-fit"
          >
            Nosotros y Servicios
          </Link>
        </div>

        {/* Sedes */}
        <div className="md:col-span-5 flex flex-col gap-4 text-sm">
          <h4 className="font-sans font-bold text-accent uppercase tracking-wide">
            Nuestras Sedes
          </h4>
          {sedes.map((s) => (
            <Link
              key={s.id}
              href={`/sedes/${s.slug}`}
              className="group flex items-start gap-3 text-on-primary-container hover:text-on-primary transition-colors"
            >
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                <span className="font-display uppercase tracking-wide text-on-primary">
                  {s.nombre}
                  {s.esProximamente && " — Próximamente"}
                </span>
                {s.direccion && (
                  <span className="block text-on-primary-container">
                    {s.direccion}
                  </span>
                )}
              </span>
            </Link>
          ))}
          <p className="text-xs text-on-primary-container/80 mt-1">
            Despachos directos a obra y taller en Piura, Talara, Paita y
            Chiclayo.
          </p>
        </div>
      </div>

      {/* Bar de Copyright */}
      <div className="border-t border-primary-container">
        <div className="max-w-container-max mx-auto px-gutter py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-primary-container">
          <span>
            © {CURRENT_YEAR} Maderera San Judas Tadeo. Todos los derechos
            reservados.
          </span>
          <span className="font-sans font-bold uppercase tracking-wide text-accent text-xs">
            Especificación · Stock · Despacho
          </span>
        </div>
      </div>
    </footer>
  );
}

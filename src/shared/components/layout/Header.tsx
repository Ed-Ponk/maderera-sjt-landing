"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { QuotationCart } from "@/cotizacion/components/QuotationCart";
import { SedeOption } from "@/shared/lib/types";
import { cn } from "@/shared/lib/utils";
import logoImg from "@/../public/images/logo_maderera_san_judas_tadeo.png";

interface HeaderProps {
  sedes: SedeOption[];
  contactos: { nombre: string; whatsapp: string }[];
  defaultSedeSlug: string;
}

export function Header({ sedes, contactos, defaultSedeSlug }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio", exact: true },
    { href: "/nosotros", label: "Nosotros", exact: false },
    { href: "/catalogo/maderas-en-tablones", label: "Productos", exact: false },
    { href: `/sedes/${defaultSedeSlug}`, label: "Sedes", exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest border-b-2 border-outline-variant">
      <div className="max-w-container-max mx-auto px-gutter flex justify-between items-center h-20">
        <Link href="/" className="h-16 flex items-center gap-3 py-1" aria-label="Maderera San Judas Tadeo - Inicio">
          <Image
            src={logoImg}
            alt="Logo Maderera San Judas Tadeo"
            width={300}
            height={100}
            className="h-12 md:h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex gap-7 items-center h-full">
          {navLinks.map((link) => (
            <li key={link.href} className="h-full flex items-center">
              <Link
                href={link.href}
                className={cn(
                  "font-display text-lg uppercase tracking-wide transition-colors",
                  isActive(link.href, link.exact)
                    ? "text-primary border-b-[3px] border-secondary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          <QuotationCart sedes={sedes} contactos={contactos} />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg border-2 border-outline-variant text-primary hover:border-secondary transition-colors"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="lg:hidden border-t-2 border-outline-variant bg-surface-container-lowest">
          <ul className="max-w-container-max mx-auto px-gutter py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block font-display text-xl uppercase tracking-wide py-2.5 border-b border-outline-variant/60",
                    isActive(link.href, link.exact)
                      ? "text-accent-deep"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

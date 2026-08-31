"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Package,
  MapPin,
  Users,
  Share2,
  FileText,
  UserCog,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Rol } from "@prisma/client";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/sedes", label: "Sedes", icon: MapPin, adminOnly: true },
  { href: "/admin/contactos", label: "Contactos", icon: Users, adminOnly: true },
  { href: "/admin/redes", label: "Redes sociales", icon: Share2, adminOnly: true },
  { href: "/admin/contenido", label: "Contenido", icon: FileText, adminOnly: true },
  { href: "/admin/usuarios", label: "Usuarios", icon: UserCog, adminOnly: true },
];

interface AdminShellProps {
  usuario: { nombre: string; rol: Rol };
  children: React.ReactNode;
}

export function AdminShell({ usuario, children }: AdminShellProps) {
  const pathname = usePathname();
  const items = NAV.filter((i) => !i.adminOnly || usuario.rol === "ADMIN");

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      <aside className="w-60 shrink-0 bg-primary text-on-primary flex flex-col">
        <div className="p-5 border-b-2 border-on-primary/20">
          <p className="font-display text-2xl uppercase tracking-wide text-on-primary">
            Panel
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-on-primary-container mt-1">
            San Judas Tadeo
          </p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 font-sans text-sm font-medium transition-colors",
                  active
                    ? "bg-on-primary/10 text-on-primary"
                    : "text-on-primary-container hover:bg-on-primary/5 hover:text-on-primary"
                )}
              >
                <item.icon className="w-4 h-4" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 bg-surface-container-lowest border-b-2 border-primary px-4 sm:px-6 flex items-center justify-between gap-4">
          <span className="hidden sm:block font-sans text-sm text-on-surface-variant">
            {usuario.nombre} · <span className="font-mono uppercase tracking-widest text-xs">{usuario.rol}</span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 font-sans text-sm text-error hover:underline cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

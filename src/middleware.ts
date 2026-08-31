import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const ADMIN_HOST = process.env.ADMIN_HOST ?? "admin.madererasjt.com";

const RESTRICTED_PREFIXES = [
  "/admin/sedes",
  "/admin/contactos",
  "/admin/usuarios",
  "/admin/contenido",
];

const SESSION_COOKIES = ["__Secure-authjs.session-token", "authjs.session-token"];

async function getJwt(req: NextRequest) {
  const cookieName = SESSION_COOKIES.find((c) => req.cookies.get(c));
  if (!cookieName) return null;
  const raw = req.cookies.get(cookieName)?.value;
  if (!raw) return null;
  try {
    return await decode({
      token: raw,
      salt: cookieName,
      secret: process.env.AUTH_SECRET!,
    });
  } catch {
    return null;
  }
}

/**
 * Dos responsabilidades:
 * 1. Subdominio admin.madererasjt.com -> rewrite interno a /admin/* (la URL
 *    del navegador queda limpia en la entrada; el contenido se sirve del mismo
 *    contenedor/build). Cualquier host que NO sea el admin subdominio sale por
 *    NextResponse.next() de inmediato: las rutas públicas no se tocan.
 * 2. Gate de UX sobre /admin (edge, sin BD): redirige a login y separa secciones
 *    por rol usando el JWT. La AUTORIDAD real está en los layouts y Server Actions
 *    (getCurrentUser relee rol/activo de la BD en cada request).
 * El gate evalúa la ruta EFECTIVA (ya reescrita) para que / en el subdominio
 * no se sirva nunca sin autenticar.
 */
function serve(target: URL | null): NextResponse {
  return target ? NextResponse.rewrite(target) : NextResponse.next();
}

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  const isAdminHost = host === ADMIN_HOST;

  let pathname = nextUrl.pathname;
  let target: URL | null = null;

  if (isAdminHost && !pathname.startsWith("/admin")) {
    if (
      pathname.startsWith("/_next") ||
      pathname === "/favicon.ico" ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/uploads/")
    ) {
      return NextResponse.next();
    }
    target = nextUrl.clone();
    target.pathname = pathname === "/" ? "/admin" : "/admin" + pathname;
    pathname = target.pathname;
  }

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminPath) return NextResponse.next();

  const jwt = await getJwt(req);
  const rol = typeof jwt?.rol === "string" ? jwt.rol : undefined;

  if (pathname === "/admin/login") {
    if (jwt && nextUrl.searchParams.get("expired") !== "1") {
      return NextResponse.redirect(new URL("/admin/productos", nextUrl));
    }
    return serve(target);
  }

  if (!jwt) {
    const loginUrl = new URL(isAdminHost ? "/login" : "/admin/login", nextUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      isAdminHost ? pathname.replace(/^\/admin/, "") || "/" : pathname
    );
    return NextResponse.redirect(loginUrl);
  }

  if (
    rol !== "ADMIN" &&
    RESTRICTED_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL("/admin/productos", nextUrl));
  }

  return serve(target);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads|api).*)"],
};

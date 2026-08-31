import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Configuración de Auth.js. Edge-safe: NO importa prisma/bcrypt en top-level.
 * El único punto de entrada a Node (BD + hash) es verify-credentials,
 * cargado dinámicamente dentro del callback authorize.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const [{ headers }, { verifyCredentials }, rateLimit] = await Promise.all([
          import("next/headers"),
          import("./verify-credentials"),
          import("./rate-limit"),
        ]);

        const hdrs = await headers();
        const ip =
          hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          hdrs.get("x-real-ip") ||
          "unknown";

        if (rateLimit.tooManyAttempts(ip)) return null;

        const user = await verifyCredentials(credentials);
        if (user) rateLimit.clearFailures(ip);
        else rateLimit.recordFailure(ip);
        return user;
      },
    }),
  ],
  callbacks: {
    authorized() {
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
      }
      return session;
    },
  },
};

import { Big_Shoulders, Big_Shoulders_Stencil, Archivo, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/shared/lib/site-url";

const display = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

const stencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  variable: "--font-stencil",
  display: "swap",
  adjustFontFallback: false,
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${display.variable} ${stencil.variable} ${sans.variable} ${mono.variable} bg-background text-on-background antialiased min-h-screen flex flex-col relative`}
      >
        {children}
      </body>
    </html>
  );
}

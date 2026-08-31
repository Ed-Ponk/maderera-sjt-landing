import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // El Aserradero — luz de patio soleado, acero carbón, madera y naranja de seguridad
        primary: "#26261f",
        "on-primary": "#f4ead6",
        "primary-container": "#453928",
        "on-primary-container": "#e0cfaa",
        secondary: "#e05e16",
        "on-secondary": "#2a1603",
        "secondary-container": "#ffc08a",
        "on-secondary-container": "#4a2a08",
        accent: "#ff9a4d",
        "accent-deep": "#9a3500",
        tertiary: "#7a5230",
        "on-tertiary": "#fff6e9",
        "tertiary-container": "#e2cf9c",
        "on-tertiary-container": "#4a3318",
        background: "#f4ead6",
        "on-background": "#26261f",
        surface: "#f4ead6",
        "on-surface": "#26261f",
        "on-surface-variant": "#5f5342",
        "surface-container-lowest": "#fbf3e0",
        "surface-container-low": "#efe1c3",
        "surface-container": "#e6d6b6",
        "surface-container-high": "#dccaa4",
        "surface-container-highest": "#d2be90",
        "surface-variant": "#e2cf9c",
        outline: "#8d7a5a",
        "outline-variant": "#c8b794",
        error: "#b3261e",
        "error-container": "#f9dedc",
      },
      fontFamily: {
        display: ["var(--font-display)", "Big Shoulders", "sans-serif"],
        stencil: ["var(--font-stencil)", "Big Shoulders Stencil", "sans-serif"],
        sans: ["var(--font-sans)", "Archivo", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
        "3xl": "1rem",
        full: "0.75rem",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      spacing: {
        gutter: "24px",
        xs: "4px",
        base: "8px",
        sm: "12px",
        md: "24px",
        lg: "48px",
        xl: "80px",
      },
      boxShadow: {
        plate: "0 1px 2px rgba(38, 38, 31, 0.18), 0 8px 24px rgba(38, 38, 31, 0.12)",
        "plate-lg": "0 2px 4px rgba(38, 38, 31, 0.16), 0 16px 40px rgba(38, 38, 31, 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;

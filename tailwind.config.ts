import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: { xs: "475px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        // Paleta oficial Master Essen (Manual de Marca)
        teal:  { DEFAULT: "#58A39D", dark: "#3D7A75", light: "#EBF5F3", "50": "#F0F8F6" },
        aqua:  { DEFAULT: "#89BCAF", dark: "#5E9A8A", light: "#F0F7F5" },
        lila:  { DEFAULT: "#BB9EC5", dark: "#9B7AAA", light: "#F5EFFB" },
        // Texto
        texto: { DEFAULT: "#1A3330", muted: "#5A7A75", light: "#8AABA6" },
        // Fondo base
        fondo: { DEFAULT: "#F4FAF8", card: "#FFFFFF", alt: "#EBF5F3" },
      },
      fontFamily: {
        sans:    ["Plus Jakarta Sans", "sans-serif"],
        heading: ["Fredoka One", "cursive"],
        script:  ["Dancing Script", "cursive"], // Darloune substitute — reemplazar con el .woff2 cuando esté disponible
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } },
        "marquee-reverse": { "0%": { transform: "translateX(-50%)" }, "100%": { transform: "translateX(0%)" } },
        "pulse-ring": {
          "0%":   { transform: "scale(1)",   opacity: "0.8" },
          "100%": { transform: "scale(1.8)", opacity: "0"   },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee 50s linear infinite",
        "marquee-reverse": "marquee-reverse 45s linear infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;

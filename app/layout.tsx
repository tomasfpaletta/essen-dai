import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Cliente } from "@/config/cliente";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

// Mapa de opciones de fuente → CSS font families
const FONT_MAP: Record<string, { heading: string; body: string }> = {
  moderna:    { heading: "'Fredoka One'",         body: "'Plus Jakarta Sans'" },
  elegante:   { heading: "'Playfair Display'",    body: "'Lato'" },
  clasica:    { heading: "'Cormorant Garamond'",  body: "'Lato'" },
  bold:       { heading: "'Bebas Neue'",          body: "'Inter'" },
  amigable:   { heading: "'Nunito'",              body: "'Nunito'" },
  manuscrita: { heading: "'Dancing Script'",      body: "'Plus Jakarta Sans'" },
}

const fuenteKey = (Cliente as Record<string, unknown>).fuente as string || 'moderna'
const fontVars = FONT_MAP[fuenteKey] ?? FONT_MAP.moderna

const BASE_URL = Cliente.seo.baseUrl;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: Cliente.seo.titulo, template: `%s | ${Cliente.marca}` },
  description: Cliente.seo.descripcion,
  keywords: [...Cliente.seo.keywords],
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website", locale: "es_AR", url: BASE_URL,
    siteName: Cliente.marca, title: Cliente.seo.titulo,
    description: Cliente.seo.descripcion,
    images: [{ url: `${BASE_URL}${Cliente.seo.ogImage}`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: Cliente.marca,
  description: Cliente.descripcionCorta,
  url: BASE_URL,
  telephone: `+${Cliente.whatsapp.numero}`,
  address: { "@type": "PostalAddress", addressLocality: Cliente.ciudad, addressRegion: Cliente.provincia, addressCountry: "AR" },
  sameAs: [Cliente.instagram.url, Cliente.whatsapp.link],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={jakartaSans.variable}
      style={{
        '--font-heading': fontVars.heading,
        '--font-body':    fontVars.body,
      } as React.CSSProperties}
    >
      <head>
        <meta name="theme-color" content="#58A39D" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fuente seleccionada desde el panel admin */}
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Fredoka+One&family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:wght@400;700&family=Bebas+Neue&family=Nunito:wght@400;600;700;800&family=Dancing+Script:wght@400;700&family=Lato:wght@400;700&family=Inter:wght@400;600;700&display=swap`}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-fondo text-texto">
        {children}
      </body>
    </html>
  );
}

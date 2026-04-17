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
    <html lang="es-AR" className={jakartaSans.variable}>
      <head>
        <meta name="theme-color" content="#58A39D" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-fondo text-texto">
        {children}
      </body>
    </html>
  );
}

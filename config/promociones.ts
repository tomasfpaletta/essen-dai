// ─────────────────────────────────────────────────────────────────────────────
//  PROMOCIONES — Sección de ediciones limitadas / ofertas especiales
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type PromoItem = {
  id: string
  titulo: string
  descripcion: string
  badge: string
  colorFondo: string
  colorTexto: string
  imagen: string
  activo: boolean
}

export type PromocionesConfig = {
  visible: boolean
  badge: string
  titulo: string
  subtitulo: string
  descripcion: string
  gradienteDesde: string
  gradienteHasta: string
  gradienteDireccion: string
  ctaTexto: string
  ctaLink: string
}

export const promocionesBanner: PromocionesConfig = {
  "visible": true,
  "badge": "Tiempo limitado",
  "titulo": "Colección Invierno 2025",
  "subtitulo": "Hasta 30% OFF en línea Nuit",
  "descripcion": "Solo por este mes, llevá la elegancia de la línea Nuit a tu cocina con descuentos exclusivos.",
  "gradienteDesde": "#1A3330",
  "gradienteHasta": "#58A39D",
  "gradienteDireccion": "135deg",
  "ctaTexto": "Ver ofertas",
  "ctaLink": "#productos"
};

export const promocionesItems: PromoItem[] = [
  {
    "id": "promo-nuit",
    "titulo": "Línea Nuit",
    "descripcion": "Elegancia en negro mate. Antiadherente premium de triple capa.",
    "badge": "Edición Limitada",
    "colorFondo": "#1C1C1E",
    "colorTexto": "#FFFFFF",
    "imagen": "/images/promociones/promo-promo-nuit-4f5015f3-7629-4486-80fb-5a6ce2000de9.webp",
    "activo": true
  },
  {
    "id": "promo-4x3",
    "titulo": "4 x 3 en Cacerolas",
    "descripcion": "Llevá 4 cacerolas y pagás solo 3. Hasta fin de stock.",
    "badge": "Oferta del mes",
    "colorFondo": "#58A39D",
    "colorTexto": "#FFFFFF",
    "imagen": "",
    "activo": true
  },
  {
    "id": "promo-cuotas",
    "titulo": "12 Cuotas sin interés",
    "descripcion": "En toda la línea con Visa, Mastercard y MODO.",
    "badge": "Financiación",
    "colorFondo": "#BB9EC5",
    "colorTexto": "#FFFFFF",
    "imagen": "",
    "activo": true
  }
];

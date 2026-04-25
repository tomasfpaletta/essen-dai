// ─────────────────────────────────────────────────────────────────────────────
//  Generators — producen el contenido de los archivos TypeScript del proyecto
//  a partir de los datos editados en el panel admin
// ─────────────────────────────────────────────────────────────────────────────

/** Genera el contenido de config/cliente.ts */
export function generateClienteTs(data: Record<string, unknown>): string {
  return `// ─────────────────────────────────────────────────────────────────────────────
//  CLIENTE — Configuración central del sitio
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────
export const Cliente = ${JSON.stringify(data, null, 2)} as const;

export type ClienteType = typeof Cliente;
`
}

/** Genera el contenido de config/promociones.ts */
export function generatePromocionesTs(data: {
  banner: Record<string, unknown>
  items: unknown[]
}): string {
  return `// ─────────────────────────────────────────────────────────────────────────────
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
  fechaFin?: string
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

export const promocionesBanner: PromocionesConfig = ${JSON.stringify(data.banner, null, 2)};

export const promocionesItems: PromoItem[] = ${JSON.stringify(data.items, null, 2)};
`
}

/** Genera el contenido de config/descuentos.ts */
export function generateDescuentosTs(data: {
  descuentos: unknown[]
  config: Record<string, unknown>
}): string {
  return `// ─────────────────────────────────────────────────────────────────────────────
//  DESCUENTOS BANCARIOS — editable desde el panel admin
//  Actualizar cada mes con las promos vigentes
// ─────────────────────────────────────────────────────────────────────────────
export type Descuento = {
  banco: string
  logo: string
  descuento: string
  detalle: string
  condicion: string
  color: string
  activo: boolean
}

export const descuentos: Descuento[] = ${JSON.stringify(data.descuentos, null, 2)};

export const descuentosConfig = ${JSON.stringify(data.config, null, 2)};
`
}

/** Genera el contenido de lib/products.ts */
export function generateProductsTs(
  hex: Record<string, string>,
  productos: unknown[],
  categorias: Array<{ value: string; label: string }>
): string {
  const catValues = categorias
    .filter(c => c.value !== 'todos')
    .map(c => `"${c.value}"`)
    .join(' | ')

  return `export type Categoria = "todos" | ${catValues};
export type Variante = { color: string; hex: string; imagen: string };
export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: Exclude<Categoria, "todos">;
  tags: string[];
  variantes: Variante[];
  descuento?: number;
  ofertaEspecial?: boolean;
  destacado?: boolean;
  badge?: string;
  stockBajo?: boolean;
};

export const HEX: Record<string, string> = ${JSON.stringify(hex, null, 2)};

export const productos: Producto[] = ${JSON.stringify(productos, null, 2)};

export function getProductoById(id: string): Producto | undefined {
  return productos.find((p) => p.id === id);
}

export function getProductosByCategoria(cat: Categoria): Producto[] {
  if (cat === "todos") return productos;
  return productos.filter((p) => p.categoria === cat);
}

export const categorias: { value: Categoria; label: string }[] = ${JSON.stringify(categorias, null, 2)};
`
}

/** Genera el contenido de config/videos.ts */
export function generateVideosTs(videosList: unknown[]): string {
  return `// ─────────────────────────────────────────────────────────────────────────────
//  VIDEOS — Carrusel de videos en la landing
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type Video = {
  id: string
  titulo: string
  descripcion: string
  url: string
  activo: boolean
}

export const videos: Video[] = ${JSON.stringify(videosList, null, 2)};
`
}

/** Genera el contenido de config/testimonios.ts */
export function generateTestimoniosTs(list: unknown[]): string {
  return `// ─────────────────────────────────────────────────────────────────────────────
//  TESTIMONIOS — Opiniones de clientes
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type Testimonio = {
  id: string
  nombre: string
  lugar: string
  texto: string
  estrellas: number
}

export const testimonios: Testimonio[] = ${JSON.stringify(list, null, 2)};
`
}

/** Genera el contenido de config/faq.ts */
export function generateFaqTs(list: unknown[]): string {
  return `// ─────────────────────────────────────────────────────────────────────────────
//  FAQ — Preguntas frecuentes
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type FaqItem = {
  id: string
  q: string
  a: string
}

export const faqItems: FaqItem[] = ${JSON.stringify(list, null, 2)};
`
}

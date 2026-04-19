// ─────────────────────────────────────────────────────────────────────────────
//  DESCUENTOS BANCARIOS — editable desde el panel admin
//  Actualizar cada mes con las promos vigentes
// ─────────────────────────────────────────────────────────────────────────────
export type Descuento = {
  banco: string           // Nombre del banco
  logo: string            // Emoji o inicial del banco
  descuento: string       // "15% OFF", "3 cuotas sin interés", etc.
  condicion: string       // "Martes y miércoles", "Todos los días", etc.
  color: string           // Color de acento del banco
  activo: boolean         // Si se muestra o no
}

export const descuentos: Descuento[] = [
  {
    banco: "Banco Nación",
    logo: "🏦",
    descuento: "3 cuotas sin interés",
    condicion: "Todos los días",
    color: "#003087",
    activo: true,
  },
  {
    banco: "Banco Galicia",
    logo: "🟠",
    descuento: "15% OFF",
    condicion: "Jueves y viernes",
    color: "#FF6B00",
    activo: true,
  },
  {
    banco: "BBVA",
    logo: "🔵",
    descuento: "20% OFF",
    condicion: "Martes y miércoles",
    color: "#004481",
    activo: true,
  },
]

export const descuentosConfig = {
  visible: true,
  titulo: "Beneficios bancarios",
  subtitulo: "Pagá en cuotas o con descuento según tu banco",
  vigencia: "Abril 2026",
}

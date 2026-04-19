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
    logo: "/images/bancos/banco-nacion.webp",
    descuento: "3 cuotas sin interés",
    condicion: "Todos los días",
    color: "#003087",
    activo: true,
  },
  {
    banco: "Banco Galicia",
    logo: "/images/bancos/banco-galicia.webp",
    descuento: "15% OFF",
    condicion: "Jueves y viernes",
    color: "#FF6B00",
    activo: true,
  },
  {
    banco: "BBVA",
    logo: "/images/bancos/bbva.webp",
    descuento: "20% OFF",
    condicion: "Martes y miércoles",
    color: "#004481",
    activo: true,
  },
  {
    banco: "Santander",
    logo: "/images/bancos/santander.webp",
    descuento: "",
    condicion: "",
    color: "#EC0000",
    activo: false,
  },
  {
    banco: "Banco Macro",
    logo: "/images/bancos/banco-macro.webp",
    descuento: "",
    condicion: "",
    color: "#FFD100",
    activo: false,
  },
  {
    banco: "Banco Provincia",
    logo: "/images/bancos/banco-provincia.webp",
    descuento: "",
    condicion: "",
    color: "#0072BC",
    activo: false,
  },
  {
    banco: "ICBC",
    logo: "/images/bancos/icbc.webp",
    descuento: "",
    condicion: "",
    color: "#C8102E",
    activo: false,
  },
  {
    banco: "Mercado Pago",
    logo: "/images/bancos/mercado-pago.webp",
    descuento: "",
    condicion: "",
    color: "#009EE3",
    activo: false,
  },
  {
    banco: "Naranja X",
    logo: "/images/bancos/naranja-x.webp",
    descuento: "",
    condicion: "",
    color: "#FF5200",
    activo: false,
  },
]

export const descuentosConfig = {
  visible: true,
  titulo: "Beneficios bancarios",
  subtitulo: "Pagá en cuotas o con descuento según tu banco",
  vigencia: "Abril 2026",
}

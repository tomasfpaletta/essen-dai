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
    logo: "/images/bancos/Banco_Nación.svg.webp",
    descuento: "3 cuotas sin interés",
    condicion: "Todos los días",
    color: "#003087",
    activo: true,
  },
  {
    banco: "Banco Galicia",
    logo: "/images/bancos/Banco_galicia_logo.webp",
    descuento: "15% OFF",
    condicion: "Jueves y viernes",
    color: "#FF6B00",
    activo: true,
  },
  {
    banco: "BBVA",
    logo: "/images/bancos/png-clipart-bbva-los-molinos-logo-brand-product-honeywell-logo-blue-text-thumbnail.webp",
    descuento: "20% OFF",
    condicion: "Martes y miércoles",
    color: "#004481",
    activo: true,
  },
  {
    banco: "Santander",
    logo: "/images/bancos/Santander_Logo.webp",
    descuento: "",
    condicion: "",
    color: "#EC0000",
    activo: false,
  },
  {
    banco: "Banco Macro",
    logo: "/images/bancos/Logo_Banco_Macro.svg.webp",
    descuento: "",
    condicion: "",
    color: "#FFD100",
    activo: false,
  },
  {
    banco: "Banco Provincia",
    logo: "/images/bancos/Banco_Provincia.svg.webp",
    descuento: "",
    condicion: "",
    color: "#0072BC",
    activo: false,
  },
  {
    banco: "ICBC",
    logo: "/images/bancos/ICBC_Argentina.webp",
    descuento: "",
    condicion: "",
    color: "#C8102E",
    activo: false,
  },
  {
    banco: "Mercado Pago",
    logo: "/images/bancos/Mercado_Pago.svg.webp",
    descuento: "",
    condicion: "",
    color: "#009EE3",
    activo: false,
  },
  {
    banco: "Naranja X",
    logo: "/images/bancos/Naranja_X.webp",
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

// ─────────────────────────────────────────────────────────────────────────────
//  DESCUENTOS BANCARIOS — editable desde el panel admin
//  Actualizar cada mes con las promos vigentes
// ─────────────────────────────────────────────────────────────────────────────
export type Descuento = {
  banco: string       // Nombre del banco
  logo: string        // Ruta al logo (no usado en el carrusel, sí en el strip)
  descuento: string   // Texto principal: "20% OFF", "3 cuotas sin interés"
  detalle: string     // Subtexto: "con tus tarjetas de Crédito y Débito"
  condicion: string   // Banner inferior: "Exclusivo con Mercado Pago"
  color: string       // Color de acento
  activo: boolean
}

export const descuentos: Descuento[] = [
  {
    banco: "Banco Nación",
    logo: "/images/bancos/banco-nacion.webp",
    descuento: "3 cuotas sin interés",
    detalle: "Con todas tus tarjetas de crédito",
    condicion: "Todos los días · Sin monto mínimo",
    color: "#003087",
    activo: true,
  },
  {
    banco: "Banco Galicia",
    logo: "/images/bancos/banco-galicia.webp",
    descuento: "15% OFF",
    detalle: "Con tarjetas de Crédito y Débito Galicia",
    condicion: "Jueves y viernes · Tope $8.000 de reintegro",
    color: "#FF6B00",
    activo: true,
  },
  {
    banco: "BBVA",
    logo: "/images/bancos/bbva.webp",
    descuento: "20% OFF",
    detalle: "Con tarjetas de Crédito y Débito BBVA",
    condicion: "Martes y miércoles · Tope $6.000 de reintegro",
    color: "#004481",
    activo: true,
  },
  {
    banco: "Mercado Pago",
    logo: "/images/bancos/mercado-pago.webp",
    descuento: "18 cuotas sin interés",
    detalle: "Con Visa y Mastercard a través de Mercado Pago",
    condicion: "Todos los días · Sin monto mínimo",
    color: "#009EE3",
    activo: true,
  },
  {
    banco: "Santander",
    logo: "/images/bancos/santander.webp",
    descuento: "",
    detalle: "",
    condicion: "",
    color: "#EC0000",
    activo: false,
  },
  {
    banco: "Banco Macro",
    logo: "/images/bancos/banco-macro.webp",
    descuento: "",
    detalle: "",
    condicion: "",
    color: "#FFD100",
    activo: false,
  },
  {
    banco: "Banco Provincia",
    logo: "/images/bancos/banco-provincia.webp",
    descuento: "",
    detalle: "",
    condicion: "",
    color: "#0072BC",
    activo: false,
  },
  {
    banco: "ICBC",
    logo: "/images/bancos/icbc.webp",
    descuento: "",
    detalle: "",
    condicion: "",
    color: "#C8102E",
    activo: false,
  },
  {
    banco: "Naranja X",
    logo: "/images/bancos/naranja-x.webp",
    descuento: "",
    detalle: "",
    condicion: "",
    color: "#FF5200",
    activo: false,
  },
]

export const descuentosConfig = {
  visible: true,
  titulo: "Beneficios bancarios",
  subtitulo: "Promociones bancarias para ahorrar más",
  vigencia: "Abril 2026",
  // Strip inferior de cuotas
  cuotasTexto: "Hasta 3 cuotas sin interés",
  cuotasBancos: ["Banco Nación", "BBVA", "Banco Galicia", "Santander", "Banco Macro", "Banco Provincia", "ICBC", "Mercado Pago", "Naranja X"],
}

// ─────────────────────────────────────────────────────────────────────────────
//  COSAS IMPORTANTES — Guías, consejos y recursos sobre productos Essen
//  Editable desde el panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type CosaItem = {
  id: string
  tipo: 'texto' | 'video' | 'consejo'
  titulo?: string
  contenido: string  // texto plano o URL de YouTube
}

export type SeccionImportante = {
  id: string
  titulo: string
  descripcion?: string
  emoji?: string
  items: CosaItem[]
  activo: boolean
}

export type CosasImportantesConfig = {
  visible: boolean
  titulo: string
  descripcion: string
  urlSlug: string
}

export const cosasImportantesConfig: CosasImportantesConfig = {
  visible: true,
  titulo: "Cosas importantes",
  descripcion: "Todo lo que necesitás saber para aprovechar al máximo tus productos Essen.",
  urlSlug: "cosas-importantes",
};

export const cosasImportantes: SeccionImportante[] = [
  {
    id: "cuidado-essen",
    titulo: "Cómo cuidar tu Essen",
    descripcion: "Consejos para que tus ollas y sartenes duren toda la vida.",
    emoji: "✨",
    activo: true,
    items: [
      {
        id: "ci-1",
        tipo: "consejo",
        titulo: "Primer uso",
        contenido: "Antes de usar por primera vez, lavá con agua tibia y jabón suave. Enjuagá bien y secá.",
      },
      {
        id: "ci-2",
        tipo: "consejo",
        titulo: "Lavado",
        contenido: "Usá esponjas suaves. Evitá virulanas o estropajos metálicos que dañan el revestimiento antiadherente.",
      },
      {
        id: "ci-3",
        tipo: "consejo",
        titulo: "Temperatura",
        contenido: "Siempre comenzá con fuego medio. El aluminio fundido distribuye el calor de forma pareja, no necesitás fuego máximo.",
      },
    ],
  },
  {
    id: "comidas-posibles",
    titulo: "¿Qué comidas se pueden hacer?",
    descripcion: "Descubrí todo lo que podés cocinar con tu Essen.",
    emoji: "🍳",
    activo: true,
    items: [
      {
        id: "cp-1",
        tipo: "texto",
        contenido: "Las ollas Essen están diseñadas para todo tipo de cocción: hervir, saltear, guisar, freír con poco aceite y hasta hornear. Su base de aluminio fundido garantiza una distribución pareja del calor.",
      },
      {
        id: "cp-2",
        tipo: "consejo",
        titulo: "Ideal para",
        contenido: "Guisos, arroces, pastas, carnes, verduras salteadas, tortas y bizcochos en las ollas con tapa hermética.",
      },
    ],
  },
];

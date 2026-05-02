export type Categoria = "todos" | "contemporanea" | "nuit" | "bazar" | "combos";
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

export const HEX: Record<string, string> = {
  "Rosa": "#FFB6C1",
  "Capri": "#1A9EC0",
  "Terra": "#A0785A",
  "Cera Forte": "#B5A89A",
  "Nuit": "#2D2D2D",
  "Unico": "#C17A5A",
  "Aqua": "#89BCAF"
};

export const productos: Producto[] = [

  // ── LÍNEA CONTEMPORÁNEA ──────────────────────────────────────────────────────

  {
    id: "cacerola-18cm",
    nombre: "Cacerola 18cm",
    descripcion: "Cacerola de aluminio fundido con esmalte exterior y antiadherente interior. Ideal para 2 personas o porciones individuales.",
    categoria: "contemporanea",
    tags: ["18 cm", "2.1 lts", "Tapa vidrio", "Todas las cocinas"],
    variantes: [
      { color: "Capri",  hex: "#1A9EC0", imagen: "/images/products/cacerola18-capri.webp" },
      { color: "Rosa",   hex: "#FFB6C1", imagen: "/images/products/cacerola18-rosa.webp"  },
    ],
    destacado: true,
  },

  {
    id: "cacerola-24cm",
    nombre: "Cacerola 24cm",
    descripcion: "Cacerola amplia para toda la familia. Aluminio fundido con esmalte exterior y tapa de vidrio hermética.",
    categoria: "contemporanea",
    tags: ["24 cm", "4.5 lts", "Tapa vidrio", "Todas las cocinas"],
    variantes: [
      { color: "Capri",  hex: "#1A9EC0", imagen: "/images/products/cacerola24-capri.webp"  },
      { color: "Rosa",   hex: "#FFB6C1", imagen: "/images/products/cacerola24-rosa.webp"   },
      { color: "Terra",  hex: "#A0785A", imagen: "/images/products/cacerola24-terra2.webp" },
    ],
    destacado: true,
    badge: "Más vendida",
  },

  {
    id: "cacerola-28cm",
    nombre: "Cacerola 28cm",
    descripcion: "Gran capacidad para cocinar en cantidad. Perfecta para guisos, sopas y preparaciones familiares.",
    categoria: "contemporanea",
    tags: ["28 cm", "6 lts", "Tapa vidrio", "Todas las cocinas"],
    variantes: [
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/cacerola28-terra.webp" },
    ],
  },

  {
    id: "cuadrada-29cm",
    nombre: "Cuadrada 29cm",
    descripcion: "Diseño cuadrado único de Essen. Ideal para horno y cocina, con distribución de calor uniforme y mayor superficie.",
    categoria: "contemporanea",
    tags: ["29 cm", "Horno y cocina", "Todas las cocinas"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/cuadrada29-capri.webp" },
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/cuadrada29-terra.webp" },
    ],
    destacado: true,
  },

  {
    id: "flip-22",
    nombre: "Flip 2.2",
    descripcion: "La sartén multifunción de Essen. Se da vuelta para cocinar de los dos lados sin perder el contenido. Perfecta para tortillas, empanadas y más.",
    categoria: "contemporanea",
    tags: ["2.2 lts", "Doble función", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Capri",     hex: "#1A9EC0", imagen: "/images/products/flip2.2-capri.webp"     },
      { color: "Rosa",      hex: "#FFB6C1", imagen: "/images/products/flip2.2-rosa.webp"      },
      { color: "Terra",     hex: "#A0785A", imagen: "/images/products/flip2.2-terra.webp"     },
      { color: "Cera Forte",hex: "#B5A89A", imagen: "/images/products/flip2.2-cera-forte.webp"},
    ],
    destacado: true,
    badge: "Favorita",
  },

  {
    id: "sarten-24cm",
    nombre: "Sartén 24cm",
    descripcion: "Sartén clásica antiadherente para el día a día. Liviana, de fácil limpieza y compatible con todas las cocinas.",
    categoria: "contemporanea",
    tags: ["24 cm", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/sarten24-capri.webp" },
    ],
  },

  {
    id: "sarten-28cm",
    nombre: "Sartén 28cm",
    descripcion: "Sartén de mayor diámetro para preparaciones abundantes. Cocción pareja y antiadherente de alta durabilidad.",
    categoria: "contemporanea",
    tags: ["28 cm", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/sarten28-terra.webp" },
    ],
  },

  {
    id: "sarten-31cm",
    nombre: "Sartén 31cm",
    descripcion: "Sartén extra grande para familias numerosas. Máxima superficie de cocción con antiadherente premium.",
    categoria: "contemporanea",
    tags: ["31 cm", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/sarten31-capri.webp" },
    ],
  },

  {
    id: "sarten-cera-forte",
    nombre: "Sartén CeraForte",
    descripcion: "Tecnología CeraForte: cerámica reforzada sin PFAS. Resistente a altas temperaturas y apta para todo tipo de cocinas.",
    categoria: "contemporanea",
    tags: ["Cerámica reforzada", "Sin PFAS", "Alta temperatura", "Todas las cocinas"],
    variantes: [
      { color: "Cera Forte", hex: "#B5A89A", imagen: "/images/products/sarten-cera-forte.webp" },
    ],
    badge: "Premium",
  },

  {
    id: "sarten-express",
    nombre: "Sartén Express",
    descripcion: "Sartén pequeña y versátil, ideal para el desayuno, huevos o porciones individuales. Calentamiento rápido y uniforme.",
    categoria: "contemporanea",
    tags: ["Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/sarten-express-terra.webp" },
    ],
  },

  {
    id: "biferas-33x23",
    nombre: "Biferas 33x23",
    descripcion: "Plancha biferas de aluminio fundido con estrías para marcar carnes, vegetales y más. Distribución de calor uniforme y antiadherente de alta durabilidad.",
    categoria: "contemporanea",
    tags: ["33x23 cm", "Plancha", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/biferas33x23.webp" },
    ],
  },

  {
    id: "pucherona-8.8lts",
    nombre: "Pucherona 8.8lts",
    descripcion: "La cacerola más grande de Essen. Ideal para cocinar para muchas personas: caldos, guisos y pucheros en grandes cantidades.",
    categoria: "contemporanea",
    tags: ["8.8 lts", "Gran capacidad", "Tapa vidrio", "Todas las cocinas"],
    variantes: [
      { color: "Aqua",  hex: "#89BCAF", imagen: "/images/products/pucherona8.8-lts-aqua.webp"  },
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/pucherona8.8-lts-terra.webp" },
    ],
  },

  {
    id: "sarten-baby-18",
    nombre: "Sartén Baby 18",
    descripcion: "Edición Limitada. Sartén pequeña con diseño exclusivo, perfecta para porciones individuales, huevos o para regalar.",
    categoria: "contemporanea",
    tags: ["18 cm", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/sarten-baby18-edicion-limitada.webp" },
    ],
    badge: "Edición Limitada",
  },

  {
    id: "jarro-quick",
    nombre: "Jarro Quick",
    descripcion: "Jarro de aluminio antiadherente con asa ergonómica. Ideal para leche, té, caldos y cualquier preparación líquida del día a día.",
    categoria: "contemporanea",
    tags: ["Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/jarro-quick-terra.webp" },
    ],
  },

  {
    id: "kamado",
    nombre: "Kamado",
    descripcion: "Cocción lenta y sabores profundos. El Kamado Essen combina la técnica ancestral de la cerámica con la tecnología antiadherente moderna.",
    categoria: "contemporanea",
    tags: ["Cocción lenta", "Antiadherente", "Todas las cocinas"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/kamado.webp" },
    ],
  },

  // ── LÍNEA NUIT (económica) ───────────────────────────────────────────────────

  {
    id: "set-nuit-24cm",
    nombre: "Set Nuit 24cm + Tapa Vidrio",
    descripcion: "Línea Nuit, la opción económica de Essen. Cacerola de aluminio 24cm con tapa de vidrio. Sin esmalte, máxima durabilidad.",
    categoria: "nuit",
    tags: ["24 cm", "Línea económica", "Tapa vidrio", "Todas las cocinas"],
    variantes: [
      { color: "Nuit", hex: "#2D2D2D", imagen: "/images/products/set-nuit24+-tapa-vidrio2.webp" },
    ],
  },

  {
    id: "set-nuit-29cm",
    nombre: "Set Nuit 29cm + Tapa Vidrio",
    descripcion: "Línea Nuit, la opción económica de Essen. Cacerola amplia 29cm con tapa de vidrio para cocinar en cantidad.",
    categoria: "nuit",
    tags: ["29 cm", "Línea económica", "Tapa vidrio", "Todas las cocinas"],
    variantes: [
      { color: "Nuit", hex: "#2D2D2D", imagen: "/images/products/set-nuit29+-tapa-vidrio.webp" },
    ],
  },

  // ── BAZAR ────────────────────────────────────────────────────────────────────

  {
    id: "multi-procesador-vegetales",
    nombre: "Multi Procesador de Vegetales",
    descripcion: "Procesador manual de vegetales Essen. Corta, pica y ralla en segundos sin electricidad. Práctico, fácil de limpiar y de guardar.",
    categoria: "bazar",
    tags: ["Sin electricidad", "Verduras y frutas"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/multi-procesador-vegetales.webp" },
    ],
  },

  {
    id: "set-bowls",
    nombre: "Set Bowls",
    descripcion: "Set de bowls Essen apilables. Ideales para servir, preparar y guardar. Diseño moderno que va de la heladera a la mesa.",
    categoria: "bazar",
    tags: ["Set", "Apilables"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/set-bowls.webp" },
    ],
  },

  {
    id: "set-utensillos",
    nombre: "Set Utensillos Uso General",
    descripcion: "Set completo de utensilios de cocina Essen. Espátulas, cucharones y más, diseñados para proteger las superficies antiadherentes.",
    categoria: "bazar",
    tags: ["Set", "Utensilios"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/set-utensillos-uso-general.webp" },
    ],
  },

  // ── COMBOS ───────────────────────────────────────────────────────────────────

  {
    id: "combo-cacerola24-cacerola18-sarten24-sarten-express",
    nombre: "Combo Cacerola 24 + Cacerola 18 + Sartén 24 + Sartén Express",
    descripcion: "El combo más completo para equipar tu cocina Essen de una sola vez. Cuatro piezas esenciales en el mismo color.",
    categoria: "combos",
    tags: ["4 piezas", "Ahorro en combo"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/combo-cacerola24+-cacerola18+-sarten24+-sarten-express-capri.webp" },
    ],
    destacado: true,
    badge: "Combo completo",
  },

  {
    id: "combo-cacerola24-sarten24-sarten-express",
    nombre: "Combo Cacerola 24 + Sartén 24 + Sartén Express",
    descripcion: "Tres piezas clave para el día a día. Una cacerola y dos sartenes coordinadas para que todo combine en tu cocina.",
    categoria: "combos",
    tags: ["3 piezas", "Ahorro en combo"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/combo-cacerola24+-sarten24+-sarten-express-capri.webp" },
    ],
  },

  {
    id: "combo-cacerola24-sarten24-savarin24",
    nombre: "Combo Cacerola 24 + Sartén 24 + Savarin 24",
    descripcion: "Combo versátil que incluye una cacerola, sartén y savarin. Ideal para quienes quieren variedad en su cocina.",
    categoria: "combos",
    tags: ["3 piezas", "Ahorro en combo"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/combo-cacerola24+-sarten24+-savarin24.webp" },
    ],
  },

  {
    id: "combo-cacerola24-savarin",
    nombre: "Combo Cacerola 24 + Savarin",
    descripcion: "Dúo perfecto: cacerola y savarin en el mismo color para una cocina coordinada y práctica.",
    categoria: "combos",
    tags: ["2 piezas", "Ahorro en combo"],
    variantes: [
      { color: "Rosa", hex: "#FFB6C1", imagen: "/images/products/combo-cacerola24+-savarin-rosa.webp" },
    ],
  },

  {
    id: "combo-cacerola24-wok",
    nombre: "Combo Cacerola 24 + Wok",
    descripcion: "La combinación clásica para cocinar de todo. Cacerola para guisos y wok para salteados, en el mismo color.",
    categoria: "combos",
    tags: ["2 piezas", "Ahorro en combo"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/combo-cacerola24+-wok-capri.webp" },
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/combo-cacerola24+-wok-terra.webp" },
    ],
  },

  {
    id: "combo-flip22-cacerola24-cacerola18-sarten24-savarin24",
    nombre: "Combo Flip 2.2 + Cacerola 24 + Cacerola 18 + Sartén 24 + Savarin 24",
    descripcion: "El combo premium de Essen. Cinco piezas para tener todo lo que necesitás en la cocina, incluyendo el exclusivo Flip 2.2.",
    categoria: "combos",
    tags: ["5 piezas", "Ahorro en combo", "Incluye Flip"],
    variantes: [
      { color: "Rosa", hex: "#FFB6C1", imagen: "/images/products/combo-flip2.2+-cacerola24+-cacerola18+-sarten24+-savarin24-rosa.webp" },
    ],
    destacado: true,
    badge: "Combo premium",
  },

  {
    id: "combo-flip-nuit-mate",
    nombre: "Combo Flip Nuit + Mate",
    descripcion: "Combo especial línea Nuit. Flip 2.2 económico más mate Essen, la combinación perfecta para regalar.",
    categoria: "combos",
    tags: ["2 piezas", "Línea económica", "Ideal para regalo"],
    variantes: [
      { color: "Nuit", hex: "#2D2D2D", imagen: "/images/products/combo-flip-nuit+-mate.webp" },
    ],
    badge: "Ideal regalo",
  },

  {
    id: "combo-fuente-rectangular-sarten-express",
    nombre: "Combo Fuente Rectangular + Sartén Express",
    descripcion: "Dúo práctico: fuente rectangular para horno y sartén express para el día a día. Dos usos, un solo combo.",
    categoria: "combos",
    tags: ["2 piezas", "Ahorro en combo", "Horno y cocina"],
    variantes: [
      { color: "Unico", hex: "#C17A5A", imagen: "/images/products/combo-fuente-rectangular+-sarten-express.webp" },
    ],
  },

  {
    id: "combo-sarten24-flip22",
    nombre: "Combo Sartén 24 + Flip 2.2",
    descripcion: "Dos sartenes Essen en un solo combo. La clásica 24cm más el Flip 2.2 multifunción para tener todas las bases cubiertas.",
    categoria: "combos",
    tags: ["2 piezas", "Ahorro en combo", "Incluye Flip"],
    variantes: [
      { color: "Terra", hex: "#A0785A", imagen: "/images/products/combo-sarten24+-flip2.2-terra.webp" },
    ],
  },

  {
    id: "combo-sarten24-sarten-express",
    nombre: "Combo Sartén 24 + Sartén Express",
    descripcion: "El dúo de sartenes más práctico. Una grande para el almuerzo y una chica para el desayuno, coordinadas en el mismo color.",
    categoria: "combos",
    tags: ["2 piezas", "Ahorro en combo"],
    variantes: [
      { color: "Capri", hex: "#1A9EC0", imagen: "/images/products/combo-sarten24+-sarten-express-capri.webp" },
    ],
  },

];

export function getProductoById(id: string): Producto | undefined {
  return productos.find((p) => p.id === id);
}

export function getProductosByCategoria(cat: Categoria): Producto[] {
  if (cat === "todos") return productos;
  return productos.filter((p) => p.categoria === cat);
}

export const categorias: { value: Categoria; label: string }[] = [
  { value: "todos",         label: "Todos"          },
  { value: "contemporanea", label: "Contemporánea"  },
  { value: "nuit",          label: "Nuit"           },
  { value: "combos",        label: "Combos"         },
  { value: "bazar",         label: "Bazar"          },
];

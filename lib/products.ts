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
  "Terra": "#808080",
  "Cera Forte": "#B5A89A",
  "Nuit": "#2D2D2D",
  "Unico": "#C17A5A"
};

export const productos: Producto[] = [
  {
    "id": "cacerola-18cm",
    "nombre": "Cacerola 18cm",
    "categoria": "contemporanea",
    "descripcion": "Aluminio fundido de alta calidad. Cocción uniforme, ideal para 2 personas.",
    "tags": [
      "2,1 lts",
      "Todos los fuegos"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": ""
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": ""
      }
    ],
    "destacado": true,
    "badge": "Mas vendida"
  },
  {
    "id": "cacerola-24cm",
    "nombre": "Cacerola 24cm",
    "categoria": "contemporanea",
    "descripcion": "Pieza ideal para familia de 4. Base de aluminio fundido y revestimiento antiadherente.",
    "tags": [
      "4,5 lts",
      "Tapa hermetica"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": ""
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": ""
      }
    ],
    "destacado": true,
    "badge": "Top familia"
  },
  {
    "id": "flip-22",
    "nombre": "Testeando",
    "categoria": "bazar",
    "descripcion": "1Test",
    "tags": [
      "1Test"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": "/products/flip-22-rosa.webp"
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": "/products/flip-22-terra.webp"
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": "/products/flip-22-capri.webp"
      }
    ],
    "destacado": true,
    "badge": "Testeando",
    "stockBajo": true,
    "ofertaEspecial": true,
    "descuento": 99
  },
  {
    "id": "sarten-24cm",
    "nombre": "Sarten 24cm",
    "categoria": "contemporanea",
    "descripcion": "Antiadherente novapremium. Liviana y versátil para el día a día.",
    "tags": [
      "24cm",
      "Antiadherente"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": ""
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": ""
      }
    ]
  },
  {
    "id": "sarten-31cm",
    "nombre": "Sarten 31cm",
    "categoria": "contemporanea",
    "descripcion": "La más grande de la línea. Perfecta para porciones generosas.",
    "tags": [
      "31cm",
      "Gran capacidad"
    ],
    "variantes": [
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": ""
      }
    ],
    "descuento": 15
  },
  {
    "id": "cuadrada-29cm",
    "nombre": "Cuadrada 29cm",
    "categoria": "contemporanea",
    "descripcion": "Forma cuadrada para aprovechar el espacio. Perfecta para carnes a la plancha.",
    "tags": [
      "29cm",
      "Todos los fuegos"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": ""
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": ""
      }
    ],
    "descuento": 20,
    "ofertaEspecial": true
  },
  {
    "id": "wok-32cm",
    "nombre": "Wok 32cm",
    "categoria": "contemporanea",
    "descripcion": "Gran capacidad y paredes altas. Ideal para salteados, arroces y pastas.",
    "tags": [
      "32cm",
      "Alta pared"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": ""
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Capri",
        "hex": "#1A9EC0",
        "imagen": ""
      }
    ],
    "destacado": true
  },
  {
    "id": "cafetera",
    "nombre": "Cafetera Acero Inoxidable",
    "categoria": "bazar",
    "descripcion": "Cafetera italiana de acero inoxidable. Café autentico en minutos.",
    "tags": [
      "Acero inox",
      "Todas las cocinas"
    ],
    "variantes": [
      {
        "color": "Unico",
        "hex": "#C17A5A",
        "imagen": ""
      }
    ],
    "descuento": 30,
    "ofertaEspecial": true,
    "badge": "30% OFF"
  },
  {
    "id": "set-utensilios",
    "nombre": "Set de Utensilios",
    "categoria": "bazar",
    "descripcion": "Set completo de utensilios de acero inoxidable. El complemento perfecto.",
    "tags": [
      "6 piezas",
      "Acero inox"
    ],
    "variantes": [
      {
        "color": "Unico",
        "hex": "#C17A5A",
        "imagen": ""
      }
    ],
    "descuento": 30,
    "badge": "30% OFF"
  },
  {
    "id": "cacerola-nuit-20cm",
    "nombre": "Cacerola Nuit 20cm",
    "categoria": "nuit",
    "descripcion": "Linea Nuit en negro profundo. Elegancia y performance en una sola pieza.",
    "tags": [
      "3,2 lts",
      "Induccion"
    ],
    "variantes": [
      {
        "color": "Nuit",
        "hex": "#2D2D2D",
        "imagen": ""
      }
    ],
    "destacado": true,
    "badge": "Premium"
  },
  {
    "id": "sarten-nuit-28cm",
    "nombre": "Sarten Nuit 28cm",
    "categoria": "nuit",
    "descripcion": "Sarten de la linea Nuit. Negro mate, maxima performance antiadherente.",
    "tags": [
      "28cm",
      "Antiadherente Nuit"
    ],
    "variantes": [
      {
        "color": "Nuit",
        "hex": "#2D2D2D",
        "imagen": ""
      }
    ]
  }
];

export function getProductoById(id: string): Producto | undefined {
  return productos.find((p) => p.id === id);
}

export function getProductosByCategoria(cat: Categoria): Producto[] {
  if (cat === "todos") return productos;
  return productos.filter((p) => p.categoria === cat);
}

export const categorias: { value: Categoria; label: string }[] = [
  {
    "value": "todos",
    "label": "Todos"
  },
  {
    "value": "contemporanea",
    "label": "Contemporanea"
  },
  {
    "value": "nuit",
    "label": "Nuit"
  },
  {
    "value": "bazar",
    "label": "Bazar"
  },
  {
    "value": "combos",
    "label": "Combos"
  }
];

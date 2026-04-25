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
    "id": "producto-1777134152832",
    "nombre": "coso rosa",
    "descripcion": "Descripción del producto.",
    "categoria": "bazar",
    "tags": [
      "2.1lts",
      "gratis"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": "/images/products/producto-1777134152832-negro.webp"
      }
    ],
    "destacado": true,
    "ofertaEspecial": false,
    "stockBajo": true,
    "badge": "gratis",
    "descuento": 15
  },
  {
    "id": "producto-1777129531995",
    "nombre": "4x3",
    "descripcion": "Descripción del producto.",
    "categoria": "nuit",
    "tags": [
      "2.1lts",
      "Linea economica"
    ],
    "variantes": [
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": "/images/products/producto-1777129531995-negro.webp"
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": "/images/products/producto-1777129531995-rosa.webp"
      }
    ],
    "destacado": true,
    "ofertaEspecial": false,
    "badge": "30% OFF",
    "descuento": 30
  },
  {
    "id": "cacerola-24cm",
    "nombre": "cacerola",
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
        "imagen": "/images/products/cacerola-24cm-rosa.webp"
      },
      {
        "color": "Terra",
        "hex": "#808080",
        "imagen": ""
      },
      {
        "color": "Rosa",
        "hex": "#FFB6C1",
        "imagen": "/images/products/cacerola-24cm-capri.webp"
      }
    ],
    "destacado": true,
    "badge": "Top familia"
  },
  {
    "id": "flip-22",
    "nombre": "1",
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
      }
    ],
    "destacado": true,
    "badge": "Testeando",
    "stockBajo": true,
    "ofertaEspecial": true,
    "descuento": 99
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

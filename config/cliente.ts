// ─────────────────────────────────────────────────────────────────────────────
//  CLIENTE — Configuración central del sitio
//  Cambiá estos valores para personalizar cualquier instancia del proyecto
// ─────────────────────────────────────────────────────────────────────────────
export const Cliente = {
  // Identidad
  nombre: "Daisy Benítez",
  marca: "Essen Dai",
  slogan: "Cocinás mejor. Vivís mejor.",
  descripcionCorta: "Distribuidora oficial Essen en Buenos Aires",

  // Ubicación
  ciudad: "Ciudad Autónoma de Buenos Aires",
  provincia: "Buenos Aires",
  pais: "Argentina",
  coordenadas: { lat: -34.6037, lng: -58.3816 },

  // Contacto
  whatsapp: {
    numero: "COMPLETAR",          // ej: "5491112345678"
    display: "+54 9 11 XXXX-XXXX",
    link: "https://wa.me/COMPLETAR",
    mensajeDefecto: "Hola Daisy! Estoy mirando los productos Essen y queria consultar.",
  },

  // Redes sociales
  instagram: {
    usuario: "master_essen",
    url: "https://www.instagram.com/master_essen",
  },

  // SEO
  seo: {
    baseUrl: "https://essendai.com",   // cambiar al dominio real
    titulo: "Essen Dai | Productos Essen en Buenos Aires — Daisy Benítez",
    descripcion:
      "Comprá productos Essen originales con tu distribuidora oficial en Buenos Aires. Cacerolas, sartenes y sets con envío a todo Argentina. Consultá por WhatsApp.",
    keywords: [
      "essen buenos aires", "essen dai", "daisy benitez essen",
      "productos essen caba", "ollas essen", "cacerolas essen",
      "comprar essen online", "distribuidora essen argentina",
    ],
    ogImage: "/opengraph-image.jpg",
  },

  // Popup WhatsApp (segundos de espera)
  popupDelay: 25,

  // Colores de marca — Manual Master Essen
  colores: {
    primary: "#58A39D",
    secondary: "#89BCAF",
    accent: "#BB9EC5",
    dark: "#1A3330",
  },
} as const;

export type ClienteType = typeof Cliente;

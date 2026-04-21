// ─────────────────────────────────────────────────────────────────────────────
//  CLIENTE — Configuración central del sitio
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────
export const Cliente = {
  "nombre": "Daisy Benítez",
  "marca": "Essen Dai",
  "slogan": "Cocinás mejor. Vivís mejor.",
  "descripcionCorta": "Distribuidora oficial Essen en Buenos Aires",
  "ciudad": "Ciudad Autónoma de Buenos Aires",
  "provincia": "Buenos Aires",
  "pais": "Argentina",
  "coordenadas": {
    "lat": -34.6037,
    "lng": -58.3816
  },
  "whatsapp": {
    "numero": "5491156951464",
    "display": "+54 9 11 5695-1464",
    "mensajeDefecto": "Hola Daisy! Estoy mirando los productos Essen y queria consultar.",
    "link": "https://wa.me/5491156951464"
  },
  "instagram": {
    "usuario": "master_essen",
    "url": "https://www.instagram.com/master_essen"
  },
  "seo": {
    "baseUrl": "https://essendai.com",
    "titulo": "Essen Dai | Productos Essen en Buenos Aires — Daisy Benítez",
    "descripcion": "Comprá productos Essen originales con tu distribuidora oficial en Buenos Aires. Cacerolas, sartenes y sets con envío a todo Argentina. Consultá por WhatsApp.",
    "keywords": [
      "essen buenos aires",
      "essen dai",
      "daisy benitez essen",
      "productos essen caba",
      "ollas essen",
      "cacerolas essen",
      "comprar essen online",
      "distribuidora essen argentina"
    ],
    "ogImage": "/opengraph-image.jpg"
  },
  "popupDelay": 25,
  "colores": {
    "primary": "#58A39D",
    "secondary": "#89BCAF",
    "accent": "#BB9EC5",
    "dark": "#1A3330"
  },
  "hero": {
    "badge": "Distribuidora Oficial · CABA",
    "titulo1": "COCINÁS",
    "titulo2": "MEJOR.",
    "subtitulo": "Vivís mejor.",
    "descripcion": "Productos Essen originales con entrega a todo Argentina.\nAtención de Daisy, directa y sin intermediarios.",
    "cta1Texto": "Ver productos",
    "cta2Texto": "Hablar con Daisy",
    "stats": [
      "150+ clientes",
      "5 años vendiendo Essen",
      "Envío gratis a todo el país",
      "2 años de garantía oficial"
    ],
    "imagen": ""
  },
  "imagenes": {
    "og": "",
    "navbarLogo": "",
    "favicon": ""
  },
  "fuente": "moderna",
  "sumateEquipo": {
    "visible": true,
    "badge": "Oportunidad Essen",
    "titulo": "Transformá tu pasión en un negocio próspero",
    "descripcion": "Unite a nuestra comunidad de emprendedoras. Gestioná tus tiempos, obtené ganancias desde el primer día y convertite en una experta culinaria. No necesitás experiencia previa, nosotros te capacitamos.",
    "beneficios": [
      "Sin inversión inicial obligatoria",
      "Capacitaciones exclusivas y gratuitas",
      "Premios y viajes por objetivos",
      "Respaldo de una marca con 30 años de historia"
    ],
    "ctaTexto": "Quiero ser emprendedora",
    "imagenEquipo": "",
    "badgeNumero": "30+",
    "badgeTexto": "años de marca"
  },
  "stats": [
    "150+ clientes",
    "5 años vendiendo Essen",
    "Envío gratis a todo el país",
    "2 años de garantía oficial"
  ]
} as const;

export type ClienteType = typeof Cliente;

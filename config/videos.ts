// ─────────────────────────────────────────────────────────────────────────────
//  VIDEOS — Carrusel de videos en la landing
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type Video = {
  id: string
  titulo: string
  descripcion: string
  url: string
  activo: boolean
}

export const videos: Video[] = [
  {
    "id": "vid-1777133666494-03z8",
    "titulo": "test",
    "descripcion": "awsa",
    "url": "https://youtube.com/shorts/g9M_gr1KOl8",
    "activo": true
  },
  {
    "id": "vid-1777133711978-xx36",
    "titulo": "test2",
    "descripcion": "tesat",
    "url": "https://youtube.com/shorts/UbjsdTfxOqc",
    "activo": true
  }
];

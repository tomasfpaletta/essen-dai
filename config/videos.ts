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
    "id": "vid-1776802681172-qedy",
    "titulo": "prueba",
    "descripcion": "prueba",
    "url": "https://youtube.com/shorts/g9M_gr1KOl8",
    "activo": true
  }
];

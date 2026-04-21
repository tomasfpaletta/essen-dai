// ─────────────────────────────────────────────────────────────────────────────
//  TESTIMONIOS — Opiniones de clientes
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type Testimonio = {
  id: string
  nombre: string
  lugar: string
  texto: string
  estrellas: number
}

export const testimonios: Testimonio[] = [
  {
    "id": "t1",
    "nombre": "María L.",
    "lugar": "Palermo, CABA",
    "texto": "Hermosas ollas, llegaron rapidísimo y Daisy me asesoró perfecto. ¡Re recomiendo a todas!",
    "estrellas": 5
  },
  {
    "id": "t2",
    "nombre": "Carla V.",
    "lugar": "San Isidro",
    "texto": "Compré el set completo y estoy encantada. Cocino muchísimo mejor y se ve precioso en la cocina.",
    "estrellas": 5
  },
  {
    "id": "t3",
    "nombre": "Florencia M.",
    "lugar": "Belgrano, CABA",
    "texto": "Superó mis expectativas. La atención de Daisy es increíble, siempre disponible y muy amable.",
    "estrellas": 5
  }
];

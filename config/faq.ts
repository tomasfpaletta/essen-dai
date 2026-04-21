// ─────────────────────────────────────────────────────────────────────────────
//  FAQ — Preguntas frecuentes
//  Última actualización: panel de administración
// ─────────────────────────────────────────────────────────────────────────────

export type FaqItem = {
  id: string
  q: string
  a: string
}

export const faqItems: FaqItem[] = [
  {
    "id": "faq-1",
    "q": "¿Hacen envíos a todo el país?",
    "a": "Sí, enviamos a todo Argentina con Andreani. El envío es gratis y llega directamente a tu domicilio en 3 a 5 días hábiles."
  },
  {
    "id": "faq-2",
    "q": "¿Cuáles son los medios de pago?",
    "a": "Aceptamos transferencia bancaria, tarjeta de crédito con hasta 18 cuotas sin interés a través de Mercado Pago, débito y efectivo. Consultá por el banco que uses."
  },
  {
    "id": "faq-3",
    "q": "¿Los productos tienen garantía?",
    "a": "Sí. Todos los productos Essen cuentan con garantía oficial de 2 años contra defectos de fabricación."
  },
  {
    "id": "faq-4",
    "q": "¿Son compatibles con cocinas de inducción?",
    "a": "La mayoría de los productos Essen son aptos para todos los tipos de cocina: gas, eléctrica, vitrocerámica e inducción."
  },
  {
    "id": "faq-5",
    "q": "¿Cómo hago un pedido?",
    "a": "Escribime por WhatsApp, te paso precios y disponibilidad, acordamos el pago y coordino el envío. Todo directo, sin intermediarios."
  },
  {
    "id": "faq-6",
    "q": "¿Puedo ver los productos antes de comprar?",
    "a": "Podés ver fotos y consultar dudas por WhatsApp o Instagram. También organizo demostraciones en CABA si lo necesitás."
  },
  {
    "id": "faq-7",
    "q": "¿Cuánto tardan en llegar los pedidos?",
    "a": "En CABA el envío suele llegar en 1-2 días hábiles. Para el interior del país, entre 3 y 7 días hábiles dependiendo la zona."
  }
]

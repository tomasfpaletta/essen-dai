import { NextResponse } from 'next/server'
import { publishFile } from '@/lib/github'
import { generateClienteTs, generateProductsTs, generateDescuentosTs, generatePromocionesTs, generateVideosTs, generateTestimoniosTs, generateFaqTs } from '@/lib/generators'

export const maxDuration = 60

export async function POST(req: Request) {
  const { cliente, productos, hex, categorias, descuentos, promociones, videos, testimonios, faq } = await req.json()

  if (!cliente && !productos && !descuentos && !promociones && !videos && !testimonios && !faq) {
    return NextResponse.json({ error: 'No hay cambios para publicar' }, { status: 400 })
  }

  try {
    // Publicar en secuencia — evita conflictos de SHA cuando GitHub recibe
    // múltiples commits simultáneos en la misma rama (error 409).
    if (cliente) {
      await publishFile(
        'config/cliente.ts',
        generateClienteTs(cliente),
        'admin: actualizar configuración del sitio'
      )
    }

    if (productos) {
      await publishFile(
        'lib/products.ts',
        generateProductsTs(hex, productos, categorias),
        'admin: actualizar catálogo de productos'
      )
    }

    if (descuentos) {
      await publishFile(
        'config/descuentos.ts',
        generateDescuentosTs(descuentos),
        'admin: actualizar descuentos bancarios'
      )
    }

    if (promociones) {
      await publishFile(
        'config/promociones.ts',
        generatePromocionesTs(promociones),
        'admin: actualizar promociones y ediciones limitadas'
      )
    }

    if (videos) {
      await publishFile(
        'config/videos.ts',
        generateVideosTs(videos),
        'admin: actualizar videos de la landing'
      )
    }

    if (testimonios) {
      await publishFile(
        'config/testimonios.ts',
        generateTestimoniosTs(testimonios),
        'admin: actualizar testimonios'
      )
    }

    if (faq) {
      await publishFile(
        'config/faq.ts',
        generateFaqTs(faq),
        'admin: actualizar preguntas frecuentes'
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[publish]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { publishFiles } from '@/lib/github'
import { generateClienteTs, generateProductsTs, generateDescuentosTs, generatePromocionesTs, generateVideosTs, generateTestimoniosTs, generateFaqTs } from '@/lib/generators'

export const maxDuration = 60

export async function POST(req: Request) {
  const { cliente, productos, hex, categorias, descuentos, promociones, videos, testimonios, faq } = await req.json()

  if (!cliente && !productos && !descuentos && !promociones && !videos && !testimonios && !faq) {
    return NextResponse.json({ error: 'No hay cambios para publicar' }, { status: 400 })
  }

  try {
    // Recolectamos todos los archivos a publicar y los subimos en UN SOLO commit
    // atómico usando la Git Trees API → cero conflictos de SHA.
    const files: Array<{ path: string; content: string }> = []

    if (cliente) {
      files.push({ path: 'config/cliente.ts', content: generateClienteTs(cliente) })
    }

    if (productos) {
      files.push({ path: 'lib/products.ts', content: generateProductsTs(hex, productos, categorias) })
    }

    if (descuentos) {
      files.push({ path: 'config/descuentos.ts', content: generateDescuentosTs(descuentos) })
    }

    if (promociones) {
      files.push({ path: 'config/promociones.ts', content: generatePromocionesTs(promociones) })
    }

    if (videos) {
      files.push({ path: 'config/videos.ts', content: generateVideosTs(videos) })
    }

    if (testimonios) {
      files.push({ path: 'config/testimonios.ts', content: generateTestimoniosTs(testimonios) })
    }

    if (faq) {
      files.push({ path: 'config/faq.ts', content: generateFaqTs(faq) })
    }

    await publishFiles(files, 'admin: publicar cambios del sitio')

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[publish]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

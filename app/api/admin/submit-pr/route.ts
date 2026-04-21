import { NextResponse } from 'next/server'
import { publishFile } from '@/lib/github'
import { generateClienteTs, generateProductsTs, generateDescuentosTs, generatePromocionesTs, generateVideosTs } from '@/lib/generators'

export const maxDuration = 30

export async function POST(req: Request) {
  const { cliente, productos, hex, categorias, descuentos, promociones, videos } = await req.json()

  if (!cliente && !productos && !descuentos && !promociones && !videos) {
    return NextResponse.json({ error: 'No hay cambios para publicar' }, { status: 400 })
  }

  try {
    const promises: Promise<unknown>[] = []

    if (cliente) {
      promises.push(publishFile(
        'config/cliente.ts',
        generateClienteTs(cliente),
        'admin: actualizar configuración del sitio'
      ))
    }

    if (productos) {
      promises.push(publishFile(
        'lib/products.ts',
        generateProductsTs(hex, productos, categorias),
        'admin: actualizar catálogo de productos'
      ))
    }

    if (descuentos) {
      promises.push(publishFile(
        'config/descuentos.ts',
        generateDescuentosTs(descuentos),
        'admin: actualizar descuentos bancarios'
      ))
    }

    if (promociones) {
      promises.push(publishFile(
        'config/promociones.ts',
        generatePromocionesTs(promociones),
        'admin: actualizar promociones y ediciones limitadas'
      ))
    }

    if (videos) {
      promises.push(publishFile(
        'config/videos.ts',
        generateVideosTs(videos),
        'admin: actualizar videos de la landing'
      ))
    }

    await Promise.all(promises)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[publish]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

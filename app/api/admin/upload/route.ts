import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { getFile, uploadFile } from '@/lib/github'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const filename = formData.get('filename') as string | null

  if (!file || !filename) {
    return NextResponse.json({ error: 'Faltan datos: se requieren file y filename' }, { status: 400 })
  }

  // Sanitizar nombre de archivo
  const cleanName = filename
    .replace(/\.[^.]+$/, '')          // quitar extensión si viene
    .replace(/[^a-zA-Z0-9-_]/g, '-') // solo caracteres seguros
    .toLowerCase()

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    // Convertir a WebP con Sharp — 800x800, fondo transparente, calidad 85%
    const webpBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .webp({ quality: 85 })
      .toBuffer()

    const base64 = webpBuffer.toString('base64')
    const filePath = `public/products/${cleanName}.webp`

    // Buscar SHA si el archivo ya existe (necesario para actualizar)
    let sha: string | undefined
    try {
      const existing = await getFile(filePath)
      sha = existing.sha
    } catch {
      // El archivo no existe aún, ok
    }

    // Commitear directamente a main (las imágenes no necesitan revisión)
    await uploadFile(
      filePath,
      base64,
      `admin: imagen ${cleanName}.webp`,
      sha,
      'main'
    )

    return NextResponse.json({
      ok: true,
      path: `/products/${cleanName}.webp`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

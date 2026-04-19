import { NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { getFile, uploadFile } from '@/lib/github'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: Request) {
  const formData = await req.formData()
  const file     = formData.get('file')     as File   | null
  const filename = formData.get('filename') as string | null
  const folder   = (formData.get('folder') as string | null) || 'products'

  if (!file || !filename) {
    return NextResponse.json({ error: 'Faltan datos: se requieren file y filename' }, { status: 400 })
  }

  // Sanitizar nombre
  const cleanName = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase()

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    // Convertir a WebP con Sharp — máx 1200px, calidad 85
    const webpBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .webp({ quality: 85 })
      .toBuffer()

    const webpName = `${cleanName}.webp`
    const publicPath = `/images/${folder}/${webpName}`   // lo que devolvemos al frontend
    const repoPath   = `public/images/${folder}/${webpName}` // ruta en el repo

    // ── DESARROLLO: guardar en filesystem local ──────────────────────────────
    if (process.env.NODE_ENV === 'development') {
      const dir = path.join(process.cwd(), 'public', 'images', folder)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(path.join(dir, webpName), webpBuffer)
      return NextResponse.json({ ok: true, path: publicPath })
    }

    // ── PRODUCCIÓN: subir a GitHub directamente a main ───────────────────────
    const base64 = webpBuffer.toString('base64')
    let sha: string | undefined
    try {
      const existing = await getFile(repoPath)
      sha = existing.sha
    } catch { /* archivo nuevo */ }

    await uploadFile(
      repoPath,
      base64,
      `admin: imagen ${webpName}`,
      sha,
      'main'
    )

    return NextResponse.json({ ok: true, path: publicPath })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

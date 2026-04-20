import { NextResponse } from 'next/server'
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

  // Sanitizar nombre — solo alfanumérico, guiones y guión bajo
  const cleanName = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 80) // máx 80 chars

  const webpName   = `${cleanName}.webp`
  const publicPath = `/images/${folder}/${webpName}`
  const repoPath   = `public/images/${folder}/${webpName}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    // Intentar convertir con Sharp, pero si falla usar el buffer original
    let finalBuffer: Buffer
    try {
      const sharp = (await import('sharp')).default
      finalBuffer = await sharp(buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer()
    } catch (sharpErr) {
      console.warn('[upload] Sharp falló, usando buffer original:', sharpErr)
      finalBuffer = buffer
    }

    // ── DESARROLLO: guardar en filesystem local ──────────────────────────
    if (process.env.NODE_ENV === 'development') {
      const dir = path.join(process.cwd(), 'public', 'images', folder)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(path.join(dir, webpName), finalBuffer)
      console.log('[upload] Guardado localmente:', publicPath)
      return NextResponse.json({ ok: true, path: publicPath })
    }

    // ── PRODUCCIÓN: subir a GitHub directamente en main ─────────────────
    const base64 = finalBuffer.toString('base64')
    let sha: string | undefined
    try {
      const existing = await getFile(repoPath)
      sha = existing.sha
    } catch { /* archivo nuevo */ }

    await uploadFile(repoPath, base64, `admin: imagen ${webpName}`, sha, 'main')
    return NextResponse.json({ ok: true, path: publicPath })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

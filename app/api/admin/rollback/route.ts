import { NextResponse } from 'next/server'

const GITHUB_API = 'https://api.github.com'
const OWNER = process.env.GITHUB_OWNER!
const REPO  = process.env.GITHUB_REPO!
const TOKEN = process.env.GITHUB_TOKEN!

function ghHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

// GET — últimos commits para mostrar en el panel
export async function GET() {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/commits?per_page=6`, {
      headers: ghHeaders(), cache: 'no-store',
    })
    if (!res.ok) throw new Error('No se pudo obtener historial')
    const commits = await res.json()
    const list = commits.map((c: { sha: string; commit: { message: string; author: { date: string } } }) => ({
      sha:     c.sha.slice(0, 7),
      fullSha: c.sha,
      message: c.commit.message,
      date:    c.commit.author.date,
    }))
    return NextResponse.json({ commits: list })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

// POST — revierte el último commit restaurando archivos de config al estado anterior
export async function POST() {
  try {
    // 1. Últimos 2 commits
    const commitsRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/commits?per_page=2`, {
      headers: ghHeaders(), cache: 'no-store',
    })
    if (!commitsRes.ok) throw new Error('No se pudo obtener historial')
    const [lastCommit, prevCommit] = await commitsRes.json()
    if (!prevCommit) throw new Error('No hay commit anterior para restaurar')

    // 2. Archivos cambiados en el último commit
    const detailRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/commits/${lastCommit.sha}`, {
      headers: ghHeaders(), cache: 'no-store',
    })
    if (!detailRes.ok) throw new Error('No se pudo leer el commit')
    const detail = await detailRes.json()
    const changedFiles: Array<{ filename: string; status: string }> = detail.files || []

    // Solo revertimos archivos de config — nunca imágenes ni código fuente
    const REVERTIBLE = ['config/', 'lib/products.ts']
    const toRevert = changedFiles.filter(f =>
      f.status !== 'added' &&
      REVERTIBLE.some(p => f.filename.startsWith(p))
    )

    if (toRevert.length === 0) {
      return NextResponse.json({ error: 'El último cambio no tiene archivos revertibles automáticamente.' }, { status: 400 })
    }

    const revertidos: string[] = []

    // 3. Para cada archivo: restaurar al contenido del commit anterior
    for (const file of toRevert) {
      const [prevRes, currRes] = await Promise.all([
        fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${file.filename}?ref=${prevCommit.sha}`, { headers: ghHeaders(), cache: 'no-store' }),
        fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${file.filename}`, { headers: ghHeaders(), cache: 'no-store' }),
      ])
      if (!prevRes.ok || !currRes.ok) continue

      const [prevFile, currFile] = await Promise.all([prevRes.json(), currRes.json()])

      const putRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${file.filename}`, {
        method: 'PUT',
        headers: ghHeaders(),
        body: JSON.stringify({
          message: `rollback: revertir cambio en ${file.filename}`,
          content: prevFile.content.replace(/\n/g, ''),
          sha: currFile.sha,
          branch: 'main',
        }),
      })
      if (putRes.ok) revertidos.push(file.filename)
    }

    return NextResponse.json({ ok: true, revertidos, message: `Revertido: "${lastCommit.commit.message.slice(0, 60)}"` })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

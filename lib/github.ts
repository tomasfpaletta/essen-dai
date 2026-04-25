// ─────────────────────────────────────────────────────────────────────────────
//  GitHub API — utilidades para el panel admin
// ─────────────────────────────────────────────────────────────────────────────
const GITHUB_API = 'https://api.github.com'
const OWNER = process.env.GITHUB_OWNER!
const REPO  = process.env.GITHUB_REPO!
const TOKEN = process.env.GITHUB_TOKEN!

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

/** Obtiene metadata de un archivo (incluye sha) */
export async function getFile(path: string) {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GitHub: no se pudo leer ${path} (${res.status})`)
  return res.json() as Promise<{ sha: string; content: string; encoding: string }>
}

/** Sube o actualiza un archivo con contenido en base64 */
export async function uploadFile(
  path: string,
  base64Content: string,
  message: string,
  sha?: string,
  branch = 'main'
) {
  const body: Record<string, unknown> = { message, content: base64Content, branch }
  if (sha) body.sha = sha

  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GitHub: error subiendo ${path}: ${JSON.stringify(err)}`)
  }
  return res.json()
}

/** Actualiza un archivo de texto en una rama */
export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string,
  branch: string
) {
  const base64 = Buffer.from(content, 'utf-8').toString('base64')
  return uploadFile(path, base64, message, sha, branch)
}

/** Obtiene el SHA del último commit de main */
export async function getMainSha(): Promise<string> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/ref/heads/main`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GitHub: no se pudo obtener SHA de main`)
  const data = await res.json()
  return data.object.sha as string
}

/** Crea una rama nueva desde un SHA */
export async function createBranch(branchName: string, fromSha: string) {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/refs`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: fromSha }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GitHub: error creando rama ${branchName}: ${JSON.stringify(err)}`)
  }
  return res.json()
}

/** Abre un Pull Request */
export async function createPR(title: string, body: string, head: string, base = 'main') {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/pulls`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ title, body, head, base }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GitHub: error creando PR: ${JSON.stringify(err)}`)
  }
  return res.json() as Promise<{ html_url: string; number: number }>
}

/**
 * Publica MÚLTIPLES archivos en un ÚNICO commit atómico usando la Git Trees API.
 * Un solo commit → un solo deploy de Vercel → cero conflictos de SHA.
 * Reintenta hasta 5 veces si el ref fue actualizado entre medio (race condition).
 */
export async function publishFiles(
  files: Array<{ path: string; content: string }>,
  message: string
) {
  if (files.length === 0) throw new Error('publishFiles: no hay archivos para publicar')

  const MAX_RETRIES = 5

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 1. SHA del último commit de main
      const refRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/ref/heads/main`, {
        headers: headers(), cache: 'no-store',
      })
      if (!refRes.ok) throw new Error('GitHub: no se pudo leer ref/heads/main')
      const refData = await refRes.json()
      const headSha: string = refData.object.sha

      // 2. SHA del tree de ese commit
      const commitRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/commits/${headSha}`, {
        headers: headers(), cache: 'no-store',
      })
      if (!commitRes.ok) throw new Error('GitHub: no se pudo leer el commit HEAD')
      const commitData = await commitRes.json()
      const basTreeSha: string = commitData.tree.sha

      // 3. Crear blobs para cada archivo (en paralelo — no hay dependencias entre sí)
      const treeItems = await Promise.all(files.map(async ({ path, content }) => {
        const blobRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/blobs`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({
            content: Buffer.from(content, 'utf-8').toString('base64'),
            encoding: 'base64',
          }),
        })
        if (!blobRes.ok) {
          const e = await blobRes.json().catch(() => ({}))
          throw new Error(`GitHub: error creando blob para ${path}: ${JSON.stringify(e)}`)
        }
        const blob = await blobRes.json()
        return { path, mode: '100644', type: 'blob', sha: blob.sha }
      }))

      // 4. Crear el nuevo tree (basado en el tree actual)
      const treeRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/trees`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ base_tree: basTreeSha, tree: treeItems }),
      })
      if (!treeRes.ok) {
        const e = await treeRes.json().catch(() => ({}))
        throw new Error(`GitHub: error creando tree: ${JSON.stringify(e)}`)
      }
      const newTree = await treeRes.json()

      // 5. Crear el commit
      const newCommitRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/commits`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha] }),
      })
      if (!newCommitRes.ok) {
        const e = await newCommitRes.json().catch(() => ({}))
        throw new Error(`GitHub: error creando commit: ${JSON.stringify(e)}`)
      }
      const newCommit = await newCommitRes.json()

      // 6. Mover el ref de main al nuevo commit
      const updateRes = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ sha: newCommit.sha, force: false }),
      })
      if (updateRes.ok) return updateRes.json()

      // 422 = ref desactualizado (alguien hizo push entre medio) → reintentar
      const errBody = await updateRes.json().catch(() => ({}))
      const isStale = updateRes.status === 422 || JSON.stringify(errBody).includes('422')
      if (isStale && attempt < MAX_RETRIES) {
        const delay = 500 * Math.pow(2, attempt - 1)
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      throw new Error(`GitHub: error actualizando ref: ${JSON.stringify(errBody)}`)

    } catch (err) {
      // Si es el último intento, propagar el error
      if (attempt === MAX_RETRIES) throw err
      // Si no es un error de red/stale, propagar inmediatamente
      const msg = err instanceof Error ? err.message : ''
      if (!msg.includes('422') && !msg.includes('ref')) throw err
      const delay = 500 * Math.pow(2, attempt - 1)
      await new Promise(r => setTimeout(r, delay))
    }
  }

  throw new Error('publishFiles: máximo de intentos alcanzado')
}

/**
 * Publica un único archivo (wrapper de publishFiles para compatibilidad).
 */
export async function publishFile(path: string, content: string, message: string) {
  return publishFiles([{ path, content }], message)
}

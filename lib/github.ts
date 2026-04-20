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
 * Crea o actualiza un archivo directamente en main.
 * No requiere rama ni PR — los cambios se publican al instante (Vercel deploya en ~30s).
 */
export async function publishFile(path: string, content: string, message: string) {
  let sha: string | undefined
  try {
    const existing = await getFile(path)
    sha = existing.sha
  } catch {
    // El archivo no existe aún → lo creamos
  }
  const base64 = Buffer.from(content, 'utf-8').toString('base64')
  return uploadFile(path, base64, message, sha, 'main')
}

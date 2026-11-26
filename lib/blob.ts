import { put, get, del } from '@vercel/blob'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, normalize } from 'node:path'

/** Dossier local qui remplace Vercel Blob pour les tests sur la machine de développement (jamais défini sur Vercel). */
export const BLOB_MOCK_DIR = process.env.BLOB_MOCK_DIR || ''

export function blobCredential(): 'jeton' | 'connexion-auto' | 'test-local' | 'aucun' {
  if (BLOB_MOCK_DIR) return 'test-local'
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'jeton'
  if (process.env.BLOB_STORE_ID) return 'connexion-auto'
  return 'aucun'
}

const suffix = () => Math.random().toString(36).slice(2, 12)
const withSuffix = (path: string) => path.replace(/(\.[a-z0-9]+)?$/i, (ext) => `-${suffix()}${ext || ''}`)

/** Traduit les erreurs de Vercel Blob en phrases claires. */
export function blobMessage(e: unknown): string {
  const name = (e as Error)?.constructor?.name ?? ''
  const msg = (e as Error)?.message ?? String(e)
  if (name === 'BlobStoreNotFoundError') return 'Le stockage Blob est introuvable : reliez un stockage Blob au projet dans Vercel, puis redéployez.'
  if (name === 'BlobStoreSuspendedError') return 'Le stockage Blob est suspendu par Vercel (quota ou facturation).'
  if (name === 'BlobAccessError') return 'Vercel Blob refuse l’accès : reliez à nouveau le stockage au projet (Storage › Connect Project), puis redéployez.'
  if (name === 'BlobOidcEnvironmentNotAllowedError') return 'Le stockage Blob n’est pas activé pour cet environnement : dans Vercel, cochez Production pour ce stockage.'
  if (name === 'BlobFileTooLargeError') return 'Photo trop lourde pour le stockage.'
  if (/No blob credentials|No read-write token/i.test(msg)) return 'Aucun stockage Blob n’est relié au projet dans Vercel.'
  return msg || 'Erreur inconnue du stockage.'
}

/**
 * Enregistre un fichier et renvoie l’adresse à afficher.
 * Stockage public : adresse directe Vercel Blob. Stockage privé : le site sert le fichier via /api/media/….
 */
export async function saveFile(path: string, file: File | Blob, contentType: string): Promise<{ url: string; access: 'public' | 'private' | 'local' }> {
  if (BLOB_MOCK_DIR) {
    const p = withSuffix(path)
    const full = join(BLOB_MOCK_DIR, normalize(p).replace(/^(\.\.(\/|\\|$))+/, ''))
    await mkdir(dirname(full), { recursive: true })
    await writeFile(full, Buffer.from(await file.arrayBuffer()))
    return { url: `/api/media/${p}`, access: 'local' }
  }
  try {
    const b = await put(path, file, { access: 'public', addRandomSuffix: true, contentType })
    return { url: b.url, access: 'public' }
  } catch (first) {
    // Stockage créé en « privé » : on enregistre en privé et le site sert le fichier lui-même.
    try {
      const b = await put(path, file, { access: 'private', addRandomSuffix: true, contentType })
      return { url: `/api/media/${b.pathname}`, access: 'private' }
    } catch {
      throw first
    }
  }
}

/** Lit un fichier privé (ou de test) pour /api/media. */
export async function readFileForMedia(pathname: string): Promise<{ body: BodyInit; type: string } | null> {
  if (BLOB_MOCK_DIR) {
    const full = join(BLOB_MOCK_DIR, normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, ''))
    if (!full.startsWith(BLOB_MOCK_DIR)) return null
    try {
      const buf = await readFile(full)
      const ext = pathname.split('.').pop()?.toLowerCase()
      const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : ext === 'pdf' ? 'application/pdf' : 'image/jpeg'
      return { body: new Uint8Array(buf), type }
    } catch {
      return null
    }
  }
  const r = await get(pathname, { access: 'private' })
  if (!r || r.statusCode !== 200) return null
  return { body: r.stream, type: r.blob.contentType || 'application/octet-stream' }
}

/** Test complet : écrit un petit fichier, le relit, puis le supprime. */
export async function blobSelfTest(): Promise<{ ok: boolean; access?: string; message: string }> {
  if (blobCredential() === 'aucun') return { ok: false, message: 'Aucun stockage Blob n’est relié au projet dans Vercel (ni BLOB_READ_WRITE_TOKEN, ni BLOB_STORE_ID).' }
  try {
    const f = new Blob([`test ${new Date().toISOString()}`], { type: 'text/plain' })
    const { url, access } = await saveFile('_test/verification.txt', f, 'text/plain')
    if (access === 'public') {
      const r = await fetch(url, { cache: 'no-store' })
      if (!r.ok) return { ok: false, access, message: `Le fichier est enregistré mais illisible (${r.status}).` }
      await del(url).catch(() => {})
    } else if (access === 'private') {
      const pathname = url.replace('/api/media/', '')
      const r = await readFileForMedia(pathname)
      if (!r) return { ok: false, access, message: 'Le fichier est enregistré mais le site ne peut pas le relire.' }
      await del(pathname).catch(() => {})
    }
    return {
      ok: true,
      access,
      message:
        access === 'private'
          ? 'Tout fonctionne. Le stockage est en mode privé : le site sert lui-même les photos.'
          : access === 'local'
            ? 'Tout fonctionne (stockage de test local).'
            : 'Tout fonctionne. Les photos sont enregistrées et visibles.',
    }
  } catch (e) {
    return { ok: false, message: blobMessage(e) }
  }
}

/** Adresse d’un fichier enregistré par le site (Blob public, ou servi par /api/media pour un stockage privé). */
export const isStoredUrl = (u: unknown, folder?: string): u is string =>
  typeof u === 'string' &&
  (/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u) ||
    new RegExp(`^/api/media/${folder ?? '[a-z0-9-]+'}/[\\w.-]+$`, 'i').test(u))

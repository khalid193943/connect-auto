import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { HAS_BLOB } from '@/lib/store'
import { blobMessage, saveFile } from '@/lib/blob'

export const runtime = 'nodejs'

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const BY_EXT: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif', svg: 'image/svg+xml', pdf: 'application/pdf' }

/**
 * Envoi d’une photo (déjà réduite dans le navigateur) vers Vercel Blob.
 * Marche avec un stockage public ou privé, relié par BLOB_READ_WRITE_TOKEN ou par la connexion automatique (BLOB_STORE_ID).
 */
export async function POST(request: Request) {
  if (!HAS_BLOB) return NextResponse.json({ error: 'Le stockage des photos n’est pas encore relié au projet dans Vercel.' }, { status: 503 })
  let fd: FormData
  try {
    fd = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Envoi interrompu ou fichier trop lourd.' }, { status: 400 })
  }
  const file = fd.get('file')
  const scope = String(fd.get('scope') ?? 'reprise')
  const folder = String(fd.get('folder') ?? 'reprise').replace(/[^a-z0-9-]/gi, '') || 'reprise'
  if (!(file instanceof File)) return NextResponse.json({ error: 'Fichier manquant.' }, { status: 400 })
  const isAdmin = scope === 'admin'
  if (isAdmin && !(await getSession())) return NextResponse.json({ error: 'Session expirée : reconnectez-vous.' }, { status: 401 })
  if (!isAdmin && folder !== 'reprise') return NextResponse.json({ error: 'Dossier refusé.' }, { status: 403 })
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const type = file.type || BY_EXT[ext] || ''
  const allowed = isAdmin ? [...TYPES, 'image/svg+xml', 'application/pdf'] : TYPES
  if (!allowed.includes(type)) return NextResponse.json({ error: `Format refusé (${type || ext || 'inconnu'}). Utilisez une photo JPEG, PNG ou WebP.` }, { status: 415 })
  if (file.size > 4.2 * 1024 * 1024) return NextResponse.json({ error: 'Photo trop lourde (plus de 4 Mo).' }, { status: 413 })
  const safe = file.name.normalize('NFD').replace(/[^\w.-]+/g, '-').toLowerCase().slice(-80) || 'photo.jpg'
  try {
    const { url } = await saveFile(`${folder}/${safe}`, file, type)
    return NextResponse.json({ url })
  } catch (e) {
    console.error('upload', e)
    return NextResponse.json({ error: blobMessage(e) }, { status: 500 })
  }
}

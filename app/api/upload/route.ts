import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { HAS_BLOB } from '@/lib/store'

export const runtime = 'nodejs'

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

/**
 * Envoi d’une photo (déjà réduite dans le navigateur) vers Vercel Blob.
 * Fonctionne avec un stockage relié par BLOB_READ_WRITE_TOKEN ou par la connexion automatique (BLOB_STORE_ID).
 */
export async function POST(request: Request) {
  if (!HAS_BLOB) return NextResponse.json({ error: 'Stockage des photos non activé.' }, { status: 503 })
  const fd = await request.formData()
  const file = fd.get('file')
  const scope = String(fd.get('scope') ?? 'reprise')
  const folder = String(fd.get('folder') ?? 'reprise').replace(/[^a-z0-9-]/gi, '') || 'reprise'
  if (!(file instanceof File)) return NextResponse.json({ error: 'Fichier manquant.' }, { status: 400 })
  const isAdmin = scope === 'admin'
  if (isAdmin && !(await getSession())) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 })
  if (!isAdmin && folder !== 'reprise') return NextResponse.json({ error: 'Dossier refusé.' }, { status: 403 })
  const allowed = isAdmin ? [...TYPES, 'image/svg+xml', 'application/pdf'] : TYPES
  if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Format refusé.' }, { status: 415 })
  if (file.size > 4.2 * 1024 * 1024) return NextResponse.json({ error: 'Fichier trop lourd.' }, { status: 413 })
  const safe = file.name.normalize('NFD').replace(/[^\w.-]+/g, '-').toLowerCase().slice(-80) || 'photo.jpg'
  try {
    const blob = await put(`${folder}/${safe}`, file, { access: 'public', addRandomSuffix: true, contentType: file.type })
    return NextResponse.json({ url: blob.url })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

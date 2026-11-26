import { getSession } from '@/lib/auth'
import { readFileForMedia } from '@/lib/blob'

export const runtime = 'nodejs'

/** Sert les photos d’un stockage Blob privé. Les photos de reprise envoyées par les clients restent réservées à l’équipe. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathname = path.map(decodeURIComponent).join('/')
  if (pathname.includes('..') || pathname.startsWith('_test/')) return new Response('Introuvable', { status: 404 })
  const isPrivateFolder = pathname.startsWith('reprise/')
  if (isPrivateFolder && !(await getSession())) return new Response('Réservé à l’équipe', { status: 401 })
  try {
    const f = await readFileForMedia(pathname)
    if (!f) return new Response('Introuvable', { status: 404 })
    return new Response(f.body, {
      headers: {
        'Content-Type': f.type,
        'Cache-Control': isPrivateFolder ? 'private, max-age=3600' : 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Introuvable', { status: 404 })
  }
}

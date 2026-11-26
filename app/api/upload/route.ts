import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { HAS_BLOB } from '@/lib/store'

export async function POST(request: Request) {
  if (!HAS_BLOB) return NextResponse.json({ error: 'Stockage des photos non activé.' }, { status: 503 })
  const body = (await request.json()) as HandleUploadBody
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const isAdmin = clientPayload === 'admin'
        if (isAdmin && !(await getSession())) throw new Error('Non connecté')
        if (!isAdmin && !pathname.startsWith('reprise/')) throw new Error('Chemin refusé')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', ...(isAdmin ? ['application/pdf', 'image/svg+xml'] : [])],
          maximumSizeInBytes: (isAdmin ? 20 : 12) * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}

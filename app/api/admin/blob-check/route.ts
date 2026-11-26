import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { blobCredential, blobSelfTest } from '@/lib/blob'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Diagnostic de l’envoi des photos, lancé depuis Réglages. */
export async function POST() {
  if (!(await getSession())) return NextResponse.json({ ok: false, message: 'Session expirée : reconnectez-vous.' }, { status: 401 })
  const credential = blobCredential()
  const r = await blobSelfTest()
  return NextResponse.json({ ...r, credential })
}

import { NextResponse } from 'next/server'
import { sessionCan } from '@/lib/auth'
import { lookupPlate } from '@/lib/plate'

export const dynamic = 'force-dynamic'

/** Remplissage automatique d’une fiche véhicule à partir de la plaque (réservé à l’espace garage). */
export async function GET(req: Request) {
  if (!(await sessionCan('vehicules'))) return NextResponse.json({ ok: false, msg: 'Accès refusé.' }, { status: 403 })
  const immat = new URL(req.url).searchParams.get('immat') ?? ''
  const r = await lookupPlate(immat.slice(0, 20))
  return NextResponse.json(r, { status: r.ok ? 200 : r.code === 'format' ? 400 : r.code === 'notfound' ? 404 : r.code === 'off' ? 501 : 502 })
}

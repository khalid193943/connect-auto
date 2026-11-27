import { sessionCan } from '@/lib/auth'
import { list } from '@/lib/store'

export const dynamic = 'force-dynamic'
const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

export async function GET() {
  if (!(await sessionCan('vehicules'))) return new Response('Accès refusé', { status: 403 })
  const rows = (await list('vehicles')).filter((v) => v.purchase?.date || v.purchase?.sellerName).sort((a, b) => (a.purchase?.date ?? '').localeCompare(b.purchase?.date ?? ''))
  const head = ['N°', 'Date d’achat', 'Vendeur', 'Adresse du vendeur', 'Pièce d’identité', 'Véhicule', 'Immatriculation', 'N° de série', 'Prix d’achat', 'Statut', 'Référence']
  const lines = rows.map((v, i) => [i + 1, v.purchase?.date, v.purchase?.sellerName, v.purchase?.sellerAddress, v.purchase?.sellerId, `${v.brand} ${v.model} ${v.version}`, v.purchase?.registration, v.purchase?.vin, v.purchase?.price, v.status, v.ref].map(cell).join(';'))
  const csv = '﻿' + [head.map(cell).join(';'), ...lines].join('\r\n')
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="registre-achats-${new Date().toISOString().slice(0, 10)}.csv"` } })
}

import { getSession } from '@/lib/auth'
import { exportAll } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const s = await getSession()
  if (!s || s.role !== 'gerant') return new Response('Accès refusé', { status: 403 })
  const data = await exportAll()
  return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="connect-auto-sauvegarde-${new Date().toISOString().slice(0, 10)}.json"` },
  })
}

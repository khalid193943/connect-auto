import Link from 'next/link'
import { Plus } from 'lucide-react'
import { list } from '@/lib/store'
import { VehicleRow } from '@/components/admin/ui'
import { CATEGORIES } from '@/lib/site'

export default async function Vehicules({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const { f = 'vente', q = '' } = await searchParams
  const all = (await list('vehicles')).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const filters: [string, string, (s: string) => boolean][] = [
    ['vente', 'En vente', (s) => s === 'disponible'],
    ['reserve', 'Réservés', (s) => s === 'reserve'],
    ['vendu', 'Vendus', (s) => s === 'vendu'],
    ['tous', 'Tous', () => true],
  ]
  const fn = filters.find((x) => x[0] === f)?.[2] ?? filters[0][2]
  const needle = q.toLowerCase()
  const shown = all.filter((v) => fn(v.status) && (!needle || `${v.brand} ${v.model} ${v.ref} ${v.version}`.toLowerCase().includes(needle)))
  return (
    <main className="adm-main">
      <div className="adm-head">
        <h1>Véhicules</h1>
        <Link href="/admin/vehicules/nouveau" className="b pri sm"><Plus /> Ajouter</Link>
      </div>
      <div className="seg">
        {filters.map(([k, l, fx]) => (
          <Link key={k} href={`/admin/vehicules?f=${k}`} className={k === f ? 'on' : undefined}>{l} ({all.filter((v) => fx(v.status)).length})</Link>
        ))}
      </div>
      <form><input type="hidden" name="f" value={f} /><input className="search" name="q" defaultValue={q} placeholder="Rechercher : Trafic, CA-104…" /></form>
      <div className="card flat">
        <div className="rows">
          {shown.length ? shown.map((v) => <VehicleRow key={v.id} v={v} />) : <p className="empty-a">Aucun véhicule ici.</p>}
        </div>
      </div>
      <p className="hint">{CATEGORIES.map((c) => `${c.label} : ${all.filter((v) => v.category === c.key && v.status !== 'vendu').length}`).join(' · ')}</p>
      <Link href="/admin/vehicules/nouveau" className="fab" aria-label="Ajouter un véhicule"><Plus /></Link>
    </main>
  )
}

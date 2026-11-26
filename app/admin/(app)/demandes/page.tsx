import Link from 'next/link'
import { list } from '@/lib/store'
import { LeadRow } from '@/components/admin/ui'

export default async function Demandes({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f = 'ouvertes' } = await searchParams
  const all = (await list('leads')).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const tabs: [string, string, (l: (typeof all)[number]) => boolean][] = [
    ['ouvertes', 'À traiter', (l) => l.status !== 'traitee'],
    ['reprise', 'Reprises', (l) => l.type === 'reprise'],
    ['rdv', 'Rendez-vous', (l) => l.type === 'rdv'],
    ['vehicule', 'Véhicules', (l) => l.type === 'vehicule'],
    ['traitees', 'Traitées', (l) => l.status === 'traitee'],
    ['toutes', 'Toutes', () => true],
  ]
  const fn = tabs.find((t) => t[0] === f)?.[2] ?? tabs[0][2]
  const shown = all.filter(fn)
  return (
    <main className="adm-main">
      <h1>Demandes</h1>
      <p className="sub">Formulaires reçus depuis le site : reprises, rendez-vous, questions sur un véhicule.</p>
      <div className="seg">
        {tabs.map(([k, l, fx]) => (
          <Link key={k} href={`/admin/demandes?f=${k}`} className={k === f ? 'on' : undefined}>{l} ({all.filter(fx).length})</Link>
        ))}
      </div>
      <div className="card flat">
        <div className="rows">{shown.length ? shown.map((l) => <LeadRow key={l.id} l={l} />) : <p className="empty-a">Rien à traiter. 👍</p>}</div>
      </div>
    </main>
  )
}

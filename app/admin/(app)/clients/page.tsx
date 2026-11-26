import Link from 'next/link'
import { ChevronRight, Plus } from 'lucide-react'
import { list } from '@/lib/store'

export default async function Clients({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const [clients, docs] = await Promise.all([list('clients'), list('docs')])
  const n = q.toLowerCase().replace(/\s/g, '')
  const shown = clients
    .filter((c) => !n || `${c.name}${c.company ?? ''}${c.phone}`.toLowerCase().replace(/\s/g, '').includes(n))
    .sort((a, b) => a.name.localeCompare(b.name))
  return (
    <main className="adm-main">
      <div className="adm-head">
        <h1>Clients</h1>
        <Link href="/admin/clients/nouveau" className="b pri sm"><Plus /> Nouveau</Link>
      </div>
      <div className="seg">
        <Link href="/admin/documents">Devis & factures</Link>
        <Link href="/admin/clients" className="on">Clients ({clients.length})</Link>
      </div>
      <form><input className="search" name="q" defaultValue={q} placeholder="Nom, société ou téléphone" /></form>
      <div className="card flat">
        <div className="rows">
          {shown.length ? shown.map((c) => (
            <Link key={c.id} href={`/admin/clients/${c.id}`} className="row">
              <span className="main"><b>{c.name}</b><span>{c.company ? `${c.company} · ` : ''}{c.phone}</span></span>
              <span className="end"><span className={`pill ${c.kind === 'pro' ? 'blue' : 'grey'}`}>{c.kind === 'pro' ? 'Pro' : 'Particulier'}</span><span className="small" style={{ color: 'var(--a-muted)' }}>{docs.filter((d) => d.clientId === c.id).length} doc.</span></span>
              <ChevronRight className="chev" />
            </Link>
          )) : <p className="empty-a">Aucun client trouvé.</p>}
        </div>
      </div>
    </main>
  )
}

import Link from 'next/link'
import { ChevronRight, Plus } from 'lucide-react'
import { list } from '@/lib/store'
import { DOC_LABEL, STATUS_COLOR, STATUS_LABEL, totals } from '@/lib/docs'
import { dateShort, eur } from '@/lib/format'

export default async function Documents({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f = 'tous' } = await searchParams
  const all = (await list('docs')).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const tabs: [string, string, (d: (typeof all)[number]) => boolean][] = [
    ['tous', 'Tous', () => true],
    ['devis', 'Devis', (d) => d.type === 'devis'],
    ['commande', 'Bons de commande', (d) => d.type === 'commande'],
    ['facture', 'Factures', (d) => d.type === 'facture'],
    ['apayer', 'À payer', (d) => d.type === 'facture' && d.status === 'emise'],
  ]
  const fn = tabs.find((t) => t[0] === f)?.[2] ?? tabs[0][2]
  const shown = all.filter(fn)
  const unpaid = all.filter((d) => d.type === 'facture' && d.status === 'emise').reduce((s, d) => s + totals(d.lines, d.vatMode).ttc, 0)
  return (
    <main className="adm-main">
      <div className="adm-head">
        <h1>Devis & factures</h1>
      </div>
      <div className="seg">
        <Link href="/admin/documents" className="on">Documents</Link>
        <Link href="/admin/clients">Clients</Link>
      </div>
      <div className="actions three">
        <Link href="/admin/documents/nouveau?type=devis" className="b sm pri"><Plus /> Devis</Link>
        <Link href="/admin/documents/nouveau?type=commande" className="b sm"><Plus /> Bon cde</Link>
        <Link href="/admin/documents/nouveau?type=facture" className="b sm"><Plus /> Facture</Link>
      </div>
      {unpaid > 0 && <p className="banner warn" style={{ margin: 0 }}>Factures en attente de paiement : <b>{eur(unpaid, 2)}</b></p>}
      <div className="seg">
        {tabs.map(([k, l, fx]) => <Link key={k} href={`/admin/documents?f=${k}`} className={k === f ? 'on' : undefined}>{l} ({all.filter(fx).length})</Link>)}
      </div>
      <div className="card flat">
        <div className="rows">
          {shown.length ? shown.map((d) => (
            <Link key={d.id} href={`/admin/documents/${d.id}`} className="row">
              <span className="main">
                <b>{d.client.company || d.client.name}</b>
                <span>{DOC_LABEL[d.type]} {d.number || '(brouillon)'} · {dateShort(d.date)}</span>
              </span>
              <span className="end">
                <b className="num">{eur(totals(d.lines, d.vatMode).ttc, 2)}</b>
                <span className={`pill ${STATUS_COLOR[d.status]}`}>{STATUS_LABEL[d.status]}</span>
              </span>
              <ChevronRight className="chev" />
            </Link>
          )) : <p className="empty-a">Aucun document.</p>}
        </div>
      </div>
    </main>
  )
}

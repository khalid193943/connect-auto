import Link from 'next/link'
import { ArrowRight, Car, FilePlus2, Inbox, Info, Plus, ReceiptEuro } from 'lucide-react'
import { can, requireSession } from '@/lib/auth'
import { HAS_BLOB, HAS_DB, list } from '@/lib/store'
import { LeadRow, VehicleRow } from '@/components/admin/ui'
import { ConfirmButton } from '@/components/admin/ActionForm'
import { totals } from '@/lib/docs'
import { eur } from '@/lib/format'
import { deleteDemoData } from '../actions'

export default async function Dashboard() {
  const me = await requireSession()
  const [vehicles, leads, docs, clients] = await Promise.all([list('vehicles'), list('leads'), list('docs'), list('clients')])
  const fresh = leads.filter((l) => l.status === 'nouvelle')
  const onSale = vehicles.filter((v) => v.status === 'disponible').length
  const reserved = vehicles.filter((v) => v.status === 'reserve').length
  const unpaidDocs = docs.filter((d) => d.type === 'facture' && d.status === 'emise')
  const unpaid = unpaidDocs.reduce((s, d) => s + totals(d.lines, d.vatMode).ttc, 0)
  const demoCount = [...vehicles, ...leads, ...clients, ...docs].filter((x) => (x as { demo?: boolean }).demo).length
  const h = Number(new Date().toLocaleString('fr-FR', { hour: 'numeric', hour12: false, timeZone: 'Europe/Paris' }))
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' })
  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  const lastVehicles = [...vehicles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5)
  const s = (n: number) => (n > 1 ? 's' : '')

  return (
    <main className="adm-main wide">
      <div className="hello">
        <p className="date">{today}</p>
        <h1>{h < 18 ? 'Bonjour' : 'Bonsoir'} {me.name}</h1>
      </div>

      {!HAS_DB && (
        <p className="banner warn"><Info /> <span>Version de démonstration : tout fonctionne, mais rien n’est conservé tant que la base de données n’est pas branchée.</span></p>
      )}
      {HAS_DB && !HAS_BLOB && <p className="banner warn"><Info /> <span>Le stockage des photos (Vercel Blob) n’est pas encore activé.</span></p>}

      <div className="kpis">
        {can(me, 'demandes') && <Link href="/admin/demandes" className={`kpi ${fresh.length ? 'hot' : ''}`}>
          <span className="kpi-ic"><Inbox /></span>
          <span className="kpi-tx"><small>Nouvelles demandes</small><b>{fresh.length}</b><i>{leads.length} au total</i></span>
          <ArrowRight className="go" />
        </Link>}
        {can(me, 'vehicules') && <Link href="/admin/vehicules" className="kpi">
          <span className="kpi-ic"><Car /></span>
          <span className="kpi-tx"><small>Véhicules en vente</small><b>{onSale}</b><i>{reserved} réservé{s(reserved)}</i></span>
          <ArrowRight className="go" />
        </Link>}
        {can(me, 'documents') && <Link href="/admin/documents?f=apayer" className="kpi">
          <span className="kpi-ic"><ReceiptEuro /></span>
          <span className="kpi-tx"><small>À encaisser</small><b>{eur(unpaid)}</b><i>{unpaidDocs.length} facture{s(unpaidDocs.length)} en attente</i></span>
          <ArrowRight className="go" />
        </Link>}
      </div>

      <div className="quick">
        {can(me, 'vehicules') && <Link href="/admin/vehicules/nouveau" className="b pri"><Plus /> Ajouter un véhicule</Link>}
        {can(me, 'documents') && <Link href="/admin/documents/nouveau?type=devis" className="b"><FilePlus2 /> Nouveau devis</Link>}
        {can(me, 'documents') && <Link href="/admin/documents/nouveau?type=facture" className="b"><FilePlus2 /> Nouvelle facture</Link>}
      </div>

      <div className="dash-cols">
        {can(me, 'demandes') && <section className="card flat">
          <div className="card-head"><h2>Dernières demandes</h2><Link href="/admin/demandes">Tout voir <ArrowRight /></Link></div>
          <div className="rows">{recentLeads.length ? recentLeads.map((l) => <LeadRow key={l.id} l={l} />) : <p className="empty-a">Les demandes du site arriveront ici.</p>}</div>
        </section>}
        {can(me, 'vehicules') && <section className="card flat">
          <div className="card-head"><h2>Véhicules récents</h2><Link href="/admin/vehicules">Tout voir <ArrowRight /></Link></div>
          <div className="rows">{lastVehicles.map((v) => <VehicleRow key={v.id} v={v} />)}</div>
        </section>}
      </div>

      {demoCount > 0 && me.role === 'gerant' && (
        <div className="card danger-zone">
          <h2>Fiches d’exemple</h2>
          <p className="hint">{demoCount} éléments d’exemple (demandes, clients, devis) servent à montrer l’outil. Supprimez-les quand vous démarrez pour de vrai.</p>
          <ConfirmButton action={deleteDemoData} confirm="Oui, tout supprimer">Supprimer les exemples</ConfirmButton>
        </div>
      )}
    </main>
  )
}

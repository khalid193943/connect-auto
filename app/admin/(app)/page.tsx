import Link from 'next/link'
import { Camera, Car, ExternalLink, FileText, Inbox, Info, MessageSquareQuote, PencilLine, Plus, Tags, Users, Wrench } from 'lucide-react'
import { requireSession } from '@/lib/auth'
import { HAS_BLOB, HAS_DB, list } from '@/lib/store'
import { LeadRow } from '@/components/admin/ui'
import { ConfirmButton } from '@/components/admin/ActionForm'
import { deleteDemoData } from '../actions'

export default async function Dashboard() {
  const me = await requireSession()
  const [vehicles, leads, docs, clients] = await Promise.all([list('vehicles'), list('leads'), list('docs'), list('clients')])
  const fresh = leads.filter((l) => l.status === 'nouvelle')
  const onSale = vehicles.filter((v) => v.status === 'disponible').length
  const toPay = docs.filter((d) => d.type === 'facture' && d.status === 'emise').length
  const demoCount = [...vehicles, ...leads, ...clients, ...docs].filter((x) => (x as { demo?: boolean }).demo).length
  const h = Number(new Date().toLocaleString('fr-FR', { hour: 'numeric', hour12: false, timeZone: 'Europe/Paris' }))
  const recent = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)

  return (
    <main className="adm-main">
      <div>
        <h1>{h < 18 ? 'Bonjour' : 'Bonsoir'} {me.name} 👋</h1>
        <p className="sub">{fresh.length ? `${fresh.length} nouvelle${fresh.length > 1 ? 's' : ''} demande${fresh.length > 1 ? 's' : ''} à traiter.` : 'Aucune nouvelle demande.'}</p>
      </div>

      {!HAS_DB && (
        <p className="banner warn"><Info /> <span>Version de démonstration : tout fonctionne, mais rien n’est conservé. La base de données sera branchée à la mise en ligne.</span></p>
      )}
      {HAS_DB && !HAS_BLOB && (
        <p className="banner warn"><Info /> <span>Le stockage des photos n’est pas encore activé dans Vercel (Blob).</span></p>
      )}

      <div className="tiles">
        <Link href="/admin/vehicules/nouveau" className="tile big">
          <span className="ti"><Plus /></span>
          <span><b>Ajouter un véhicule</b><small>Photos, prix, kilométrage : en ligne en 2 minutes</small></span>
        </Link>
        <Link href="/admin/demandes" className="tile">
          {fresh.length > 0 && <span className="badge">{fresh.length}</span>}
          <span className="ti"><Inbox /></span>
          <b>Demandes<small>{leads.length} au total</small></b>
        </Link>
        <Link href="/admin/vehicules" className="tile">
          <span className="ti"><Car /></span>
          <b>Véhicules<small>{onSale} en vente</small></b>
        </Link>
        <Link href="/admin/documents" className="tile">
          {toPay > 0 && <span className="badge" style={{ background: 'var(--a-warn)' }}>{toPay}</span>}
          <span className="ti"><FileText /></span>
          <b>Devis & factures<small>{docs.length} documents</small></b>
        </Link>
        <Link href="/admin/clients" className="tile">
          <span className="ti"><Users /></span>
          <b>Clients<small>{clients.length} fiches</small></b>
        </Link>
        <Link href="/admin/tarifs" className="tile">
          <span className="ti"><Tags /></span>
          <b>Prix<small>Tarifs affichés</small></b>
        </Link>
        <Link href="/admin/services" className="tile">
          <span className="ti"><Wrench /></span>
          <b>Services<small>Textes et prix</small></b>
        </Link>
        <Link href="/admin/textes" className="tile">
          <span className="ti"><PencilLine /></span>
          <b>Textes & horaires<small>Accueil, contact</small></b>
        </Link>
        <Link href="/admin/photos" className="tile">
          <span className="ti"><Camera /></span>
          <b>Photos du site<small>Bandeaux, services</small></b>
        </Link>
        <Link href="/admin/avis" className="tile">
          <span className="ti"><MessageSquareQuote /></span>
          <b>Avis clients<small>Note Google</small></b>
        </Link>
      </div>

      <div className="card flat">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--a-line)' }}>
          <h2>Dernières demandes</h2>
          <Link href="/admin/demandes" className="b sm">Tout voir</Link>
        </div>
        <div className="rows">
          {recent.length ? recent.map((l) => <LeadRow key={l.id} l={l} />) : <p className="empty-a">Les demandes du site arriveront ici.</p>}
        </div>
      </div>

      <a href="/" target="_blank" className="b full"><ExternalLink /> Voir le site</a>

      {demoCount > 0 && me.role === 'gerant' && (
        <div className="card danger-zone">
          <h2>Annonces et fiches d’exemple</h2>
          <p className="hint">{demoCount} éléments d’exemple servent à montrer le site. Supprimez-les quand vos vrais véhicules sont en ligne.</p>
          <ConfirmButton action={deleteDemoData} confirm="Oui, tout supprimer">Supprimer les exemples</ConfirmButton>
        </div>
      )}
    </main>
  )
}

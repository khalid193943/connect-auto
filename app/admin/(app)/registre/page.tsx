import { Download } from 'lucide-react'
import { list } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { dateShort, eur } from '@/lib/format'
import Link from 'next/link'

export default async function Registre() {
  const vehicles = (await list('vehicles')).filter((v) => v.purchase?.date || v.purchase?.sellerName).sort((a, b) => (b.purchase?.date ?? '').localeCompare(a.purchase?.date ?? ''))
  return (
    <main className="adm-main">
      <Back href="/admin/plus" label="Plus" />
      <h1>Registre des achats</h1>
      <p className="sub">Livre de police : chaque véhicule acheté avec la date, le vendeur, sa pièce d’identité et le prix. À conserver et à présenter en cas de contrôle.</p>
      <p className="banner info" style={{ margin: 0 }}>Ces informations se remplissent dans chaque véhicule, rubrique « Achat du véhicule ». Exportez régulièrement le registre pour l’archiver.</p>
      <a href="/api/admin/registre" className="b pri full"><Download /> Télécharger le registre (tableur)</a>
      <div className="card flat">
        <div className="rows">
          {vehicles.length ? vehicles.map((v) => (
            <Link key={v.id} href={`/admin/vehicules/${v.id}`} className="row">
              <span className="main"><b>{v.brand} {v.model} · {v.purchase?.registration || v.ref}</b><span>{v.purchase?.date ? dateShort(v.purchase.date) : 'Date ?'} · {v.purchase?.sellerName || 'Vendeur ?'}</span></span>
              <span className="end"><b className="num">{v.purchase?.price ? eur(v.purchase.price) : '—'}</b>{!v.purchase?.sellerId && <span className="pill orange">Pièce d’identité ?</span>}</span>
            </Link>
          )) : <p className="empty-a">Aucun achat renseigné pour l’instant.</p>}
        </div>
      </div>
    </main>
  )
}

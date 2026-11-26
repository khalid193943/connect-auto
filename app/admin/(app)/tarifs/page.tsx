import { ExternalLink } from 'lucide-react'
import { list } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { ActionForm } from '@/components/admin/ActionForm'
import { PricesEditor } from '@/components/admin/PricesEditor'
import { savePrices } from '../../actions'

export default async function Tarifs() {
  const prices = (await list('prices')).sort((a, b) => a.order - b.order)
  return (
    <main className="adm-main">
      <Back href="/admin/plus" label="Plus" />
      <h1>Tarifs</h1>
      <p className="sub">Prix TTC affichés sur la page Tarifs. Un prix vide s’affiche « Sur devis ».</p>
      <p className="banner info" style={{ margin: 0 }}>Rappel : le taux horaire TTC et les prix des prestations courantes doivent aussi être affichés à l’atelier.</p>
      <a href="/tarifs" target="_blank" className="b sm"><ExternalLink /> Voir la page Tarifs</a>
      <ActionForm action={savePrices}>
        <PricesEditor initial={prices} />
      </ActionForm>
    </main>
  )
}

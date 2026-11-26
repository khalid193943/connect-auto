import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { get } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { ActionForm } from '@/components/admin/ActionForm'
import { saveService } from '../../../actions'

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = await get('services', id)
  if (!s) notFound()
  return (
    <main className="adm-main">
      <Back href="/admin/services" label="Services" />
      <h1>{s.title}</h1>
      <a href={`/services/${s.slug}`} target="_blank" className="b sm"><ExternalLink /> Voir la page</a>
      <ActionForm action={saveService}>
        <input type="hidden" name="id" value={s.id} />
        <div className="card">
          <label className="toggle"><span className="t"><b>Afficher ce service sur le site</b></span><input type="checkbox" name="visible" defaultChecked={s.visible} /></label>
          <label className="f"><span>Prix « à partir de »</span><small>Laissez vide pour afficher « Devis gratuit »</small><input name="priceFrom" defaultValue={s.priceFrom} placeholder="ex. 79 €" /></label>
          <label className="f"><span>Nom du service</span><input name="title" defaultValue={s.title} /></label>
          <label className="f"><span>Phrase courte (carte de l’accueil)</span><textarea name="short" defaultValue={s.short} style={{ minHeight: 80 }} /></label>
          <label className="f"><span>Présentation</span><textarea name="intro" defaultValue={s.intro} style={{ minHeight: 160 }} /></label>
          <label className="f"><span>Ce que vous faites</span><small>Une ligne par prestation</small><textarea name="points" defaultValue={s.points.join('\n')} style={{ minHeight: 180 }} /></label>
        </div>
      </ActionForm>
    </main>
  )
}

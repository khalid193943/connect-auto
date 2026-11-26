import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import { get } from '@/lib/store'
import { HAS_BLOB } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { ActionForm, ConfirmButton, ActButton } from '@/components/admin/ActionForm'
import { PhotoManager } from '@/components/admin/PhotoManager'
import { deleteVehicle, saveVehicle, setVehicleStatus } from '../../../actions'
import { CATEGORIES } from '@/lib/site'
import type { Vehicle } from '@/lib/types'

const FUELS = ['Diesel', 'Essence', 'Hybride', 'Hybride rechargeable', 'Électrique', 'GPL']

export default async function EditVehicle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'nouveau'
  const v: Partial<Vehicle> | null = isNew ? { category: 'utilitaires', status: 'disponible', visible: true, photos: [], equipment: [], gearbox: 'Manuelle', fuel: 'Diesel' } : await get('vehicles', id)
  if (!v) notFound()
  const p = v.purchase ?? {}
  return (
    <main className="adm-main">
      <Back href="/admin/vehicules" label="Véhicules" />
      <div className="adm-head">
        <h1>{isNew ? 'Nouveau véhicule' : `${v.brand} ${v.model}`}</h1>
        {!isNew && <span className="pill grey">{v.ref}</span>}
      </div>

      {!isNew && (
        <div className="card">
          <h2>Statut rapide</h2>
          <div className="actions three">
            <ActButton className={`b sm ${v.status === 'disponible' ? 'pri' : ''}`} action={setVehicleStatus.bind(null, v.id!, 'disponible')}>En vente</ActButton>
            <ActButton className={`b sm ${v.status === 'reserve' ? 'dark' : ''}`} action={setVehicleStatus.bind(null, v.id!, 'reserve')}>Réservé</ActButton>
            <ActButton className={`b sm ${v.status === 'vendu' ? 'dark' : ''}`} action={setVehicleStatus.bind(null, v.id!, 'vendu')}>Vendu</ActButton>
          </div>
          <div className="actions">
            <a href={`/occasions/${v.category}/${v.slug}`} target="_blank" className="b sm"><ExternalLink /> Voir l’annonce</a>
            <Link href={`/admin/documents/nouveau?type=commande&vehicle=${v.id}`} className="b sm"><FileText /> Bon de commande</Link>
          </div>
        </div>
      )}

      <ActionForm action={saveVehicle}>
        <input type="hidden" name="id" value={isNew ? '' : v.id} />
        <div className="card">
          <h2>Photos</h2>
          {v.sourceUrl && (v.photos ?? []).length === 0 && (
            <p className="banner info" style={{ margin: 0 }}>
              Annonce reprise depuis <a href={v.sourceUrl} target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>{new URL(v.sourceUrl).hostname.replace('www.', '')}</a> : ajoutez les photos ici. Vérifiez aussi le prix et le statut.
            </p>
          )}
          <PhotoManager initial={v.photos ?? []} enabled={HAS_BLOB} />
        </div>

        <div className="card">
          <h2>Le véhicule</h2>
          <div className="choice" style={{ ['--n' as string]: 4 }}>
            {CATEGORIES.map((c) => (
              <label key={c.key}><input type="radio" name="category" value={c.key} defaultChecked={v.category === c.key} /><span>{c.singular}</span></label>
            ))}
          </div>
          <div className="grid2">
            <label className="f"><span>Marque *</span><input name="brand" defaultValue={v.brand} placeholder="Renault" required /></label>
            <label className="f"><span>Modèle *</span><input name="model" defaultValue={v.model} placeholder="Trafic" required /></label>
          </div>
          <label className="f"><span>Version / finition</span><input name="version" defaultValue={v.version} placeholder="Fourgon L2H1 2.0 dCi 130 Grand Confort" /></label>
          <label className="f"><span>Prix TTC (€) *</span><input className="big" name="price" inputMode="numeric" defaultValue={v.price} placeholder="15 900" required /></label>
          <label className="toggle">
            <span className="t"><b>TVA récupérable</b><small>Affiche aussi le prix HT (utilitaires vendus avec TVA)</small></span>
            <input type="checkbox" name="vatRecoverable" defaultChecked={v.vatRecoverable} />
          </label>
          <div className="grid2">
            <label className="f"><span>Année *</span><input name="year" inputMode="numeric" defaultValue={v.year} placeholder="2019" required /></label>
            <label className="f"><span>Kilométrage</span><input name="km" inputMode="numeric" defaultValue={v.km} placeholder="98 000" /></label>
          </div>
          <div className="grid2">
            <label className="f"><span>Énergie</span>
              <select name="fuel" defaultValue={v.fuel}>{FUELS.map((x) => <option key={x}>{x}</option>)}</select>
            </label>
            <label className="f"><span>Boîte</span>
              <select name="gearbox" defaultValue={v.gearbox}><option>Manuelle</option><option>Automatique</option></select>
            </label>
          </div>
        </div>

        <div className="card">
          <h2>Statut sur le site</h2>
          <div className="choice">
            <label><input type="radio" name="status" value="disponible" defaultChecked={v.status === 'disponible'} /><span>En vente</span></label>
            <label><input type="radio" name="status" value="reserve" defaultChecked={v.status === 'reserve'} /><span>Réservé</span></label>
            <label><input type="radio" name="status" value="vendu" defaultChecked={v.status === 'vendu'} /><span>Vendu</span></label>
          </div>
          <label className="toggle"><span className="t"><b>Visible sur le site</b><small>Décochez pour cacher l’annonce</small></span><input type="checkbox" name="visible" defaultChecked={v.visible} /></label>
          <label className="toggle"><span className="t"><b>Mettre en avant sur l’accueil</b></span><input type="checkbox" name="featured" defaultChecked={v.featured} /></label>
        </div>

        <div className="card">
          <h2>Description</h2>
          <label className="f"><span>Le mot du garage</span><textarea name="description" defaultValue={v.description} placeholder="État, entretien, points forts…" /></label>
          <label className="f"><span>Équipements</span><small>Un équipement par ligne</small><textarea name="equipment" defaultValue={(v.equipment ?? []).join('\n')} placeholder={'Climatisation\nRadar de recul\nAttelage'} /></label>
        </div>

        <details className="card">
          <summary style={{ fontWeight: 750, cursor: 'pointer', minHeight: 30 }}>Plus de détails (facultatif)</summary>
          <div className="grid2">
            <label className="f"><span>Puissance (ch)</span><input name="power" inputMode="numeric" defaultValue={v.power} /></label>
            <label className="f"><span>Puissance fiscale (CV)</span><input name="fiscalPower" inputMode="numeric" defaultValue={v.fiscalPower} /></label>
            <label className="f"><span>Couleur</span><input name="color" defaultValue={v.color} /></label>
            <label className="f"><span>Crit’Air</span><select name="critair" defaultValue={v.critair ?? ''}><option value="">—</option>{['0', '1', '2', '3', '4', '5'].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="f"><span>Portes</span><input name="doors" inputMode="numeric" defaultValue={v.doors} /></label>
            <label className="f"><span>Places</span><input name="seats" inputMode="numeric" defaultValue={v.seats} /></label>
          </div>
          <label className="f"><span>Volume, PTAC, cylindrée…</span><input name="extra" defaultValue={v.extra} placeholder="Volume utile 6 m³ / PTAC 3,5 t / 689 cm³" /></label>
        </details>

        <details className="card">
          <summary style={{ fontWeight: 750, cursor: 'pointer', minHeight: 30 }}>Achat du véhicule · registre (privé)</summary>
          <p className="hint">Jamais affiché sur le site. Sert au registre des achats (livre de police) et au calcul de la marge.</p>
          <div className="grid2">
            <label className="f"><span>Date d’achat</span><input type="date" name="p_date" defaultValue={p.date} /></label>
            <label className="f"><span>Prix d’achat (€)</span><input name="p_price" inputMode="numeric" defaultValue={p.price} /></label>
          </div>
          <label className="f"><span>Vendeur (nom)</span><input name="p_name" defaultValue={p.sellerName} /></label>
          <label className="f"><span>Adresse du vendeur</span><input name="p_address" defaultValue={p.sellerAddress} /></label>
          <label className="f"><span>Pièce d’identité (type, n°, date)</span><input name="p_id" defaultValue={p.sellerId} /></label>
          <div className="grid2">
            <label className="f"><span>Immatriculation</span><input name="p_reg" defaultValue={p.registration} /></label>
            <label className="f"><span>N° de série (VIN)</span><input name="p_vin" defaultValue={p.vin} /></label>
          </div>
        </details>
      </ActionForm>

      {!isNew && (
        <div className="card danger-zone">
          <h2>Supprimer l’annonce</h2>
          <p className="hint">Pour un véhicule vendu, préférez le statut « Vendu » : l’annonce reste visible comme référence.</p>
          <ConfirmButton action={deleteVehicle.bind(null, v.id!)} confirm="Confirmer la suppression">Supprimer ce véhicule</ConfirmButton>
        </div>
      )}
    </main>
  )
}

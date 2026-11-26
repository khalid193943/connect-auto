import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { HAS_BLOB } from '@/lib/store'
import { PageHero } from '@/components/PageHero'
import { LeadForm } from '@/components/LeadForm'
import { Slot } from '@/components/Slot'
import { CATEGORIES } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Reprise et rachat de véhicule à Milhaud, près de Nîmes',
  description: 'Vendez votre voiture, utilitaire, camion ou moto à Connect Auto : envoyez quelques photos, recevez une proposition, nous nous occupons des papiers. Milhaud (Gard).',
  alternates: { canonical: '/reprise' },
}

export default async function Reprise() {
  const s = await getSettings()
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Reprise', url: '/reprise' }]}
        eyebrow="Vente & reprise"
        title="On rachète"
        accent="votre véhicule"
        lead={s.repriseText}
      />
      <section className="section tight wrap">
        <div className="split wide-left">
          <LeadForm
            type="reprise"
            withPhotos
            uploads={HAS_BLOB}
            title="Estimer mon véhicule"
            intro="Plus vos photos sont nettes (avant, arrière, côtés, intérieur, compteur), plus notre proposition sera précise."
            whatsapp={s.whatsapp}
            messageLabel="État général, défauts, entretien récent"
            messagePlaceholder="Ex. distribution faite à 120 000 km, petite rayure porte arrière…"
            submitLabel="Recevoir une proposition"
            fields={[
              { name: 'type', label: 'Type de véhicule', type: 'select', required: true, options: CATEGORIES.map((c) => c.singular) },
              { name: 'marque', label: 'Marque et modèle', required: true, placeholder: 'Ex. Peugeot Partner' },
              { name: 'annee', label: 'Année', inputMode: 'numeric', placeholder: '2018' },
              { name: 'km', label: 'Kilométrage', inputMode: 'numeric', placeholder: '120 000' },
              { name: 'energie', label: 'Énergie', type: 'select', options: ['Diesel', 'Essence', 'Hybride', 'Électrique', 'GPL'] },
              { name: 'projet', label: 'Votre projet', type: 'select', options: ['Vendre uniquement', 'Reprise contre un véhicule du stock', 'Je ne sais pas encore'] },
            ]}
          />
          <div className="stack sticky">
            <Slot id="IMG-22" images={s.images} icon="handshake" alt="Expertise d’un véhicule avant reprise" style={{ aspectRatio: '3/2', borderRadius: 'var(--r)' }} />
            <div className="steps" style={{ gridTemplateColumns: '1fr', marginTop: 30 }}>
              <div className="step"><h3>Vous envoyez photos et infos</h3><p>Deux minutes avec ce formulaire, ou directement sur WhatsApp.</p></div>
              <div className="step"><h3>Nous vous rappelons</h3><p>Avec une première proposition, confirmée après un coup d’œil au véhicule.</p></div>
              <div className="step"><h3>On s’occupe du reste</h3><p>Paiement, certificat de cession et démarches : vous repartez l’esprit tranquille.</p></div>
            </div>
            <div className="prose small" style={{ fontSize: 15 }}>
              <h3>À prévoir le jour de la vente</h3>
              <ul>
                <li>La carte grise à votre nom</li>
                <li>Une pièce d’identité</li>
                <li>Le contrôle technique de moins de six mois pour un véhicule de plus de quatre ans</li>
                <li>Le carnet d’entretien et les factures, s’il y en a</li>
                <li>Tous les doubles des clés</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

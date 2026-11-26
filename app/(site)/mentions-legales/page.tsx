import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = { title: 'Mentions légales', alternates: { canonical: '/mentions-legales' } }

const todo = (v: string, label: string) => v || `[${label} à compléter]`

export default async function Mentions() {
  const s = await getSettings()
  const L = s.legal
  return (
    <>
      <PageHero crumbs={[{ name: 'Mentions légales', url: '/mentions-legales' }]} title="Mentions" accent="légales" />
      <section className="section tight wrap">
        <div className="prose">
          <h2>Éditeur du site</h2>
          <p>
            <strong>{L.company}</strong>{L.capital ? `, au capital de ${L.capital}` : ''}<br />
            Siège : {s.street}, {s.zip} {s.city}<br />
            SIRET : {L.siret} · {L.rcs}<br />
            Code NAF : {L.naf}<br />
            N° de TVA intracommunautaire : {todo(L.vat, 'numéro')}<br />
            Téléphone : {s.phone}{s.email ? <> · E-mail : {s.email}</> : null}
          </p>
          <p>Directeur de la publication : {todo(L.director, 'nom')}</p>
          <h2>Hébergement</h2>
          <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis · vercel.com</p>
          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, photos, logo et éléments graphiques de ce site appartiennent à {L.company} ou sont utilisés avec autorisation. Toute reproduction
            sans accord écrit préalable est interdite.
          </p>
          <h2>Annonces</h2>
          <p>
            Les annonces de véhicules sont données à titre indicatif et sans valeur contractuelle. Les prix sont exprimés TTC, sauf mention « HT ».
            La disponibilité d’un véhicule est confirmée par le garage au moment de la commande.
          </p>
          <h2>Médiation de la consommation</h2>
          <p>
            Conformément au Code de la consommation, le client consommateur peut recourir gratuitement à un médiateur de la consommation en cas de litige
            non résolu avec le garage : {todo('', 'nom et coordonnées du médiateur')}.
          </p>
        </div>
      </section>
    </>
  )
}

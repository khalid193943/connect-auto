import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = { title: 'Politique de confidentialité', alternates: { canonical: '/confidentialite' } }

export default async function Privacy() {
  const s = await getSettings()
  return (
    <>
      <PageHero crumbs={[{ name: 'Confidentialité', url: '/confidentialite' }]} title="Vos données" accent="personnelles" />
      <section className="section tight wrap">
        <div className="prose">
          <h2>Qui est responsable ?</h2>
          <p>{s.legal.company}, {s.street}, {s.zip} {s.city}, est responsable des données collectées sur ce site.</p>
          <h2>Quelles données, pour quoi faire ?</h2>
          <p>
            Lorsque vous remplissez un formulaire (rendez-vous, devis, reprise, contact, intérêt pour un véhicule), nous recueillons votre nom, votre
            téléphone, éventuellement votre e-mail, les informations sur votre véhicule, vos photos et votre message. Ces données servent uniquement à
            répondre à votre demande et, si vous devenez client, à établir devis et factures.
          </p>
          <p>Base légale : votre consentement pour le formulaire, puis l’exécution du contrat et nos obligations comptables et légales.</p>
          <h2>Combien de temps ?</h2>
          <p>
            Les demandes sans suite sont supprimées au plus tard trois ans après le dernier contact. Les factures sont conservées dix ans, comme l’exige
            la loi.
          </p>
          <h2>Qui y a accès ?</h2>
          <p>
            Seule l’équipe Connect Auto, via un espace protégé par mot de passe. Les données sont hébergées par nos prestataires techniques (Vercel,
            Neon) et ne sont jamais vendues ni cédées.
          </p>
          <h2>Cookies</h2>
          <p>
            Ce site n’utilise aucun cookie publicitaire ni outil de mesure d’audience. Un cookie technique sert uniquement à la connexion de l’équipe à
            l’espace de gestion. La carte de la page Contact est fournie par Google Maps, qui peut déposer ses propres cookies lorsque vous l’affichez.
          </p>
          <h2>Vos droits</h2>
          <p>
            Vous pouvez accéder à vos données, les faire rectifier ou supprimer, et vous opposer à leur utilisation : appelez-nous au {s.phone}
            {s.email ? ` ou écrivez à ${s.email}` : ''}, ou passez au garage. En cas de désaccord, vous pouvez saisir la CNIL (cnil.fr).
          </p>
        </div>
      </section>
    </>
  )
}

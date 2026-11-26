import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getVehicles } from '@/lib/data'
import { Catalogue } from '@/components/Catalogue'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Véhicules d’occasion à Milhaud, près de Nîmes',
  description: 'Voitures, utilitaires, camions et motos d’occasion contrôlés par notre atelier. Reprise possible, TVA récupérable sur les utilitaires éligibles. Connect Auto, Milhaud (30).',
  alternates: { canonical: '/occasions' },
}

export default async function Occasions() {
  const vehicles = await getVehicles()
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Occasions', url: '/occasions' }]}
        eyebrow="Le stock"
        art="utilitaire"
        title="Nos véhicules"
        accent="d’occasion"
        lead="Voitures, utilitaires, camions et motos, préparés dans notre atelier avant la vente. Un véhicule vous intéresse ? Appelez-nous ou passez l’essayer à Milhaud."
      />
      <section className="section tight wrap">
        <Suspense fallback={<p className="muted">Chargement du stock…</p>}>
          <Catalogue vehicles={vehicles} />
        </Suspense>
      </section>
      <section className="section tight wrap" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="split">
          <h2 className="display h3" style={{ fontSize: 'clamp(26px,2.6vw,44px)' }}>Vous ne trouvez pas <span className="accent">le bon véhicule ?</span></h2>
          <div className="stack">
            <p className="muted" style={{ margin: 0 }}>
              Notre stock évolue chaque semaine et certains véhicules partent avant d’être mis en ligne. Dites-nous ce que vous cherchez :
              type, budget, kilométrage. Nous vous prévenons dès qu’un véhicule correspond.
            </p>
            <Link href="/contact?sujet=recherche" className="btn btn-accent">Lancer une recherche</Link>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVehicles } from '@/lib/data'
import { CATEGORIES, catOf } from '@/lib/site'
import { Catalogue } from '@/components/Catalogue'
import { PageHero } from '@/components/PageHero'
import { ILLUS } from '@/components/Slot'
import type { Category } from '@/lib/types'

export const dynamicParams = false
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categorie: c.key }))
}

export async function generateMetadata({ params }: { params: Promise<{ categorie: string }> }): Promise<Metadata> {
  const c = catOf((await params).categorie)
  if (!c) return {}
  return { title: c.seoTitle, description: `${c.seoText} Connect Auto, garage à Milhaud près de Nîmes.`, alternates: { canonical: `/occasions/${c.key}` } }
}

const SEO: Record<Category, { h: string; p: string[] }> = {
  voitures: {
    h: 'Acheter une voiture d’occasion près de Nîmes',
    p: [
      'Chaque voiture passe par notre atelier avant d’être proposée : contrôle des points de sécurité, niveaux, freinage, pneus, et entretien remis à jour si nécessaire. Vous voyez le véhicule sur place, vous l’essayez, et vous repartez avec les papiers en règle.',
      'Vendue par un professionnel à un particulier, une voiture d’occasion bénéficie de la garantie légale de conformité : 2 ans, avec une présomption de défaut de 12 mois à compter de la livraison. Nous reprenons aussi votre ancienne voiture pour alléger votre budget.',
    ],
  },
  utilitaires: {
    h: 'Utilitaires d’occasion pour les pros du Gard',
    p: [
      'Fourgonnettes pour la ville, fourgons moyens et grands volumes pour le déménagement ou la livraison : les utilitaires sont au cœur de notre métier. Nous connaissons les points à vérifier sur un véhicule qui a travaillé : embrayage, distribution, train arrière, état de la caisse.',
      'Sur les véhicules éligibles, le prix est affiché HT et la TVA est récupérable par votre entreprise. La facture est établie au nom de votre société, et nous pouvons ensuite assurer l’entretien pour limiter les immobilisations.',
    ],
  },
  camions: {
    h: 'Camions, bennes et plateaux d’occasion',
    p: [
      'Bennes basculantes, plateaux et porteurs pour le BTP, les paysagistes ou le transport : nous sélectionnons des véhicules sains, dont les organes de travail (vérin, ridelles, attelage) sont contrôlés avant la vente.',
      'Une benne ou un plateau d’un PTAC de 3,5 tonnes se conduit avec le permis B ; au-delà, le permis C est nécessaire. Le PTAC et l’équipement sont indiqués sur chaque annonce ; en cas de doute, appelez-nous.',
    ],
  },
  motos: {
    h: 'Motos d’occasion à Nîmes et dans le Gard',
    p: [
      'Roadsters, trails, motos compatibles avec le permis A2 : chaque moto est vérifiée avant la vente (freinage, pneus, transmission, éclairage) et vendue avec ses papiers en règle.',
      'Pour un jeune permis, une moto en version 35 kW reste la solution réglementaire pendant les deux premières années. Nous vous indiquons si la moto est livrée bridée ou bridable.',
    ],
  },
}

export default async function CategoryPage({ params }: { params: Promise<{ categorie: string }> }) {
  const c = catOf((await params).categorie)
  if (!c) notFound()
  const vehicles = await getVehicles()
  const seo = SEO[c.key]
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Occasions', url: '/occasions' }, { name: c.label, url: `/occasions/${c.key}` }]}
        eyebrow="Le stock"
        art={ILLUS[c.key]}
        title={c.label}
        accent="d’occasion"
        lead={c.seoText}
      />
      <section className="section tight wrap">
        <Suspense fallback={<p className="muted">Chargement du stock…</p>}>
          <Catalogue vehicles={vehicles} category={c.key} />
        </Suspense>
      </section>
      <section className="section tight wrap" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="split">
          <h2 className="display h3" style={{ fontSize: 'clamp(26px,2.6vw,44px)' }}>{seo.h}</h2>
          <div className="stack muted">
            {seo.p.map((t) => <p key={t} style={{ margin: 0 }}>{t}</p>)}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/reprise" className="btn btn-sm">Faire reprendre mon véhicule</Link>
              <Link href="/contact?sujet=recherche" className="btn btn-sm">Je cherche un modèle précis</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ARTICLES } from '@/lib/articles'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Conseils auto : achat, vente, entretien',
  description: 'Les conseils du garage Connect Auto pour acheter un utilitaire d’occasion, vendre sa voiture, connaître ses garanties et sa vignette Crit’Air.',
  alternates: { canonical: '/conseils' },
}

export default function Conseils() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Conseils', url: '/conseils' }]} eyebrow="Le blog du garage" art="camion" title="Nos" accent="conseils" lead="Ce que nous expliquons tous les jours au garage, écrit noir sur blanc." />
      <section className="section tight wrap">
        <div className="post-grid">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/conseils/${a.slug}`} className="post" data-reveal>
              <span className="meta">{a.tag} · {a.minutes} min de lecture</span>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <span className="link-arrow">Lire <ArrowRight /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

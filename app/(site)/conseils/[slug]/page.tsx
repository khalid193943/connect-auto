import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ARTICLES } from '@/lib/articles'
import { PageHero } from '@/components/PageHero'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/site'
import { dateFr } from '@/lib/format'

type Params = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const a = ARTICLES.find((x) => x.slug === slug)
  if (!a) return {}
  return { title: a.title, description: a.description, alternates: { canonical: `/conseils/${a.slug}` }, openGraph: { type: 'article' } }
}

export default async function Article({ params }: Params) {
  const { slug } = await params
  const a = ARTICLES.find((x) => x.slug === slug)
  if (!a) notFound()
  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3)
  return (
    <>
      <PageHero crumbs={[{ name: 'Conseils', url: '/conseils' }, { name: a.tag, url: `/conseils/${a.slug}` }]} eyebrow={`${a.tag} · ${a.minutes} min`}>
        <h1 className="display" style={{ fontSize: 'clamp(34px,4.6vw,84px)', maxWidth: '22ch' }}>{a.title}</h1>
        <p className="lead" style={{ marginTop: 24 }}>{a.description}</p>
      </PageHero>
      <section className="section tight wrap">
        <div className="split wide-left">
          <article className="prose">
            {a.body.map((b, i) =>
              b.h2 ? <h2 key={i}>{b.h2}</h2> : b.ul ? <ul key={i}>{b.ul.map((li) => <li key={li}>{li}</li>)}</ul> : b.note ? <p key={i} className="note">{b.note}</p> : <p key={i}>{b.p}</p>,
            )}
            <p className="muted small">Publié le {dateFr(a.date)} par l’équipe Connect Auto.</p>
          </article>
          <aside className="stack sticky">
            <div className="form-card">
              <h2 className="display h3" style={{ margin: 0 }}>Une question ?</h2>
              <p className="muted" style={{ margin: 0 }}>Nous répondons volontiers, par téléphone, sur WhatsApp ou au garage à Milhaud.</p>
              <Link href="/contact" className="btn btn-accent btn-block">Nous contacter</Link>
            </div>
            <p className="eyebrow" style={{ marginTop: 20 }}>À lire aussi</p>
            {others.map((o) => (
              <Link key={o.slug} href={`/conseils/${o.slug}`} className="post" style={{ padding: 22 }}>
                <span className="meta">{o.tag}</span>
                <h2 style={{ fontSize: 19 }}>{o.title}</h2>
                <span className="link-arrow">Lire <ArrowRight /></span>
              </Link>
            ))}
          </aside>
        </div>
      </section>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, datePublished: a.date, author: { '@type': 'Organization', name: 'Connect Auto' }, publisher: { '@id': `${SITE_URL}/#garage` }, mainEntityOfPage: `${SITE_URL}/conseils/${a.slug}` }} />
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, Phone } from 'lucide-react'
import { getAllServices, getServices, getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'
import { LeadForm } from '@/components/LeadForm'
import { ServiceCard } from '@/components/ServiceCard'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/site'
import { telHref, waHref } from '@/lib/format'
import { slotSrc } from '@/lib/images'
import { SERVICE_ICONS } from '@/components/icons'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getAllServices()).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const sv = (await getServices()).find((x) => x.slug === slug)
  if (!sv) return {}
  return { title: sv.seoTitle, description: sv.seoDescription, alternates: { canonical: `/services/${sv.slug}` } }
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params
  const [services, s] = await Promise.all([getServices(), getSettings()])
  const sv = services.find((x) => x.slug === slug)
  if (!sv) notFound()
  const others = services.filter((x) => x.id !== sv.id).slice(0, 4)
  const SvcIcon = SERVICE_ICONS[sv.icon] ?? SERVICE_ICONS.wrench
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Services', url: '/services' }, { name: sv.title, url: `/services/${sv.slug}` }]}
        eyebrow="Service atelier · Milhaud"
        title={sv.title}
        lead={sv.short}
        slot={slotSrc(s.images, sv.banner) ? sv.banner : undefined}
        images={s.images}
        icon={sv.icon}
        artNode={<span className="svc-big ph-svc"><SvcIcon /></span>}
      >
        <div className="hero-ctas" style={{ marginTop: 30 }}>
          <a href="#devis" className="btn btn-accent">Demander un devis <ArrowRight className="arrow" /></a>
          <a href={telHref(s.phone)} className="btn"><Phone /> {s.phone}</a>
        </div>
      </PageHero>

      <section className="section wrap">
        <div className="split wide-left">
          <div className="stack">
            <p className="eyebrow">Ce que nous faisons</p>
            <p className="prose" style={{ fontSize: 'clamp(19px,1.5vw,23px)', color: 'var(--text)', margin: 0 }}>{sv.intro}</p>
            {sv.priceFrom && (
              <p className="muted" style={{ marginTop: 22 }}>À partir de <b style={{ color: 'var(--text)', fontSize: 22 }}>{sv.priceFrom}</b> · devis précis selon votre véhicule.</p>
            )}
          </div>
          <ul className="checklist" data-reveal>
            {sv.points.map((p) => <li key={p}><Check /> {p}</li>)}
          </ul>
        </div>
      </section>

      <section className="section tight band-2">
        <div className="wrap">
          <p className="eyebrow">Comment ça se passe</p>
          <div className="steps" style={{ marginTop: 20 }}>
            {sv.steps.map((st) => (
              <div className="step" key={st.t} data-reveal><h3>{st.t}</h3><p>{st.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap" id="devis">
        <div className="split">
          <div className="stack">
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="display h2" style={{ fontSize: 'clamp(30px,3.4vw,60px)' }}>Bon à <span className="accent">savoir</span></h2>
            <div className="faq" style={{ marginTop: 30 }}>
              {sv.faq.map((f) => (
                <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 30 }}>
              <a href={waHref(s.whatsapp, `Bonjour, j’ai une question sur : ${sv.title}.`)} target="_blank" rel="noopener" className="btn btn-sm"><MessageCircle /> Poser une question sur WhatsApp</a>
            </div>
          </div>
          <LeadForm
            type="rdv"
            title={`Devis · ${sv.title}`}
            intro="Réponse rapide pendant nos horaires d’ouverture."
            whatsapp={s.whatsapp}
            messageLabel="Votre demande"
            messagePlaceholder="Modèle, année, kilométrage, ce qui ne va pas…"
            fields={[
              { name: 'prestation', label: 'Prestation', type: 'select', options: services.map((x) => x.title), defaultValue: sv.title, required: true },
              { name: 'vehicule', label: 'Véhicule', placeholder: 'Ex. Renault Trafic 2019' },
              { name: 'date', label: 'Date souhaitée', type: 'date' },
              { name: 'immat', label: 'Immatriculation (facultatif)', placeholder: 'AB-123-CD' },
            ]}
          />
        </div>
      </section>

      <section className="section tight band-2">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display h2" style={{ fontSize: 'clamp(28px,3.2vw,56px)' }}>Autres <span className="accent">services</span></h2>
            <Link href="/services" className="link-arrow" style={{ justifySelf: 'end' }}>Tous les services <ArrowRight /></Link>
          </div>
          <div className="svc-grid">{others.map((o, i) => <ServiceCard key={o.id} s={o} images={s.images} i={i} />)}</div>
        </div>
      </section>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: sv.title,
            description: sv.intro,
            provider: { '@id': `${SITE_URL}/#garage` },
            areaServed: ['Milhaud', 'Nîmes', 'Gard'],
            url: `${SITE_URL}/services/${sv.slug}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: sv.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]}
      />
    </>
  )
}

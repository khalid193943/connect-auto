import type { Metadata } from 'next'
import Link from 'next/link'
import { getPrices, getServices, getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Tarifs de l’atelier',
  description: 'Taux horaires et prix des prestations courantes du garage Connect Auto à Milhaud : entretien, diagnostic, pneus, carte grise. Devis gratuit avant intervention.',
  alternates: { canonical: '/tarifs' },
}

export default async function Tarifs() {
  const [prices, services] = await Promise.all([getPrices(), getServices(), getSettings()])
  const groups = [...new Set(prices.map((p) => p.group))]
  const withFrom = services.filter((s) => s.priceFrom)
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Tarifs', url: '/tarifs' }]}
        eyebrow="Transparence"
        title="Nos"
        accent="tarifs"
        lead="Prix TTC des prestations courantes. Pour toute réparation, un devis détaillé vous est remis avant le début des travaux."
      />
      <section className="section tight wrap">
        <div className="split wide-left">
          <div>
            {groups.map((g) => (
              <div className="price-group" key={g}>
                <h3>{g}</h3>
                {prices.filter((p) => p.group === g).map((p) => (
                  <div className="price-row" key={p.id}>
                    <span className="lbl">{p.label}{p.note && <small>{p.note}</small>}</span>
                    <span className="dots" />
                    <span className={`val num ${p.price ? '' : 'ask'}`}>{p.price || 'Sur devis'}</span>
                  </div>
                ))}
              </div>
            ))}
            {withFrom.length > 0 && (
              <div className="price-group">
                <h3>Services</h3>
                {withFrom.map((s) => (
                  <div className="price-row" key={s.id}>
                    <span className="lbl"><Link href={`/services/${s.slug}`}>{s.title}</Link></span>
                    <span className="dots" />
                    <span className="val num">dès {s.priceFrom}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="muted small" style={{ marginTop: 30 }}>Prix TTC. Sauf mention contraire, les pièces sont facturées en plus de la main-d’œuvre, selon le devis.</p>
          </div>
          <aside className="form-card sticky">
            <h2 className="display h3" style={{ margin: 0 }}>Un devis précis ?</h2>
            <p className="muted" style={{ margin: 0 }}>Le prix dépend du modèle et de la motorisation. Indiquez-nous votre véhicule : vous recevez un devis clair, sans engagement.</p>
            <Link href="/rendez-vous" className="btn btn-accent btn-block">Demander un devis</Link>
          </aside>
        </div>
      </section>
    </>
  )
}

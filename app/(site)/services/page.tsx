import type { Metadata } from 'next'
import Link from 'next/link'
import { getServices, getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'
import { ServiceCard } from '@/components/ServiceCard'

export const metadata: Metadata = {
  title: 'Services de l’atelier : entretien, mécanique, carrosserie, pneus',
  description: 'Entretien et vidange, mécanique et diagnostic, pneus, carrosserie et peinture, pare-brise, dépannage, carte grise et utilitaires pros. Garage Connect Auto à Milhaud, près de Nîmes.',
  alternates: { canonical: '/services' },
}

export default async function Services() {
  const [s, services] = await Promise.all([getSettings(), getServices()])
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Services', url: '/services' }]}
        eyebrow="L’atelier"
        art="logo"
        title="Nos"
        accent="services"
        lead="Voitures et utilitaires de toutes marques. Un devis clair avant chaque intervention, et une seule équipe du diagnostic à la remise des clés."
      />
      <section className="section tight wrap">
        <div className="svc-grid">
          {services.map((sv, i) => <ServiceCard key={sv.id} s={sv} images={s.images} i={i} />)}
        </div>
      </section>
      <section className="section tight wrap" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="split">
          <h2 className="display h3" style={{ fontSize: 'clamp(26px,2.6vw,44px)' }}>Les tarifs sont <span className="accent">affichés</span></h2>
          <div className="stack muted">
            <p style={{ margin: 0 }}>Taux horaires et prix des prestations courantes sont consultables en ligne et à l’atelier. Pour une réparation, le devis vous est remis avant le début des travaux.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/tarifs" className="btn btn-sm">Voir les tarifs</Link>
              <Link href="/rendez-vous" className="btn btn-accent btn-sm">Demander un devis</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

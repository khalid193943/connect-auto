import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getServices, getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'
import { Slot } from '@/components/Slot'
import { IconAccess, IconCardPay, IconHandshake, IconShield, IconVan, IconWrench } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Le garage : un indépendant à Milhaud depuis 2019',
  description: 'Connect Auto, garage indépendant installé depuis 2019 route de Nîmes à Milhaud : vente et reprise de véhicules d’occasion, atelier mécanique et carrosserie.',
  alternates: { canonical: '/a-propos' },
}

export default async function About() {
  const [s, services] = await Promise.all([getSettings(), getServices()])
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Le garage', url: '/a-propos' }]}
        eyebrow="Le garage"
        title="Connect Auto,"
        accent="à Milhaud"
        lead={s.aboutText}
      />
      <section className="section tight wrap">
        <div className="split">
          <Slot id="IMG-18" images={s.images} icon="wrench" alt="Fouad, gérant de Connect Auto, dans l’atelier" style={{ aspectRatio: '4/5', borderRadius: 'var(--r)' }} />
          <div className="stack prose" style={{ alignSelf: 'center' }}>
            <p className="eyebrow">Notre façon de travailler</p>
            <h2 className="display h2" style={{ fontSize: 'clamp(30px,3.4vw,60px)', margin: 0, fontStyle: 'italic', textTransform: 'uppercase' }}>
              Simple, <span className="accent">direct</span>, carré
            </h2>
            <p>
              Connect Auto est une société créée en avril 2019 et installée au 1520 route de Nîmes, à Milhaud. Le garage réunit sous un même toit la vente
              de véhicules d’occasion, la reprise, l’atelier mécanique et la carrosserie.
            </p>
            <p>
              Ce qui compte pour nous : vous dire les choses clairement. Le prix est annoncé avant l’intervention, le véhicule est montré tel qu’il est,
              et vous avez toujours quelqu’un au bout du fil, par téléphone ou sur WhatsApp.
            </p>
            <p>
              Particuliers, artisans ou entreprises, nous suivons votre véhicule dans la durée : l’achat, l’entretien, les réparations, puis la reprise le
              jour où vous changez.
            </p>
          </div>
        </div>
      </section>

      <section className="fullband" style={{ minHeight: 'clamp(360px,42vw,620px)' }}>
        <Slot id="IMG-20" images={s.images} icon="wrench" alt="L’atelier Connect Auto" />
        <div className="fullband-inner">
          <p className="display h2" style={{ fontSize: 'clamp(30px,4vw,72px)' }}>Vente · Reprise · Atelier<br /><span className="accent">un seul garage</span></p>
        </div>
      </section>

      <section className="section wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Sur place</p>
            <h2 className="display h2">Ce que vous <span className="accent">trouvez ici</span></h2>
          </div>
        </div>
        <div className="info-cards">
          {[
            { i: <IconHandshake />, t: 'Vente & reprise', d: 'Voitures, utilitaires, camions et motos d’occasion, et le rachat de votre véhicule.' },
            { i: <IconWrench />, t: 'Atelier mécanique', d: 'Entretien, diagnostic et réparation toutes marques.' },
            { i: <IconShield />, t: 'Carrosserie & peinture', d: 'Redressage, remplacement d’éléments et mise en peinture.' },
            { i: <IconVan />, t: 'Spécialiste utilitaires', d: 'Fourgons et bennes pour les pros, TVA récupérable sur les véhicules éligibles.' },
            { i: <IconAccess />, t: 'Accès facilité', d: 'Parking et accès en fauteuil roulant, toilettes sur place.' },
            { i: <IconCardPay />, t: 'Paiement par carte', d: 'Carte bancaire acceptée.' },
          ].map((c) => (
            <div className="info-card" key={c.t} data-reveal><span className="ico">{c.i}</span><h3>{c.t}</h3><p>{c.d}</p></div>
          ))}
        </div>
      </section>

      <section className="section tight band-2">
        <div className="wrap split">
          <Slot id="IMG-19" images={s.images} icon="wrench" alt="L’équipe Connect Auto" style={{ aspectRatio: '3/2', borderRadius: 'var(--r)' }} />
          <div className="stack" style={{ alignSelf: 'center' }}>
            <p className="eyebrow">Informations</p>
            <dl className="spec-grid" style={{ margin: 0 }}>
              {[
                ['Raison sociale', s.legal.company],
                ['Création', 'Avril 2019'],
                ['SIRET', s.legal.siret],
                ['Activité', 'Entretien et réparation de véhicules légers'],
                ['Adresse', `${s.street}, ${s.zip} ${s.city}`],
                ['Services', `${services.length} services atelier`],
              ].map(([k, v]) => (
                <div className="spec" key={k}><dt style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)' }}>{k}</dt><dd style={{ margin: 0, fontWeight: 700 }}>{v}</dd></div>
              ))}
            </dl>
            <Link href="/contact" className="btn btn-accent" style={{ justifySelf: 'start' }}>Nous rendre visite <ArrowRight className="arrow" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}

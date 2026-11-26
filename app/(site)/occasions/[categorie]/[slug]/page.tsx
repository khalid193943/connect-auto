import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, Phone } from 'lucide-react'
import { getSettings, getVehicles } from '@/lib/data'
import { catOf, SITE_URL } from '@/lib/site'
import { eur, km, num, priceHT, telHref, waHref } from '@/lib/format'
import { Gallery } from '@/components/Gallery'
import { LeadForm } from '@/components/LeadForm'
import { PageHero } from '@/components/PageHero'
import { StatusTag, VehicleCard, vehicleHref } from '@/components/VehicleCard'
import { JsonLd } from '@/components/JsonLd'
import { IconHandshake, IconShield, IconWrench } from '@/components/icons'
import { HAS_BLOB } from '@/lib/store'

type Params = { params: Promise<{ categorie: string; slug: string }> }

export async function generateStaticParams() {
  return (await getVehicles()).map((v) => ({ categorie: v.category, slug: v.slug }))
}

async function find(slug: string) {
  return (await getVehicles()).find((v) => v.slug === slug)
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const v = await find(slug)
  if (!v) return {}
  const title = `${v.brand} ${v.model} ${v.version} ${v.year} d’occasion`
  return {
    title,
    description: `${v.brand} ${v.model} ${v.year}, ${km(v.km)}, ${v.fuel.toLowerCase()}, ${v.gearbox.toLowerCase()} : ${eur(v.price)}${v.vatRecoverable ? ' (TVA récupérable)' : ''}. À voir chez Connect Auto à Milhaud, près de Nîmes.`,
    alternates: { canonical: vehicleHref(v) },
    openGraph: v.photos[0] ? { images: [{ url: v.photos[0] }] } : undefined,
  }
}

export default async function VehiclePage({ params }: Params) {
  const { categorie, slug } = await params
  const [all, s] = await Promise.all([getVehicles(), getSettings()])
  const v = all.find((x) => x.slug === slug)
  if (!v) notFound()
  if (v.category !== categorie) permanentRedirect(vehicleHref(v))
  const c = catOf(v.category)!
  const name = `${v.brand} ${v.model}`
  const similar = all.filter((x) => x.id !== v.id && x.category === v.category && x.status !== 'vendu').slice(0, 4)
  const wa = waHref(s.whatsapp, `Bonjour, je suis intéressé par le ${name} ${v.version} (${v.year}, réf. ${v.ref}) vu sur votre site. Est-il toujours disponible ?`)

  const specs: [string, string | undefined][] = [
    ['Année', String(v.year)],
    ['Kilométrage', km(v.km)],
    ['Énergie', v.fuel],
    ['Boîte', v.gearbox],
    ['Puissance', v.power ? `${v.power} ch` : undefined],
    ['Puissance fiscale', v.fiscalPower ? `${v.fiscalPower} CV` : undefined],
    ['Couleur', v.color],
    ['Portes', v.doors ? String(v.doors) : undefined],
    ['Places', v.seats ? String(v.seats) : undefined],
    ['Crit’Air', v.critair],
    [v.category === 'motos' ? 'Moteur' : v.category === 'camions' ? 'Charge / équipement' : 'Volume / charge', v.extra],
    ['Référence', v.ref],
  ]

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Occasions', url: '/occasions' }, { name: c.label, url: `/occasions/${c.key}` }, { name: `${name} ${v.year}`, url: vehicleHref(v) }]}
        className="slim"
      />
      <section className="wrap" style={{ marginTop: 'calc(-1 * clamp(40px, 5vw, 80px))', paddingBottom: 'clamp(60px,7vw,120px)' }}>
        <div className="vd">
          <div style={{ display: 'grid', gap: 'clamp(28px,3vw,48px)' }}>
            <Gallery photos={v.photos} alt={`${name} ${v.version}`} icon={v.category} refId={v.ref} />
            <div>
              <h2 className="eyebrow">Caractéristiques</h2>
              <div className="spec-grid">
                {specs.filter(([, val]) => val).map(([k, val]) => (
                  <div className="spec" key={k}><span>{k}</span><b>{val}</b></div>
                ))}
              </div>
            </div>
            {v.description && (
              <div>
                <h2 className="eyebrow">Le mot du garage</h2>
                <p className="prose" style={{ margin: 0 }}>{v.description}</p>
              </div>
            )}
            {v.equipment.length > 0 && (
              <div>
                <h2 className="eyebrow">Équipements</h2>
                <ul className="equip">
                  {v.equipment.map((e) => <li key={e}><Check /> {e}</li>)}
                </ul>
              </div>
            )}
            <div id="interet">
              <LeadForm
                type="vehicule"
                vehicleId={v.id}
                title="Ce véhicule vous intéresse ?"
                intro="Laissez votre numéro : nous vous rappelons pour répondre à vos questions ou organiser un essai."
                whatsapp={s.whatsapp}
                uploads={HAS_BLOB}
                messageLabel="Votre question (facultatif)"
                messagePlaceholder="Disponibilité, essai, reprise de mon véhicule…"
                fields={[{ name: 'reprise', label: 'Avez-vous un véhicule à faire reprendre ?', type: 'select', options: ['Non', 'Oui'], full: true }]}
                submitLabel="Être rappelé"
              />
            </div>
          </div>

          <aside className="vd-panel">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="tag">{c.singular}</span>
              <StatusTag v={v} />
              {v.vatRecoverable && <span className="tag green">TVA récupérable</span>}
              {v.demo && <span className="tag ghost">Annonce exemple</span>}
            </div>
            <div>
              <h1>{name}</h1>
              <p className="vd-version">{v.version}</p>
            </div>
            <div className="vd-price">
              <b className="num">{eur(v.price)}</b>
              <span className="muted small">{v.vatRecoverable ? <>Soit <b style={{ color: 'var(--accent)' }}>{eur(priceHT(v.price))} HT</b>, TVA récupérable</> : 'Prix TTC'}</span>
            </div>
            <div className="veh-specs">
              <span>{v.year}</span><span>{num(v.km)} km</span><span>{v.fuel}</span><span>{v.gearbox}</span>
            </div>
            {v.status === 'vendu' ? (
              <div className="vd-actions">
                <p className="muted" style={{ margin: 0 }}>Ce véhicule a trouvé preneur. Nous pouvons vous en trouver un similaire.</p>
                <Link href={`/occasions/${v.category}`} className="btn btn-accent btn-block">Voir les {c.label.toLowerCase()} disponibles</Link>
              </div>
            ) : (
              <div className="vd-actions">
                <a href={telHref(s.phone)} className="btn btn-accent btn-block"><Phone /> Appeler le garage</a>
                <div className="row">
                  <a href={wa} target="_blank" rel="noopener" className="btn btn-block"><MessageCircle /> WhatsApp</a>
                  <a href="#interet" className="btn btn-block">Être rappelé</a>
                </div>
              </div>
            )}
            <div className="assure">
              <div><IconShield /><span><b>Garantie légale de conformité</b> de 2 ans pour les particuliers, défauts présumés pendant 12 mois.</span></div>
              <div><IconHandshake /><span><b>Reprise possible</b> de votre véhicule actuel. <Link href="/reprise" style={{ textDecoration: 'underline' }}>Estimer</Link></span></div>
              <div><IconWrench /><span><b>Entretien sur place</b> après l’achat, dans notre atelier de Milhaud.</span></div>
            </div>
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section tight band-2">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="display h2" style={{ fontSize: 'clamp(28px,3.2vw,56px)' }}>Dans la même <span className="accent">catégorie</span></h2>
              <Link href={`/occasions/${v.category}`} className="link-arrow" style={{ justifySelf: 'end' }}>Tous les {c.label.toLowerCase()} <ArrowRight /></Link>
            </div>
            <div className="veh-row">{similar.map((x) => <VehicleCard key={x.id} v={x} />)}</div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': v.category === 'motos' ? 'Motorcycle' : 'Car',
          name: `${name} ${v.version}`,
          brand: { '@type': 'Brand', name: v.brand },
          model: v.model,
          vehicleModelDate: String(v.year),
          mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.km, unitCode: 'KMT' },
          fuelType: v.fuel,
          vehicleTransmission: v.gearbox,
          color: v.color,
          itemCondition: 'https://schema.org/UsedCondition',
          image: v.photos.length ? v.photos : undefined,
          sku: v.ref,
          url: SITE_URL + vehicleHref(v),
          offers: {
            '@type': 'Offer',
            price: v.price,
            priceCurrency: 'EUR',
            availability: v.status === 'disponible' ? 'https://schema.org/InStock' : v.status === 'reserve' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/SoldOut',
            seller: { '@id': `${SITE_URL}/#garage` },
          },
        }}
      />
    </>
  )
}

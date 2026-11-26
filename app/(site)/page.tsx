import Link from 'next/link'
import { BrandCarousel } from '@/components/BrandCarousel'
import { BrandChips } from '@/components/BrandChips'
import Image from 'next/image'
import { ArrowRight, CalendarCheck, Clock, MapPin, Phone, Wrench } from 'lucide-react'
import { getReviews, getServices, getSettings, getVehicles } from '@/lib/data'
import { CATEGORIES } from '@/lib/site'
import { slotSrc } from '@/lib/images'
import { telHref } from '@/lib/format'
import { VehicleCard } from '@/components/VehicleCard'
import { CardRail } from '@/components/CardRail'
import { OpenStatus } from '@/components/OpenStatus'
import { SERVICE_ICONS, Stars, IconHandshake } from '@/components/icons'

export default async function Home() {
  const [s, services, vehicles, reviews] = await Promise.all([getSettings(), getServices(), getVehicles(), getReviews()])
  const img = s.images
  const available = vehicles.filter((v) => v.status !== 'vendu')
  const featured = [...available.filter((v) => v.featured), ...available.filter((v) => !v.featured)].slice(0, 12)
  const count = (c: string) => available.filter((v) => v.category === c).length
  const rating = String(s.googleRating).replace('.', ',')
  const heroImg = slotSrc(img, 'IMG-01') ?? '/images/hero-studio.webp'

  return (
    <>
      {/* ============ HÉRO ============ */}
      <section className="h6 wrap" aria-labelledby="hero-title">
        <div className="h6-card">
          <div className="h6-media">
            <Image src={heroImg} alt="Véhicule d’occasion en studio" fill priority sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: 'cover', objectPosition: '50% 62%' }} />
          </div>
          <svg className="h6-trails" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="trail" x1="0" x2="1">
                <stop offset="0" stopColor="#2EC95C" stopOpacity="0" />
                <stop offset=".5" stopColor="#2EC95C" stopOpacity=".9" />
                <stop offset="1" stopColor="#2EC95C" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 250 C 220 230, 380 300, 800 150" stroke="url(#trail)" strokeWidth="2.2" fill="none" />
            <path d="M0 272 C 260 250, 420 310, 800 190" stroke="url(#trail)" strokeWidth="1.2" fill="none" opacity=".6" />
          </svg>
          <div className="h6-copy">
            <p className="h6-kicker" data-hero style={{ ['--d' as string]: '.05s' }}>{s.heroEyebrow}</p>
            <h1 id="hero-title" className="h6-title" data-hero style={{ ['--d' as string]: '.12s' }}>
              <span>{s.heroLine1}</span>
              <span className="accent">{s.heroLine2}</span>
            </h1>
            <p className="h6-lead" data-hero style={{ ['--d' as string]: '.22s' }}>{s.heroText}</p>
            <div className="h6-ctas" data-hero style={{ ['--d' as string]: '.32s' }}>
              <Link href="/occasions" className="btn btn-accent">Voir les véhicules <ArrowRight className="arrow" /></Link>
              <Link href="/reprise" className="btn">Estimer mon véhicule</Link>
            </div>
          </div>
        </div>

        <form action="/occasions" className="h6-search" data-hero style={{ ['--d' as string]: '.42s' }}>
          <label><span>Catégorie</span>
            <select name="cat" defaultValue="">
              <option value="">Toutes</option>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label} ({count(c.key)})</option>)}
            </select>
          </label>
          <label><span>Marque</span>
            <select name="marque" defaultValue="">
              <option value="">Toutes</option>
              {[...new Set(available.map((v) => v.brand))].sort().map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label><span>Budget</span>
            <select name="prix" defaultValue="">
              <option value="">Tous</option>
              {[8000, 10000, 15000, 20000, 25000].map((p) => <option key={p} value={p}>Jusqu’à {p.toLocaleString('fr-FR')} €</option>)}
            </select>
          </label>
          <label><span>Kilométrage</span>
            <select name="km" defaultValue="">
              <option value="">Tous</option>
              {[50000, 100000, 150000, 200000].map((k) => <option key={k} value={k}>Moins de {k.toLocaleString('fr-FR')} km</option>)}
            </select>
          </label>
          <button className="btn btn-accent">Rechercher</button>
        </form>
      </section>

      {/* ============ MARQUES ============ */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <BrandCarousel logos={s.brandLogos ?? {}} place="top" />
      </section>

      {/* ============ L’ATELIER ============ */}
      <section className="s6 wrap" aria-labelledby="svc-title">
        <div className="s6-head">
          <h2 id="svc-title" className="t6">L’atelier <span>toutes marques</span></h2>
          <Link href="/services" className="link-arrow">Tous les services <ArrowRight /></Link>
        </div>
        <div className="svc6">
          {services.map((sv) => {
            const I = SERVICE_ICONS[sv.icon] ?? SERVICE_ICONS.wrench
            const photo = slotSrc(img, sv.card)
            return (
              <div key={sv.slug} className="svc6-card">
                <span className="svc6-img">
                  {photo && <Image src={photo} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" style={{ objectFit: 'cover' }} />}
                </span>
                <span className="svc6-body">
                  <span className="svc6-ico"><I /></span>
                  <span className="svc6-tx">
                    <Link href={`/services/${sv.slug}`} className="svc6-link"><b>{sv.title}</b></Link>
                    <BrandChips />
                  </span>
                  <ArrowRight className="svc6-go" aria-hidden />
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ============ OCCASIONS ============ */}
      <section className="s6 wrap" aria-labelledby="stock-title">
        <div className="s6-head">
          <h2 id="stock-title" className="t6">Nos occasions <span>du moment</span></h2>
          <Link href="/occasions" className="link-arrow">Tout le stock ({available.length}) <ArrowRight /></Link>
        </div>
        <CardRail label="Véhicules à la une">
          {featured.map((v) => <VehicleCard key={v.id} v={v} />)}
        </CardRail>
      </section>

      {/* ============ DEUX ATOUTS ============ */}
      <section className="s6 wrap duo" aria-label="Reprise et atelier">
        <Link href="/reprise" className="duo-card">
          <span className="duo-ico"><IconHandshake /></span>
          <span className="duo-txt">
            <b>Reprise de votre véhicule</b>
            <span>{s.repriseText}</span>
          </span>
          <span className="duo-img"><Image src={slotSrc(img, 'IMG-16') ?? '/images/reprise.webp'} alt="" fill sizes="30vw" style={{ objectFit: 'cover' }} /></span>
          <span className="duo-go"><ArrowRight /></span>
        </Link>
        <Link href="/rendez-vous" className="duo-card">
          <span className="duo-ico"><Wrench /></span>
          <span className="duo-txt">
            <b>Rendez-vous atelier</b>
            <span>Entretien, réparation, pneus. Le prix est annoncé avant, toujours.</span>
          </span>
          <span className="duo-img"><Image src="/images/detail-freinage.webp" alt="" fill sizes="30vw" style={{ objectFit: 'cover' }} /></span>
          <span className="duo-go"><ArrowRight /></span>
        </Link>
      </section>

      {/* ============ AVIS (ajoutés depuis l’admin) ============ */}
      {reviews.length > 0 && (
        <section className="s6 wrap" aria-labelledby="rev-title">
          <div className="s6-head">
            <h2 id="rev-title" className="t6">Ils nous font <span>confiance</span></h2>
            <a href={s.googleUrl} target="_blank" rel="noopener" className="link-arrow">Tous les avis Google <ArrowRight /></a>
          </div>
          <div className="rev6">
            {reviews.slice(0, 3).map((r) => (
              <article key={r.id} className="rev6-card">
                <Stars value={r.rating} />
                <p>« {r.text} »</p>
                <b>{r.author}</b>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ============ INFOS PRATIQUES ============ */}
      <section className="s6 wrap" aria-label="Infos pratiques">
        <div className="info6">
          <a href={s.googleUrl} target="_blank" rel="noopener" className="info6-item">
            <b className="num">{rating}<small>/5</small></b>
            <span><Stars value={s.googleRating} /><small>{s.googleCount} avis Google</small></span>
          </a>
          <div className="info6-item">
            <span className="info6-ico"><Clock /></span>
            <span><b>Horaires</b><small><OpenStatus hours={s.hours} /></small></span>
          </div>
          <a className="info6-item" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.street} ${s.zip} ${s.city}`)}`} target="_blank" rel="noopener">
            <span className="info6-ico"><MapPin /></span>
            <span><b>{s.street}</b><small>{s.zip} {s.city} · Itinéraire</small></span>
          </a>
          <a className="info6-item" href={telHref(s.phone)}>
            <span className="info6-ico"><Phone /></span>
            <span><b>{s.phone}</b><small>Appeler le garage</small></span>
          </a>
          <Link href="/rendez-vous" className="btn btn-accent"><CalendarCheck /> Prendre rendez-vous</Link>
        </div>
      </section>

    </>
  )
}

import Link from 'next/link'
import { ArrowRight, BadgeEuro, CalendarCheck, Clock, Gauge, MapPin, ShieldCheck, Star as StarIco, Wrench } from 'lucide-react'
import { getReviews, getServices, getSettings, getVehicles } from '@/lib/data'
import { CATEGORIES, DAYS, DAY_ORDER } from '@/lib/site'
import { slotSrc } from '@/lib/images'
import { fmtDay } from '@/lib/hours'
import { dateFr } from '@/lib/format'
import { Slot } from '@/components/Slot'
import { Floor } from '@/components/HeroScene'
import { HeroPanels } from '@/components/HeroPanels'
import { BrandStrip } from '@/components/BrandStrip'
import { ServiceCard } from '@/components/ServiceCard'
import { Showroom } from '@/components/Showroom'
import { BeforeAfter } from '@/components/BeforeAfter'
import { LeadForm } from '@/components/LeadForm'
import { OpenStatus } from '@/components/OpenStatus'
import { SERVICE_ICONS, Stars, IconAccess, IconHandshake, IconShield, IconVan } from '@/components/icons'

export default async function Home() {
  const [s, services, vehicles, reviews] = await Promise.all([getSettings(), getServices(), getVehicles(), getReviews()])
  const img = s.images
  const available = vehicles.filter((v) => v.status !== 'vendu')
  const featured = [...available.filter((v) => v.featured), ...available.filter((v) => !v.featured)].slice(0, 10)
  const count = (c: string) => available.filter((v) => v.category === c).length
  const rating = String(s.googleRating).replace('.', ',')
  const brands = [...new Set(['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Fiat', 'Ford', 'Mercedes-Benz', 'Iveco', 'Nissan', 'Opel', 'Toyota', 'Dacia', 'Yamaha', 'Honda', 'Kawasaki', 'BMW', ...vehicles.map((v) => v.brand)])]
  const panelImg: Record<string, string> = {
    voitures: slotSrc(img, 'IMG-01') ?? '/images/hero-studio.webp',
    utilitaires: slotSrc(img, 'IMG-03') ?? '/images/cat-utilitaires.webp',
    camions: slotSrc(img, 'IMG-04') ?? '/images/cat-camions.webp',
    motos: slotSrc(img, 'IMG-05') ?? '/images/cat-motos.webp',
  }
  const panels = [...CATEGORIES]
    .sort((a, b) => count(b.key) - count(a.key))
    .map((c) => ({ key: c.key, label: c.label, href: `/occasions/${c.key}`, count: count(c.key), img: panelImg[c.key] }))

  return (
    <>
      {/* ============ HÉRO ============ */}
      <section className="hz" aria-labelledby="hero-title">
        <div className="hx-bg" />
        <Floor />
        <div className="hz-inner">
          <div className="hz-copy">
            <p className="eyebrow" data-hero style={{ ['--d' as string]: '.05s' }}>{s.heroEyebrow}</p>
            <h1 id="hero-title" className="display hz-title" data-hero style={{ ['--d' as string]: '.15s' }}>
              <span className="l1">{s.heroLine1}</span>
              <span className="l2">{s.heroLine2}</span>
            </h1>
            <p className="hz-lead" data-hero style={{ ['--d' as string]: '.28s' }}>{s.heroText}</p>
            <div className="hx-ctas" data-hero style={{ ['--d' as string]: '.4s' }}>
              <Link href="/occasions" className="btn btn-accent">Voir les {available.length} véhicules <ArrowRight className="arrow" /></Link>
              <Link href="/rendez-vous" className="btn">Réserver l’atelier</Link>
            </div>
            <div className="hz-proof" data-hero style={{ ['--d' as string]: '.52s' }}>
              <a href={s.googleUrl} target="_blank" rel="noopener" className="hz-rating">
                <b className="num">{rating}</b>
                <span><Stars value={s.googleRating} /><small>{s.googleCount} avis Google</small></span>
              </a>
              <span className="hz-sep" aria-hidden />
              <span className="hz-meta">
                <OpenStatus hours={s.hours} />
                <small><MapPin size={13} /> {s.street}, {s.city}</small>
              </span>
            </div>
          </div>
          <div data-hero style={{ ['--d' as string]: '.2s' }}>
            <HeroPanels panels={panels} />
          </div>
        </div>
        <nav className="hz-services" aria-label="Services de l’atelier">
          {services.map((sv) => {
            const I = SERVICE_ICONS[sv.icon] ?? SERVICE_ICONS.wrench
            return <Link key={sv.slug} href={`/services/${sv.slug}`}><I /> {sv.title}</Link>
          })}
        </nav>
      </section>

      {/* ============ L’ATELIER ============ */}
      <section className="section wrap" aria-labelledby="svc-title">
        <div className="sec-head" data-reveal>
          <div>
            <p className="eyebrow">L’atelier</p>
            <h2 id="svc-title" className="display h2">Entretien, réparation, carrosserie : <span className="accent">on s’occupe de tout</span></h2>
          </div>
          <div style={{ display: 'grid', gap: 18, justifyItems: 'end' }}>
            <p className="lead">Toutes marques, voitures et utilitaires. Le prix est annoncé avant. Toujours.</p>
            <Link href="/services" className="link-arrow">Tous les services <ArrowRight /></Link>
          </div>
        </div>
        <div className="svc-grid">
          {services.map((sv, i) => <ServiceCard key={sv.id} s={sv} images={img} i={i} />)}
        </div>
      </section>

      {/* ============ SHOWROOM ============ */}
      <section className="section band-2" aria-labelledby="stock-title">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Occasions</p>
              <h2 id="stock-title" className="display h2">Disponibles <span className="accent">maintenant</span></h2>
            </div>
            <div style={{ display: 'grid', gap: 18, justifyItems: 'end' }}>
              <p className="lead">Prix TTC affichés. Utilitaires éligibles : prix HT et TVA récupérable.</p>
              <Link href="/occasions" className="link-arrow">Tout le stock ({available.length}) <ArrowRight /></Link>
            </div>
          </div>
          <form action="/occasions" className="quick" style={{ marginBottom: 26 }} data-reveal>
            <label><span>Je cherche</span>
              <select name="cat" defaultValue="">
                <option value="">Tous les véhicules</option>
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label} ({count(c.key)})</option>)}
              </select>
            </label>
            <label><span>Marque</span>
              <select name="marque" defaultValue="">
                <option value="">Toutes</option>
                {[...new Set(available.map((v) => v.brand))].sort().map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label><span>Budget max.</span>
              <select name="prix" defaultValue="">
                <option value="">Sans limite</option>
                {[8000, 10000, 15000, 20000, 25000].map((p) => <option key={p} value={p}>{p.toLocaleString('fr-FR')} €</option>)}
              </select>
            </label>
            <label><span>Kilométrage max.</span>
              <select name="km" defaultValue="">
                <option value="">Sans limite</option>
                {[50000, 100000, 150000, 200000].map((k) => <option key={k} value={k}>{k.toLocaleString('fr-FR')} km</option>)}
              </select>
            </label>
            <button className="btn btn-accent">Rechercher</button>
          </form>
          <div data-reveal>
            <Showroom vehicles={featured} whatsapp={s.whatsapp} />
          </div>
        </div>
      </section>

      {/* ============ SAVOIR-FAIRE ============ */}
      <section className="section" aria-labelledby="craft-title">
        <div className="wrap craft">
          <div className="craft-mosaic" data-reveal>
            <Slot src="/images/atelier.webp" alt="Atelier mécanique avec ponts élévateurs" sizes="(max-width: 980px) 100vw, 55vw" />
            <Slot src="/images/detail-freinage.webp" alt="Contrôle du freinage" sizes="(max-width: 980px) 50vw, 27vw" />
            <Slot src="/images/ban-carrosserie.webp" alt="Préparation avant peinture" sizes="(max-width: 980px) 50vw, 27vw" />
          </div>
          <div data-reveal style={{ ['--d' as string]: '.1s' }}>
            <p className="eyebrow">Le savoir-faire</p>
            <h2 id="craft-title" className="display h2">Des pros, <span className="accent">des vrais outils</span></h2>
            <p className="lead" style={{ marginTop: 20 }}>On cherche la panne avant de changer une pièce. Et chaque véhicule vendu passe d’abord par notre atelier.</p>
            <div className="pillars">
              {[
                { i: <Gauge />, t: 'Diagnostic électronique', d: 'La panne trouvée, pas devinée.' },
                { i: <BadgeEuro />, t: 'Devis avant travaux', d: 'Vous validez, on attaque.' },
                { i: <Wrench />, t: 'Toutes marques', d: 'Voitures, utilitaires, flottes.' },
                { i: <ShieldCheck />, t: 'Plan constructeur', d: 'Votre garantie reste intacte.' },
              ].map((x) => <div className="pillar" key={x.t}>{x.i}<b>{x.t}</b><span>{x.d}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ============ POURQUOI NOUS ============ */}
      <section className="section band-2" aria-labelledby="why-title">
        <div className="wrap why">
          <div data-reveal>
            <p className="eyebrow">Pourquoi Connect Auto</p>
            <h2 id="why-title" className="display h2">{s.aboutTitle}</h2>
            <p className="lead" style={{ marginTop: 22 }}>{s.aboutText}</p>
            <Link href="/a-propos" className="btn" style={{ marginTop: 32 }}>Découvrir le garage <ArrowRight className="arrow" /></Link>
          </div>
          <div className="why-list" data-reveal style={{ ['--d' as string]: '.1s' }}>
            {[
              { i: <Wrench />, t: 'Un seul interlocuteur', d: 'Achat, atelier, carte grise : la même équipe.' },
              { i: <IconShield />, t: 'Garantie légale 2 ans', d: 'Sur nos occasions vendues aux particuliers.' },
              { i: <IconHandshake />, t: 'Reprise possible', d: 'Même si vous n’achetez pas chez nous.' },
              { i: <IconVan />, t: 'Pros bienvenus', d: 'Prix HT, TVA récupérable, facture société.' },
              { i: <BadgeEuro />, t: 'Prix annoncé avant', d: 'Pas de surprise au moment de payer.' },
              { i: <IconAccess />, t: 'Accès facile', d: 'Parking, accès PMR, paiement par carte.' },
            ].map((w) => (
              <div key={w.t} className="why-item"><span className="ico">{w.i}</span><h3>{w.t}</h3><p>{w.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AVANT / APRÈS + RDV ============ */}
      <section className="section" aria-labelledby="ba-title">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Carrosserie & peinture</p>
              <h2 id="ba-title" className="display h2">Rayé, cabossé ? <span className="accent">On répare.</span></h2>
            </div>
            <p className="lead">Faites glisser pour comparer, puis demandez votre devis : on vous rappelle.</p>
          </div>
          <div className="ba-wrap">
            <BeforeAfter images={img} />
            <div data-reveal style={{ ['--d' as string]: '.1s' }}>
              <LeadForm
                type="rdv"
                title="Devis ou rendez-vous"
                intro="Choisissez la prestation. On vous rappelle pour le créneau et le prix."
                whatsapp={s.whatsapp}
                compact
                messageLabel="Précisions (facultatif)"
                messagePlaceholder="Modèle, symptôme, date souhaitée…"
                fields={[{ name: 'prestation', label: 'Prestation', type: 'select', required: true, full: true, options: [...services.map((x) => x.title), 'Autre'] }]}
                submitLabel="Être rappelé"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ REPRISE ============ */}
      <section className="fullband" aria-labelledby="rep-title">
        <Slot id="IMG-16" images={img} illus="utilitaire" alt="Remise des clés d’un véhicule" />
        <div className="fullband-inner" data-reveal>
          <p className="eyebrow">Reprise & rachat</p>
          <h2 id="rep-title" className="display h2">Vous vendez ? <span className="accent">On rachète.</span></h2>
          <p className="lead" style={{ color: '#d4dae0' }}>{s.repriseText}</p>
          <ol className="steps-inline">
            <li>Vos photos</li>
            <li>Notre proposition</li>
            <li>Paiement & papiers</li>
          </ol>
          <div className="hero-ctas">
            <Link href="/reprise" className="btn btn-accent">Estimer mon véhicule <ArrowRight className="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* ============ AVIS ============ */}
      <section className="section wrap" aria-labelledby="rev-title">
        <div className="reviews">
          <div className="rating-big" data-reveal>
            <p className="eyebrow">Avis clients</p>
            <b className="num">{rating}</b>
            <Stars value={s.googleRating} />
            <p className="muted" style={{ margin: 0 }}>Moyenne Google sur {s.googleCount} avis.</p>
            <a href={s.googleUrl} target="_blank" rel="noopener" className="link-arrow">Lire les avis <ArrowRight /></a>
          </div>
          <div data-reveal style={{ ['--d' as string]: '.1s' }}>
            <h2 id="rev-title" className="display h2" style={{ marginBottom: 30 }}>Ils en parlent <span className="accent">mieux que nous</span></h2>
            {reviews.length ? (
              <div className="review-grid">
                {reviews.slice(0, 6).map((r) => (
                  <article key={r.id} className="review">
                    <Stars value={r.rating} />
                    <p>« {r.text} »</p>
                    <footer><b style={{ color: 'var(--text)' }}>{r.author}</b><span>{dateFr(r.date, { month: 'long', year: 'numeric' })} · Google</span></footer>
                  </article>
                ))}
              </div>
            ) : (
              <div className="review-empty">
                <StarIco style={{ color: '#ffc94d' }} />
                <p style={{ margin: 0 }}>Vous êtes passé au garage ? Votre avis aide d’autres automobilistes de la région.</p>
                <a href={s.googleUrl} target="_blank" rel="noopener" className="btn btn-sm">Laisser un avis Google</a>
              </div>
            )}
          </div>
        </div>
      </section>

      <BrandStrip brands={brands} logos={s.brandLogos ?? {}} />

      {/* ============ VISITE ============ */}
      <section className="cta-final" aria-labelledby="visit-title">
        <div className="fullband" style={{ minHeight: 560 }}>
          <Slot id="IMG-17" images={img} illus="voiture" alt="Atelier mécanique" />
          <div className="fullband-inner" data-reveal>
            <p className="eyebrow">Passez nous voir</p>
            <h2 className="display h2">1520 route de Nîmes, <span className="accent">Milhaud</span></h2>
            <p className="lead" style={{ color: '#d4dae0' }}>Sur l’axe Nîmes – Montpellier. Parking sur place, accès PMR.</p>
            <div className="hero-ctas">
              <a className="btn btn-light" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.street} ${s.zip} ${s.city}`)}`} target="_blank" rel="noopener"><MapPin /> Itinéraire</a>
              <Link className="btn" href="/contact">Nous contacter</Link>
            </div>
          </div>
        </div>
        <div className="visit">
          <div style={{ display: 'grid', gap: 14 }}>
            <h2 id="visit-title" className="display h2" style={{ fontSize: 'clamp(28px,2.6vw,44px)' }}>Horaires</h2>
            <OpenStatus hours={s.hours} />
          </div>
          <div className="hours">
            {DAY_ORDER.map((d) => <div key={d}><span>{DAYS[Number(d)]}</span><b>{fmtDay(s.hours[d])}</b></div>)}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/rendez-vous" className="btn"><CalendarCheck /> Rendez-vous</Link>
            <a href={`tel:+33${s.phone.replace(/\D/g, '').slice(1)}`} className="btn"><Clock /> {s.phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}

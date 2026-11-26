import Link from 'next/link'
import { ArrowRight, BadgeEuro, CalendarCheck, Clock, MapPin, ShieldCheck, Star as StarIco, Wrench } from 'lucide-react'
import { getReviews, getServices, getSettings, getVehicles } from '@/lib/data'
import { CATEGORIES, DAYS, DAY_ORDER } from '@/lib/site'
import { slotSrc } from '@/lib/images'
import { Slot } from '@/components/Slot'
import { CarArt } from '@/components/Logo'
import { ServiceCard } from '@/components/ServiceCard'
import { VehicleCard } from '@/components/VehicleCard'
import { BeforeAfter } from '@/components/BeforeAfter'
import { LeadForm } from '@/components/LeadForm'
import { Stars, IconAccess, IconHandshake, IconShield, IconVan } from '@/components/icons'
import { fmtDay } from '@/lib/hours'
import { OpenStatus } from '@/components/OpenStatus'
import { dateFr } from '@/lib/format'

export default async function Home() {
  const [s, services, vehicles, reviews] = await Promise.all([getSettings(), getServices(), getVehicles(), getReviews()])
  const img = s.images
  const heroPhoto = slotSrc(img, 'IMG-01')
  const featured = [...vehicles.filter((v) => v.featured && v.status !== 'vendu'), ...vehicles.filter((v) => !v.featured && v.status !== 'vendu')].slice(0, 8)
  const count = (c: string) => vehicles.filter((v) => v.category === c && v.status !== 'vendu').length
  const brands = [...new Set(['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Fiat', 'Ford', 'Mercedes-Benz', 'Iveco', 'Dacia', 'Toyota', 'Nissan', 'Opel', 'Yamaha', 'Honda', 'Kawasaki', 'BMW', ...vehicles.map((v) => v.brand)])]

  return (
    <>
      {/* ============ HÉRO ============ */}
      <section className="hero" aria-labelledby="hero-title">
        {heroPhoto ? (
          <Slot id="IMG-01" images={img} className="hero-media" priority alt="L’atelier Connect Auto à Milhaud" />
        ) : (
          <>
            <div className="hero-glow" />
            <div className="hero-grid" />
            <CarArt className="hero-art" />
            <span className="slot-tag" style={{ position: 'absolute', right: 'var(--pad)', top: 'calc(var(--hdr) + 18px)', left: 'auto', bottom: 'auto' }}>
              <b>IMG-01</b> Grand bandeau d’accueil
            </span>
          </>
        )}
        <div className="hero-inner">
          <p className="eyebrow" data-hero style={{ ['--d' as string]: '.05s' }}>{s.heroEyebrow}</p>
          <h1 id="hero-title" className="display h1" data-hero style={{ ['--d' as string]: '.15s' }}>
            <span className="l1">{s.heroLine1}</span>
            <span className="l2">{s.heroLine2}</span>
          </h1>
          <div className="hero-row" data-hero style={{ ['--d' as string]: '.3s' }}>
            <p className="lead" style={{ color: '#d4dae0' }}>{s.heroText}</p>
            <div className="hero-ctas">
              <Link href="/occasions" className="btn btn-accent">Voir les occasions <ArrowRight className="arrow" /></Link>
              <Link href="/rendez-vous" className="btn">Prendre rendez-vous</Link>
            </div>
          </div>
          <form action="/occasions" className="quick" data-hero style={{ ['--d' as string]: '.45s' }}>
            <label><span>Je cherche</span>
              <select name="cat" defaultValue="">
                <option value="">Tous les véhicules</option>
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
            <label><span>Marque</span>
              <select name="marque" defaultValue="">
                <option value="">Toutes</option>
                {[...new Set(vehicles.map((v) => v.brand))].sort().map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label><span>Budget max.</span>
              <select name="prix" defaultValue="">
                <option value="">Sans limite</option>
                {[8000, 10000, 15000, 20000, 25000, 30000].map((p) => <option key={p} value={p}>{p.toLocaleString('fr-FR')} €</option>)}
              </select>
            </label>
            <label><span>Kilométrage max.</span>
              <select name="km" defaultValue="">
                <option value="">Sans limite</option>
                {[50000, 100000, 150000].map((k) => <option key={k} value={k}>{k.toLocaleString('fr-FR')} km</option>)}
              </select>
            </label>
            <button className="btn btn-accent">Rechercher</button>
          </form>
          <ul className="trust" data-hero style={{ ['--d' as string]: '.55s' }}>
            <li><Stars value={s.googleRating} /> <b>{String(s.googleRating).replace('.', ',')}/5</b> sur Google · {s.googleCount} avis</li>
            <li><ShieldCheck /> Garantie légale sur nos occasions</li>
            <li><IconHandshake /> Reprise de votre véhicule</li>
            <li><MapPin /> {s.street}, {s.city}</li>
          </ul>
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {['Vente', 'Reprise', 'Entretien', 'Mécanique', 'Carrosserie', 'Peinture', 'Pneus', 'Pare-brise', 'Dépannage', 'Carte grise'].map((w) => (
                <span key={w}>{w}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ CATÉGORIES ============ */}
      <section className="section tight wrap" aria-labelledby="cat-title" style={{ paddingBottom: 'clamp(28px,3vw,48px)' }}>
        <div className="sec-head" data-reveal>
          <div>
            <p className="eyebrow">Nos occasions</p>
            <h2 id="cat-title" className="display h2">Voitures, utilitaires,<br />camions <span className="accent">&amp; motos</span></h2>
          </div>
          <p className="lead">Un stock varié, contrôlé et préparé dans notre atelier. Chaque véhicule est visible sur place, à Milhaud, à dix minutes de Nîmes.</p>
        </div>
      </section>
      <div className="cats">
        {CATEGORIES.map((c, i) => (
          <Link key={c.key} href={`/occasions/${c.key}`} className="cat" data-reveal style={{ ['--d' as string]: `${i * 0.08}s` }}>
            <Slot id={c.slot} images={img} icon={c.key} alt={`${c.label} d’occasion chez Connect Auto`} sizes="(max-width: 1000px) 50vw, 25vw" />
            <span className="cat-go" aria-hidden><ArrowRight /></span>
            <div className="cat-body">
              <span className="cat-count">{count(c.key) ? `${count(c.key)} en stock` : 'Sur demande'}</span>
              <h3 className="display">{c.label}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ============ SERVICES ============ */}
      <section className="section wrap" aria-labelledby="svc-title">
        <div className="sec-head" data-reveal>
          <div>
            <p className="eyebrow">L’atelier</p>
            <h2 id="svc-title" className="display h2">Tout pour votre véhicule,<br /><span className="accent">au même endroit</span></h2>
          </div>
          <div style={{ display: 'grid', gap: 22, justifyItems: 'end' }}>
            <p className="lead">Entretien, réparation, carrosserie, pneus, pare-brise, dépannage et carte grise : voitures et utilitaires de toutes marques.</p>
            <Link href="/services" className="link-arrow">Tous les services <ArrowRight /></Link>
          </div>
        </div>
        <div className="svc-grid">
          {services.map((sv, i) => <ServiceCard key={sv.id} s={sv} images={img} i={i} />)}
        </div>
      </section>

      {/* ============ STOCK ============ */}
      <section className="section band-2" aria-labelledby="stock-title">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Arrivages</p>
              <h2 id="stock-title" className="display h2">En ce moment <span className="accent">au garage</span></h2>
            </div>
            <div style={{ display: 'grid', gap: 22, justifyItems: 'end' }}>
              <p className="lead">Prix affichés TTC. Pour les utilitaires éligibles, le prix HT est indiqué et la TVA est récupérable.</p>
              <Link href="/occasions" className="link-arrow">Tout le stock ({vehicles.filter((v) => v.status !== 'vendu').length}) <ArrowRight /></Link>
            </div>
          </div>
          <div className="veh-row" data-reveal>
            {featured.map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* ============ POURQUOI NOUS ============ */}
      <section className="section wrap" aria-labelledby="why-title">
        <div className="why">
          <div data-reveal>
            <p className="eyebrow">Pourquoi Connect Auto</p>
            <h2 id="why-title" className="display h2">{s.aboutTitle}</h2>
            <p className="lead" style={{ marginTop: 26 }}>{s.aboutText}</p>
            <div className="stats">
              <div className="stat"><b className="num">{String(s.googleRating).replace('.', ',')}<em>/5</em></b><span>Note Google, {s.googleCount} avis</span></div>
              <div className="stat"><b className="num">2019</b><span>Installés route de Nîmes à Milhaud</span></div>
              <div className="stat"><b className="num">4</b><span>Catégories : voitures, utilitaires, camions, motos</span></div>
              <div className="stat"><b className="num">{services.length}</b><span>Services réunis dans un seul garage</span></div>
            </div>
            <Link href="/a-propos" className="btn" style={{ marginTop: 40 }}>Découvrir le garage <ArrowRight className="arrow" /></Link>
          </div>
          <div className="why-list" data-reveal style={{ ['--d' as string]: '.1s' }}>
            {[
              { i: <Wrench />, t: 'Un seul interlocuteur', d: 'Achat, entretien, carrosserie et carte grise : la même équipe suit votre véhicule.' },
              { i: <IconShield />, t: 'Garantie légale', d: 'Nos occasions vendues aux particuliers bénéficient de la garantie légale de conformité de 2 ans.' },
              { i: <IconHandshake />, t: 'Reprise de votre véhicule', d: 'Nous rachetons votre voiture, votre utilitaire ou votre moto, même sans achat chez nous.' },
              { i: <IconVan />, t: 'Utilitaires & pros', d: 'Prix HT, TVA récupérable sur les véhicules éligibles, facture au nom de votre société.' },
              { i: <BadgeEuro />, t: 'Prix annoncé avant', d: 'Un devis clair avant chaque intervention. Pas de surprise au moment de payer.' },
              { i: <IconAccess />, t: 'Accès facile', d: 'Parking sur place, accès en fauteuil roulant, paiement par carte bancaire.' },
            ].map((w) => (
              <div key={w.t} className="why-item">
                <span className="ico">{w.i}</span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AVANT / APRÈS + RDV ============ */}
      <section className="section band-2" aria-labelledby="ba-title">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Carrosserie & peinture</p>
              <h2 id="ba-title" className="display h2">Avant, <span className="accent">après</span></h2>
            </div>
            <p className="lead">Faites glisser la poignée pour comparer. Une rayure, un choc ou un sinistre : demandez un devis, on vous rappelle.</p>
          </div>
          <div className="ba-wrap">
            <BeforeAfter images={img} />
            <div data-reveal style={{ ['--d' as string]: '.1s' }}>
              <LeadForm
                type="rdv"
                title="Rendez-vous ou devis"
                intro="Choisissez la prestation, nous vous rappelons pour fixer le créneau."
                whatsapp={s.whatsapp}
                compact
                messageLabel="Précisions (facultatif)"
                messagePlaceholder="Modèle du véhicule, symptôme, date souhaitée…"
                fields={[
                  { name: 'prestation', label: 'Prestation', type: 'select', required: true, full: true, options: [...services.map((x) => x.title), 'Autre'] },
                ]}
                submitLabel="Être rappelé"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ REPRISE ============ */}
      <section className="fullband" aria-labelledby="rep-title">
        <Slot id="IMG-16" images={img} icon="key" alt="Remise des clés après une reprise de véhicule" />
        <div className="fullband-inner" data-reveal>
          <p className="eyebrow">Reprise & rachat</p>
          <h2 id="rep-title" className="display h2">On rachète<br /><span className="accent">votre véhicule</span></h2>
          <p className="lead" style={{ color: '#d4dae0' }}>{s.repriseText}</p>
          <ol className="steps-inline">
            <li>Vos photos et infos</li>
            <li>Notre proposition</li>
            <li>Paiement et papiers faits</li>
          </ol>
          <div className="hero-ctas">
            <Link href="/reprise" className="btn btn-accent">Faire estimer mon véhicule <ArrowRight className="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* ============ AVIS ============ */}
      <section className="section wrap" aria-labelledby="rev-title">
        <div className="reviews">
          <div className="rating-big" data-reveal>
            <p className="eyebrow">Avis clients</p>
            <b className="num">{String(s.googleRating).replace('.', ',')}</b>
            <Stars value={s.googleRating} />
            <p className="muted" style={{ margin: 0 }}>Note moyenne sur Google, {s.googleCount} avis.</p>
            <a href={s.googleUrl} target="_blank" rel="noopener" className="link-arrow">Lire les avis sur Google <ArrowRight /></a>
          </div>
          <div data-reveal style={{ ['--d' as string]: '.1s' }}>
            <h2 id="rev-title" className="display h2" style={{ marginBottom: 32 }}>Ils nous ont <span className="accent">fait confiance</span></h2>
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
                <p style={{ margin: 0 }}>
                  Les avis de nos clients sont publiés sur Google. Vous êtes passé au garage ? Votre retour aide d’autres automobilistes de la région.
                </p>
                <a href={s.googleUrl} target="_blank" rel="noopener" className="btn btn-sm">Voir et laisser un avis</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ MARQUES ============ */}
      <div className="ticker" aria-label="Marques entretenues et vendues">
        <div className="ticker-track" style={{ animationDuration: '60s' }}>
          {[0, 1].map((k) => (
            <span key={k} aria-hidden={k === 1}>
              {brands.map((b) => <span key={b} style={{ color: 'var(--dim)' }}>{b}</span>)}
            </span>
          ))}
        </div>
      </div>

      {/* ============ VISITE ============ */}
      <section className="cta-final" aria-labelledby="visit-title">
        <div className="fullband" style={{ minHeight: 560 }}>
          <Slot id="IMG-17" images={img} icon="car" alt="La façade de l’atelier Connect Auto" />
          <div className="fullband-inner" data-reveal>
            <p className="eyebrow">Passez nous voir</p>
            <h2 className="display h2">1520 route<br />de Nîmes</h2>
            <p className="lead" style={{ color: '#d4dae0' }}>À Milhaud, sur l’axe Nîmes – Montpellier. Parking sur place et accès en fauteuil roulant.</p>
            <div className="hero-ctas">
              <a className="btn btn-light" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.street} ${s.zip} ${s.city}`)}`} target="_blank" rel="noopener">
                <MapPin /> Itinéraire
              </a>
              <Link className="btn" href="/contact">Nous contacter</Link>
            </div>
          </div>
        </div>
        <div className="visit">
          <div style={{ display: 'grid', gap: 16 }}>
            <h2 id="visit-title" className="display h2" style={{ fontSize: 'clamp(30px,3vw,52px)' }}>Horaires</h2>
            <OpenStatus hours={s.hours} />
          </div>
          <div className="hours">
            {DAY_ORDER.map((d) => (
              <div key={d}><span>{DAYS[Number(d)]}</span><b>{fmtDay(s.hours[d])}</b></div>
            ))}
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

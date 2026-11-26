import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BadgeEuro, Handshake, MapPin, ShieldCheck, Star as StarIco } from 'lucide-react'
import type { Settings } from '@/lib/types'
import { slotSrc } from '@/lib/images'
import { CarArt } from './Logo'
import { Stars } from './icons'
import { OpenStatus } from './OpenStatus'

/** Sol en perspective (lignes qui fuient vers l’horizon). */
function Floor() {
  const W = 1600, H = 520, vx = 1050
  const rays = Array.from({ length: 29 }, (_, i) => -1400 + i * 140)
  const rows = Array.from({ length: 11 }, (_, i) => Math.pow(i / 10, 2.1) * H)
  return (
    <svg className="hx-floor" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="hxf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2EC95C" stopOpacity="0" />
          <stop offset=".35" stopColor="#9fb3c8" stopOpacity=".16" />
          <stop offset="1" stopColor="#9fb3c8" stopOpacity=".28" />
        </linearGradient>
        <radialGradient id="hxfm" cx=".66" cy=".2" r=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hxmask"><rect width={W} height={H} fill="url(#hxfm)" /></mask>
      </defs>
      <g mask="url(#hxmask)" stroke="url(#hxf)" strokeWidth="1" fill="none">
        {rays.map((x) => <path key={x} d={`M${vx} 0 L${vx + x * 1.6} ${H}`} />)}
        {rows.map((y, i) => <path key={i} d={`M0 ${y.toFixed(1)} H${W}`} />)}
      </g>
    </svg>
  )
}

export function HeroScene({ s, stock, services }: { s: Settings; stock: number; services: number }) {
  const photo = slotSrc(s.images, 'IMG-01')
  const rating = String(s.googleRating).replace('.', ',')
  return (
    <section className="hx" aria-labelledby="hero-title">
      <div className="hx-bg" />
      <Floor />
      <div className="hx-noise" />

      <div className="hx-inner">
        <div className="hx-copy">
          <div data-hero style={{ ['--d' as string]: '.05s', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="eyebrow" style={{ margin: 0 }}>{s.heroEyebrow}</span>
          </div>
          <h1 id="hero-title" className="display h1" data-hero style={{ ['--d' as string]: '.15s' }}>
            <span className="l1">{s.heroLine1}</span>
            <span className="l2">{s.heroLine2}</span>
          </h1>
          <p className="lead" data-hero style={{ ['--d' as string]: '.28s' }}>{s.heroText}</p>
          <div className="hx-ctas" data-hero style={{ ['--d' as string]: '.4s' }}>
            <Link href="/occasions" className="btn btn-accent">Voir les {stock} véhicules <ArrowRight className="arrow" /></Link>
            <Link href="/rendez-vous" className="btn">Prendre rendez-vous</Link>
          </div>
          <div className="hx-proof" data-hero style={{ ['--d' as string]: '.52s' }}>
            <span className="avatars" aria-hidden>
              <span><ShieldCheck /></span><span><Handshake /></span><span><BadgeEuro /></span>
            </span>
            <span><Stars value={s.googleRating} /> <b>{rating}/5</b> · {s.googleCount} avis Google<br /><OpenStatus hours={s.hours} /></span>
          </div>
        </div>

        {photo ? (
          <div className="hx-visual" data-hero style={{ ['--d' as string]: '.2s' }}>
            <div className="hx-frame">
              <Image src={photo} alt="Véhicule d’occasion présenté en studio" fill priority sizes="(max-width: 1080px) 92vw, 44vw" style={{ objectFit: 'cover' }} />
              <span className="hx-frame-line" aria-hidden />
            </div>
            <div className="hx-car-mini" aria-hidden><CarArt /></div>
            <div className="hx-chip c1"><span className="ci"><BadgeEuro /></span><span><b>TVA récupérable</b><span>sur les utilitaires éligibles</span></span></div>
            <div className="hx-chip c2"><span className="ci"><Handshake /></span><span><b>Reprise de votre véhicule</b><span>proposition rapide</span></span></div>
            <div className="hx-chip c3"><span className="ci"><StarIco /></span><span><b>{rating}/5 sur Google</b><span>{s.googleCount} avis clients</span></span></div>
          </div>
        ) : (
          <div className="hx-scene" aria-hidden>
            <div className="hx-streaks"><i /><i /><i /><i /></div>
            <div className="hx-glow" />
            <div className="hx-beam" />
            <div className="hx-car hx-car-in"><CarArt /></div>
            <div className="hx-reflect hx-car-in"><CarArt /></div>
            <div className="hx-chip c1"><span className="ci"><BadgeEuro /></span><span><b>TVA récupérable</b><span>sur les utilitaires éligibles</span></span></div>
            <div className="hx-chip c2"><span className="ci"><Handshake /></span><span><b>Reprise de votre véhicule</b><span>proposition rapide</span></span></div>
            <div className="hx-chip c3"><span className="ci"><StarIco /></span><span><b>{rating}/5 sur Google</b><span>{s.googleCount} avis clients</span></span></div>
          </div>
        )}
      </div>

      <div className="hx-stats" data-hero style={{ ['--d' as string]: '.6s' }}>
        <div className="hx-stat"><b className="num">{stock}<em>+</em></b><span>véhicules en stock</span></div>
        <div className="hx-stat"><b className="num">{rating}<em>/5</em></b><span>{s.googleCount} avis Google</span></div>
        <div className="hx-stat"><b className="num">2019</b><span>installés à Milhaud</span></div>
        <div className="hx-stat"><b className="num">{services}</b><span>services atelier</span></div>
      </div>
      <span className="sr-only"><MapPin /> {s.street}, {s.zip} {s.city}</span>
    </section>
  )
}

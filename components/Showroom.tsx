'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import type { Vehicle } from '@/lib/types'
import { eur, km, priceHT, waHref } from '@/lib/format'
import { NoPhoto } from './NoPhoto'
import { vehiclePicture } from '@/lib/vehicle-photos'

const CAT: Record<string, string> = { voitures: 'Voiture', utilitaires: 'Utilitaire', camions: 'Camion', motos: 'Moto' }

/** Vitrine des véhicules : grande scène, fiche détaillée, navigation et défilement automatique. */
export function Showroom({ vehicles, whatsapp }: { vehicles: Vehicle[]; whatsapp: string }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const strip = useRef<HTMLDivElement>(null)
  const touch = useRef(0)
  const n = vehicles.length
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n])

  useEffect(() => {
    if (paused || n < 2) return
    const t = setTimeout(() => go(1), 6500)
    return () => clearTimeout(t)
  }, [i, paused, go, n])

  useEffect(() => {
    const el = strip.current?.children[i] as HTMLElement | undefined
    if (el && strip.current) strip.current.scrollTo({ left: el.offsetLeft - strip.current.offsetLeft - 8, behavior: 'smooth' })
  }, [i])

  if (!n) return null
  const v = vehicles[i]
  const href = `/occasions/${v.category}/${v.slug}`
  const pic = vehiclePicture(v)

  return (
    <div
      className="sr"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Véhicules en vitrine"
    >
      <div className="sr-top">
        <div className="sr-count num" aria-live="polite">
          <b>{String(i + 1).padStart(2, '0')}</b><span>/ {String(n).padStart(2, '0')}</span>
        </div>
        <div className="sr-progress" aria-hidden><i key={`${i}-${paused}`} className={paused ? 'paused' : ''} /></div>
        <div className="sr-nav">
          <button onClick={() => go(-1)} aria-label="Véhicule précédent"><ArrowLeft /></button>
          <button onClick={() => go(1)} aria-label="Véhicule suivant"><ArrowRight /></button>
        </div>
      </div>

      <div className="sr-main">
        <Link
          href={href}
          className="sr-stage"
          onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) { e.preventDefault(); go(dx < 0 ? 1 : -1) } }}
          aria-label={`Voir la fiche ${v.brand} ${v.model}`}
        >
          <span className="sr-bigname" aria-hidden key={'n' + v.id}>{v.model}</span>
          <span className="sr-spot" aria-hidden />
          <div className={`sr-visual ${pic ? 'has-photo' : ''}`} key={'v' + v.id}>
            {pic ? (
              <Image src={pic.src} alt={`${v.brand} ${v.model} ${v.version}`} fill sizes="(max-width: 1000px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
            ) : (
              <NoPhoto brand={v.brand} model={v.model} category={v.category} big />
            )}
          </div>
          <span className="sr-tags">
            <span className="tag">{CAT[v.category]}</span>
            {v.vatRecoverable && <span className="tag green">TVA récupérable</span>}
            {pic?.illustrative && <span className="tag ghost">Photo d’illustration</span>}
            {!pic && <span className="tag ghost">Photos sur demande</span>}
          </span>
          <span className="sr-open" aria-hidden><ArrowUpRight /></span>
        </Link>

        <div className="sr-info" key={'i' + v.id}>
          <p className="sr-ref">Réf. {v.ref} · {v.year}</p>
          <h3 className="sr-title">{v.brand} <em>{v.model}</em></h3>
          <p className="sr-version">{v.version}</p>
          <div className="sr-price">
            <b className="num">{eur(v.price)}</b>
            <span>{v.vatRecoverable ? `${eur(priceHT(v.price))} HT · TVA récupérable` : 'Prix TTC'}</span>
          </div>
          <dl className="sr-specs">
            <div><dt>Année</dt><dd>{v.year}</dd></div>
            <div><dt>Kilométrage</dt><dd>{km(v.km)}</dd></div>
            <div><dt>Énergie</dt><dd>{v.fuel}</dd></div>
            <div><dt>Boîte</dt><dd>{v.gearbox}</dd></div>
            {v.power ? <div><dt>Puissance</dt><dd>{v.power} ch</dd></div> : null}
            {v.seats ? <div><dt>Places</dt><dd>{v.seats}</dd></div> : null}
          </dl>
          <div className="sr-ctas">
            <Link href={href} className="btn btn-accent">Voir la fiche <ArrowRight className="arrow" /></Link>
            <a className="btn" target="_blank" rel="noopener" href={waHref(whatsapp, `Bonjour, le ${v.brand} ${v.model} ${v.version} (${v.year}, réf. ${v.ref}) est-il toujours disponible ?`)}>
              <MessageCircle /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="sr-strip" ref={strip}>
        {vehicles.map((x, k) => (
          <button key={x.id} className={`sr-thumb ${k === i ? 'on' : ''}`} onClick={() => setI(k)} aria-label={`${x.brand} ${x.model}, ${eur(x.price)}`} aria-current={k === i}>
            <span className="sr-thumb-img">
              {vehiclePicture(x) ? (
                <Image src={vehiclePicture(x)!.src} alt="" fill sizes="160px" style={{ objectFit: 'cover' }} />
              ) : (
                <NoPhoto brand="" model="" category={x.category} />
              )}
            </span>
            <span className="sr-thumb-txt"><b>{x.brand} {x.model}</b><span className="num">{x.year} · {eur(x.price)}</span></span>
          </button>
        ))}
      </div>
    </div>
  )
}

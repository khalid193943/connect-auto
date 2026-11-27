'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { NoPhoto } from './NoPhoto'

/**
 * Photos d’une annonce. Un clic sur la photo ouvre le plein écran :
 * flèches et clavier sur ordinateur, glisser sur téléphone (vers le bas pour fermer), double-tap pour zoomer.
 */
export function Gallery({ photos, alt, icon, refId, illustration, brand = '', model = '' }: { photos: string[]; alt: string; icon: string; refId: string; illustration?: string; brand?: string; model?: string }) {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const n = photos.length
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n])
  void refId
  if (!n && illustration) {
    return (
      <div className="gallery">
        <div className="gallery-main">
          <Image src={illustration} alt={`${alt} (photo d’illustration)`} fill priority sizes="(max-width: 1050px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
          <span className="illus-badge big">Photo d’illustration · photos réelles du véhicule sur demande</span>
        </div>
      </div>
    )
  }
  if (!n) {
    return (
      <div className="gallery">
        <div className="gallery-main"><NoPhoto brand={brand} model={model} category={icon} big /></div>
      </div>
    )
  }
  return (
    <div className="gallery">
      <div
        className="gallery-main zoomable"
        onTouchStart={(e) => { const el = e.currentTarget as HTMLElement; el.dataset.x = String(e.touches[0].clientX); el.dataset.swiped = '' }}
        onTouchEnd={(e) => {
          const el = e.currentTarget as HTMLElement
          const dx = e.changedTouches[0].clientX - Number(el.dataset.x)
          if (n > 1 && Math.abs(dx) > 40) { el.dataset.swiped = '1'; go(dx < 0 ? 1 : -1) }
        }}
      >
        <button type="button" className="gallery-open" onClick={(e) => { if ((e.currentTarget.parentElement as HTMLElement).dataset.swiped === '1') return; setOpen(true) }} aria-label={`Voir la photo ${i + 1} en plein écran`}>
          <Image src={photos[i]} alt={`${alt} — photo ${i + 1}`} fill priority sizes="(max-width: 1050px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
        </button>
        {n > 1 && (
          <>
            <button className="gallery-nav prev" onClick={() => go(-1)} aria-label="Photo précédente"><ChevronLeft /></button>
            <button className="gallery-nav next" onClick={() => go(1)} aria-label="Photo suivante"><ChevronRight /></button>
          </>
        )}
        <span className="tag gallery-count num">{i + 1} / {n}</span>
        <span className="gallery-full" aria-hidden><Expand /> Plein écran</span>
      </div>
      {n > 1 && (
        <div className="gallery-strip">
          {photos.map((p, j) => (
            <button key={p} onClick={() => setI(j)} onDoubleClick={() => { setI(j); setOpen(true) }} aria-current={j === i} aria-label={`Voir la photo ${j + 1}`}>
              <Image src={p} alt="" width={220} height={165} />
            </button>
          ))}
        </div>
      )}
      {open && <Lightbox photos={photos} index={i} alt={alt} onIndex={setI} onClose={() => setOpen(false)} />}
    </div>
  )
}

function Lightbox({ photos, index, alt, onIndex, onClose }: { photos: string[]; index: number; alt: string; onIndex: (i: number) => void; onClose: () => void }) {
  const n = photos.length
  const [zoom, setZoom] = useState(false)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const start = useRef<{ x: number; y: number; t: number } | null>(null)
  const lastTap = useRef(0)
  const touchAt = useRef(0)
  const stage = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const go = useCallback((d: number) => { setZoom(false); onIndex((index + d + n) % n) }, [index, n, onIndex])

  // clavier, défilement de la page bloqué, focus
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && n > 1) go(1)
      else if (e.key === 'ArrowLeft' && n > 1) go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prevFocus?.focus() }
  }, [go, n, onClose])

  // précharge les photos voisines
  useEffect(() => {
    for (const d of [1, -1]) { const img = new window.Image(); img.src = photos[(index + d + n) % n] }
  }, [index, n, photos])

  const toggleZoom = (cx: number, cy: number) => {
    const z = !zoom
    setZoom(z)
    if (z) requestAnimationFrame(() => {
      const el = stage.current
      if (!el) return
      const r = el.getBoundingClientRect()
      el.scrollLeft = ((cx - r.left) / r.width) * el.scrollWidth - r.width / 2
      el.scrollTop = ((cy - r.top) / r.height) * el.scrollHeight - r.height / 2
    })
  }

  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`Photos : ${alt}`}>
      <div className="lb-top">
        <span className="lb-count num">{index + 1} / {n}</span>
        <button ref={closeBtn} type="button" className="lb-btn" onClick={onClose} aria-label="Fermer le plein écran"><X /></button>
      </div>
      <div
        ref={stage}
        className={`lb-stage${zoom ? ' zoom' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget && !zoom) onClose() }}
        onTouchStart={(e) => { const t = e.touches[0]; start.current = { x: t.clientX, y: t.clientY, t: Date.now() } }}
        onTouchMove={(e) => { if (zoom || !start.current || e.touches.length > 1) return; const t = e.touches[0]; setDrag({ x: t.clientX - start.current.x, y: Math.max(0, t.clientY - start.current.y) }) }}
        onTouchEnd={(e) => {
          const s = start.current; start.current = null
          const t = e.changedTouches[0]
          const now = Date.now()
          touchAt.current = now
          if (s && Math.abs(t.clientX - s.x) < 10 && Math.abs(t.clientY - s.y) < 10) {
            if (now - lastTap.current < 300) { toggleZoom(t.clientX, t.clientY); lastTap.current = 0 } else lastTap.current = now
          } else if (s && !zoom) {
            const dx = t.clientX - s.x, dy = t.clientY - s.y
            if (dy > 110 && dy > Math.abs(dx)) onClose()
            else if (n > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
          }
          setDrag({ x: 0, y: 0 })
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photos[index]}
          src={photos[index]}
          alt={`${alt} — photo ${index + 1} sur ${n}`}
          className="lb-img"
          draggable={false}
          onDoubleClick={(e) => { if (Date.now() - touchAt.current > 800) toggleZoom(e.clientX, e.clientY) }}
          style={drag.x || drag.y ? { transform: `translate(${drag.x}px, ${drag.y}px)`, opacity: 1 - Math.min(drag.y / 400, 0.5), transition: 'none' } : undefined}
        />
      </div>
      {n > 1 && (
        <>
          <button type="button" className="lb-btn lb-nav prev" onClick={() => go(-1)} aria-label="Photo précédente"><ChevronLeft /></button>
          <button type="button" className="lb-btn lb-nav next" onClick={() => go(1)} aria-label="Photo suivante"><ChevronRight /></button>
          <div className="lb-thumbs">
            {photos.map((p, j) => (
              <button key={p} type="button" aria-current={j === index} aria-label={`Photo ${j + 1}`} onClick={() => { setZoom(false); onIndex(j) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" />
              </button>
            ))}
          </div>
        </>
      )}
      <p className="lb-hint lb-touch">{zoom ? 'Double-tap pour revenir' : n > 1 ? 'Glissez pour changer · double-tap pour zoomer' : 'Double-tap pour zoomer'}</p>
      <p className="lb-hint lb-mouse">{zoom ? 'Double-clic pour revenir' : `${n > 1 ? '← → pour changer · ' : ''}double-clic pour zoomer · Échap pour fermer`}</p>
    </div>,
    document.body,
  )
}

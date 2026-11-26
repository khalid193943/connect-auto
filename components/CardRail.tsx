'use client'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/** Rangée de cartes qui défile, avec deux flèches de navigation. */
export function CardRail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const go = (d: number) => {
    const el = ref.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 18 : el.clientWidth * 0.8
    el.scrollBy({ left: d * step, behavior: 'smooth' })
  }
  return (
    <div className="rail">
      <div className="rail-nav">
        <button onClick={() => go(-1)} aria-label="Précédent"><ArrowLeft /></button>
        <button onClick={() => go(1)} aria-label="Suivant"><ArrowRight /></button>
      </div>
      <div className="rail-track" ref={ref} role="region" aria-label={label}>{children}</div>
    </div>
  )
}

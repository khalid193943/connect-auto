'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { BRAND_LIST } from '@/lib/brands'

/** Pastilles des marques les plus courantes + « +13 » qui ouvre la liste complète sur la carte. */
export function BrandChips({ max = 5 }: { max?: number }) {
  const [open, setOpen] = useState(false)
  const shown = BRAND_LIST.slice(0, max)
  const rest = BRAND_LIST.length - max
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen((o) => !o)
  }
  return (
    <>
      <span className="bch">
        <span className="bch-stack" aria-label={`Toutes marques : ${BRAND_LIST.map((b) => b.name).join(', ')}`} role="img">
          {shown.map((b) => (
            <span key={b.id} className="bch-chip" title={b.name}><BrandLogo id={b.id} className="bch-logo" /></span>
          ))}
        </span>
        <button type="button" className="bch-more" aria-expanded={open} aria-label={`Voir les ${BRAND_LIST.length} marques`} onClick={toggle}>+{rest}</button>
      </span>
      {open && (
        <span className="bch-pop" role="dialog" aria-label="Toutes les marques" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
          <span className="bch-pop-head">
            <b>Toutes marques</b>
            <button type="button" className="bch-close" aria-label="Fermer" onClick={toggle}><X /></button>
          </span>
          <span className="bch-grid">
            {BRAND_LIST.map((b) => (
              <span key={b.id} className="bch-cell" title={b.name}><BrandLogo id={b.id} className="bch-logo" /><small>{b.name.replace(' Automobiles', '').replace('-Benz', '')}</small></span>
            ))}
          </span>
        </span>
      )}
    </>
  )
}

'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

export type Panel = { key: string; label: string; href: string; count: number; img: string }

/** Héro : 4 panneaux photo qui s’ouvrent l’un après l’autre (survol = ouverture). */
export function HeroPanels({ panels }: { panels: Panel[] }) {
  const [on, setOn] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (hold) return
    const t = setTimeout(() => setOn((x) => (x + 1) % panels.length), 4200)
    return () => clearTimeout(t)
  }, [on, hold, panels.length])
  return (
    <div className="hp" onMouseLeave={() => setHold(false)}>
      {panels.map((p, i) => (
        <Link
          key={p.key}
          href={p.href}
          className={`hp-item ${i === on ? 'on' : ''}`}
          onMouseEnter={() => { setOn(i); setHold(true) }}
          onFocus={() => { setOn(i); setHold(true) }}
          style={{ ['--i' as string]: i }}
        >
          <Image src={p.img} alt={`${p.label} d’occasion`} fill priority={i < 2} sizes="(max-width: 900px) 80vw, 40vw" style={{ objectFit: 'cover' }} />
          <span className="hp-shade" aria-hidden />
          <span className="hp-v" aria-hidden>{p.label}</span>
          <span className="hp-body">
            <span className="hp-count">{p.count ? `${p.count} en stock` : 'Sur demande'}</span>
            <span className="hp-label">{p.label}</span>
          </span>
          <span className="hp-go" aria-hidden><ArrowUpRight /></span>
          <span className="hp-bar" aria-hidden><i key={`${on}-${hold}`} /></span>
        </Link>
      ))}
    </div>
  )
}

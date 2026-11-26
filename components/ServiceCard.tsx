import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/types'
import { Slot } from './Slot'
import { slotSrc } from '@/lib/images'
import { SERVICE_ICONS } from './icons'
import { BrandChips } from './BrandChips'

export function ServiceCard({ s, images, i = 0 }: { s: Service; images: Record<string, string>; i?: number }) {
  const Icon = SERVICE_ICONS[s.icon] ?? SERVICE_ICONS.wrench
  return (
    <div className="svc" data-reveal style={{ ['--d' as string]: `${(i % 4) * 0.08}s` }}>
      {slotSrc(images, s.card) ? (
        <Slot id={s.card} images={images} icon={s.icon} alt={s.title} sizes="(max-width: 620px) 92vw, (max-width: 1200px) 46vw, 24vw" />
      ) : (
        <div className="slot" style={{ aspectRatio: '4 / 3' }}>
          <div className="slot-ph"><span className="svc-big"><Icon /></span><span className="slot-tag"><b>{s.card}</b> {s.title}</span></div>
        </div>
      )}
      <span className="svc-ico" aria-hidden><Icon /></span>
      <div className="svc-body">
        <h3 className="display"><Link href={`/services/${s.slug}`} className="svc-link">{s.title}</Link></h3>
        <BrandChips />
        <p>{s.short}</p>
      </div>
      <div className="svc-foot">
        <span className="svc-price">{s.priceFrom ? <>À partir de <b>{s.priceFrom}</b></> : 'Devis gratuit'}</span>
        <span className="link-arrow">Découvrir <ArrowRight /></span>
      </div>
    </div>
  )
}

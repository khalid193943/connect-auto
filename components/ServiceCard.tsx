import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/types'
import { Slot } from './Slot'
import { SERVICE_ICONS } from './icons'

export function ServiceCard({ s, images, i = 0 }: { s: Service; images: Record<string, string>; i?: number }) {
  const Icon = SERVICE_ICONS[s.icon] ?? SERVICE_ICONS.wrench
  return (
    <Link href={`/services/${s.slug}`} className="svc" data-reveal style={{ ['--d' as string]: `${(i % 4) * 0.08}s` }}>
      <Slot id={s.card} images={images} icon={s.icon} alt={s.title} sizes="(max-width: 620px) 92vw, (max-width: 1200px) 46vw, 24vw" />
      <span className="svc-ico" aria-hidden><Icon /></span>
      <div className="svc-body">
        <h3 className="display">{s.title}</h3>
        <p>{s.short}</p>
      </div>
      <div className="svc-foot">
        <span className="svc-price">{s.priceFrom ? <>À partir de <b>{s.priceFrom}</b></> : 'Devis gratuit'}</span>
        <span className="link-arrow">Découvrir <ArrowRight /></span>
      </div>
    </Link>
  )
}

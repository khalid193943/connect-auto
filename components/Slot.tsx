import Image from 'next/image'
import { SLOTS, slotSrc } from '@/lib/images'
import { CATEGORY_ICONS, SERVICE_ICONS } from './icons'
import { ImageIcon } from 'lucide-react'

export const ILLUS: Record<string, string> = { voitures: 'voiture', utilitaires: 'utilitaire', camions: 'camion', motos: 'moto' }

/** Emplacement photo : affiche la photo si elle existe, sinon un visuel d’attente avec sa référence (IMG-xx). */
export function Slot({
  id, images, src, alt = '', icon, className, sizes = '100vw', priority, label, style, illus, soon,
}: {
  id?: string
  images?: Record<string, string>
  src?: string
  alt?: string
  icon?: string
  className?: string
  sizes?: string
  priority?: boolean
  label?: string
  style?: React.CSSProperties
  /** grande illustration SVG affichée tant que la photo manque (voiture, utilitaire, camion, moto) */
  illus?: string
  soon?: string
}) {
  const url = src ?? (id ? slotSrc(images, id) : undefined)
  const Icon = (icon && (SERVICE_ICONS[icon] || CATEGORY_ICONS[icon])) || null
  return (
    <div className={`slot ${className ?? ''}`} style={style}>
      {url ? (
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
      ) : illus ? (
        <div className="slot-illus">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/illus/${illus}.svg`} alt={alt} loading="lazy" />
          {soon && <span className="soon">{soon}</span>}
          {id && <span className="slot-tag"><b>{id}</b> {label ?? SLOTS.find((s) => s.id === id)?.label ?? 'Photo à venir'}</span>}
        </div>
      ) : (
        <div className="slot-ph" aria-hidden>
          {Icon ? <Icon /> : <ImageIcon strokeWidth={1.1} />}
          {id && (
            <span className="slot-tag">
              <b>{id}</b> {label ?? SLOTS.find((s) => s.id === id)?.label ?? 'Photo à venir'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

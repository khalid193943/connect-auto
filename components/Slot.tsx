import Image from 'next/image'
import { SLOTS, slotSrc } from '@/lib/images'
import { CATEGORY_ICONS, SERVICE_ICONS } from './icons'
import { ImageIcon } from 'lucide-react'

/** Emplacement photo : affiche la photo si elle existe, sinon un visuel d’attente avec sa référence (IMG-xx). */
export function Slot({
  id, images, src, alt = '', icon, className, sizes = '100vw', priority, label, style,
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
}) {
  const url = src ?? (id ? slotSrc(images, id) : undefined)
  const Icon = (icon && (SERVICE_ICONS[icon] || CATEGORY_ICONS[icon])) || null
  return (
    <div className={`slot ${className ?? ''}`} style={style}>
      {url ? (
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
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

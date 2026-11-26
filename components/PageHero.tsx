import Link from 'next/link'
import { JsonLd } from './JsonLd'
import { breadcrumbs } from '@/lib/schema'
import { Slot } from './Slot'

export function PageHero({
  crumbs, eyebrow, title = '', accent, lead, children, slot, images, icon, className,
}: {
  crumbs: { name: string; url: string }[]
  eyebrow?: string
  title?: string
  accent?: string
  lead?: string
  children?: React.ReactNode
  slot?: string
  images?: Record<string, string>
  icon?: string
  className?: string
}) {
  const all = [{ name: 'Accueil', url: '/' }, ...crumbs]
  return (
    <section className={`page-hero ${slot ? 'with-img' : ''} ${className ?? ''}`}>
      {slot && <Slot id={slot} images={images} icon={icon} priority alt="" />}
      <ol className="crumbs" aria-label="Fil d’Ariane">
        {all.map((c, i) => (
          <li key={c.url}>{i < all.length - 1 ? <Link href={c.url}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
      {eyebrow && <p className="eyebrow" data-hero>{eyebrow}</p>}
      {title && (
        <h1 className="display h1" style={{ fontSize: 'clamp(40px, 6.4vw, 124px)' }}>
          {title}
          {accent && <> <span className="accent">{accent}</span></>}
        </h1>
      )}
      {lead && <p className="lead">{lead}</p>}
      {children}
      <JsonLd data={breadcrumbs(all)} />
    </section>
  )
}

import Link from 'next/link'
import { JsonLd } from './JsonLd'
import { breadcrumbs } from '@/lib/schema'
import { Slot } from './Slot'
import { CarArt } from './Logo'

export function PageHero({
  crumbs, eyebrow, title = '', accent, lead, children, slot, images, icon, className, art, artNode,
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
  /** grande illustration à droite : voiture, utilitaire, camion, moto, ou 'logo' (la voiture du logo) */
  art?: string
  artNode?: React.ReactNode
}) {
  const all = [{ name: 'Accueil', url: '/' }, ...crumbs]
  return (
    <section className={`page-hero ${slot ? 'with-img' : ''} ${className ?? ''}`}>
      {slot && <Slot id={slot} images={images} icon={icon} priority alt="" />}
      {artNode && !slot && <div className="ph-art" aria-hidden>{artNode}</div>}
      {art && !slot && (
        <div className="ph-art" aria-hidden>
          {art === 'logo' ? <CarArt /> : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/illus/${art}.svg`} alt="" />
          )}
        </div>
      )}
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

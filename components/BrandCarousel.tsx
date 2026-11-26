import { BrandLogo } from './BrandLogo'
import { BRAND_LIST } from '@/lib/brands'

/**
 * Bandeau des marques, sobre : logos seuls, en défilement lent, fondus sur les bords.
 * Un logo envoyé depuis l’admin remplace celui du site V0.
 */
export function BrandCarousel({ logos, place = 'bottom' }: { logos: Record<string, string>; place?: 'top' | 'bottom' }) {
  const item = (b: (typeof BRAND_LIST)[number], k: string, hidden?: boolean) => (
    <li key={k} className="bmq-item" title={b.name} aria-hidden={hidden || undefined}>
      {logos[b.name] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logos[b.name]} alt="" loading="lazy" className="bmq-img" />
      ) : (
        <BrandLogo id={b.id} className="bmq-logo" />
      )}
      <span className="sr-only">{b.name}</span>
    </li>
  )
  return (
    <section className={`bmq bmq-${place}`} aria-label="Marques suivies : vente, entretien et réparation">
      <p className="bmq-label"><b>Toutes marques</b><i aria-hidden /> Vente · entretien · réparation</p>
      <div className="bmq-view">
        <ul className="bmq-track">
          {BRAND_LIST.map((b) => item(b, b.id))}
          {BRAND_LIST.map((b) => item(b, 'x' + b.id, true))}
        </ul>
      </div>
    </section>
  )
}

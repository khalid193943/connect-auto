import { BrandLogo } from './BrandLogo'
import { BRAND_LIST } from '@/lib/brands'

/** Carrousel des marques, sur toutes les pages. Un logo envoyé depuis l’admin remplace celui du site V0. */
export function BrandCarousel({ logos }: { logos: Record<string, string> }) {
  const item = (b: (typeof BRAND_LIST)[number], k: string, hidden?: boolean) => (
    <li key={k} className="bcar-item" aria-hidden={hidden || undefined}>
      {logos[b.name] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logos[b.name]} alt="" loading="lazy" className="bcar-img" />
      ) : (
        <BrandLogo id={b.id} className="bcar-logo" />
      )}
      <span>{b.name}</span>
    </li>
  )
  return (
    <section className="bcar" aria-label="Marques suivies : vente, entretien et réparation">
      <div className="bcar-head">
        <p>Toutes marques</p>
        <span>Vente · entretien · réparation</span>
      </div>
      <div className="bcar-view">
        <ul className="bcar-track">
          {BRAND_LIST.map((b) => item(b, b.id))}
          {BRAND_LIST.map((b) => item(b, 'x' + b.id, true))}
        </ul>
      </div>
    </section>
  )
}

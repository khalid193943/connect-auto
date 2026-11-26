import { Camera } from 'lucide-react'

const BACKDROP: Record<string, string> = {
  voitures: '/images/cat-voitures.webp',
  utilitaires: '/images/cat-utilitaires.webp',
  camions: '/images/cat-camions.webp',
  motos: '/images/cat-motos.webp',
}

/** Véhicule sans photo : fond studio flouté + marque et modèle, jamais une fausse photo du véhicule. */
export function NoPhoto({ brand, model, category, big }: { brand: string; model: string; category: string; big?: boolean }) {
  return (
    <div className={`nophoto ${big ? 'big' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BACKDROP[category] ?? BACKDROP.utilitaires} alt="" aria-hidden loading="lazy" />
      <span className="nophoto-txt">
        <small>{brand}</small>
        <b>{model}</b>
        <em><Camera /> Photos sur demande</em>
      </span>
    </div>
  )
}

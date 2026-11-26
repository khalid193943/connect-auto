import type { Vehicle } from './types'

/**
 * Photos d’illustration par modèle (projet Connect-Auto-V0). Elles ne montrent PAS le véhicule vendu :
 * elles s’affichent avec la mention « Photo d’illustration » tant que les vraies photos ne sont pas ajoutées.
 */
const MODELS: { test: (v: Vehicle) => boolean; src: string }[] = [
  { test: (v) => v.brand === 'Peugeot' && v.model === '2008', src: '/images/veh-2008.webp' },
  { test: (v) => v.brand === 'Renault' && /master/i.test(v.model) && /benne|plateau/i.test(`${v.version} ${v.extra ?? ''}`), src: '/images/veh-master-benne.webp' },
  { test: (v) => v.brand === 'Renault' && /master/i.test(v.model) && v.year >= 2019, src: '/images/veh-master.webp' },
  { test: (v) => v.brand === 'Nissan' && /primastar/i.test(v.model), src: '/images/veh-primastar.webp' },
  { test: (v) => v.brand === 'Ford' && /custom/i.test(v.model), src: '/images/veh-transit-custom.webp' },
  { test: (v) => /citro/i.test(v.brand) && /berlingo/i.test(v.model), src: '/images/veh-berlingo.webp' },
]

export type VehiclePicture = { src: string; illustrative: boolean } | null

export function vehiclePicture(v: Vehicle): VehiclePicture {
  if (v.photos[0]) return { src: v.photos[0], illustrative: false }
  const m = MODELS.find((x) => x.test(v))
  return m ? { src: m.src, illustrative: true } : null
}

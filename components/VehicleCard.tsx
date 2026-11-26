import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Vehicle } from '@/lib/types'
import { eur, km, priceHT } from '@/lib/format'
import { Slot } from './Slot'
import { NoPhoto } from './NoPhoto'
import { vehiclePicture } from '@/lib/vehicle-photos'

export const vehicleHref = (v: Vehicle) => `/occasions/${v.category}/${v.slug}`
export const vehicleName = (v: Vehicle) => `${v.brand} ${v.model}`

export function StatusTag({ v }: { v: Vehicle }) {
  if (v.status === 'vendu') return <span className="tag sold">Vendu</span>
  if (v.status === 'reserve') return <span className="tag warn">Réservé</span>
  return null
}

export function VehicleCard({ v, priority }: { v: Vehicle; priority?: boolean }) {
  const pic = vehiclePicture(v)
  return (
    <Link href={vehicleHref(v)} className="veh">
      <div className="veh-tags">
        <StatusTag v={v} />
        {v.vatRecoverable && v.status === 'disponible' && <span className="tag green">TVA récupérable</span>}
        {v.demo && <span className="tag ghost">Annonce exemple</span>}
      </div>
      {pic?.illustrative && <span className="illus-badge">Photo d’illustration</span>}
      {pic ? (
        <Slot src={pic.src} alt={`${vehicleName(v)} ${v.version} ${v.year}`} sizes="(max-width: 640px) 90vw, (max-width: 1200px) 45vw, 25vw" priority={priority} />
      ) : (
        <div className="slot"><NoPhoto brand={v.brand} model={v.model} category={v.category} /></div>
      )}
      <div className="veh-body">
        <div className="veh-title">
          <b>{vehicleName(v)}</b>
          <span>{v.version}</span>
        </div>
        <div className="veh-specs">
          <span>{v.year}</span>
          <span>{km(v.km)}</span>
          <span>{v.fuel}</span>
          <span>{v.gearbox === 'Automatique' ? 'Auto' : 'Manuelle'}</span>
        </div>
        <div className="veh-foot">
          <div>
            <div className="veh-price num">{eur(v.price)}</div>
            {v.vatRecoverable && <div className="veh-ht num">{eur(priceHT(v.price))} HT</div>}
          </div>
          <span className="veh-arrow" aria-hidden><ArrowUpRight /></span>
        </div>
      </div>
    </Link>
  )
}

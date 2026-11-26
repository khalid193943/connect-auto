import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Lead, Vehicle } from '@/lib/types'
import { CATEGORY_ICONS } from '@/components/icons'
import { eur, km } from '@/lib/format'

export const LEAD_TYPE: Record<Lead['type'], string> = { reprise: 'Reprise', rdv: 'Rendez-vous / devis', contact: 'Contact', vehicule: 'Intérêt véhicule' }
export const LEAD_STATUS: Record<Lead['status'], [string, string]> = { nouvelle: ['Nouvelle', 'red'], en_cours: ['En cours', 'orange'], traitee: ['Traitée', 'green'] }
export const V_STATUS: Record<Vehicle['status'], [string, string]> = { disponible: ['En vente', 'green'], reserve: ['Réservé', 'orange'], vendu: ['Vendu', 'grey'] }

export function Back({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="back"><ChevronLeft /> {label}</Link>
}

export function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `il y a ${Math.max(1, m)} min`
  const h = Math.round(m / 60)
  if (h < 24) return `il y a ${h} h`
  const d = Math.round(h / 24)
  if (d < 7) return `il y a ${d} j`
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', timeZone: 'Europe/Paris' })
}

export function VehicleRow({ v }: { v: Vehicle }) {
  const Icon = CATEGORY_ICONS[v.category]
  const [label, color] = V_STATUS[v.status]
  return (
    <Link href={`/admin/vehicules/${v.id}`} className="row">
      <span className="thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {v.photos[0] ? <img src={v.photos[0]} alt="" /> : <Icon />}
      </span>
      <span className="main">
        <b>{v.brand} {v.model}</b>
        <span>{v.year} · {km(v.km)} · {v.ref}{!v.visible ? ' · masqué' : ''}{v.demo ? ' · exemple' : ''}</span>
      </span>
      <span className="end">
        <b className="num">{eur(v.price)}</b>
        <span className={`pill ${color}`}>{label}</span>
      </span>
      <ChevronRight className="chev" />
    </Link>
  )
}

export function LeadRow({ l }: { l: Lead }) {
  const [label, color] = LEAD_STATUS[l.status]
  return (
    <Link href={`/admin/demandes/${l.id}`} className={`row ${l.status === 'nouvelle' ? 'unread' : ''}`}>
      <span className="main">
        <b>{l.name}</b>
        <span>{LEAD_TYPE[l.type]} · {l.fields['Véhicule'] || l.fields['Marque et modèle'] || l.fields['Prestation'] || l.fields['Prestations'] || l.message || l.phone}</span>
      </span>
      <span className="end">
        <span className="small" style={{ color: 'var(--a-muted)' }}>{ago(l.createdAt)}</span>
        <span className={`pill ${color}`}>{label}</span>
      </span>
      <ChevronRight className="chev" />
    </Link>
  )
}

import Link from 'next/link'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import type { Service, Settings } from '@/lib/types'
import { CATEGORIES, DAYS, DAY_ORDER, NEARBY } from '@/lib/site'
import { telHref, waHref } from '@/lib/format'
import { fmtDay } from '@/lib/hours'
import { Logo } from './Logo'

export function Footer({ s, services }: { s: Settings; services: Service[] }) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Connect Auto ${s.street} ${s.zip} ${s.city}`)}`
  return (
    <footer className="ftr">
      <div className="ftr-top">
        <div className="ftr-brand">
          <Logo variant="compact" tone="dark" />
          <p className="muted small" style={{ margin: 0 }}>
            Garage indépendant à Milhaud, près de Nîmes : vente et reprise de véhicules d’occasion, entretien, mécanique,
            carrosserie et pneus.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a className="btn btn-sm" href={telHref(s.phone)}><Phone /> {s.phone}</a>
            <a className="btn btn-sm" href={waHref(s.whatsapp)} target="_blank" rel="noopener"><MessageCircle /> WhatsApp</a>
          </div>
        </div>
        <div>
          <h4>Occasions</h4>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.key}><Link href={`/occasions/${c.key}`}>{c.label} d’occasion</Link></li>
            ))}
            <li><Link href="/reprise">Reprise de votre véhicule</Link></li>
          </ul>
        </div>
        <div>
          <h4>Atelier</h4>
          <ul>
            {services.map((sv) => (
              <li key={sv.slug}><Link href={`/services/${sv.slug}`}>{sv.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Nous trouver</h4>
          <ul>
            <li>
              <a href={maps} target="_blank" rel="noopener" style={{ display: 'flex', gap: 8 }}>
                <MapPin size={18} style={{ color: 'var(--accent)', flex: 'none', marginTop: 3 }} />
                <span>{s.street}<br />{s.zip} {s.city}</span>
              </a>
            </li>
            {DAY_ORDER.map((d) => (
              <li key={d} className="small" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span className="muted">{DAYS[Number(d)].slice(0, 3)}.</span>
                <span>{fmtDay(s.hours[d])}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="ftr-seo">
        Connect Auto accueille les automobilistes et les professionnels de {NEARBY.slice(0, 12).join(', ')} et de tout le Gard :
        voitures, utilitaires, camions et motos d’occasion, reprise de véhicules, entretien et réparation toutes marques.
      </p>
      <div className="ftr-logo" aria-hidden><Logo variant="full" tone="dark" label="" /></div>
      <div className="ftr-bottom">
        <span>© {new Date().getFullYear()} {s.legal.company} · SIRET {s.legal.siret}</span>
        <nav aria-label="Informations légales">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/admin">Espace garage</Link>
        </nav>
      </div>
    </footer>
  )
}

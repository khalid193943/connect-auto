'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, ExternalLink, FileText, Home, Inbox, MonitorSmartphone, Settings } from 'lucide-react'
import { Logo } from '@/components/Logo'

const SITE = ['/admin/site', '/admin/textes', '/admin/services', '/admin/tarifs', '/admin/photos', '/admin/avis', '/admin/marques']
const DOCS = ['/admin/documents', '/admin/clients']
const SETTINGS = ['/admin/reglages', '/admin/compte', '/admin/equipe', '/admin/registre']

/** Ordinateur : barre latérale. Téléphone : bandeau en haut + 5 onglets en bas. */
export function AdminNav({ newLeads, name, role, demo, perms }: { newLeads: number; name: string; role: string; demo: boolean; perms: string[] }) {
  const p = usePathname()
  const under = (xs: string[]) => xs.some((x) => p.startsWith(x))
  const items = [
    { href: '/admin', label: 'Accueil', icon: Home, on: p === '/admin' },
    { href: '/admin/vehicules', label: 'Véhicules', icon: Car, on: p.startsWith('/admin/vehicules'), sec: 'vehicules' },
    { href: '/admin/demandes', label: 'Demandes', icon: Inbox, on: p.startsWith('/admin/demandes'), badge: newLeads, sec: 'demandes' },
    { href: '/admin/documents', label: 'Devis & factures', short: 'Factures', icon: FileText, on: under(DOCS), sec: 'documents' },
    { href: '/admin/site', label: 'Mon site', icon: MonitorSmartphone, on: under(SITE), sec: 'site' },
  ].filter((t) => !t.sec || perms.includes(t.sec))
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <>
      <aside className="side" aria-label="Menu de l’espace garage">
        <Link href="/admin" className="side-logo" aria-label="Accueil de l’espace garage"><Logo id="sidelogo" /></Link>
        {demo && <span className="side-demo">Démo · rien n’est enregistré</span>}
        <nav className="side-nav">
          {items.map((t) => (
            <Link key={t.href} href={t.href} className={t.on ? 'on' : undefined}>
              <t.icon />
              <span>{t.label}</span>
              {t.badge ? <em>{t.badge}</em> : null}
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <a href="/" target="_blank" className="side-site"><ExternalLink /> Voir le site</a>
          <Link href="/admin/reglages" className={`side-me ${under(SETTINGS) ? 'on' : ''}`}>
            <span className="av">{initial}</span>
            <span className="who"><b>{name}</b><small>{role === 'gerant' ? 'Gérant' : 'Équipe'} · Réglages</small></span>
            <Settings className="cog" />
          </Link>
        </div>
      </aside>

      <header className="mtop">
        <Link href="/admin" className="mtop-logo" aria-label="Accueil"><Logo id="mtoplogo" /></Link>
        {demo && <span className="mtop-demo">Démo</span>}
        <Link href="/admin/reglages" className={`av ${under(SETTINGS) ? 'on' : ''}`} aria-label="Réglages et compte">{initial}</Link>
      </header>

      <nav className="mbar" aria-label="Menu" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((t) => (
          <Link key={t.href} href={t.href} className={t.on ? 'on' : undefined}>
            <span className="ic"><t.icon />{t.badge ? <em>{t.badge}</em> : null}</span>
            <span>{t.short ?? t.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

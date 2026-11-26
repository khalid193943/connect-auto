'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookLock, Camera, Car, FileText, Home, Inbox, KeyRound, LayoutGrid, MessageSquareQuote, PencilLine, Tags, Users, UserRound, Wrench, ExternalLink } from 'lucide-react'

/** Téléphone : barre d’onglets en bas. Ordinateur : menu complet à gauche. */
export function TabBar({ newLeads, manager }: { newLeads: number; manager: boolean }) {
  const p = usePathname()
  const on = (x: string) => (x === '/admin' ? p === '/admin' : p.startsWith(x))
  const tabs = [
    { href: '/admin', label: 'Accueil', icon: Home },
    { href: '/admin/vehicules', label: 'Véhicules', icon: Car },
    { href: '/admin/demandes', label: 'Demandes', icon: Inbox, badge: newLeads },
    { href: '/admin/documents', label: 'Devis·Fact.', long: 'Devis & factures', icon: FileText },
  ]
  const more = [
    { href: '/admin/clients', label: 'Clients', icon: UserRound },
    { href: '/admin/services', label: 'Services', icon: Wrench },
    { href: '/admin/tarifs', label: 'Tarifs', icon: Tags },
    { href: '/admin/textes', label: 'Textes & horaires', icon: PencilLine },
    { href: '/admin/photos', label: 'Photos du site', icon: Camera },
    { href: '/admin/avis', label: 'Avis clients', icon: MessageSquareQuote },
    { href: '/admin/registre', label: 'Registre des achats', icon: BookLock },
    ...(manager ? [{ href: '/admin/equipe', label: 'Équipe', icon: Users }] : []),
    { href: '/admin/compte', label: 'Mon compte', icon: KeyRound },
  ]
  const moreOn = p.startsWith('/admin/plus') || more.some((m) => on(m.href) && m.href !== '/admin/clients')
  return (
    <nav className="tabbar" aria-label="Menu de l’espace garage">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={on(t.href) || (t.href === '/admin/documents' && on('/admin/clients')) ? 'on' : undefined}>
          <t.icon />
          <span className="lbl-m">{t.label}</span>
          <span className="lbl-d">{t.long ?? t.label}</span>
          {t.badge ? <span className="badge">{t.badge}</span> : null}
        </Link>
      ))}
      <Link href="/admin/plus" className={`mob ${moreOn ? 'on' : ''}`}>
        <LayoutGrid />
        Plus
      </Link>
      <span className="desk sep">Gestion</span>
      {more.map((m) => (
        <Link key={m.href} href={m.href} className={`desk ${on(m.href) ? 'on' : ''}`}>
          <m.icon />
          <span>{m.label}</span>
        </Link>
      ))}
      <a href="/" target="_blank" className="desk"><ExternalLink /><span>Voir le site</span></a>
    </nav>
  )
}

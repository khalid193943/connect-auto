'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, FileText, Home, Inbox, LayoutGrid } from 'lucide-react'

export function TabBar({ newLeads }: { newLeads: number }) {
  const p = usePathname()
  const tabs = [
    { href: '/admin', label: 'Accueil', icon: Home, on: p === '/admin' },
    { href: '/admin/vehicules', label: 'Véhicules', icon: Car, on: p.startsWith('/admin/vehicules') },
    { href: '/admin/demandes', label: 'Demandes', icon: Inbox, on: p.startsWith('/admin/demandes'), badge: newLeads },
    { href: '/admin/documents', label: 'Devis·Fact.', icon: FileText, on: p.startsWith('/admin/documents') || p.startsWith('/admin/clients') },
    { href: '/admin/plus', label: 'Plus', icon: LayoutGrid, on: ['/admin/plus', '/admin/services', '/admin/tarifs', '/admin/textes', '/admin/photos', '/admin/avis', '/admin/equipe', '/admin/registre', '/admin/compte', '/admin/coordonnees'].some((x) => p.startsWith(x)) },
  ]
  return (
    <nav className="tabbar" aria-label="Menu de l’espace garage">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={t.on ? 'on' : undefined}>
          <t.icon />
          {t.label}
          {t.badge ? <span className="badge">{t.badge}</span> : null}
        </Link>
      ))}
    </nav>
  )
}

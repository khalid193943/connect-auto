import Link from 'next/link'
import { BookLock, Camera, ChevronRight, DatabaseBackup, KeyRound, MessageSquareQuote, PencilLine, Tags, Users, Wrench, Clock } from 'lucide-react'
import { requireSession } from '@/lib/auth'

export default async function Plus() {
  const me = await requireSession()
  const items = [
    { href: '/admin/services', icon: Wrench, t: 'Services', d: 'Textes, prix « à partir de », afficher ou masquer' },
    { href: '/admin/tarifs', icon: Tags, t: 'Tarifs', d: 'Taux horaires et prix affichés' },
    { href: '/admin/textes', icon: PencilLine, t: 'Textes du site', d: 'Accueil, présentation, bandeau d’information' },
    { href: '/admin/textes#horaires', icon: Clock, t: 'Coordonnées & horaires', d: 'Téléphone, WhatsApp, adresse, horaires' },
    { href: '/admin/photos', icon: Camera, t: 'Photos du site', d: 'Bandeaux, catégories, services' },
    { href: '/admin/avis', icon: MessageSquareQuote, t: 'Avis clients', d: 'Note Google et avis affichés' },
    { href: '/admin/registre', icon: BookLock, t: 'Registre des achats', d: 'Livre de police, export' },
    ...(me.role === 'gerant' ? [{ href: '/admin/equipe', icon: Users, t: 'Équipe', d: 'Les 6 comptes d’accès' }] : []),
    ...(me.role === 'gerant' ? [{ href: '/api/admin/export', icon: DatabaseBackup, t: 'Sauvegarde', d: 'Télécharger toutes les données' }] : []),
    { href: '/admin/compte', icon: KeyRound, t: 'Mon compte', d: 'Mot de passe, déconnexion' },
  ]
  return (
    <main className="adm-main">
      <h1>Plus</h1>
      <div className="card flat">
        <div className="rows">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="row" prefetch={!i.href.startsWith('/api')}>
              <span className="thumb" style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--a-acc-bg)', color: 'var(--a-acc)' }}><i.icon /></span>
              <span className="main"><b>{i.t}</b><span>{i.d}</span></span>
              <ChevronRight className="chev" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

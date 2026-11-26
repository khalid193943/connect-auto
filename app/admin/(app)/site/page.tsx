import { Award, Camera, Clock, MessageSquareQuote, PencilLine, Tags, Wrench, ExternalLink } from 'lucide-react'
import { Hub } from '@/components/admin/Hub'

export default function MonSite() {
  return (
    <main className="adm-main">
      <div className="adm-head">
        <div>
          <h1>Mon site</h1>
          <p className="sub">Tout ce que voient les visiteurs. Chaque modification est en ligne aussitôt.</p>
        </div>
        <a href="/" target="_blank" className="b sm"><ExternalLink /> Voir le site</a>
      </div>
      <Hub
        items={[
          { href: '/admin/textes', icon: PencilLine, t: 'Textes', d: 'Titre d’accueil, présentation, bandeau d’info' },
          { href: '/admin/textes#horaires', icon: Clock, t: 'Coordonnées & horaires', d: 'Téléphone, WhatsApp, adresse, horaires' },
          { href: '/admin/services', icon: Wrench, t: 'Services', d: 'Les 8 services de l’atelier' },
          { href: '/admin/tarifs', icon: Tags, t: 'Tarifs', d: 'Prix affichés sur la page Tarifs' },
          { href: '/admin/photos', icon: Camera, t: 'Photos', d: 'Accueil, services, avant / après' },
          { href: '/admin/avis', icon: MessageSquareQuote, t: 'Avis clients', d: 'Note Google et avis affichés' },
          { href: '/admin/marques', icon: Award, t: 'Logos des marques', d: 'Bandeau « Toutes marques »' },
        ]}
      />
    </main>
  )
}

import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'

export type HubItem = { href: string; icon: LucideIcon; t: string; d: string; external?: boolean }

/** Liste de rubriques (Mon site, Réglages) : grille sur ordinateur, liste sur téléphone. */
export function Hub({ items }: { items: HubItem[] }) {
  return (
    <div className="hub">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="hub-item" prefetch={!i.external}>
          <span className="hub-ic"><i.icon /></span>
          <span className="hub-tx"><b>{i.t}</b><small>{i.d}</small></span>
          <ChevronRight className="chev" />
        </Link>
      ))}
    </div>
  )
}

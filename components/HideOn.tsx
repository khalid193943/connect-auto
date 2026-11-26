'use client'
import { usePathname } from 'next/navigation'

/** N’affiche pas son contenu sur les pages indiquées (ex. l’accueil, qui a déjà le bandeau en haut). */
export function HideOn({ paths, children }: { paths: string[]; children: React.ReactNode }) {
  const p = usePathname()
  return paths.includes(p) ? null : <>{children}</>
}

import { requirePerm } from '@/lib/auth'

/** Partie réservée aux comptes autorisés pour « demandes ». */
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requirePerm('demandes')
  return children
}

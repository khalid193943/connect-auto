import { requirePerm } from '@/lib/auth'

/** Partie réservée aux comptes autorisés pour « vehicules ». */
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requirePerm('vehicules')
  return children
}

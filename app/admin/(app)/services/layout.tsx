import { requirePerm } from '@/lib/auth'

/** Partie réservée aux comptes autorisés pour « site ». */
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requirePerm('site')
  return children
}

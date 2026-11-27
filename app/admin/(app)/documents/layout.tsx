import { requirePerm } from '@/lib/auth'

/** Partie réservée aux comptes autorisés pour « documents ». */
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requirePerm('documents')
  return children
}

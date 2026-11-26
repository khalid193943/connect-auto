import Link from 'next/link'
import { requireSession } from '@/lib/auth'
import { HAS_DB, list } from '@/lib/store'
import { LogoWord } from '@/components/Logo'
import { TabBar } from '@/components/admin/TabBar'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const me = await requireSession()
  const leads = await list('leads')
  const fresh = leads.filter((l) => l.status === 'nouvelle').length
  return (
    <>
      <header className="adm-top">
        <Link href="/admin" className="logo" aria-label="Accueil de l’espace garage"><LogoWord id="admlogo" /></Link>
        {!HAS_DB && <span className="demo">Démo</span>}
        <Link href="/admin/compte" className="who">{me.name}</Link>
      </header>
      {children}
      <TabBar newLeads={fresh} />
    </>
  )
}

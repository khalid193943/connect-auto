import { requireSession } from '@/lib/auth'
import { HAS_DB, list } from '@/lib/store'
import { AdminNav } from '@/components/admin/Nav'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const me = await requireSession()
  const leads = await list('leads')
  const fresh = leads.filter((l) => l.status === 'nouvelle').length
  return (
    <div className="shell">
      <AdminNav newLeads={fresh} name={me.name} role={me.role} demo={!HAS_DB} perms={me.perms ?? []} />
      <div className="content">{children}</div>
    </div>
  )
}

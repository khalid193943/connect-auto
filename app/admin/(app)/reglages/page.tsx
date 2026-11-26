import { BookLock, DatabaseBackup, KeyRound, LogOut, Users } from 'lucide-react'
import { requireSession } from '@/lib/auth'
import { Hub } from '@/components/admin/Hub'
import { BlobCheck } from '@/components/admin/BlobCheck'
import { logoutAction } from '../../actions'

export default async function Reglages() {
  const me = await requireSession()
  const manager = me.role === 'gerant'
  return (
    <main className="adm-main">
      <div className="me-card">
        <span className="av">{me.name.trim().charAt(0).toUpperCase()}</span>
        <span><b>{me.name}</b><small>Identifiant « {me.login} » · {manager ? 'Gérant' : 'Équipe'}</small></span>
      </div>
      <Hub
        items={[
          { href: '/admin/compte', icon: KeyRound, t: 'Mot de passe', d: 'Changer mon mot de passe' },
          { href: '/admin/registre', icon: BookLock, t: 'Registre des achats', d: 'Livre de police, export CSV' },
          ...(manager ? [{ href: '/admin/equipe', icon: Users, t: 'Équipe', d: 'Jusqu’à 6 comptes d’accès' }] : []),
          ...(manager ? [{ href: '/api/admin/export', icon: DatabaseBackup, t: 'Sauvegarde', d: 'Télécharger toutes les données', external: true }] : []),
        ]}
      />
      <BlobCheck />
      <form action={logoutAction}><button className="b full ghost"><LogOut /> Se déconnecter</button></form>
    </main>
  )
}

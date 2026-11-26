import { LogOut } from 'lucide-react'
import { requireSession } from '@/lib/auth'
import { Back } from '@/components/admin/ui'
import { ActionForm } from '@/components/admin/ActionForm'
import { changePassword, logoutAction } from '../../actions'

export default async function Compte() {
  const me = await requireSession()
  return (
    <main className="adm-main">
      <Back href="/admin/plus" label="Plus" />
      <h1>Mon compte</h1>
      <p className="sub">{me.name} · identifiant « {me.login} » · {me.role === 'gerant' ? 'Gérant' : 'Équipe'}</p>
      <div className="card">
        <h2>Changer mon mot de passe</h2>
        <ActionForm action={changePassword} label="Changer" sticky={false}>
          <label className="f"><span>Nouveau mot de passe</span><input name="p1" type="password" autoComplete="new-password" /></label>
          <label className="f"><span>Encore une fois</span><input name="p2" type="password" autoComplete="new-password" /></label>
        </ActionForm>
      </div>
      <div className="card">
        <h2>Astuce</h2>
        <p className="hint">Sur votre téléphone, ouvrez le menu du navigateur puis « Ajouter à l’écran d’accueil » : l’espace garage s’ouvrira comme une application.</p>
      </div>
      <form action={logoutAction}><button className="b full"><LogOut /> Se déconnecter</button></form>
    </main>
  )
}

import { requireSession } from '@/lib/auth'
import { Back } from '@/components/admin/ui'
import { ActionForm } from '@/components/admin/ActionForm'
import { changePassword } from '../../actions'

export default async function Compte() {
  const me = await requireSession()
  return (
    <main className="adm-main">
      <Back href="/admin/reglages" label="Réglages" />
      <h1>Mot de passe</h1>
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
    </main>
  )
}

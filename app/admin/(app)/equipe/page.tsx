import { requireManager } from '@/lib/auth'
import { list } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { ActionForm } from '@/components/admin/ActionForm'
import { saveUser } from '../../actions'

export default async function Equipe() {
  const me = await requireManager()
  const users = (await list('users')).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return (
    <main className="adm-main">
      <Back href="/admin/reglages" label="Réglages" />
      <h1>Équipe</h1>
      <p className="sub">{users.length}/6 comptes. Le gérant voit tout ; un compte « équipe » ne gère ni les comptes ni les informations légales.</p>
      {users.map((u) => (
        <details key={u.id} className="card">
          <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
            <span><b>{u.name}</b> <span className="hint">· {u.login}</span></span>
            <span style={{ display: 'flex', gap: 6 }}>
              <span className={`pill ${u.role === 'gerant' ? 'blue' : 'grey'}`}>{u.role === 'gerant' ? 'Gérant' : 'Équipe'}</span>
              {!u.active && <span className="pill red">Désactivé</span>}
            </span>
          </summary>
          <ActionForm action={saveUser} sticky={false}>
            <input type="hidden" name="id" value={u.id} />
            <div className="grid2">
              <label className="f"><span>Prénom</span><input name="name" defaultValue={u.name} /></label>
              <label className="f"><span>Identifiant</span><input name="login" defaultValue={u.login} autoCapitalize="none" /></label>
            </div>
            <label className="f"><span>Nouveau mot de passe</span><small>Laissez vide pour ne pas le changer</small><input name="password" type="password" autoComplete="new-password" /></label>
            {u.id !== me.uid && (
              <>
                <div className="choice" style={{ ['--n' as string]: 2 }}>
                  <label><input type="radio" name="role" value="equipe" defaultChecked={u.role === 'equipe'} /><span>Équipe</span></label>
                  <label><input type="radio" name="role" value="gerant" defaultChecked={u.role === 'gerant'} /><span>Gérant</span></label>
                </div>
                <label className="toggle"><span className="t"><b>Compte actif</b><small>Désactivez pour bloquer l’accès</small></span><input type="checkbox" name="active" defaultChecked={u.active} /></label>
              </>
            )}
          </ActionForm>
        </details>
      ))}
      {users.length < 6 && (
        <div className="card">
          <h2>Ajouter une personne</h2>
          <ActionForm action={saveUser} label="Créer le compte" sticky={false}>
            <div className="grid2">
              <label className="f"><span>Prénom</span><input name="name" /></label>
              <label className="f"><span>Identifiant</span><input name="login" autoCapitalize="none" placeholder="ex. karim" /></label>
            </div>
            <label className="f"><span>Mot de passe</span><input name="password" type="password" autoComplete="new-password" /></label>
            <div className="choice" style={{ ['--n' as string]: 2 }}>
              <label><input type="radio" name="role" value="equipe" defaultChecked /><span>Équipe</span></label>
              <label><input type="radio" name="role" value="gerant" /><span>Gérant</span></label>
            </div>
          </ActionForm>
        </div>
      )}
    </main>
  )
}

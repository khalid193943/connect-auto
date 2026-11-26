'use client'
import { useActionState } from 'react'
import { Loader2, LogIn } from 'lucide-react'
import { loginAction } from '../actions'

export function LoginForm({ demo, noUser }: { demo: { login: string; password: string } | null; noUser: boolean }) {
  const [state, run, pending] = useActionState(loginAction, { ok: false })
  return (
    <form action={run}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src="/brand/logo-dark.svg" alt="Connect Auto" />
      <h1 style={{ textAlign: 'center', fontSize: 22 }}>Espace garage</h1>
      {demo && (
        <p className="banner info" style={{ margin: 0 }}>
          <span>Version de démonstration : identifiant <b>{demo.login}</b>, mot de passe <b>{demo.password}</b>. Les modifications ne sont pas conservées.</span>
        </p>
      )}
      {noUser && <p className="banner warn" style={{ margin: 0 }}>Ajoutez la variable ADMIN_PASSWORD dans Vercel pour créer le premier compte.</p>}
      <label className="f"><span>Identifiant</span><input name="login" autoComplete="username" autoCapitalize="none" defaultValue={demo?.login} required /></label>
      <label className="f"><span>Mot de passe</span><input name="password" type="password" autoComplete="current-password" required /></label>
      {state.msg && <p className="banner warn" role="alert" style={{ margin: 0 }}>{state.msg}</p>}
      <button className="b pri full" disabled={pending}>{pending ? <Loader2 className="spin-ico" /> : <LogIn />} Se connecter</button>
      <a href="/" className="hint" style={{ textAlign: 'center' }}>← Retour au site</a>
    </form>
  )
}

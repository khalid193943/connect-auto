import { redirect } from 'next/navigation'
import { getSession, DEMO_LOGIN, findUsers } from '@/lib/auth'
import { HAS_DB } from '@/lib/store'
import { LoginForm } from './LoginForm'
import { Logo } from '@/components/Logo'

export const dynamic = 'force-dynamic'

export default async function Connexion() {
  if (await getSession()) redirect('/admin')
  const users = await findUsers()
  return (
    <div className="login">
      <div className="login-logo"><Logo id="loginlogo" /></div>
      <LoginForm demo={HAS_DB ? null : DEMO_LOGIN} noUser={HAS_DB && users.length === 0} />
    </div>
  )
}

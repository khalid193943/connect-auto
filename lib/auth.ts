import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { createHash } from 'node:crypto'
import { HAS_DB, list, put } from './store'
import type { AdminSection, User } from './types'

const COOKIE = 'ca_session'
const secretKey = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET ||
      createHash('sha256').update('connect-auto|' + (process.env.DATABASE_URL || process.env.POSTGRES_URL || 'demo')).digest('hex'),
  )

export interface Session { uid: string; name: string; role: User['role']; login: string; perms?: AdminSection[] }

export const DEMO_LOGIN = { login: 'fouad', password: 'demo' }

export async function findUsers(): Promise<User[]> {
  let users = await list('users')
  if (users.length === 0) {
    const pwd = HAS_DB ? process.env.ADMIN_PASSWORD : DEMO_LOGIN.password
    if (!pwd) return []
    const first: User = {
      id: 'u-fouad', login: 'fouad', name: 'Fouad', role: 'gerant',
      passwordHash: await bcrypt.hash(pwd, 10), active: true, createdAt: new Date().toISOString(),
    }
    await put('users', first)
    users = [first]
  }
  return users
}

export async function login(loginName: string, password: string): Promise<Session | null> {
  const users = await findUsers()
  const u = users.find((x) => x.active && x.login.toLowerCase() === loginName.trim().toLowerCase())
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return null
  const session: Session = { uid: u.id, name: u.name, role: u.role, login: u.login }
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('60d')
    .sign(secretKey())
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 60,
  })
  return session
}

export async function logout() {
  ;(await cookies()).delete(COOKIE)
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return { uid: String(payload.uid), name: String(payload.name), role: payload.role as User['role'], login: String(payload.login) }
  } catch {
    return null
  }
}

export const ALL_SECTIONS: AdminSection[] = ['vehicules', 'demandes', 'documents', 'site']
export const SECTION_LABELS: Record<AdminSection, string> = { vehicules: 'Véhicules', demandes: 'Demandes', documents: 'Devis & factures', site: 'Mon site' }

export async function requireSession(): Promise<Session> {
  const s = await getSession()
  if (!s) redirect('/admin/connexion')
  const users = await findUsers()
  const u = users.find((x) => x.id === s.uid)
  if (!u || !u.active) redirect('/admin/connexion')
  const perms = u.role === 'gerant' ? ALL_SECTIONS : (u.perms?.length ? u.perms : ALL_SECTIONS)
  return { ...s, name: u.name, role: u.role, perms }
}

/** Le compte peut-il utiliser cette partie de l’espace garage ? (le gérant peut tout) */
export const can = (s: Session, sec: AdminSection) => s.role === 'gerant' || (s.perms ?? ALL_SECTIONS).includes(sec)

/** Bloque une page ou une action réservée à une partie de l’espace garage. */
export async function requirePerm(sec: AdminSection): Promise<Session> {
  const s = await requireSession()
  if (!can(s, sec)) redirect('/admin')
  return s
}

export async function requireManager(): Promise<Session> {
  const s = await requireSession()
  if (s.role !== 'gerant') redirect('/admin')
  return s
}

export const hashPassword = (p: string) => bcrypt.hash(p, 10)

/** Pour les routes API (sans redirection) : la session active a-t-elle accès à cette partie ? */
export async function sessionCan(sec: AdminSection): Promise<boolean> {
  const s = await getSession()
  if (!s) return false
  const u = (await findUsers()).find((x) => x.id === s.uid)
  if (!u || !u.active) return false
  return u.role === 'gerant' || !u.perms?.length || u.perms.includes(sec)
}

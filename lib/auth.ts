import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { createHash } from 'node:crypto'
import { HAS_DB, list, put } from './store'
import type { User } from './types'

const COOKIE = 'ca_session'
const secretKey = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET ||
      createHash('sha256').update('connect-auto|' + (process.env.DATABASE_URL || process.env.POSTGRES_URL || 'demo')).digest('hex'),
  )

export interface Session { uid: string; name: string; role: User['role']; login: string }

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

export async function requireSession(): Promise<Session> {
  const s = await getSession()
  if (!s) redirect('/admin/connexion')
  const users = await findUsers()
  const u = users.find((x) => x.id === s.uid)
  if (!u || !u.active) redirect('/admin/connexion')
  return { ...s, name: u.name, role: u.role }
}

export async function requireManager(): Promise<Session> {
  const s = await requireSession()
  if (s.role !== 'gerant') redirect('/admin')
  return s
}

export const hashPassword = (p: string) => bcrypt.hash(p, 10)

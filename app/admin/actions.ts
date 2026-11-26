'use server'
import { revalidatePath } from 'next/cache'
import { isStoredUrl } from '@/lib/blob'
import { redirect } from 'next/navigation'
import { get, list, newId, nextNumber, put, remove } from '@/lib/store'
import { hashPassword, login, logout, requireManager, requireSession } from '@/lib/auth'
import { docNumber, isLocked } from '@/lib/docs'
import { slugify } from '@/lib/format'
import type { Category, Client, Doc, DocLine, DocStatus, DocType, Lead, PriceItem, Review, Service, Settings, User, Vehicle, VehicleStatus } from '@/lib/types'
import { SEED_SETTINGS } from '@/lib/seed'

export type R = { ok: boolean; msg?: string; id?: string }

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? '').trim().slice(0, max)
const numv = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? '').replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '')
  return v === '' ? undefined : Number(v)
}
const bool = (fd: FormData, k: string) => fd.get(k) === 'on' || fd.get(k) === '1' || fd.get(k) === 'true'
const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean)
const refreshSite = () => revalidatePath('/', 'layout')
const now = () => new Date().toISOString()

/* ---------------- Connexion ---------------- */
export async function loginAction(_: R, fd: FormData): Promise<R> {
  const s = await login(str(fd, 'login', 60), String(fd.get('password') ?? ''))
  if (!s) return { ok: false, msg: 'Identifiant ou mot de passe incorrect.' }
  redirect('/admin')
}
export async function logoutAction() {
  await logout()
  redirect('/admin/connexion')
}

/* ---------------- Véhicules ---------------- */
export async function saveVehicle(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const id = str(fd, 'id', 60)
  const prev = id ? await get('vehicles', id) : null
  const brand = str(fd, 'brand', 60)
  const model = str(fd, 'model', 60)
  const price = numv(fd, 'price')
  const year = numv(fd, 'year')
  if (!brand || !model) return { ok: false, msg: 'Indiquez au moins la marque et le modèle.' }
  if (!price) return { ok: false, msg: 'Indiquez le prix.' }
  if (!year) return { ok: false, msg: 'Indiquez l’année.' }
  let photos: string[] = []
  try { photos = JSON.parse(String(fd.get('photos') ?? '[]')).filter((x: unknown) => typeof x === 'string').slice(0, 40) } catch {}
  const all = await list('vehicles')
  const ref = prev?.ref ?? `CA-${String(Math.max(100, ...all.map((v) => Number(v.ref.replace(/\D/g, '')) || 0)) + 1)}`
  const version = str(fd, 'version', 120)
  const v: Vehicle = {
    ...(prev ?? ({} as Vehicle)),
    id: prev?.id ?? newId('v'),
    ref,
    slug: prev?.slug ?? slugify(`${brand} ${model} ${version} ${year} ${ref}`),
    category: (str(fd, 'category', 20) as Category) || 'voitures',
    brand, model, version,
    year,
    km: numv(fd, 'km') ?? 0,
    fuel: str(fd, 'fuel', 30) || 'Diesel',
    gearbox: str(fd, 'gearbox', 30) || 'Manuelle',
    power: numv(fd, 'power'),
    fiscalPower: numv(fd, 'fiscalPower'),
    color: str(fd, 'color', 40) || undefined,
    doors: numv(fd, 'doors'),
    seats: numv(fd, 'seats'),
    critair: str(fd, 'critair', 5) || undefined,
    extra: str(fd, 'extra', 120) || undefined,
    price,
    vatRecoverable: bool(fd, 'vatRecoverable'),
    description: str(fd, 'description', 4000),
    equipment: lines(str(fd, 'equipment', 4000)).slice(0, 60),
    photos,
    status: (str(fd, 'status', 20) as VehicleStatus) || 'disponible',
    visible: bool(fd, 'visible'),
    featured: bool(fd, 'featured'),
    demo: prev?.demo && photos.length === 0 ? prev.demo : undefined,
    sourceUrl: prev?.sourceUrl,
    purchase: {
      date: str(fd, 'p_date', 20) || undefined,
      sellerName: str(fd, 'p_name', 120) || undefined,
      sellerAddress: str(fd, 'p_address', 200) || undefined,
      sellerId: str(fd, 'p_id', 120) || undefined,
      price: numv(fd, 'p_price'),
      registration: str(fd, 'p_reg', 20) || undefined,
      vin: str(fd, 'p_vin', 30) || undefined,
    },
    createdAt: prev?.createdAt ?? now(),
    updatedAt: now(),
  }
  await put('vehicles', v)
  refreshSite()
  if (!prev) redirect(`/admin/vehicules/${v.id}?ok=1`)
  return { ok: true, msg: 'Enregistré. Le site est à jour.', id: v.id }
}

export async function setVehicleStatus(id: string, status: VehicleStatus) {
  await requireSession()
  const v = await get('vehicles', id)
  if (!v) return
  await put('vehicles', { ...v, status, updatedAt: now() })
  refreshSite()
}

export async function deleteVehicle(id: string) {
  await requireSession()
  await remove('vehicles', id)
  refreshSite()
  redirect('/admin/vehicules')
}

export async function deleteDemoData() {
  await requireManager()
  for (const col of ['vehicles', 'leads', 'clients', 'docs'] as const) {
    for (const x of await list(col)) if ((x as { demo?: boolean }).demo) await remove(col, x.id)
  }
  refreshSite()
  redirect('/admin')
}

/* ---------------- Demandes ---------------- */
export async function setLeadStatus(id: string, status: Lead['status']) {
  await requireSession()
  const l = await get('leads', id)
  if (l) await put('leads', { ...l, status })
  revalidatePath('/admin', 'layout')
}
export async function deleteLead(id: string) {
  await requireSession()
  await remove('leads', id)
  redirect('/admin/demandes')
}
export async function leadToClient(id: string) {
  await requireSession()
  const l = await get('leads', id)
  if (!l) redirect('/admin/demandes')
  const existing = (await list('clients')).find((c) => c.phone.replace(/\D/g, '') === l.phone.replace(/\D/g, ''))
  const client: Client = existing ?? { id: newId('c'), kind: 'particulier', name: l.name, phone: l.phone, email: l.email, createdAt: now() }
  if (!existing) await put('clients', client)
  await put('leads', { ...l, clientId: client.id, status: l.status === 'nouvelle' ? 'en_cours' : l.status })
  redirect(`/admin/clients/${client.id}`)
}

/* ---------------- Clients ---------------- */
export async function saveClient(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const id = str(fd, 'id', 60)
  const prev = id ? await get('clients', id) : null
  const name = str(fd, 'name', 120)
  if (!name) return { ok: false, msg: 'Indiquez le nom du client.' }
  const c: Client = {
    ...(prev ?? ({} as Client)),
    id: prev?.id ?? newId('c'),
    kind: str(fd, 'kind', 20) === 'pro' ? 'pro' : 'particulier',
    name,
    company: str(fd, 'company', 120) || undefined,
    siret: str(fd, 'siret', 30) || undefined,
    phone: str(fd, 'phone', 40),
    email: str(fd, 'email', 120) || undefined,
    address: str(fd, 'address', 300) || undefined,
    notes: str(fd, 'notes', 3000) || undefined,
    createdAt: prev?.createdAt ?? now(),
  }
  await put('clients', c)
  if (!prev) redirect(`/admin/clients/${c.id}`)
  return { ok: true, msg: 'Fiche client enregistrée.', id: c.id }
}
export async function deleteClient(id: string) {
  await requireSession()
  await remove('clients', id)
  redirect('/admin/clients')
}

/* ---------------- Devis / bons de commande / factures ---------------- */
async function assignNumber(type: DocType) {
  const year = new Date().getFullYear()
  return docNumber(type, year, await nextNumber(`${type}-${year}`))
}

export async function saveDoc(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const id = str(fd, 'id', 60)
  const prev = id ? await get('docs', id) : null
  if (prev && isLocked(prev)) return { ok: false, msg: 'Une facture émise ne peut plus être modifiée. Faites un avoir si besoin.' }
  const type = (prev?.type ?? (str(fd, 'type', 20) as DocType)) || 'devis'
  let ls: DocLine[] = []
  try {
    ls = (JSON.parse(String(fd.get('lines') ?? '[]')) as DocLine[])
      .map((l) => ({ label: String(l.label ?? '').slice(0, 300), qty: Number(l.qty) || 0, unit: Number(l.unit) || 0, vat: Number(l.vat) || 0 }))
      .filter((l) => l.label || l.unit)
      .slice(0, 80)
  } catch {}
  const clientName = str(fd, 'c_name', 120)
  if (!clientName) return { ok: false, msg: 'Indiquez le nom du client.' }
  if (!ls.length) return { ok: false, msg: 'Ajoutez au moins une ligne.' }
  let clientId = str(fd, 'clientId', 60) || undefined
  if (!clientId) {
    const phone = str(fd, 'c_phone', 40)
    const match = phone ? (await list('clients')).find((c) => c.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) : undefined
    if (match) clientId = match.id
    else {
      const c: Client = { id: newId('c'), kind: str(fd, 'c_siret', 30) || str(fd, 'c_company', 120) ? 'pro' : 'particulier', name: clientName, company: str(fd, 'c_company', 120) || undefined, siret: str(fd, 'c_siret', 30) || undefined, phone, email: str(fd, 'c_email', 120) || undefined, address: str(fd, 'c_address', 300) || undefined, createdAt: now() }
      await put('clients', c)
      clientId = c.id
    }
  }
  const d: Doc = {
    ...(prev ?? ({} as Doc)),
    id: prev?.id ?? newId('d'),
    type,
    number: prev?.number ?? (type === 'facture' ? '' : await assignNumber(type)),
    status: prev?.status ?? (type === 'facture' ? 'brouillon' : 'brouillon'),
    vatMode: str(fd, 'vatMode', 10) === 'marge' ? 'marge' : 'normal',
    date: str(fd, 'date', 10) || now().slice(0, 10),
    dueDate: str(fd, 'dueDate', 10) || undefined,
    clientId,
    client: {
      name: clientName,
      company: str(fd, 'c_company', 120) || undefined,
      siret: str(fd, 'c_siret', 30) || undefined,
      address: str(fd, 'c_address', 300) || undefined,
      phone: str(fd, 'c_phone', 40) || undefined,
      email: str(fd, 'c_email', 120) || undefined,
    },
    lines: ls,
    notes: str(fd, 'notes', 3000) || undefined,
    vehicleId: str(fd, 'vehicleId', 60) || undefined,
    token: prev?.token ?? (newId('t') + newId()),
    createdAt: prev?.createdAt ?? now(),
  }
  await put('docs', d)
  if (!prev) redirect(`/admin/documents/${d.id}?ok=1`)
  return { ok: true, msg: 'Document enregistré.', id: d.id }
}

export async function setDocStatus(id: string, status: DocStatus) {
  await requireSession()
  const d = await get('docs', id)
  if (!d || isLocked(d)) return
  await put('docs', { ...d, status })
  revalidatePath('/admin', 'layout')
}

export async function convertDoc(id: string, to: DocType) {
  await requireSession()
  const d = await get('docs', id)
  if (!d) redirect('/admin/documents')
  const nd: Doc = {
    ...d,
    id: newId('d'),
    type: to,
    number: to === 'facture' ? '' : await assignNumber(to),
    status: 'brouillon',
    date: now().slice(0, 10),
    dueDate: undefined,
    fromId: d.id,
    token: newId('t') + newId(),
    paidAt: undefined,
    paymentMethod: undefined,
    demo: undefined,
    createdAt: now(),
  }
  await put('docs', nd)
  if (d.type === 'devis' && d.status !== 'accepte') await put('docs', { ...d, status: 'accepte' })
  redirect(`/admin/documents/${nd.id}`)
}

export async function emitInvoice(id: string) {
  await requireSession()
  const d = await get('docs', id)
  if (!d || d.type !== 'facture' || isLocked(d)) return
  await put('docs', { ...d, number: d.number || (await assignNumber('facture')), status: 'emise', date: now().slice(0, 10) })
  revalidatePath('/admin', 'layout')
}

export async function markPaid(id: string, method: string) {
  await requireSession()
  const d = await get('docs', id)
  if (!d) return
  if (d.type === 'facture' && !d.number) return
  await put('docs', { ...d, status: 'payee', paidAt: now(), paymentMethod: method.slice(0, 40) })
  revalidatePath('/admin', 'layout')
}

export async function deleteDoc(id: string) {
  await requireSession()
  const d = await get('docs', id)
  if (d && isLocked(d)) return
  await remove('docs', id)
  redirect('/admin/documents')
}

/* ---------------- Services & tarifs ---------------- */
export async function saveService(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const id = str(fd, 'id', 60)
  const prev = await get('services', id)
  if (!prev) return { ok: false, msg: 'Service introuvable.' }
  const sv: Service = {
    ...prev,
    title: str(fd, 'title', 80) || prev.title,
    short: str(fd, 'short', 300),
    intro: str(fd, 'intro', 3000),
    points: lines(str(fd, 'points', 3000)),
    priceFrom: str(fd, 'priceFrom', 40) || undefined,
    visible: bool(fd, 'visible'),
  }
  await put('services', sv)
  refreshSite()
  return { ok: true, msg: 'Service enregistré. Le site est à jour.' }
}

export async function savePrices(_: R, fd: FormData): Promise<R> {
  await requireSession()
  let rows: PriceItem[] = []
  try { rows = JSON.parse(String(fd.get('rows') ?? '[]')) } catch { return { ok: false, msg: 'Données invalides.' } }
  const keep = new Set<string>()
  let order = 1
  for (const r of rows.slice(0, 120)) {
    const label = String(r.label ?? '').trim().slice(0, 120)
    if (!label) continue
    const item: PriceItem = { id: r.id || newId('p'), group: String(r.group ?? '').trim().slice(0, 60) || 'Divers', label, price: String(r.price ?? '').trim().slice(0, 40), note: String(r.note ?? '').trim().slice(0, 120) || undefined, order: order++ }
    keep.add(item.id)
    await put('prices', item)
  }
  for (const p of await list('prices')) if (!keep.has(p.id)) await remove('prices', p.id)
  refreshSite()
  return { ok: true, msg: 'Tarifs enregistrés. Le site est à jour.' }
}

/* ---------------- Textes, horaires, réglages ---------------- */
async function settings(): Promise<Settings> {
  const s = await get('settings', 'site')
  return { ...SEED_SETTINGS, ...(s ?? {}), legal: { ...SEED_SETTINGS.legal, ...(s?.legal ?? {}) }, images: { ...(s?.images ?? {}) } }
}

export async function saveTexts(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const s = await settings()
  const next: Settings = {
    ...s,
    heroEyebrow: str(fd, 'heroEyebrow', 120) || s.heroEyebrow,
    heroLine1: str(fd, 'heroLine1', 60) || s.heroLine1,
    heroLine2: str(fd, 'heroLine2', 60) || s.heroLine2,
    heroText: str(fd, 'heroText', 400),
    aboutTitle: str(fd, 'aboutTitle', 120) || s.aboutTitle,
    aboutText: str(fd, 'aboutText', 1500),
    repriseText: str(fd, 'repriseText', 600),
    announcement: str(fd, 'announcement', 200),
    announcementOn: bool(fd, 'announcementOn'),
  }
  await put('settings', next)
  refreshSite()
  return { ok: true, msg: 'Textes enregistrés. Le site est à jour.' }
}

export async function saveContact(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const s = await settings()
  const hours: Settings['hours'] = {}
  for (const d of ['0', '1', '2', '3', '4', '5', '6']) {
    if (!bool(fd, `open_${d}`)) { hours[d] = []; continue }
    const slots: [string, string][] = []
    const a1 = str(fd, `a1_${d}`, 5), b1 = str(fd, `b1_${d}`, 5), a2 = str(fd, `a2_${d}`, 5), b2 = str(fd, `b2_${d}`, 5)
    if (a1 && b1) slots.push([a1, b1])
    if (bool(fd, `split_${d}`) && a2 && b2) slots.push([a2, b2])
    hours[d] = slots
  }
  const next: Settings = {
    ...s,
    phone: str(fd, 'phone', 30) || s.phone,
    whatsapp: str(fd, 'whatsapp', 30) || s.whatsapp,
    email: str(fd, 'email', 120),
    street: str(fd, 'street', 120) || s.street,
    zip: str(fd, 'zip', 10) || s.zip,
    city: str(fd, 'city', 60) || s.city,
    hours,
    googleRating: numv(fd, 'googleRating') ?? s.googleRating,
    googleCount: numv(fd, 'googleCount') ?? s.googleCount,
    googleUrl: str(fd, 'googleUrl', 500) || s.googleUrl,
    facebookUrl: str(fd, 'facebookUrl', 300),
    instagramUrl: str(fd, 'instagramUrl', 300),
    leboncoinUrl: str(fd, 'leboncoinUrl', 300),
  }
  await put('settings', next)
  refreshSite()
  return { ok: true, msg: 'Coordonnées et horaires enregistrés.' }
}

export async function saveLegal(_: R, fd: FormData): Promise<R> {
  await requireManager()
  const s = await settings()
  await put('settings', {
    ...s,
    legal: {
      company: str(fd, 'company', 120) || s.legal.company,
      capital: str(fd, 'capital', 60),
      rcs: str(fd, 'rcs', 80),
      siret: str(fd, 'siret', 30) || s.legal.siret,
      vat: str(fd, 'vat', 30),
      director: str(fd, 'director', 80),
      naf: str(fd, 'naf', 10) || s.legal.naf,
    },
    docFooter: str(fd, 'docFooter', 1000),
    iban: str(fd, 'iban', 60),
  })
  refreshSite()
  return { ok: true, msg: 'Informations légales enregistrées.' }
}

export async function setSlotImage(slot: string, url: string | null) {
  await requireSession()
  const s = await settings()
  const images = { ...s.images }
  if (url && (isStoredUrl(url) || /^https:\/\//.test(url))) images[slot] = url
  else delete images[slot]
  await put('settings', { ...s, images })
  refreshSite()
}

export async function setBrandLogo(brand: string, url: string | null) {
  await requireSession()
  const s = await settings()
  const logos = { ...(s.brandLogos ?? {}) }
  const b = brand.trim().slice(0, 40)
  if (url && (isStoredUrl(url) || /^https:\/\//.test(url))) logos[b] = url
  else delete logos[b]
  await put('settings', { ...s, brandLogos: logos })
  refreshSite()
}

/* ---------------- Avis ---------------- */
export async function saveReview(_: R, fd: FormData): Promise<R> {
  await requireSession()
  const author = str(fd, 'author', 80)
  const text = str(fd, 'text', 1200)
  if (!author || !text) return { ok: false, msg: 'Indiquez le nom et le texte de l’avis.' }
  const r: Review = { id: str(fd, 'id', 60) || newId('r'), author, text, rating: Math.min(5, Math.max(1, numv(fd, 'rating') ?? 5)), date: str(fd, 'date', 10) || now().slice(0, 10), visible: true }
  await put('reviews', r)
  refreshSite()
  return { ok: true, msg: 'Avis ajouté au site.' }
}
export async function deleteReview(id: string) {
  await requireSession()
  await remove('reviews', id)
  refreshSite()
}

/* ---------------- Équipe ---------------- */
export async function saveUser(_: R, fd: FormData): Promise<R> {
  const me = await requireManager()
  const id = str(fd, 'id', 60)
  const users = await list('users')
  const prev = users.find((u) => u.id === id)
  const loginName = str(fd, 'login', 40).toLowerCase().replace(/[^a-z0-9._-]/g, '')
  const name = str(fd, 'name', 60)
  const password = String(fd.get('password') ?? '')
  if (!loginName || !name) return { ok: false, msg: 'Indiquez le prénom et l’identifiant.' }
  if (users.some((u) => u.login === loginName && u.id !== id)) return { ok: false, msg: 'Cet identifiant existe déjà.' }
  if (!prev && users.length >= 6) return { ok: false, msg: 'Six comptes maximum.' }
  if (!prev && password.length < 6) return { ok: false, msg: 'Mot de passe de 6 caractères minimum.' }
  if (password && password.length < 6) return { ok: false, msg: 'Mot de passe de 6 caractères minimum.' }
  const active = prev?.id === me.uid ? true : bool(fd, 'active')
  const u: User = {
    id: prev?.id ?? newId('u'),
    login: loginName,
    name,
    role: prev?.id === me.uid ? 'gerant' : str(fd, 'role', 10) === 'gerant' ? 'gerant' : 'equipe',
    passwordHash: password ? await hashPassword(password) : prev!.passwordHash,
    active: prev ? active : true,
    createdAt: prev?.createdAt ?? now(),
  }
  await put('users', u)
  revalidatePath('/admin/equipe')
  return { ok: true, msg: prev ? 'Compte mis à jour.' : `Compte créé : identifiant « ${u.login} ».` }
}

export async function changePassword(_: R, fd: FormData): Promise<R> {
  const me = await requireSession()
  const u = await get('users', me.uid)
  const p1 = String(fd.get('p1') ?? '')
  if (!u) return { ok: false, msg: 'Compte introuvable.' }
  if (p1.length < 6) return { ok: false, msg: '6 caractères minimum.' }
  if (p1 !== String(fd.get('p2') ?? '')) return { ok: false, msg: 'Les deux mots de passe sont différents.' }
  await put('users', { ...u, passwordHash: await hashPassword(p1) })
  return { ok: true, msg: 'Mot de passe changé.' }
}

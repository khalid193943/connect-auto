import 'server-only'
import { BRAND_LIST } from './brands'
import type { Category } from './types'

/**
 * Recherche d’un véhicule par sa plaque d’immatriculation (données de la carte grise).
 *
 * Deux fournisseurs possibles, choisis par les variables d’environnement :
 *   PLAQUE_API_TOKEN   → apiplaqueimmatriculation.com (français, données SIV)
 *   REGCHECK_USERNAME  → regcheck.org.uk (opération CheckFrance)
 * PLAQUE_MOCK=1 (ou la démo sans base de données) renvoie un exemple, pour essayer sans payer de crédits.
 * Chaque recherche est gardée en mémoire 24 h : retaper la même plaque ne recoûte rien.
 */

export interface PlateInfo {
  plate: string
  brand: string
  model: string
  version: string
  year?: number
  firstRegistration?: string // AAAA-MM-JJ
  fuel?: string
  gearbox?: 'Manuelle' | 'Automatique'
  power?: number
  fiscalPower?: number
  color?: string
  doors?: number
  seats?: number
  co2?: number
  vin?: string
  category?: Category
  extra?: string
  description: string
  source: 'apiplaque' | 'regcheck' | 'exemple'
}

export type PlateResult = { ok: true; info: PlateInfo } | { ok: false; msg: string; code?: 'off' | 'format' | 'notfound' | 'provider' }

const DEMO = !(process.env.DATABASE_URL || process.env.POSTGRES_URL)
const MOCK = process.env.PLAQUE_MOCK === '1' || (DEMO && !process.env.PLAQUE_API_TOKEN && !process.env.REGCHECK_USERNAME)

export const plateLookupEnabled = () => MOCK || !!process.env.PLAQUE_API_TOKEN || !!process.env.REGCHECK_USERNAME

/** AB-123-CD (SIV) ou 1234 AB 30 (ancien FNI) → forme normalisée, sinon null. */
export function normalizePlate(raw: string): string | null {
  const s = raw.toUpperCase().normalize('NFD').replace(/[^A-Z0-9]/g, '')
  const siv = s.match(/^([A-Z]{2})(\d{3})([A-Z]{2})$/)
  if (siv) {
    if (/[IOU]/.test(siv[1] + siv[3]) || siv[1] === 'SS' || siv[3] === 'SS' || siv[1] === 'WW' || siv[2] === '000') return null
    return `${siv[1]}-${siv[2]}-${siv[3]}`
  }
  const fni = s.match(/^(\d{1,4})([A-Z]{1,3})(\d{2}|2A|2B|97\d)$/)
  if (fni) return `${fni[1]} ${fni[2]} ${fni[3]}`
  return null
}

const cache = new Map<string, { at: number; r: PlateResult }>()

export async function lookupPlate(raw: string): Promise<PlateResult> {
  const plate = normalizePlate(raw)
  if (!plate) return { ok: false, code: 'format', msg: 'Plaque non reconnue. Format attendu : AB-123-CD (ou 1234 AB 30 pour les anciennes).' }
  if (!plateLookupEnabled()) return { ok: false, code: 'off', msg: 'La recherche par plaque n’est pas encore activée : il faut un compte chez un fournisseur de données carte grise.' }
  const hit = cache.get(plate)
  if (hit && Date.now() - hit.at < 864e5) return hit.r
  let r: PlateResult
  try {
    if (process.env.PLAQUE_API_TOKEN) r = await viaApiPlaque(plate)
    else if (process.env.REGCHECK_USERNAME) r = await viaRegcheck(plate)
    else r = { ok: true, info: example(plate) }
  } catch (e) {
    console.error('[plaque]', e)
    r = { ok: false, code: 'provider', msg: 'Le service carte grise ne répond pas. Réessayez dans un instant, ou remplissez la fiche à la main.' }
  }
  if (r.ok || r.code === 'notfound') cache.set(plate, { at: Date.now(), r })
  return r
}

/* ---------- fournisseurs ---------- */

async function viaApiPlaque(plate: string): Promise<PlateResult> {
  const u = new URL(process.env.PLAQUE_API_URL || 'https://api.apiplaqueimmatriculation.com/carte-grise')
  u.searchParams.set('host_name', process.env.PLAQUE_API_HOST || 'connectauto-service.fr')
  u.searchParams.set('immatriculation', plate)
  u.searchParams.set('token', process.env.PLAQUE_API_TOKEN!)
  u.searchParams.set('format', 'json')
  const res = await fetch(u, { method: 'POST', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000), cache: 'no-store' })
  if (!res.ok) throw new Error(`apiplaque HTTP ${res.status}`)
  const j = await res.json()
  const d = j?.data ?? {}
  if (d.erreur || !d.marque) return { ok: false, code: 'notfound', msg: d.erreur ? `Plaque introuvable (${String(d.erreur).slice(0, 120)}).` : 'Aucune information pour cette plaque.' }
  return {
    ok: true,
    info: finish({
      plate, source: 'apiplaque',
      brand: d.marque, model: d.modele, version: d.sra_commercial ?? '',
      firstRegistration: isoDate(d.date1erCir_us) ?? isoDate(d.date1erCir_fr),
      fuel: mapFuel(d.energieNGC),
      gearbox: mapGearbox(d.boite_vitesse),
      power: num(d.puisFiscReel), fiscalPower: num(d.puisFisc),
      color: d.couleur, doors: num(d.nb_portes), seats: num(d.nr_passagers),
      co2: num(d.co2), vin: d.vin,
      category: mapGenre(d.genreVCGNGC ?? d.genreVCG),
    }),
  }
}

async function viaRegcheck(plate: string): Promise<PlateResult> {
  const u = new URL(process.env.REGCHECK_API_URL || 'https://www.regcheck.org.uk/api/reg.asmx/CheckFrance')
  u.searchParams.set('RegistrationNumber', plate.replace(/[^A-Z0-9]/g, ''))
  u.searchParams.set('username', process.env.REGCHECK_USERNAME!)
  const res = await fetch(u, { signal: AbortSignal.timeout(15000), cache: 'no-store' })
  const xml = await res.text()
  if (!res.ok) {
    if (/out of credit|no credit/i.test(xml)) return { ok: false, code: 'provider', msg: 'Plus de crédits chez le fournisseur carte grise : rechargez le compte.' }
    if (/not found|no data|invalid/i.test(xml)) return { ok: false, code: 'notfound', msg: 'Aucune information pour cette plaque.' }
    throw new Error(`regcheck HTTP ${res.status}: ${xml.slice(0, 200)}`)
  }
  const m = xml.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/)
  if (!m) return { ok: false, code: 'notfound', msg: 'Aucune information pour cette plaque.' }
  const j = JSON.parse(decodeXml(m[1]))
  const x = j.ExtendedData ?? {}
  const txt = (o: unknown) => (o && typeof o === 'object' && 'CurrentTextValue' in o ? String((o as { CurrentTextValue: unknown }).CurrentTextValue ?? '') : '')
  const brand = txt(j.CarMake) || txt(j.MakeDescription)
  if (!brand) return { ok: false, code: 'notfound', msg: 'Aucune information pour cette plaque.' }
  const d = String(x.datePremiereMiseCirculation ?? '')
  return {
    ok: true,
    info: finish({
      plate, source: 'regcheck',
      brand, model: x.libelleModele || txt(j.CarModel), version: String(x.libVersion ?? '').trim(),
      firstRegistration: /^\d{8}$/.test(d) ? `${d.slice(4)}-${d.slice(2, 4)}-${d.slice(0, 2)}` : isoDate(j.RegistrationDate),
      fuel: mapFuel(txt(j.FuelType) || x.carburantVersion),
      gearbox: mapGearbox(x.boiteDeVitesse),
      power: kw(x.puissanceDyn), fiscalPower: num(x.puissance),   // puissanceDyn est en kW (81 kW = 110 ch)
      seats: num(x.nbPlace), co2: num(x.Co2), vin: x.numSerieMoteur,
      category: mapGenre(x.genre),
      body: txt(j.BodyStyle), cc: num(x.EngineCC),
    }),
  }
}

function example(plate: string): PlateInfo {
  return finish({
    plate, source: 'exemple',
    brand: 'RENAULT', model: 'TRAFIC', version: 'FOURGON L2H1 2.0 DCI 120',
    firstRegistration: '2019-03-14', fuel: 'Diesel', gearbox: 'Manuelle',
    power: 120, fiscalPower: 7, color: 'BLANC', doors: 4, seats: 3, co2: 177,
    vin: 'VF1FL000000000000', category: 'utilitaires', body: 'FOURGON', cc: 1997,
  })
}

/* ---------- mise en forme ---------- */

type Raw = Omit<PlateInfo, 'description' | 'year' | 'extra'> & { body?: string; cc?: number }

function finish(r: Raw): PlateInfo {
  const brand = niceBrand(r.brand)
  const model = nice(r.model)
  const v0 = (r.version ?? '').replace(/\s+/g, ' ').trim()
  const version = v0 && v0 === v0.toUpperCase() ? niceVersion(v0) : v0
  const pv = version.match(/\b(\d{2,3})\s*(?:cv|ch)\b/i)   // « 110cv » dans la version : c’est la puissance réelle
  if (pv) r = { ...r, power: Number(pv[1]) }
  const year = r.firstRegistration ? Number(r.firstRegistration.slice(0, 4)) || undefined : undefined
  const color = r.color ? nice(r.color) : undefined
  const extra = [r.body ? `Carrosserie ${nice(r.body).toLowerCase()}` : '', r.cc ? `${r.cc.toLocaleString('fr-FR')} cm³` : ''].filter(Boolean).join(' · ') || undefined
  const info: PlateInfo = { ...r, brand, model, version, year, color, extra, description: '' }
  delete (info as Partial<Raw>).body; delete (info as Partial<Raw>).cc
  info.description = describe(info)
  return info
}

/** Texte d’annonce de départ, factuel : Fouad le complète (état, entretien, options). */
function describe(i: PlateInfo): string {
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const l1 = [`${i.brand} ${i.model}${i.version ? ` ${i.version}` : ''}`, i.fuel?.toLowerCase(), i.gearbox && `boîte ${i.gearbox.toLowerCase()}`, i.power && `${i.power} ch`].filter(Boolean).join(', ') + '.'
  const parts = [l1]
  if (i.firstRegistration) { const [y, m] = i.firstRegistration.split('-'); parts.push(`Première mise en circulation : ${mois[Number(m) - 1] ?? ''} ${y}.`.replace('  ', ' ')) }
  const pl = [i.seats && `${i.seats} places`, i.doors && `${i.doors} portes`, i.fiscalPower && `${i.fiscalPower} CV fiscaux`, i.color && `couleur ${i.color.toLowerCase()}`].filter(Boolean)
  if (pl.length) parts.push(pl.join(', ').replace(/^./, (c) => c.toUpperCase()) + '.')
  parts.push('À voir chez Connect Auto, 1520 route de Nîmes à Milhaud. Reprise de votre véhicule possible.')
  return parts.join('\n')
}

/** FOURGON L2H1 2.0 DCI 120 → Fourgon L2H1 2.0 dCi 120 (sigles moteurs écrits comme les constructeurs). */
const MOTORS: Record<string, string> = { dci: 'dCi', hdi: 'HDi', bluehdi: 'BlueHDi', tce: 'TCe', tdi: 'TDI', tsi: 'TSI', cdi: 'CDI', crdi: 'CRDi', jtd: 'JTD', multijet: 'Multijet', puretech: 'PureTech', ecoblue: 'EcoBlue', tdci: 'TDCi', vti: 'VTi', thp: 'THP', gti: 'GTI', bva: 'BVA', bvm: 'BVM', edc: 'EDC', eat8: 'EAT8', dsg: 'DSG' }
function niceVersion(v: string): string {
  return v.split(' ').map((w) => MOTORS[w.toLowerCase()] ?? (/\d/.test(w) || w.length <= 2 ? w : w.charAt(0) + w.slice(1).toLowerCase())).join(' ')
}
const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
function niceBrand(b: string): string {
  const k = strip(b)
  const hit = BRAND_LIST.find((x) => k === x.id || k.startsWith(x.id) || strip(x.name) === k)
  return hit ? hit.name : nice(b)
}
/** RENAULT SCÉNIC III → Renault Scénic III ; garde C15, 3008, GTI, ID.3… */
function nice(s: string): string {
  return String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ').split(' ').map((w) => {
    const up = w.toUpperCase()
    if (/^[IVX]+$/.test(up) || /\d/.test(w) || ['gti', 'gt', 'rs', 'suv', 'tdi', 'hdi', 'dci', 'amg'].includes(w)) return up
    return w.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('-')
  }).join(' ')
}

function mapFuel(v: unknown): string | undefined {
  const s = strip(String(v ?? ''))
  if (!s) return undefined
  if (s.includes('rechargeable') || s === 'ee' || s === 'gl' || s === 'phev') return 'Hybride rechargeable'
  if (s.includes('hybrid') || ['ol', 'pe', 'ne', 'fl', 'h'].includes(s)) return 'Hybride'
  if (s.includes('electri') || s === 'el') return 'Électrique'
  if (s.includes('gpl') || s.includes('gnv') || ['gp', 'gn'].includes(s)) return 'GPL'
  if (s.includes('diesel') || s.includes('gazole') || ['go', 'd'].includes(s)) return 'Diesel'
  if (s.includes('essence') || s.includes('super') || ['es', 'e', 'fe'].includes(s)) return 'Essence'
  return undefined
}
function mapGearbox(v: unknown): 'Manuelle' | 'Automatique' | undefined {
  const s = strip(String(v ?? ''))
  if (!s) return undefined
  return s.startsWith('a') || s.includes('auto') || s === 'cvt' || s === 's' ? 'Automatique' : 'Manuelle'
}
function mapGenre(v: unknown): Category | undefined {
  const s = strip(String(v ?? ''))
  if (!s) return undefined
  if (['vp', '1'].includes(s)) return 'voitures'
  if (s.startsWith('ctte') || s.startsWith('derivvp') || s.startsWith('vasp') || ['2', '4'].includes(s)) return 'utilitaires'
  if (s.startsWith('mt') || s.startsWith('moto') || ['cl', '5', '6', 'tm', '10'].includes(s)) return 'motos'
  if (['cam', 'trr', 'tcp', '12', '13', '14'].includes(s)) return 'camions'
  return undefined
}
const kw = (v: unknown) => { const n = num(v); return n ? Math.round(n * 1.35962) : undefined }
const num = (v: unknown) => { const n = Number(String(v ?? '').replace(/[^\d.]/g, '')); return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined }
function isoDate(v: unknown): string | undefined {
  const s = String(v ?? '')
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`
  m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/); if (m) return `${m[3]}-${m[2]}-${m[1]}`
  return undefined
}
const decodeXml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&')

import 'server-only'
import { neon } from '@neondatabase/serverless'
import type { CollectionName, Collections } from './types'
import {
  SEED_CLIENTS, SEED_DOCS, SEED_LEADS, SEED_PRICES, SEED_REVIEWS, SEED_SERVICES, SEED_SETTINGS, SEED_VEHICLES,
} from './seed'

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
export const HAS_DB = DB_URL.length > 0
export const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

const seedData = (): { [K in CollectionName]: Collections[K][] } => ({
  vehicles: SEED_VEHICLES,
  leads: SEED_LEADS,
  clients: SEED_CLIENTS,
  docs: SEED_DOCS,
  services: SEED_SERVICES,
  prices: SEED_PRICES,
  reviews: SEED_REVIEWS,
  settings: [SEED_SETTINGS],
  users: [],
})

/* ------------------------------------------------------------------ */
/* Mode démonstration : données en mémoire (rien n'est conservé)       */
/* ------------------------------------------------------------------ */
type Mem = { cols: Map<string, Map<string, unknown>>; counters: Map<string, number> }
const g = globalThis as unknown as { __caMem?: Mem }
function mem(): Mem {
  if (!g.__caMem) {
    const cols = new Map<string, Map<string, unknown>>()
    const data = seedData()
    for (const [col, rows] of Object.entries(data)) {
      cols.set(col, new Map((rows as { id: string }[]).map((r) => [r.id, structuredClone(r)])))
    }
    g.__caMem = { cols, counters: new Map([['devis-2026', 1]]) }
  }
  return g.__caMem
}

/* ------------------------------------------------------------------ */
/* Postgres (Neon)                                                     */
/* ------------------------------------------------------------------ */
const sql = HAS_DB ? neon(DB_URL) : null
let ready: Promise<void> | null = null

async function init() {
  if (!sql) return
  await sql`create table if not exists ca_docs (
    col text not null,
    id text not null,
    data jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (col, id)
  )`
  await sql`create table if not exists ca_counters (key text primary key, n integer not null)`
  const rows = (await sql`select count(*)::int as n from ca_docs where col = 'settings'`) as { n: number }[]
  if (rows[0]?.n === 0) {
    const data = seedData()
    for (const [col, list] of Object.entries(data)) {
      if (col === 'leads' || col === 'clients' || col === 'docs') continue // pas de fausses demandes en production
      for (const row of list as { id: string }[]) {
        await sql`insert into ca_docs (col, id, data) values (${col}, ${row.id}, ${JSON.stringify(row)}::jsonb) on conflict do nothing`
      }
    }
  }
}
function ensure() {
  if (!ready) ready = init().catch((e) => { ready = null; throw e })
  return ready
}

/* ------------------------------------------------------------------ */
/* API commune                                                         */
/* ------------------------------------------------------------------ */
export async function list<K extends CollectionName>(col: K): Promise<Collections[K][]> {
  if (!sql) return [...(mem().cols.get(col)?.values() ?? [])].map((x) => structuredClone(x)) as Collections[K][]
  await ensure()
  const rows = (await sql`select data from ca_docs where col = ${col} order by created_at`) as { data: Collections[K] }[]
  return rows.map((r) => r.data)
}

export async function get<K extends CollectionName>(col: K, id: string): Promise<Collections[K] | null> {
  if (!sql) {
    const v = mem().cols.get(col)?.get(id)
    return v ? (structuredClone(v) as Collections[K]) : null
  }
  await ensure()
  const rows = (await sql`select data from ca_docs where col = ${col} and id = ${id}`) as { data: Collections[K] }[]
  return rows[0]?.data ?? null
}

export async function put<K extends CollectionName>(col: K, doc: Collections[K]): Promise<void> {
  const id = (doc as { id: string }).id
  if (!sql) {
    const m = mem()
    if (!m.cols.has(col)) m.cols.set(col, new Map())
    m.cols.get(col)!.set(id, structuredClone(doc))
    return
  }
  await ensure()
  await sql`insert into ca_docs (col, id, data) values (${col}, ${id}, ${JSON.stringify(doc)}::jsonb)
    on conflict (col, id) do update set data = excluded.data, updated_at = now()`
}

export async function remove(col: CollectionName, id: string): Promise<void> {
  if (!sql) {
    mem().cols.get(col)?.delete(id)
    return
  }
  await ensure()
  await sql`delete from ca_docs where col = ${col} and id = ${id}`
}

/** Numérotation continue et sans trou (devis, bons de commande, factures). */
export async function nextNumber(key: string): Promise<number> {
  if (!sql) {
    const m = mem().counters
    const n = (m.get(key) ?? 0) + 1
    m.set(key, n)
    return n
  }
  await ensure()
  const rows = (await sql`insert into ca_counters (key, n) values (${key}, 1)
    on conflict (key) do update set n = ca_counters.n + 1 returning n`) as { n: number }[]
  return rows[0].n
}

export async function exportAll() {
  const out: Record<string, unknown[]> = {}
  for (const col of ['vehicles', 'leads', 'clients', 'docs', 'services', 'prices', 'reviews', 'settings'] as CollectionName[]) {
    out[col] = await list(col)
  }
  return out
}

export function newId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

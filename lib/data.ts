import 'server-only'
import { cache } from 'react'
import { get, list } from './store'
import { SEED_SETTINGS } from './seed'
import type { Settings } from './types'

export const getSettings = cache(async (): Promise<Settings> => {
  const s = await get('settings', 'site')
  return { ...SEED_SETTINGS, ...(s ?? {}), legal: { ...SEED_SETTINGS.legal, ...(s?.legal ?? {}) }, images: { ...(s?.images ?? {}) } }
})

export const getServices = cache(async () => (await list('services')).filter((s) => s.visible).sort((a, b) => a.order - b.order))
export const getAllServices = cache(async () => (await list('services')).sort((a, b) => a.order - b.order))

const statusRank = { disponible: 0, reserve: 1, vendu: 2 } as const
export const getVehicles = cache(async () =>
  (await list('vehicles'))
    .filter((v) => v.visible)
    .sort((a, b) => statusRank[a.status] - statusRank[b.status] || b.createdAt.localeCompare(a.createdAt)),
)

export const getPrices = cache(async () => (await list('prices')).sort((a, b) => a.order - b.order))
export const getReviews = cache(async () => (await list('reviews')).filter((r) => r.visible).sort((a, b) => b.date.localeCompare(a.date)))

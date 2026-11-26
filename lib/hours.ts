import type { DayHours } from './types'

export const fmtDay = (h?: DayHours) =>
  !h || h.length === 0 ? 'Fermé' : h.map(([a, b]) => `${a.replace(':', 'h')} – ${b.replace(':', 'h')}`).join(' · ')

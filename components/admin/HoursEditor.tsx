'use client'
import { useState } from 'react'
import type { DayHours } from '@/lib/types'
import { DAYS, DAY_ORDER } from '@/lib/site'

export function HoursEditor({ hours }: { hours: Record<string, DayHours> }) {
  const [st, setSt] = useState(() =>
    Object.fromEntries(DAY_ORDER.map((d) => {
      const h = hours[d] ?? []
      return [d, { open: h.length > 0, split: h.length > 1, a1: h[0]?.[0] ?? '08:30', b1: h[0]?.[1] ?? (h.length > 1 ? '12:00' : '18:00'), a2: h[1]?.[0] ?? '14:00', b2: h[1]?.[1] ?? '18:00' }]
    })) as Record<string, { open: boolean; split: boolean; a1: string; b1: string; a2: string; b2: string }>,
  )
  const set = (d: string, p: Partial<(typeof st)[string]>) => setSt((s) => ({ ...s, [d]: { ...s[d], ...p } }))
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      {DAY_ORDER.map((d) => {
        const x = st[d]
        return (
          <div key={d} style={{ borderBottom: '1px solid var(--a-line)', paddingBottom: 10 }}>
            <label className="toggle">
              <span className="t"><b>{DAYS[Number(d)]}</b><small>{x.open ? (x.split ? 'Ouvert, avec pause le midi' : 'Ouvert en continu') : 'Fermé'}</small></span>
              <input type="checkbox" name={`open_${d}`} checked={x.open} onChange={(e) => set(d, { open: e.target.checked })} />
            </label>
            {x.open && (
              <div style={{ display: 'grid', gap: 8 }}>
                <div className="grid2">
                  <input className="inp" type="time" name={`a1_${d}`} value={x.a1} onChange={(e) => set(d, { a1: e.target.value })} aria-label="Ouverture" />
                  <input className="inp" type="time" name={`b1_${d}`} value={x.b1} onChange={(e) => set(d, { b1: e.target.value })} aria-label="Fermeture" />
                </div>
                <label className="check" style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14.5 }}>
                  <input type="checkbox" name={`split_${d}`} checked={x.split} onChange={(e) => set(d, { split: e.target.checked })} style={{ width: 22, height: 22 }} />
                  Pause le midi
                </label>
                {x.split && (
                  <div className="grid2">
                    <input className="inp" type="time" name={`a2_${d}`} value={x.a2} onChange={(e) => set(d, { a2: e.target.value })} aria-label="Réouverture" />
                    <input className="inp" type="time" name={`b2_${d}`} value={x.b2} onChange={(e) => set(d, { b2: e.target.value })} aria-label="Fermeture du soir" />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

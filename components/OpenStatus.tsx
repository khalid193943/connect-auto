'use client'
import { useEffect, useState } from 'react'
import type { DayHours } from '@/lib/types'

function parisNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date())
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find((p) => p.type === 'weekday')!.value)
  const hm = `${parts.find((p) => p.type === 'hour')!.value}:${parts.find((p) => p.type === 'minute')!.value}`
  return { wd, hm }
}

export function openState(hours: Record<string, DayHours>) {
  const { wd, hm } = parisNow()
  const today = hours[String(wd)] ?? []
  const slot = today.find(([a, b]) => hm >= a && hm < b)
  if (slot) return { open: true, text: `Ouvert · ferme à ${slot[1].replace(':', 'h')}` }
  const later = today.find(([a]) => hm < a)
  if (later) return { open: false, text: `Fermé · ouvre à ${later[0].replace(':', 'h')}` }
  for (let i = 1; i <= 7; i++) {
    const d = (wd + i) % 7
    const h = hours[String(d)]
    if (h && h.length) {
      const name = i === 1 ? 'demain' : ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][d]
      return { open: false, text: `Fermé · ouvre ${name} à ${h[0][0].replace(':', 'h')}` }
    }
  }
  return { open: false, text: 'Fermé' }
}

export function OpenStatus({ hours, className }: { hours: Record<string, DayHours>; className?: string }) {
  const [st, setSt] = useState<{ open: boolean; text: string } | null>(null)
  useEffect(() => {
    const up = () => setSt(openState(hours))
    up()
    const t = setInterval(up, 60000)
    return () => clearInterval(t)
  }, [hours])
  if (!st) return null
  return (
    <span className={`open-pill ${st.open ? 'on' : ''} ${className ?? ''}`}>
      <i /> {st.text}
    </span>
  )
}

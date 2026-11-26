'use client'
import { useEffect, useState } from 'react'
import type { DayHours } from '@/lib/types'
import { DAYS, DAY_ORDER } from '@/lib/site'
import { fmtDay } from '@/lib/hours'


export function HoursTable({ hours }: { hours: Record<string, DayHours> }) {
  const [wd, setWd] = useState<string | null>(null)
  useEffect(() => {
    const w = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short' }).format(new Date())
    setWd(String(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(w)))
  }, [])
  return (
    <table className="hours-table">
      <tbody>
        {DAY_ORDER.map((d) => (
          <tr key={d} className={wd === d ? 'today' : undefined}>
            <td>{DAYS[Number(d)]}</td>
            <td>{fmtDay(hours[d])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

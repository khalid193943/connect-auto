'use client'
import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { PriceItem } from '@/lib/types'

export function PricesEditor({ initial }: { initial: PriceItem[] }) {
  const [rows, setRows] = useState(initial)
  const upd = (i: number, p: Partial<PriceItem>) => setRows((r) => r.map((x, k) => (k === i ? { ...x, ...p } : x)))
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= rows.length) return
    const r = [...rows]
    ;[r[i], r[j]] = [r[j], r[i]]
    setRows(r)
  }
  const groups = [...new Set(rows.map((r) => r.group))]
  return (
    <>
      <input type="hidden" name="rows" value={JSON.stringify(rows)} />
      <datalist id="groups">{groups.map((g) => <option key={g} value={g} />)}</datalist>
      <div className="lines">
        {rows.map((r, i) => (
          <div className="line" key={r.id || i}>
            <div className="line-top">
              <input className="inp" value={r.label} onChange={(e) => upd(i, { label: e.target.value })} placeholder="Prestation" aria-label="Prestation" />
            </div>
            <div className="grid2">
              <label className="f"><span style={{ fontSize: 12.5 }}>Prix TTC</span><input value={r.price} onChange={(e) => upd(i, { price: e.target.value })} placeholder="ex. 89 € (vide = sur devis)" /></label>
              <label className="f"><span style={{ fontSize: 12.5 }}>Rubrique</span><input list="groups" value={r.group} onChange={(e) => upd(i, { group: e.target.value })} /></label>
            </div>
            <input className="inp" value={r.note ?? ''} onChange={(e) => upd(i, { note: e.target.value })} placeholder="Précision (facultatif)" style={{ minHeight: 46, fontSize: 15 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="b sm" onClick={() => move(i, -1)} aria-label="Monter"><ArrowUp /></button>
              <button type="button" className="b sm" onClick={() => move(i, 1)} aria-label="Descendre"><ArrowDown /></button>
              <button type="button" className="b sm red" onClick={() => setRows(rows.filter((_, k) => k !== i))} aria-label="Supprimer"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="b full" onClick={() => setRows([...rows, { id: '', group: groups[groups.length - 1] ?? 'Divers', label: '', price: '', order: rows.length + 1 }])}><Plus /> Ajouter un tarif</button>
    </>
  )
}

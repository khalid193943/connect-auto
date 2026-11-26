'use client'
import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Doc, DocLine, PriceItem } from '@/lib/types'
import { totals } from '@/lib/docs'
import { eur } from '@/lib/format'

type C = { id: string; name: string; phone: string; company?: string; siret?: string; address?: string; email?: string }

export function DocEditor({ doc, clients, prices }: { doc: Partial<Doc>; clients: C[]; prices: PriceItem[] }) {
  const [lines, setLines] = useState<DocLine[]>(doc.lines?.length ? doc.lines : [{ label: '', qty: 1, unit: 0, vat: 20 }])
  const [mode, setMode] = useState<Doc['vatMode']>(doc.vatMode ?? 'normal')
  const [cl, setCl] = useState({ id: doc.clientId ?? '', ...{ name: '', phone: '', company: '', siret: '', address: '', email: '' }, ...(doc.client ?? {}) })
  const t = useMemo(() => totals(lines, mode), [lines, mode])

  const upd = (i: number, patch: Partial<DocLine>) => setLines((ls) => ls.map((l, k) => (k === i ? { ...l, ...patch } : l)))
  const pick = (name: string) => {
    const c = clients.find((x) => x.name === name)
    if (c) setCl({ id: c.id, name: c.name, phone: c.phone ?? '', company: c.company ?? '', siret: c.siret ?? '', address: c.address ?? '', email: c.email ?? '' })
    else setCl((x) => ({ ...x, id: '', name }))
  }
  const parse = (v: string) => Number(v.replace(/\s/g, '').replace(',', '.')) || 0

  return (
    <>
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <input type="hidden" name="clientId" value={cl.id} />
      <div className="card">
        <h2>Client</h2>
        <label className="f"><span>Nom *</span>
          <input name="c_name" list="clients-list" value={cl.name} onChange={(e) => pick(e.target.value)} placeholder="Tapez pour retrouver un client" autoComplete="off" required />
          <datalist id="clients-list">{clients.map((c) => <option key={c.id} value={c.name}>{c.company || c.phone}</option>)}</datalist>
        </label>
        <div className="grid2">
          <label className="f"><span>Téléphone</span><input name="c_phone" type="tel" value={cl.phone} onChange={(e) => setCl({ ...cl, phone: e.target.value })} /></label>
          <label className="f"><span>E-mail</span><input name="c_email" type="email" value={cl.email} onChange={(e) => setCl({ ...cl, email: e.target.value })} /></label>
        </div>
        <label className="f"><span>Adresse</span><input name="c_address" value={cl.address} onChange={(e) => setCl({ ...cl, address: e.target.value })} /></label>
        <div className="grid2">
          <label className="f"><span>Société</span><input name="c_company" value={cl.company} onChange={(e) => setCl({ ...cl, company: e.target.value })} /></label>
          <label className="f"><span>SIRET</span><input name="c_siret" value={cl.siret} onChange={(e) => setCl({ ...cl, siret: e.target.value })} /></label>
        </div>
      </div>

      <div className="card">
        <h2>TVA</h2>
        <div className="choice" style={{ ['--n' as string]: 2 }}>
          <label><input type="radio" name="vatMode" value="normal" checked={mode === 'normal'} onChange={() => setMode('normal')} /><span>TVA normale</span></label>
          <label><input type="radio" name="vatMode" value="marge" checked={mode === 'marge'} onChange={() => setMode('marge')} /><span>Véhicule d’occasion (TVA sur marge)</span></label>
        </div>
        <p className="hint">{mode === 'normal' ? 'Atelier, pièces, véhicule vendu avec TVA récupérable : prix saisis HT.' : 'Véhicule d’occasion acheté à un particulier : prix saisis TTC, la TVA n’apparaît pas sur le document.'}</p>
      </div>

      <div className="card">
        <h2>Lignes</h2>
        <div className="lines">
          {lines.map((l, i) => (
            <div className="line" key={i}>
              <div className="line-top">
                <input className="inp" value={l.label} onChange={(e) => upd(i, { label: e.target.value })} placeholder="Désignation (ex. Vidange + filtre)" aria-label="Désignation" />
                <button type="button" className="b sm red" onClick={() => setLines(lines.filter((_, k) => k !== i))} aria-label="Supprimer la ligne"><Trash2 /></button>
              </div>
              <div className="grid3">
                <label className="f"><span style={{ fontSize: 12.5 }}>Quantité</span><input inputMode="decimal" defaultValue={String(l.qty).replace('.', ',')} onChange={(e) => upd(i, { qty: parse(e.target.value) })} /></label>
                <label className="f"><span style={{ fontSize: 12.5 }}>Prix unit. {mode === 'marge' ? 'TTC' : 'HT'}</span><input inputMode="decimal" defaultValue={l.unit ? String(l.unit).replace('.', ',') : ''} onChange={(e) => upd(i, { unit: parse(e.target.value) })} /></label>
                {mode === 'normal' ? (
                  <label className="f"><span style={{ fontSize: 12.5 }}>TVA</span>
                    <select value={l.vat} onChange={(e) => upd(i, { vat: Number(e.target.value) })}>
                      <option value={20}>20 %</option><option value={10}>10 %</option><option value={5.5}>5,5 %</option><option value={0}>0 %</option>
                    </select>
                  </label>
                ) : <span />}
              </div>
              <div className="tot num">{eur((l.qty || 0) * (l.unit || 0), 2)} {mode === 'marge' ? 'TTC' : 'HT'}</div>
            </div>
          ))}
        </div>
        <div className="actions">
          <button type="button" className="b sm" onClick={() => setLines([...lines, { label: '', qty: 1, unit: 0, vat: 20 }])}><Plus /> Ajouter une ligne</button>
          {prices.length > 0 && (
            <select className="inp" style={{ minHeight: 44, fontSize: 14.5 }} value="" onChange={(e) => {
              const p = prices.find((x) => x.id === e.target.value)
              if (!p) return
              const ttc = parse(p.price.replace(/[^\d,.\s]/g, ''))
              setLines([...lines.filter((x) => x.label || x.unit), { label: p.label, qty: 1, unit: mode === 'marge' ? ttc : Math.round((ttc / 1.2) * 100) / 100, vat: 20 }])
            }}>
              <option value="">+ Depuis les tarifs</option>
              {prices.map((p) => <option key={p.id} value={p.id}>{p.label}{p.price ? ` · ${p.price}` : ''}</option>)}
            </select>
          )}
        </div>
        <div className="totals num">
          {mode === 'normal' ? (
            <>
              <div><span>Total HT</span><b>{eur(t.ht, 2)}</b></div>
              {t.vat.filter((v) => v.rate > 0).map((v) => <div key={v.rate}><span>TVA {String(v.rate).replace('.', ',')} %</span><b>{eur(v.amount, 2)}</b></div>)}
            </>
          ) : null}
          <div className="grand"><span>Total TTC</span><b>{eur(t.ttc, 2)}</b></div>
        </div>
      </div>

      <div className="card">
        <h2>Dates et notes</h2>
        <div className="grid2">
          <label className="f"><span>Date</span><input type="date" name="date" defaultValue={doc.date ?? new Date().toISOString().slice(0, 10)} /></label>
          <label className="f"><span>{doc.type === 'facture' ? 'Échéance' : 'Valable jusqu’au'}</span><input type="date" name="dueDate" defaultValue={doc.dueDate} /></label>
        </div>
        <label className="f"><span>Notes affichées sur le document</span><textarea name="notes" defaultValue={doc.notes} placeholder="Délai, conditions, garantie…" /></label>
      </div>
    </>
  )
}

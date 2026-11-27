'use client'
import { useRef, useState } from 'react'
import { Check, Loader2, Sparkles } from 'lucide-react'

type Info = {
  plate: string; brand: string; model: string; version: string; year?: number; fuel?: string; gearbox?: string
  power?: number; fiscalPower?: number; color?: string; doors?: number; seats?: number; vin?: string
  category?: string; extra?: string; description: string; source: string
}

/** Format d’affichage pendant la saisie : AB-123-CD. */
const fmt = (s: string) => {
  const c = s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 9)
  const m = c.match(/^([A-Z]{1,2})(\d{0,3})([A-Z]{0,2})$/)
  if (!m) return s.toUpperCase().slice(0, 12)
  return [m[1], m[2], m[3]].filter(Boolean).join('-')
}

/** Écrit une valeur dans un champ du formulaire comme si on l’avait tapée (le formulaire voit le changement). */
function put(form: HTMLFormElement, name: string, value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false
  const el = form.elements.namedItem(name)
  if (!el) return false
  if (el instanceof RadioNodeList) {
    const r = Array.from(el).find((x) => (x as HTMLInputElement).value === String(value)) as HTMLInputElement | undefined
    if (!r) return false
    r.click()
    return true
  }
  const f = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (f instanceof HTMLSelectElement && !Array.from(f.options).some((o) => (o.value || o.text) === String(value))) return false
  const proto = f instanceof HTMLSelectElement ? HTMLSelectElement.prototype : f instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(f, String(value))
  f.dispatchEvent(new Event('input', { bubbles: true }))
  f.dispatchEvent(new Event('change', { bubbles: true }))
  const box = f.closest('.f') ?? f
  box.classList.remove('autofilled'); void (box as HTMLElement).offsetWidth; box.classList.add('autofilled')
  const det = f.closest('details'); if (det) det.open = true
  return true
}

export function PlateLookup({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [plate, setPlate] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState<{ info: Info; n: number } | null>(null)

  const run = async () => {
    const form = ref.current?.closest('form')
    if (!form || busy) return
    setErr(''); setDone(null); setBusy(true)
    try {
      const res = await fetch(`/api/admin/plaque?immat=${encodeURIComponent(plate)}`, { cache: 'no-store' })
      const r = await res.json().catch(() => ({ ok: false, msg: 'Réponse illisible du serveur.' }))
      if (!r.ok) { setErr(r.msg || 'Recherche impossible.'); return }
      const i: Info = r.info
      let n = 0
      const fill: [string, unknown][] = [
        ['category', i.category], ['brand', i.brand], ['model', i.model], ['version', i.version], ['year', i.year],
        ['fuel', i.fuel], ['gearbox', i.gearbox], ['power', i.power], ['fiscalPower', i.fiscalPower], ['color', i.color],
        ['doors', i.doors], ['seats', i.seats], ['extra', i.extra], ['p_reg', i.plate], ['p_vin', i.vin],
      ]
      for (const [k, v] of fill) if (put(form, k, v)) n++
      const desc = form.elements.namedItem('description') as HTMLTextAreaElement | null
      if (desc && !desc.value.trim() && put(form, 'description', i.description)) n++
      setDone({ info: i, n })
      const price = form.elements.namedItem('price') as HTMLInputElement | null
      if (price && !price.value) setTimeout(() => { price.scrollIntoView({ behavior: 'smooth', block: 'center' }); price.focus({ preventScroll: true }) }, 350)
    } catch {
      setErr('Pas de connexion. Vérifiez le réseau et réessayez.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card plate-card" ref={ref}>
      <div className="plate-head">
        <span className="plate-ico"><Sparkles /></span>
        <div>
          <h2>Remplissage automatique</h2>
          <p className="hint">Tapez la plaque : marque, modèle, version, année, énergie, boîte, puissance et le texte de l’annonce se remplissent tout seuls.</p>
        </div>
      </div>
      <div className="plate-row">
        <label className="plate" aria-label="Plaque d’immatriculation">
          <span className="plate-eu" aria-hidden><i>★</i>F</span>
          <input
            value={plate}
            onChange={(e) => setPlate(fmt(e.target.value))}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); run() } }}
            placeholder="AB-123-CD"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            disabled={!enabled}
          />
          <span className="plate-eu right" aria-hidden />
        </label>
        <button type="button" className="b pri" onClick={run} disabled={!enabled || busy || plate.replace(/[^A-Z0-9]/gi, '').length < 5}>
          {busy ? <Loader2 className="spin-ico" /> : <Sparkles />} {busy ? 'Recherche…' : 'Remplir la fiche'}
        </button>
      </div>
      {!enabled && <p className="banner info" style={{ margin: 0 }}>Option à activer : il faut un abonnement chez un fournisseur de données carte grise (payant à la recherche). En attendant, la fiche se remplit à la main.</p>}
      {err && <p className="banner warn" role="alert" style={{ margin: 0 }}>{err}</p>}
      {done && (
        <div className="plate-ok" role="status">
          <Check />
          <div>
            <b>{done.info.brand} {done.info.model}{done.info.year ? ` · ${done.info.year}` : ''}</b>
            <span>{done.n} informations remplies{done.info.source === 'exemple' ? ' (exemple de démonstration)' : ''}. Il reste : <b>prix</b>, <b>kilométrage</b> et <b>photos</b>, puis « Publier l’annonce ».</span>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useRef, useState } from 'react'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import { uploadPhoto } from '@/lib/client-image'
import { setBrandLogo, setSlotImage } from '@/app/admin/actions'

export function SlotUploader({ slot, url, enabled, brand }: { slot: string; url?: string; enabled: boolean; brand?: boolean }) {
  const save = (u: string | null) => (brand ? setBrandLogo(slot, u) : setSlotImage(slot, u))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const pick = async (f?: File) => {
    if (!f) return
    setBusy(true)
    setErr('')
    try {
      const u = await uploadPhoto(f, brand ? 'marques' : 'site', 'admin', brand)
      await save(u)
    } catch (e) {
      setErr((e as Error).message || 'Envoi impossible')
    }
    setBusy(false)
  }
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <button type="button" className="b sm" disabled={!enabled || busy} onClick={() => input.current?.click()}>
        {busy ? <Loader2 className="spin-ico" /> : <Camera />} {url ? 'Remplacer' : 'Ajouter'}
      </button>
      {url && (
        <button type="button" className="b sm red" disabled={busy} onClick={async () => { setBusy(true); await save(null); setBusy(false) }} aria-label="Retirer la photo">
          <Trash2 />
        </button>
      )}
      {err && <span className="hint" style={{ color: 'var(--a-red)' }}>{err}</span>}
      <input ref={input} type="file" accept={brand ? 'image/svg+xml,image/png,image/webp' : 'image/*'} hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}

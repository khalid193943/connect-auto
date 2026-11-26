'use client'
import { useRef, useState } from 'react'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import { uploadPhoto } from '@/lib/client-image'
import { setSlotImage } from '@/app/admin/actions'

export function SlotUploader({ slot, url, enabled }: { slot: string; url?: string; enabled: boolean }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const pick = async (f?: File) => {
    if (!f) return
    setBusy(true)
    setErr('')
    try {
      const u = await uploadPhoto(f, 'site', 'admin')
      await setSlotImage(slot, u)
    } catch {
      setErr('Envoi impossible')
    }
    setBusy(false)
  }
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <button type="button" className="b sm" disabled={!enabled || busy} onClick={() => input.current?.click()}>
        {busy ? <Loader2 className="spin-ico" /> : <Camera />} {url ? 'Remplacer' : 'Ajouter'}
      </button>
      {url && (
        <button type="button" className="b sm red" disabled={busy} onClick={async () => { setBusy(true); await setSlotImage(slot, null); setBusy(false) }} aria-label="Retirer la photo">
          <Trash2 />
        </button>
      )}
      {err && <span className="hint" style={{ color: 'var(--a-red)' }}>{err}</span>}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}

'use client'
import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Camera, Loader2, Trash2 } from 'lucide-react'
import { uploadPhoto } from '@/lib/client-image'

/** Photos d’un véhicule : prises au téléphone, réduites puis envoyées. La 1re photo est celle de l’annonce. */
export function PhotoManager({ initial, enabled, name = 'photos' }: { initial: string[]; enabled: boolean; name?: string }) {
  const [photos, setPhotos] = useState(initial)
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    setErr('')
    const list = Array.from(files)
    for (let i = 0; i < list.length; i++) {
      setBusy(`Envoi ${i + 1}/${list.length}…`)
      try {
        const url = await uploadPhoto(list[i], 'vehicules', 'admin')
        setPhotos((p) => [...p, url])
      } catch (e) {
        setErr(`${list[i].name} : ${(e as Error).message}`)
      }
    }
    setBusy('')
    // signale au formulaire qu’il y a des changements
    input.current?.form?.dispatchEvent(new Event('change', { bubbles: true }))
  }
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= photos.length) return
    const p = [...photos]
    ;[p[i], p[j]] = [p[j], p[i]]
    setPhotos(p)
    input.current?.form?.dispatchEvent(new Event('change', { bubbles: true }))
  }
  const del = (i: number) => {
    setPhotos(photos.filter((_, k) => k !== i))
    input.current?.form?.dispatchEvent(new Event('change', { bubbles: true }))
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <input type="hidden" name={name} value={JSON.stringify(photos)} />
      {!enabled && <p className="banner warn" style={{ margin: 0 }}>L’envoi de photos sera actif dès que le stockage sera branché sur Vercel.</p>}
      <div className="ph-grid">
        {photos.map((p, i) => (
          <div className="ph-item" key={p}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt={`Photo ${i + 1}`} />
            {i === 0 && <span className="first">Photo principale</span>}
            <div className="tools">
              <button type="button" aria-label="Avancer" onClick={() => move(i, -1)}><ArrowLeft /></button>
              <button type="button" aria-label="Supprimer" onClick={() => del(i)}><Trash2 color="#c62f2f" /></button>
              <button type="button" aria-label="Reculer" onClick={() => move(i, 1)}><ArrowRight /></button>
            </div>
          </div>
        ))}
        <button type="button" className="ph-add" disabled={!enabled || !!busy} onClick={() => input.current?.click()}>
          {busy ? <Loader2 className="spin-ico" /> : <Camera />}
          {busy || 'Ajouter des photos'}
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      {err && <p className="banner warn" style={{ margin: 0 }}>{err}</p>}
      <p className="hint">La première photo apparaît sur l’annonce. Utilisez les flèches pour changer l’ordre.</p>
    </div>
  )
}

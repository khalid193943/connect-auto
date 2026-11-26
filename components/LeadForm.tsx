'use client'
import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight, Camera, Check, Loader2, X } from 'lucide-react'
import { submitLead } from '@/app/actions'
import type { RequestType } from '@/lib/types'
import { uploadPhoto } from '@/lib/client-image'
import { waHref } from '@/lib/format'

export type FieldDef = {
  name: string
  label: string
  type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'chips'
  options?: string[]
  required?: boolean
  full?: boolean
  placeholder?: string
  inputMode?: 'numeric' | 'text' | 'tel'
  defaultValue?: string
}

export function LeadForm({
  type, fields = [], withPhotos = false, uploads = false, vehicleId, submitLabel = 'Envoyer ma demande',
  title, intro, whatsapp, messageLabel = 'Votre message', messagePlaceholder, compact,
}: {
  type: RequestType
  fields?: FieldDef[]
  withPhotos?: boolean
  uploads?: boolean
  vehicleId?: string
  submitLabel?: string
  title?: string
  intro?: string
  whatsapp: string
  messageLabel?: string
  messagePlaceholder?: string
  compact?: boolean
}) {
  const [pending, start] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [chips, setChips] = useState<Record<string, string[]>>({})
  const [files, setFiles] = useState<{ file: File; url: string }[]>([])
  const [progress, setProgress] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next = [...files, ...Array.from(list).filter((f) => f.type.startsWith('image/')).map((file) => ({ file, url: URL.createObjectURL(file) }))]
    setFiles(next.slice(0, 8))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    if (!fd.get('consent')) {
      setError('Merci de cocher la case pour que nous puissions vous recontacter.')
      return
    }
    const values: Record<string, string> = {}
    for (const f of fields) {
      values[f.label] = f.type === 'chips' ? (chips[f.name] ?? []).join(', ') : String(fd.get(f.name) ?? '')
    }
    start(async () => {
      let photos: string[] = []
      if (withPhotos && files.length && uploads) {
        try {
          for (let i = 0; i < files.length; i++) {
            setProgress(`Envoi des photos ${i + 1}/${files.length}…`)
            photos.push(await uploadPhoto(files[i].file, 'reprise', 'reprise'))
          }
        } catch {
          photos = []
          values['Photos'] = 'Envoi des photos impossible : à demander par WhatsApp'
        }
        setProgress('')
      } else if (withPhotos && files.length) {
        values['Photos'] = `${files.length} photo(s) à envoyer par WhatsApp`
      }
      const res = await submitLead({
        type,
        name: String(fd.get('name') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        email: String(fd.get('email') ?? ''),
        message: String(fd.get('message') ?? ''),
        website: String(fd.get('website') ?? ''),
        fields: values,
        photos,
        vehicleId,
      })
      if (res.ok) setDone(true)
      else setError(res.error ?? 'Une erreur est survenue.')
    })
  }

  if (done) {
    return (
      <div className="form-card" role="status">
        <div className="form-ok">
          <span className="ico"><Check /></span>
          <h3 className="display h3">Demande bien reçue</h3>
          <p className="muted" style={{ margin: 0 }}>
            Merci ! Nous vous rappelons au plus vite pendant nos horaires d’ouverture.
            {withPhotos && files.length > 0 && !uploads ? ' Pensez à nous envoyer vos photos par WhatsApp.' : ''}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a className="btn btn-sm" href={waHref(whatsapp, 'Bonjour, je viens de faire une demande sur le site.')} target="_blank" rel="noopener">
              Écrire sur WhatsApp
            </a>
            <Link className="btn btn-sm" href="/occasions">Voir les occasions</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      {title && <h3 className="display h3" style={{ margin: 0 }}>{title}</h3>}
      {intro && <p className="muted" style={{ margin: 0 }}>{intro}</p>}
      <div className="form-grid">
        {fields.map((f) => (
          <div key={f.name} className={`field ${f.full || f.type === 'textarea' || f.type === 'chips' ? 'full' : ''}`}>
            <span>{f.label}{f.required && <i> *</i>}</span>
            {f.type === 'select' ? (
              <select name={f.name} required={f.required} defaultValue={f.defaultValue ?? ''}>
                <option value="" disabled>Choisir…</option>
                {f.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea name={f.name} placeholder={f.placeholder} />
            ) : f.type === 'chips' ? (
              <div className="chips" role="group" aria-label={f.label}>
                {f.options?.map((o) => {
                  const on = chips[f.name]?.includes(o) ?? false
                  return (
                    <button
                      type="button" key={o} className="chip" aria-pressed={on}
                      onClick={() => setChips((c) => ({ ...c, [f.name]: on ? (c[f.name] ?? []).filter((x) => x !== o) : [...(c[f.name] ?? []), o] }))}
                    >
                      {on && <Check size={15} />} {o}
                    </button>
                  )
                })}
              </div>
            ) : (
              <input name={f.name} type={f.type === 'date' ? 'date' : 'text'} inputMode={f.inputMode} placeholder={f.placeholder} required={f.required} defaultValue={f.defaultValue} />
            )}
          </div>
        ))}

        {withPhotos && (
          <div className="field full">
            <span>Photos du véhicule (8 maximum)</span>
            <div className="photos-pick">
              {files.map((f, i) => (
                <div className="ph" key={f.url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={`Photo ${i + 1}`} />
                  <button type="button" aria-label="Retirer la photo" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X /></button>
                </div>
              ))}
              {files.length < 8 && (
                <button type="button" className="photos-add" onClick={() => fileInput.current?.click()} style={{ background: 'transparent' }}>
                  <Camera /> Ajouter
                </button>
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          </div>
        )}

        <label className="field"><span>Nom et prénom<i> *</i></span><input name="name" autoComplete="name" required /></label>
        <label className="field"><span>Téléphone<i> *</i></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" required /></label>
        {!compact && <label className="field full"><span>E-mail (facultatif)</span><input name="email" type="email" autoComplete="email" /></label>}
        <label className="field full">
          <span>{messageLabel}</span>
          <textarea name="message" placeholder={messagePlaceholder} rows={compact ? 3 : 4} />
        </label>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: 'absolute', left: -9999, width: 1, height: 1 }} />
        <label className="check full">
          <input type="checkbox" name="consent" value="1" />
          <span>
            J’accepte que Connect Auto utilise ces informations pour me recontacter au sujet de ma demande.{' '}
            <Link href="/confidentialite" style={{ textDecoration: 'underline' }}>En savoir plus</Link>
          </span>
        </label>
      </div>
      {error && <p className="form-err" role="alert">{error}</p>}
      <button className="btn btn-accent btn-block" disabled={pending}>
        {pending ? <Loader2 className="spin-ico" /> : null}
        {pending ? progress || 'Envoi…' : submitLabel}
        {!pending && <ArrowRight className="arrow" />}
      </button>
    </form>
  )
}

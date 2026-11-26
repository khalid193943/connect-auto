'use client'
import { useState } from 'react'
import { Download, Loader2, MessageCircle } from 'lucide-react'
import { waHref } from '@/lib/format'

/** Envoie le PDF : partage natif du téléphone (WhatsApp, e-mail…) ou lien WhatsApp vers le PDF en ligne. */
export function ShareDoc({ id, token, phone, label, filename }: { id: string; token: string; phone?: string; label: string; filename: string }) {
  const [busy, setBusy] = useState(false)
  const url = `/api/documents/${id}/pdf?t=${token}`
  const share = async () => {
    setBusy(true)
    const link = `${location.origin}${url}`
    const text = `Bonjour, voici votre ${label} Connect Auto.`
    try {
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], filename, { type: 'application/pdf' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text })
        setBusy(false)
        return
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') { setBusy(false); return }
    }
    window.open(phone ? waHref(phone, `${text} ${link}`) : `https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`, '_blank')
    setBusy(false)
  }
  return (
    <div className="actions">
      <button type="button" className="b wa" onClick={share} disabled={busy}>{busy ? <Loader2 className="spin-ico" /> : <MessageCircle />} Envoyer</button>
      <a className="b" href={url} target="_blank" rel="noopener"><Download /> PDF</a>
    </div>
  )
}

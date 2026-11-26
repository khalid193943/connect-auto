'use client'
import { useState } from 'react'
import { CheckCircle2, Loader2, TriangleAlert, UploadCloud } from 'lucide-react'

const CRED: Record<string, string> = { jeton: 'clé BLOB_READ_WRITE_TOKEN', 'connexion-auto': 'connexion automatique (BLOB_STORE_ID)', 'test-local': 'stockage de test local', aucun: 'aucun stockage relié' }

/** Réglages : vérifie en un clic que l’envoi de photos fonctionne en ligne. */
export function BlobCheck() {
  const [busy, setBusy] = useState(false)
  const [r, setR] = useState<{ ok: boolean; message: string; credential?: string } | null>(null)
  const run = async () => {
    setBusy(true)
    setR(null)
    try {
      const res = await fetch('/api/admin/blob-check', { method: 'POST' })
      setR(await res.json())
    } catch {
      setR({ ok: false, message: 'Le site ne répond pas. Vérifiez la connexion.' })
    }
    setBusy(false)
  }
  return (
    <div className="card">
      <h2>Envoi des photos</h2>
      <p className="hint">Enregistre un petit fichier de test dans le stockage Vercel Blob, le relit puis le supprime.</p>
      <button type="button" className="b" onClick={run} disabled={busy}>
        {busy ? <Loader2 className="spin-ico" /> : <UploadCloud />} Tester l’envoi de photos
      </button>
      {r && (
        <p className={`banner ${r.ok ? 'ok' : 'warn'}`} role="status">
          {r.ok ? <CheckCircle2 /> : <TriangleAlert />} {r.message}
          {r.credential && <><br /><small>Branchement : {CRED[r.credential] ?? r.credential}</small></>}
        </p>
      )}
    </div>
  )
}

'use client'

/** Réduit une photo de téléphone (max 2000 px, JPEG) avant l’envoi : plus rapide sur la 4G. */
export async function shrink(file: File, max = 2000, quality = 0.84): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
    if (k === 1 && file.size < 1_500_000) return file
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * k)
    c.height = Math.round(bmp.height * k)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    const blob: Blob = await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/jpeg', quality))
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

const isHeic = (f: File) => /image\/hei[cf]/.test(f.type) || /\.hei[cf]$/i.test(f.name)

/** Envoie une photo et renvoie son adresse. Les erreurs sont des phrases claires, à afficher telles quelles. */
export async function uploadPhoto(file: File, folder: string, payload: string, raw = false): Promise<string> {
  // réduction plus forte si besoin pour rester sous la limite d’envoi (4 Mo)
  let small = raw || file.type === 'image/svg+xml' ? file : await shrink(file)
  if (!raw && small.size > 3.8 * 1024 * 1024) small = await shrink(file, 1600, 0.75)
  if (isHeic(small)) throw new Error('Photo au format HEIC (iPhone) : ce navigateur ne sait pas la lire. Envoyez-la depuis le téléphone, ou exportez-la en JPEG.')
  if (small.size > 4.2 * 1024 * 1024) throw new Error('Photo trop lourde (plus de 4 Mo), même après réduction.')
  const fd = new FormData()
  fd.append('file', small)
  fd.append('folder', folder)
  fd.append('scope', payload)
  let res: Response
  try {
    res = await fetch('/api/upload', { method: 'POST', body: fd })
  } catch {
    throw new Error('Connexion interrompue pendant l’envoi. Réessayez.')
  }
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (res.status === 413) throw new Error('Photo trop lourde pour l’envoi.')
  if (!res.ok || !json.url) throw new Error(json.error || `Envoi impossible (erreur ${res.status}).`)
  return json.url
}

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

export async function uploadPhoto(file: File, folder: string, payload: string, raw = false): Promise<string> {
  // réduction plus forte si besoin pour rester sous la limite d’envoi (4 Mo)
  let small = raw || file.type === 'image/svg+xml' ? file : await shrink(file)
  if (!raw && small.size > 3.8 * 1024 * 1024) small = await shrink(file, 1600, 0.75)
  const fd = new FormData()
  fd.append('file', small)
  fd.append('folder', folder)
  fd.append('scope', payload)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok || !json.url) throw new Error(json.error || 'Envoi impossible')
  return json.url
}

import type { Doc, DocLine, DocStatus, DocType } from './types'

export const DOC_LABEL: Record<DocType, string> = { devis: 'Devis', commande: 'Bon de commande', facture: 'Facture' }
export const DOC_PREFIX: Record<DocType, string> = { devis: 'D', commande: 'BC', facture: 'F' }
export const STATUS_LABEL: Record<DocStatus, string> = {
  brouillon: 'Brouillon', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé', emise: 'À payer', payee: 'Payée',
}
export const STATUS_COLOR: Record<DocStatus, string> = {
  brouillon: 'grey', envoye: 'blue', accepte: 'green', refuse: 'red', emise: 'orange', payee: 'green',
}

const r2 = (n: number) => Math.round(n * 100) / 100

export function totals(lines: DocLine[], vatMode: Doc['vatMode']) {
  if (vatMode === 'marge') {
    const ttc = r2(lines.reduce((s, l) => s + (l.qty || 0) * (l.unit || 0), 0))
    return { ht: ttc, ttc, vat: [] as { rate: number; base: number; amount: number }[] }
  }
  const byRate = new Map<number, number>()
  for (const l of lines) {
    const base = (l.qty || 0) * (l.unit || 0)
    byRate.set(l.vat, (byRate.get(l.vat) ?? 0) + base)
  }
  const vat = [...byRate.entries()].sort((a, b) => b[0] - a[0]).map(([rate, base]) => ({ rate, base: r2(base), amount: r2((base * rate) / 100) }))
  const ht = r2(vat.reduce((s, v) => s + v.base, 0))
  const ttc = r2(ht + vat.reduce((s, v) => s + v.amount, 0))
  return { ht, ttc, vat }
}

export const docNumber = (type: DocType, year: number, n: number) => `${DOC_PREFIX[type]}-${year}-${String(n).padStart(4, '0')}`
export const isLocked = (d: Doc) => d.type === 'facture' && (d.status === 'emise' || d.status === 'payee')

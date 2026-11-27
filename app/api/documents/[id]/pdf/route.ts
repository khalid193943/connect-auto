import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { get } from '@/lib/store'
import { sessionCan } from '@/lib/auth'
import { getSettings } from '@/lib/data'
import { DOC_LABEL, totals } from '@/lib/docs'
import { LOGO_DOC_PNG } from '@/lib/brand/logo-doc'
import type { Doc, Settings } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Les polices standard du PDF ne connaissent que l’alphabet « WinAnsi » : on remplace le reste. */
const safe = (s: string) =>
  s
    .replace(/[   ]/g, ' ')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/³/g, '3')
    .replace(/[^\x20-\x7e -ÿ€Œœ•]/g, '')

const money = (n: number) => safe(new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n))
const day = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const out: string[] = []
  for (const para of safe(text).split('\n')) {
    let line = ''
    for (const w of para.split(' ')) {
      const t = line ? `${line} ${w}` : w
      if (font.widthOfTextAtSize(t, size) > max && line) {
        out.push(line)
        line = w
      } else line = t
    }
    out.push(line)
  }
  return out
}

async function render(d: Doc, s: Settings) {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`${DOC_LABEL[d.type]} ${d.number}`)
  pdf.setAuthor('Connect Auto')
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await pdf.embedPng(Buffer.from(LOGO_DOC_PNG, 'base64'))
  const W = 595.28, H = 841.89, M = 44
  const ink = rgb(0.05, 0.07, 0.09), mute = rgb(0.38, 0.42, 0.47), green = rgb(0.12, 0.62, 0.28), line = rgb(0.86, 0.88, 0.9)
  let page: PDFPage = pdf.addPage([W, H])
  let y = H - M

  const text = (t: string, x: number, yy: number, o: { size?: number; f?: PDFFont; color?: ReturnType<typeof rgb>; right?: boolean } = {}) => {
    const size = o.size ?? 10, f = o.f ?? font, str = safe(t)
    const w = f.widthOfTextAtSize(str, size)
    page.drawText(str, { x: o.right ? x - w : x, y: yy, size, font: f, color: o.color ?? ink })
  }

  // En-tête
  const lw = 170, lh = (logo.height / logo.width) * lw
  page.drawImage(logo, { x: M, y: y - lh, width: lw, height: lh })
  text(DOC_LABEL[d.type].toUpperCase(), W - M, y - 18, { size: 20, f: bold, right: true })
  text(`N° ${d.number}`, W - M, y - 36, { size: 11, f: bold, color: green, right: true })
  text(`Date : ${day(d.date)}`, W - M, y - 52, { right: true, color: mute })
  if (d.dueDate) text(`${d.type === 'facture' ? 'Échéance' : 'Valable jusqu’au'} : ${day(d.dueDate)}`, W - M, y - 66, { right: true, color: mute })
  y -= Math.max(lh, 70) + 18

  // Émetteur / client
  const L = s.legal
  const left = [L.company, s.street, `${s.zip} ${s.city}`, `Tél. ${s.phone}`, s.email, `SIRET ${L.siret}`, L.vat ? `TVA ${L.vat}` : ''].filter(Boolean) as string[]
  const c = d.client
  const right = [c.company, c.name, ...(c.address ? c.address.split('\n') : []), c.phone ? `Tél. ${c.phone}` : '', c.email ?? '', c.siret ? `SIRET ${c.siret}` : ''].filter(Boolean) as string[]
  page.drawRectangle({ x: W / 2 + 6, y: y - 14 * right.length - 22, width: W / 2 - M - 6, height: 14 * right.length + 30, color: rgb(0.96, 0.97, 0.98) })
  text('ÉMETTEUR', M, y, { size: 8, f: bold, color: mute })
  text('CLIENT', W / 2 + 18, y, { size: 8, f: bold, color: mute })
  left.forEach((t, i) => text(t, M, y - 16 - i * 13, { f: i === 0 ? bold : font, size: 9.5 }))
  right.forEach((t, i) => text(t, W / 2 + 18, y - 16 - i * 14, { f: i === 0 ? bold : font }))
  y -= Math.max(left.length * 13, right.length * 14 + 14) + 34

  // Tableau
  const marge = d.vatMode === 'marge'
  const cols = marge ? { qty: W - M - 170, unit: W - M - 90, tot: W - M } : { qty: W - M - 220, unit: W - M - 150, vat: W - M - 90, tot: W - M }
  const header = () => {
    page.drawRectangle({ x: M, y: y - 8, width: W - 2 * M, height: 24, color: ink })
    text('Désignation', M + 10, y, { f: bold, size: 9, color: rgb(1, 1, 1) })
    text('Qté', cols.qty, y, { f: bold, size: 9, color: rgb(1, 1, 1), right: true })
    text(marge ? 'P.U. TTC' : 'P.U. HT', cols.unit, y, { f: bold, size: 9, color: rgb(1, 1, 1), right: true })
    if (!marge) text('TVA', (cols as { vat: number }).vat, y, { f: bold, size: 9, color: rgb(1, 1, 1), right: true })
    text(marge ? 'Total TTC' : 'Total HT', cols.tot - 8, y, { f: bold, size: 9, color: rgb(1, 1, 1), right: true })
    y -= 28
  }
  header()
  const descW = cols.qty - M - 50
  for (const l of d.lines) {
    const rows = wrap(l.label, font, 10, descW)
    const need = rows.length * 13 + 10
    if (y - need < 170) {
      page = pdf.addPage([W, H])
      y = H - M
      header()
    }
    rows.forEach((r, i) => text(r, M + 10, y - i * 13))
    text(String(l.qty).replace('.', ','), cols.qty, y, { right: true })
    text(money(l.unit), cols.unit, y, { right: true })
    if (!marge) text(`${String(l.vat).replace('.', ',')} %`, (cols as { vat: number }).vat, y, { right: true })
    text(money(l.qty * l.unit), cols.tot - 8, y, { right: true, f: bold })
    const bottom = y - (rows.length - 1) * 13 - 8
    page.drawLine({ start: { x: M, y: bottom }, end: { x: W - M, y: bottom }, thickness: 0.6, color: line })
    y = bottom - 16
  }

  // Totaux
  const t = totals(d.lines, d.vatMode)
  y -= 8
  const tx = W - M - 200
  if (!marge) {
    text('Total HT', tx, y); text(money(t.ht), W - M - 8, y, { right: true }); y -= 16
    for (const v of t.vat) { text(`TVA ${String(v.rate).replace('.', ',')} %`, tx, y); text(money(v.amount), W - M - 8, y, { right: true }); y -= 16 }
  }
  y -= 6
  page.drawRectangle({ x: tx - 10, y: y - 10, width: 210, height: 28, color: green })
  text('TOTAL TTC', tx, y, { f: bold, size: 11, color: rgb(1, 1, 1) })
  text(money(t.ttc), W - M - 8, y, { f: bold, size: 12, color: rgb(1, 1, 1), right: true })
  y -= 40
  if (marge) { text('Régime particulier - Biens d’occasion (TVA sur la marge, art. 297 A du CGI). TVA non récupérable.', M, y, { size: 8.5, color: mute }); y -= 16 }
  if (d.status === 'payee' && d.paidAt) { text(`Payée le ${day(d.paidAt.slice(0, 10))}${d.paymentMethod ? ` par ${d.paymentMethod.toLowerCase()}` : ''}.`, M, y, { f: bold, color: green }); y -= 18 }

  if (d.notes) { for (const r of wrap(d.notes, font, 9.5, W - 2 * M)) { text(r, M, y, { size: 9.5 }); y -= 13 } y -= 6 }
  if (d.type === 'devis') { text('Bon pour accord (date et signature) :', M, y, { size: 9.5, f: bold }); y -= 60 }
  if (d.type === 'commande') { text('Signature du client :', M, y, { size: 9.5, f: bold }); text('Signature du vendeur :', W / 2, y, { size: 9.5, f: bold }); y -= 60 }

  // Pied de page
  const foot = [
    d.type === 'facture' && s.iban ? `Règlement par virement : IBAN ${s.iban}` : '',
    d.type === 'facture' ? s.docFooter : '',
    `${L.company}${L.capital ? `, capital ${L.capital}` : ''} · ${s.street}, ${s.zip} ${s.city} · SIRET ${L.siret}${L.rcs ? ` · ${L.rcs}` : ''} · NAF ${L.naf}${L.vat ? ` · TVA ${L.vat}` : ''}`,
  ].filter(Boolean)
  pdf.getPages().forEach((p, i, all) => {
    let fy = 30 + 10 * foot.length
    for (const f of foot) for (const r of wrap(f, font, 7.5, W - 2 * M)) { p.drawText(r, { x: M, y: fy, size: 7.5, font, color: mute }); fy -= 10 }
    p.drawText(safe(`Page ${i + 1}/${all.length}`), { x: W - M - 40, y: 18, size: 7.5, font, color: mute })
  })
  return pdf.save()
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const d = await get('docs', id)
  if (!d) return new Response('Document introuvable', { status: 404 })
  const t = new URL(req.url).searchParams.get('t')
  if (t !== d.token && !(await sessionCan('documents'))) return new Response('Accès refusé', { status: 403 })
  if (d.type === 'facture' && !d.number) return new Response('Facture non émise', { status: 409 })
  const bytes = await render(d, await getSettings())
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${d.number || 'document'}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}

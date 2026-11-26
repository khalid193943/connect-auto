import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRightLeft, BadgeCheck, Send, Stamp, User } from 'lucide-react'
import { get, list } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { ActionForm, ActButton, ConfirmButton } from '@/components/admin/ActionForm'
import { DocEditor } from '@/components/admin/DocEditor'
import { ShareDoc } from '@/components/admin/ShareDoc'
import { convertDoc, deleteDoc, emitInvoice, markPaid, saveDoc, setDocStatus } from '../../../actions'
import { DOC_LABEL, STATUS_COLOR, STATUS_LABEL, isLocked, totals } from '@/lib/docs'
import { dateFr, eur, km } from '@/lib/format'
import type { Doc, DocType } from '@/lib/types'

type SP = { type?: string; client?: string; lead?: string; vehicle?: string; ok?: string }

export default async function DocPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<SP> }) {
  const { id } = await params
  const sp = await searchParams
  const isNew = id === 'nouveau'
  const [clients, prices] = await Promise.all([list('clients'), list('prices')])
  let doc: Partial<Doc> | null
  if (isNew) {
    const type = (['devis', 'commande', 'facture'].includes(sp.type ?? '') ? sp.type : 'devis') as DocType
    doc = { type, vatMode: 'normal', lines: [] }
    if (sp.client) {
      const c = await get('clients', sp.client)
      if (c) doc.clientId = c.id, doc.client = { name: c.name, company: c.company, siret: c.siret, address: c.address, phone: c.phone, email: c.email }
    }
    if (sp.lead) {
      const l = await get('leads', sp.lead)
      if (l) {
        doc.clientId = l.clientId
        doc.client = { name: l.name, phone: l.phone, email: l.email }
        const what = l.fields['Prestation'] || l.fields['Prestations'] || ''
        doc.lines = [{ label: [what, l.fields['Véhicule']].filter(Boolean).join(' · ') || 'Prestation', qty: 1, unit: 0, vat: 20 }]
      }
    }
    if (sp.vehicle) {
      const v = await get('vehicles', sp.vehicle)
      if (v) {
        doc.vehicleId = v.id
        doc.vatMode = v.vatRecoverable ? 'normal' : 'marge'
        const label = `Vente véhicule d’occasion ${v.brand} ${v.model} ${v.version}, ${v.year}, ${km(v.km)}${v.purchase?.registration ? `, immat. ${v.purchase.registration}` : ''}${v.purchase?.vin ? `, VIN ${v.purchase.vin}` : ''}`
        doc.lines = [{ label, qty: 1, unit: v.vatRecoverable ? Math.round((v.price / 1.2) * 100) / 100 : v.price, vat: 20 }]
      }
    }
  } else {
    doc = await get('docs', id)
  }
  if (!doc) notFound()
  const d = doc
  const locked = !isNew && isLocked(d as Doc)
  const t = totals(d.lines ?? [], d.vatMode ?? 'normal')
  const label = DOC_LABEL[d.type!]

  return (
    <main className="adm-main">
      <Back href="/admin/documents" label="Devis & factures" />
      <div className="adm-head">
        <div>
          <h1>{isNew ? `Nouveau ${label.toLowerCase()}` : `${label} ${d.number || '(brouillon)'}`}</h1>
          {!isNew && <p className="sub">{d.client?.company || d.client?.name} · {eur(t.ttc, 2)} TTC</p>}
        </div>
        {!isNew && <span className={`pill ${STATUS_COLOR[d.status!]}`}>{STATUS_LABEL[d.status!]}</span>}
      </div>
      {sp.ok && <p className="banner ok" style={{ margin: 0 }}>Document créé.</p>}

      {!isNew && (
        <div className="card">
          {d.type === 'facture' && !d.number ? (
            <>
              <p className="banner info" style={{ margin: 0 }}>Brouillon : vérifiez les lignes, puis émettez la facture. Elle reçoit alors son numéro définitif et ne peut plus être modifiée.</p>
              <ConfirmButton className="b dark full" action={emitInvoice.bind(null, d.id!)} confirm="Confirmer : émettre la facture"><Stamp /> Émettre la facture</ConfirmButton>
            </>
          ) : (
            <ShareDoc id={d.id!} token={d.token!} phone={d.client?.phone} label={label.toLowerCase()} filename={`${d.number}.pdf`} />
          )}
          {d.type === 'devis' && (
            <div className="actions">
              <ActButton action={setDocStatus.bind(null, d.id!, 'envoye')} className={`b sm ${d.status === 'envoye' ? 'dark' : ''}`}><Send /> Envoyé</ActButton>
              <ActButton action={setDocStatus.bind(null, d.id!, 'accepte')} className={`b sm ${d.status === 'accepte' ? 'pri' : ''}`}><BadgeCheck /> Accepté</ActButton>
            </div>
          )}
          {d.type !== 'facture' && (
            <div className="actions">
              {d.type === 'devis' && <ActButton action={convertDoc.bind(null, d.id!, 'commande')}><ArrowRightLeft /> En bon de commande</ActButton>}
              <ActButton action={convertDoc.bind(null, d.id!, 'facture')}><ArrowRightLeft /> En facture</ActButton>
            </div>
          )}
          {d.type === 'facture' && d.status === 'emise' && (
            <div className="actions three">
              {['Carte', 'Virement', 'Espèces'].map((m) => <ActButton key={m} className="b sm pri" action={markPaid.bind(null, d.id!, m)}>Payée · {m}</ActButton>)}
            </div>
          )}
          {d.status === 'payee' && <p className="banner ok" style={{ margin: 0 }}>Payée le {dateFr(d.paidAt!)}{d.paymentMethod ? ` par ${d.paymentMethod.toLowerCase()}` : ''}.</p>}
          {d.clientId && <Link href={`/admin/clients/${d.clientId}`} className="b sm"><User /> Fiche client</Link>}
        </div>
      )}

      {locked ? (
        <div className="card">
          <h2>Contenu</h2>
          {d.lines!.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--a-line)', paddingBottom: 8 }}>
              <span>{l.qty} × {l.label}</span><b className="num">{eur(l.qty * l.unit, 2)}</b>
            </div>
          ))}
          <div className="totals num"><div className="grand"><span>Total TTC</span><b>{eur(t.ttc, 2)}</b></div></div>
          <p className="hint">Facture émise : elle ne peut plus être modifiée (obligation légale). En cas d’erreur, établissez une facture d’avoir.</p>
        </div>
      ) : (
        <ActionForm action={saveDoc} label={isNew ? 'Créer' : 'Enregistrer'}>
          <input type="hidden" name="id" value={isNew ? '' : d.id} />
          <input type="hidden" name="type" value={d.type} />
          <input type="hidden" name="vehicleId" value={d.vehicleId ?? ''} />
          <DocEditor
            doc={d}
            clients={clients.map((c) => ({ id: c.id, name: c.name, phone: c.phone, company: c.company, siret: c.siret, address: c.address, email: c.email }))}
            prices={prices.sort((a, b) => a.order - b.order)}
          />
        </ActionForm>
      )}

      {!isNew && !locked && <ConfirmButton action={deleteDoc.bind(null, d.id!)} confirm="Confirmer la suppression">Supprimer ce document</ConfirmButton>}
    </main>
  )
}

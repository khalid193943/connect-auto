import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileText, MessageCircle, Phone, Receipt } from 'lucide-react'
import { get, list } from '@/lib/store'
import { Back, LeadRow } from '@/components/admin/ui'
import { ActionForm, ConfirmButton } from '@/components/admin/ActionForm'
import { deleteClient, saveClient } from '../../../actions'
import { DOC_LABEL, STATUS_COLOR, STATUS_LABEL, totals } from '@/lib/docs'
import { dateShort, eur, telHref, waHref } from '@/lib/format'
import type { Client } from '@/lib/types'

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'nouveau'
  const c: Partial<Client> | null = isNew ? { kind: 'particulier' } : await get('clients', id)
  if (!c) notFound()
  const [docs, leads] = isNew ? [[], []] : await Promise.all([list('docs'), list('leads')])
  const myDocs = docs.filter((d) => d.clientId === c.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const myLeads = leads.filter((l) => l.clientId === c.id || (c.phone && l.phone.replace(/\D/g, '') === c.phone.replace(/\D/g, '')))
  const billed = myDocs.filter((d) => d.type === 'facture' && d.number).reduce((s, d) => s + totals(d.lines, d.vatMode).ttc, 0)
  return (
    <main className="adm-main">
      <Back href="/admin/clients" label="Clients" />
      <h1>{isNew ? 'Nouveau client' : c.name}</h1>
      {!isNew && (
        <>
          {c.phone && (
            <div className="actions">
              <a href={telHref(c.phone)} className="b pri"><Phone /> Appeler</a>
              <a href={waHref(c.phone)} target="_blank" className="b wa"><MessageCircle /> WhatsApp</a>
            </div>
          )}
          <div className="actions">
            <Link href={`/admin/documents/nouveau?type=devis&client=${c.id}`} className="b sm"><FileText /> Nouveau devis</Link>
            <Link href={`/admin/documents/nouveau?type=facture&client=${c.id}`} className="b sm"><Receipt /> Nouvelle facture</Link>
          </div>
          <div className="card flat">
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--a-line)', display: 'flex', justifyContent: 'space-between' }}>
              <h2>Historique</h2>
              <span className="hint">Facturé : <b>{eur(billed, 2)}</b></span>
            </div>
            <div className="rows">
              {myDocs.map((d) => (
                <Link key={d.id} href={`/admin/documents/${d.id}`} className="row">
                  <span className="main"><b>{DOC_LABEL[d.type]} {d.number || '(brouillon)'}</b><span>{dateShort(d.date)} · {d.lines[0]?.label}</span></span>
                  <span className="end"><b className="num">{eur(totals(d.lines, d.vatMode).ttc, 2)}</b><span className={`pill ${STATUS_COLOR[d.status]}`}>{STATUS_LABEL[d.status]}</span></span>
                </Link>
              ))}
              {myLeads.map((l) => <LeadRow key={l.id} l={l} />)}
              {!myDocs.length && !myLeads.length && <p className="empty-a">Pas encore d’historique.</p>}
            </div>
          </div>
        </>
      )}
      <ActionForm action={saveClient}>
        <input type="hidden" name="id" value={isNew ? '' : c.id} />
        <div className="card">
          <div className="choice" style={{ ['--n' as string]: 2 }}>
            <label><input type="radio" name="kind" value="particulier" defaultChecked={c.kind !== 'pro'} /><span>Particulier</span></label>
            <label><input type="radio" name="kind" value="pro" defaultChecked={c.kind === 'pro'} /><span>Professionnel</span></label>
          </div>
          <label className="f"><span>Nom et prénom *</span><input name="name" defaultValue={c.name} required /></label>
          <label className="f"><span>Téléphone</span><input name="phone" type="tel" defaultValue={c.phone} /></label>
          <label className="f"><span>E-mail</span><input name="email" type="email" defaultValue={c.email} /></label>
          <label className="f"><span>Adresse</span><textarea name="address" defaultValue={c.address} style={{ minHeight: 80 }} /></label>
          <div className="grid2">
            <label className="f"><span>Société</span><input name="company" defaultValue={c.company} /></label>
            <label className="f"><span>SIRET</span><input name="siret" inputMode="numeric" defaultValue={c.siret} /></label>
          </div>
          <label className="f"><span>Notes (véhicules, préférences…)</span><textarea name="notes" defaultValue={c.notes} /></label>
        </div>
      </ActionForm>
      {!isNew && <ConfirmButton action={deleteClient.bind(null, c.id!)} confirm="Confirmer la suppression">Supprimer la fiche</ConfirmButton>}
    </main>
  )
}

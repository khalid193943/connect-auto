import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileText, MessageCircle, Phone, UserPlus, Car } from 'lucide-react'
import { Fragment } from 'react'
import { get, put } from '@/lib/store'
import { Back, LEAD_STATUS, LEAD_TYPE } from '@/components/admin/ui'
import { ActButton, ConfirmButton } from '@/components/admin/ActionForm'
import { deleteLead, leadToClient, setLeadStatus } from '../../../actions'
import { dateFr, telHref, waHref } from '@/lib/format'

export default async function Demande({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const l = await get('leads', id)
  if (!l) notFound()
  if (l.status === 'nouvelle') await put('leads', { ...l, status: 'en_cours' })
  const v = l.vehicleId ? await get('vehicles', l.vehicleId) : null
  const status = l.status === 'nouvelle' ? 'en_cours' : l.status
  const first = l.name.split(' ').find((x) => x && x !== '·' && x !== 'Exemple') ?? ''
  return (
    <main className="adm-main">
      <Back href="/admin/demandes" label="Demandes" />
      <div className="adm-head">
        <div>
          <h1>{l.name}</h1>
          <p className="sub">{LEAD_TYPE[l.type]} · {dateFr(l.createdAt, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span className={`pill ${LEAD_STATUS[status][1]}`}>{LEAD_STATUS[status][0]}</span>
      </div>

      <div className="actions">
        <a href={telHref(l.phone)} className="b pri"><Phone /> Appeler</a>
        <a href={waHref(l.phone, `Bonjour ${first}, c’est Connect Auto suite à votre demande sur notre site.`)} target="_blank" className="b wa"><MessageCircle /> WhatsApp</a>
      </div>

      <div className="card">
        <dl className="kv">
          <dt>Téléphone</dt><dd><a href={telHref(l.phone)}>{l.phone}</a></dd>
          {l.email && <><dt>E-mail</dt><dd><a href={`mailto:${l.email}`}>{l.email}</a></dd></>}
          {Object.entries(l.fields).map(([k, val]) => <Fragment key={k}><dt>{k}</dt><dd>{val}</dd></Fragment>)}
        </dl>
        {l.message && <p style={{ margin: 0, padding: 14, background: '#f6f8f9', borderRadius: 12, whiteSpace: 'pre-wrap' }}>{l.message}</p>}
        {l.photos.length > 0 && (
          <div className="ph-grid">
            {l.photos.map((p, i) => (
              <a key={p} href={p} target="_blank" className="ph-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt={`Photo ${i + 1}`} />
              </a>
            ))}
          </div>
        )}
        {v && <Link href={`/admin/vehicules/${v.id}`} className="b sm"><Car /> {v.brand} {v.model} · {v.ref}</Link>}
      </div>

      <div className="card">
        <h2>Suite à donner</h2>
        <div className="actions">
          {l.clientId ? (
            <Link href={`/admin/clients/${l.clientId}`} className="b sm"><UserPlus /> Fiche client</Link>
          ) : (
            <ActButton action={leadToClient.bind(null, l.id)}><UserPlus /> Créer la fiche client</ActButton>
          )}
          <Link href={`/admin/documents/nouveau?type=devis&lead=${l.id}`} className="b sm"><FileText /> Faire un devis</Link>
        </div>
        {status !== 'traitee' ? (
          <ActButton className="b dark full" action={setLeadStatus.bind(null, l.id, 'traitee')}>Marquer comme traitée</ActButton>
        ) : (
          <ActButton className="b full" action={setLeadStatus.bind(null, l.id, 'en_cours')}>Remettre à traiter</ActButton>
        )}
      </div>
      <ConfirmButton action={deleteLead.bind(null, l.id)} confirm="Confirmer la suppression">Supprimer la demande</ConfirmButton>
    </main>
  )
}

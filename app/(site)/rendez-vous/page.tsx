import type { Metadata } from 'next'
import { MessageCircle, Phone } from 'lucide-react'
import { getServices, getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'
import { LeadForm } from '@/components/LeadForm'
import { HoursTable } from '@/components/Hours'
import { OpenStatus } from '@/components/OpenStatus'
import { telHref, waHref } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Prendre rendez-vous ou demander un devis',
  description: 'Rendez-vous atelier et devis gratuit : entretien, mécanique, carrosserie, pneus, pare-brise, carte grise. Connect Auto, 1520 route de Nîmes, Milhaud.',
  alternates: { canonical: '/rendez-vous' },
}

export default async function RendezVous() {
  const [s, services] = await Promise.all([getSettings(), getServices()])
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Rendez-vous', url: '/rendez-vous' }]}
        eyebrow="Atelier"
        art="utilitaire"
        title="Rendez-vous"
        accent="& devis"
        lead="Choisissez une ou plusieurs prestations, indiquez votre véhicule et vos disponibilités : nous vous rappelons pour confirmer le créneau et le prix."
      />
      <section className="section tight wrap">
        <div className="split wide-left">
          <LeadForm
            type="rdv"
            whatsapp={s.whatsapp}
            messageLabel="Ce qui se passe avec votre véhicule"
            messagePlaceholder="Bruit, voyant, entretien à faire, choc…"
            submitLabel="Demander mon rendez-vous"
            fields={[
              { name: 'prestations', label: 'Prestations', type: 'chips', options: services.map((x) => x.title), required: true },
              { name: 'vehicule', label: 'Véhicule', required: true, placeholder: 'Ex. Citroën Jumpy 2019' },
              { name: 'immat', label: 'Immatriculation (facultatif)', placeholder: 'AB-123-CD' },
              { name: 'date', label: 'Date souhaitée', type: 'date' },
              { name: 'moment', label: 'Moment', type: 'select', options: ['Matin', 'Après-midi', 'Peu importe'] },
            ]}
          />
          <aside className="stack sticky">
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h2 className="display h3" style={{ margin: 0 }}>Plus rapide ?</h2>
                <OpenStatus hours={s.hours} />
              </div>
              <a href={telHref(s.phone)} className="btn btn-accent btn-block"><Phone /> {s.phone}</a>
              <a href={waHref(s.whatsapp, 'Bonjour, je voudrais un rendez-vous pour ')} target="_blank" rel="noopener" className="btn btn-block"><MessageCircle /> WhatsApp {s.whatsapp}</a>
              <HoursTable hours={s.hours} />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

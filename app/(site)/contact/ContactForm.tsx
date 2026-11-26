'use client'
import { useSearchParams } from 'next/navigation'
import { LeadForm } from '@/components/LeadForm'

const SUBJECTS = ['Question générale', 'Je cherche un véhicule', 'Un véhicule du stock', 'Atelier / devis', 'Reprise de mon véhicule', 'Carte grise', 'Autre']

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const sp = useSearchParams()
  const recherche = sp.get('sujet') === 'recherche'
  return (
    <LeadForm
      type="contact"
      title={recherche ? 'Votre recherche' : 'Écrivez-nous'}
      intro={recherche ? 'Type de véhicule, budget, kilométrage : nous vous prévenons dès qu’un véhicule correspond.' : undefined}
      whatsapp={whatsapp}
      messageLabel="Votre message"
      messagePlaceholder={recherche ? 'Ex. fourgon L2H2, moins de 120 000 km, budget 20 000 € TTC' : undefined}
      fields={[{ name: 'sujet', label: 'Sujet', type: 'select', options: SUBJECTS, defaultValue: recherche ? 'Je cherche un véhicule' : '', required: true, full: true }]}
    />
  )
}

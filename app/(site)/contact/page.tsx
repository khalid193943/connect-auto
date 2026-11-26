import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { getSettings } from '@/lib/data'
import { PageHero } from '@/components/PageHero'
import { HoursTable } from '@/components/Hours'
import { OpenStatus } from '@/components/OpenStatus'
import { ContactForm } from './ContactForm'
import { Slot } from '@/components/Slot'
import { telHref, waHref } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Contact et accès : 1520 route de Nîmes, Milhaud',
  description: 'Téléphone, WhatsApp, horaires et plan d’accès du garage Connect Auto, 1520 route de Nîmes à Milhaud, entre Nîmes et Montpellier.',
  alternates: { canonical: '/contact' },
}

export default async function Contact() {
  const s = await getSettings()
  const addr = `${s.street}, ${s.zip} ${s.city}`
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Contact', url: '/contact' }]}
        eyebrow="Contact & accès"
        title="Parlons de"
        accent="votre véhicule"
        lead="Par téléphone, sur WhatsApp, avec le formulaire ou directement au garage : choisissez ce qui vous arrange."
      >
        <div style={{ marginTop: 24 }}><OpenStatus hours={s.hours} /></div>
      </PageHero>
      <section className="section tight wrap">
        <div className="info-cards">
          <a className="info-card" href={telHref(s.phone)}><span className="ico"><Phone /></span><h3>Téléphone</h3><span className="big-link">{s.phone}</span></a>
          <a className="info-card" href={waHref(s.whatsapp, 'Bonjour Connect Auto, ')} target="_blank" rel="noopener"><span className="ico"><MessageCircle /></span><h3>WhatsApp</h3><span className="big-link">{s.whatsapp}</span></a>
          <a className="info-card" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`} target="_blank" rel="noopener"><span className="ico"><MapPin /></span><h3>Adresse</h3><span className="big-link" style={{ fontSize: 22 }}>{s.street}<br />{s.zip} {s.city}</span></a>
        </div>
      </section>
      <section className="section tight wrap" style={{ paddingTop: 0 }}>
        <div className="split">
          <Suspense><ContactForm whatsapp={s.whatsapp} /></Suspense>
          <div className="stack">
            <iframe
              className="map"
              title="Plan d’accès Connect Auto"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`Connect Auto, ${addr}`)}&z=14&output=embed`}
            />
            <div className="form-card">
              <h2 className="display h3" style={{ margin: 0 }}>Horaires</h2>
              <HoursTable hours={s.hours} />
            </div>
            <Slot id="IMG-21" images={s.images} icon="car" alt="Entrée et parking du garage" style={{ aspectRatio: '3/2', borderRadius: 'var(--r)' }} />
          </div>
        </div>
      </section>
    </>
  )
}

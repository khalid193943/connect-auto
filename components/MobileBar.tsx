import Link from 'next/link'
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react'
import { telHref, waHref } from '@/lib/format'

export function MobileBar({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <nav className="mbar" aria-label="Contact rapide">
      <a href={telHref(phone)}><Phone /> Appeler</a>
      <a href={waHref(whatsapp, 'Bonjour Connect Auto, ')} target="_blank" rel="noopener"><MessageCircle /> WhatsApp</a>
      <Link href="/rendez-vous" className="go"><CalendarCheck /> Rendez-vous</Link>
    </nav>
  )
}

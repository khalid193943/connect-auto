import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MobileBar } from '@/components/MobileBar'
import { RevealObserver } from '@/components/Reveal'
import { IntroGate, INTRO_SCRIPT } from '@/components/IntroGate'
import { JsonLd } from '@/components/JsonLd'
import { getServices, getSettings } from '@/lib/data'
import { businessSchema } from '@/lib/schema'

/** Pages toujours à jour : chaque modification faite dans l’admin est visible immédiatement. */
export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services] = await Promise.all([getSettings(), getServices()])
  const announce = s.announcementOn && s.announcement.trim()
  return (
    <div className={announce ? 'has-announce' : undefined}>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <noscript><style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style></noscript>
      <a className="skip" href="#contenu">Aller au contenu</a>
      {announce && <div className="announce" role="note">{s.announcement}</div>}
      <Header phone={s.phone} whatsapp={s.whatsapp} />
      <main id="contenu">{children}</main>
      <Footer s={s} services={services} />
      <MobileBar phone={s.phone} whatsapp={s.whatsapp} />
      <IntroGate />
      <RevealObserver />
      <JsonLd data={businessSchema(s)} />
    </div>
  )
}

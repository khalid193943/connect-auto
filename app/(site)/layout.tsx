import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BrandCarousel } from '@/components/BrandCarousel'
import { HideOn } from '@/components/HideOn'
import { MobileBar } from '@/components/MobileBar'
import { RevealObserver } from '@/components/Reveal'
import { IntroGate, INTRO_SCRIPT } from '@/components/IntroGate'
import { JsonLd } from '@/components/JsonLd'
import { getServices, getSettings, getVehicles } from '@/lib/data'
import { businessSchema } from '@/lib/schema'

/** Pages toujours à jour : chaque modification faite dans l’admin est visible immédiatement. */
export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services, vehicles] = await Promise.all([getSettings(), getServices(), getVehicles()])
  const announce = s.announcementOn && s.announcement.trim()
  return (
    <div className={announce ? 'has-announce' : undefined}>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <noscript><style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style></noscript>
      <a className="skip" href="#contenu">Aller au contenu</a>
      {announce && <div className="announce" role="note">{s.announcement}</div>}
      <Header phone={s.phone} whatsapp={s.whatsapp} stock={vehicles.filter((v) => v.status === 'disponible').length} />
      <main id="contenu">{children}</main>
      <HideOn paths={['/']}><BrandCarousel logos={s.brandLogos ?? {}} /></HideOn>
      <Footer s={s} services={services} />
      <MobileBar phone={s.phone} whatsapp={s.whatsapp} />
      <IntroGate />
      <RevealObserver />
      <JsonLd data={businessSchema(s)} />
    </div>
  )
}

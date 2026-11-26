import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/archivo/wdth-italic.css'
import '@fontsource-variable/dm-sans/opsz.css'
import '@fontsource-variable/montserrat/wght.css'
import './globals.css'
import { SITE_URL, INDEXABLE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Connect Auto · Garage et véhicules d’occasion à Milhaud, près de Nîmes', template: '%s · Connect Auto' },
  description:
    'Garage indépendant à Milhaud (Gard) : voitures, utilitaires, camions et motos d’occasion, reprise de votre véhicule, entretien, mécanique, carrosserie, pneus, pare-brise et carte grise.',
  applicationName: 'Connect Auto',
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Connect Auto' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = { themeColor: '#141518', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

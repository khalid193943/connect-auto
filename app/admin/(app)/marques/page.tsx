import { getSettings } from '@/lib/data'
import { HAS_BLOB, list } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { SlotUploader } from '@/components/admin/SlotUploader'

const BRANDS = ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Fiat', 'Ford', 'Mercedes-Benz', 'Iveco', 'Nissan', 'Opel', 'Toyota', 'Dacia', 'Yamaha', 'Honda', 'Kawasaki', 'BMW']

export default async function Marques() {
  const [s, vehicles] = await Promise.all([getSettings(), list('vehicles')])
  const brands = [...new Set([...BRANDS, ...vehicles.map((v) => v.brand)])]
  const logos = s.brandLogos ?? {}
  return (
    <main className="adm-main">
      <Back href="/admin/plus" label="Plus" />
      <h1>Logos des marques</h1>
      <p className="sub">Bandeau « Toutes marques » de l’accueil. Sans logo, le nom de la marque s’affiche.</p>
      <p className="banner info" style={{ margin: 0 }}>
        Utilisez les fichiers officiels (SVG ou PNG transparent) fournis par les marques ou leurs espaces presse, en respectant leurs conditions d’utilisation. Les logos s’affichent en blanc pour rester harmonieux.
      </p>
      {!HAS_BLOB && <p className="banner warn" style={{ margin: 0 }}>L’envoi de fichiers sera actif dès que le stockage sera branché sur Vercel.</p>}
      <div className="card flat">
        {brands.map((b) => (
          <div key={b} className="slot-row">
            <div className="pv" style={{ background: '#0b0e12', color: '#fff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {logos[b] ? <img src={logos[b]} alt={b} style={{ objectFit: 'contain', padding: 12, filter: 'brightness(0) invert(1)' }} /> : b}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <b style={{ fontSize: 15.5 }}>{b}</b>
              <SlotUploader slot={b} url={logos[b]} enabled={HAS_BLOB} brand />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

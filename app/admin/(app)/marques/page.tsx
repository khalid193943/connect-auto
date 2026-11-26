import { getSettings } from '@/lib/data'
import { HAS_BLOB } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { SlotUploader } from '@/components/admin/SlotUploader'
import { BrandLogo } from '@/components/BrandLogo'
import { BRAND_LIST } from '@/lib/brands'


export default async function Marques() {
  const s = await getSettings()
  const brands = BRAND_LIST
  const logos = s.brandLogos ?? {}
  return (
    <main className="adm-main">
      <Back href="/admin/site" label="Mon site" />
      <h1>Logos des marques</h1>
      <p className="sub">Carrousel « Toutes marques », en bas de chaque page. Les logos du site V0 s’affichent par défaut ; un fichier envoyé ici les remplace.</p>
      <p className="banner info" style={{ margin: 0 }}>
        Utilisez les fichiers officiels (SVG ou PNG transparent) fournis par les marques ou leurs espaces presse, en respectant leurs conditions d’utilisation. Les logos s’affichent en blanc pour rester harmonieux.
      </p>
      {!HAS_BLOB && <p className="banner warn" style={{ margin: 0 }}>L’envoi de fichiers sera actif dès que le stockage sera branché sur Vercel.</p>}
      <div className="card flat">
        {brands.map(({ id, name: b }) => (
          <div key={b} className="slot-row">
            <div className="pv" style={{ background: '#0b0e12', color: '#fff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {logos[b] ? <img src={logos[b]} alt={b} style={{ objectFit: 'contain', padding: 12, filter: 'brightness(0) invert(1)' }} /> : <BrandLogo id={id} className="adm-brand" />}
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

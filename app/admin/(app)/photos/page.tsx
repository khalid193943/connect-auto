import { getSettings } from '@/lib/data'
import { HAS_BLOB } from '@/lib/store'
import { SLOTS, slotSrc } from '@/lib/images'
import { Back } from '@/components/admin/ui'
import { SlotUploader } from '@/components/admin/SlotUploader'

export default async function Photos() {
  const s = await getSettings()
  return (
    <main className="adm-main">
      <Back href="/admin/plus" label="Plus" />
      <h1>Photos du site</h1>
      <p className="sub">Chaque emplacement porte la même référence que sur le site (IMG-01, IMG-02…). Les photos des véhicules se gèrent dans chaque annonce.</p>
      {!HAS_BLOB && <p className="banner warn" style={{ margin: 0 }}>L’envoi de photos sera actif dès que le stockage sera branché sur Vercel.</p>}
      <div className="card flat">
        {SLOTS.map((sl) => {
          const url = slotSrc(s.images, sl.id)
          return (
            <div key={sl.id} className="slot-row">
              <div className="pv">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {url ? <img src={url} alt="" /> : sl.id}
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <b style={{ fontSize: 15.5 }}>{sl.label}</b>
                <span className="hint">{sl.id} · {sl.where} · format {sl.ratio.replace('/', ':')}</span>
                <SlotUploader slot={sl.id} url={s.images[sl.id]} enabled={HAS_BLOB} />
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

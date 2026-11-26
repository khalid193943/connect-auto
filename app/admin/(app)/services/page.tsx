import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { list } from '@/lib/store'
import { Back } from '@/components/admin/ui'
import { SERVICE_ICONS } from '@/components/icons'

export default async function Services() {
  const services = (await list('services')).sort((a, b) => a.order - b.order)
  return (
    <main className="adm-main">
      <Back href="/admin/site" label="Mon site" />
      <h1>Services</h1>
      <p className="sub">Touchez un service pour modifier son texte ou son prix.</p>
      <div className="card flat">
        <div className="rows">
          {services.map((s) => {
            const I = SERVICE_ICONS[s.icon]
            return (
              <Link key={s.id} href={`/admin/services/${s.id}`} className="row">
                <span className="thumb" style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--a-acc-bg)', color: 'var(--a-acc)' }}><I /></span>
                <span className="main"><b>{s.title}</b><span>{s.priceFrom ? `À partir de ${s.priceFrom}` : 'Sur devis'}</span></span>
                <span className={`pill ${s.visible ? 'green' : 'grey'}`}>{s.visible ? 'Affiché' : 'Masqué'}</span>
                <ChevronRight className="chev" />
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}

import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
})

export const IconOil = (p: P) => (<svg {...base(p)}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></svg>)
export const IconGauge = (p: P) => (<svg {...base(p)}><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16l4-5" /><circle cx="12" cy="16" r="1.2" /><path d="M7 12.5l-1-.6M12 8V7M17 12.5l1-.6" /></svg>)
export const IconTyre = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /></svg>)
export const IconCar = (p: P) => (<svg {...base(p)}><path d="M3 15h18v-3l-3-1-2.5-3.5h-7L6 11l-3 1z" /><circle cx="7" cy="16" r="1.8" /><circle cx="17" cy="16" r="1.8" /></svg>)
export const IconWindscreen = (p: P) => (<svg {...base(p)}><path d="M4 7h16l-2.5 10h-11z" /><path d="M9 15l4-5" /></svg>)
export const IconWarning = (p: P) => (<svg {...base(p)}><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>)
export const IconCard = (p: P) => (<svg {...base(p)}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 11h6M7 14h4" /><circle cx="17" cy="12" r="1.5" /></svg>)
export const IconVan = (p: P) => (<svg {...base(p)}><path d="M2.5 16V8.5A1.5 1.5 0 0 1 4 7h10l4 4.5h2.5a1 1 0 0 1 1 1V16" /><path d="M14 7v4.5h4" /><circle cx="6.5" cy="17" r="1.8" /><circle cx="17" cy="17" r="1.8" /><path d="M8.3 17h6.9" /></svg>)
export const IconTruck = (p: P) => (<svg {...base(p)}><path d="M2 6.5h11v10H2z" /><path d="M13 10h4l3.5 3.5v3H13" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>)
export const IconMoto = (p: P) => (<svg {...base(p)}><circle cx="5.5" cy="16" r="3.5" /><circle cx="18.5" cy="16" r="3.5" /><path d="M5.5 16l4-5.5h4.5l4.5 5.5" /><path d="M14 10.5L12.5 7H15.5" /><path d="M8 10.5h4.5" /></svg>)
export const IconWrench = (p: P) => (<svg {...base(p)}><path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z" /><path d="M14.5 6.5L17 4l3 3-2.5 2.5" /></svg>)
export const IconKey = (p: P) => (<svg {...base(p)}><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8M16 7l2 2M14 9l2 2" /></svg>)
export const IconShield = (p: P) => (<svg {...base(p)}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>)
export const IconHandshake = (p: P) => (<svg {...base(p)}><path d="M3 11l4-4 5 2 5-2 4 4-7 7z" /><path d="M8 13l2 2M11 11l3 3" /></svg>)
export const IconAccess = (p: P) => (<svg {...base(p)}><circle cx="12" cy="4.5" r="1.6" /><path d="M9 21a5 5 0 1 1 6-7.5" /><path d="M11 8v5h5l2 5" /></svg>)
export const IconCardPay = (p: P) => (<svg {...base(p)}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></svg>)

export const SERVICE_ICONS: Record<string, (p: P) => React.ReactElement> = {
  oil: IconOil, gauge: IconGauge, tyre: IconTyre, car: IconCar, windscreen: IconWindscreen,
  warning: IconWarning, card: IconCard, van: IconVan, truck: IconTruck, moto: IconMoto, wrench: IconWrench,
  key: IconKey, handshake: IconHandshake, shield: IconShield,
}

export const CATEGORY_ICONS: Record<string, (p: P) => React.ReactElement> = {
  voitures: IconCar, utilitaires: IconVan, camions: IconTruck, motos: IconMoto,
}

export const Star = (p: P) => (<svg viewBox="0 0 24 24" aria-hidden {...p}><polygon points="12 3 14.6 8.6 20.7 9.2 16.1 13.3 17.4 19.3 12 16.2 6.6 19.3 7.9 13.3 3.3 9.2 9.4 8.6" /></svg>)

export function Stars({ value, label }: { value: number; label?: string }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${String(value).replace('.', ',')} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
          <Star style={{ opacity: 0.25 }} />
          <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${Math.max(0, Math.min(1, value - i)) * 100}%` }}>
            <Star />
          </span>
        </span>
      ))}
    </span>
  )
}

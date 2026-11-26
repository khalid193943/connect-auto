import logo from '@/lib/brand/logo.json'

const W = logo.word

/** Mot-symbole CONNECT AUTO (sans la voiture) — en-tête, pied de page. */
export function LogoWord({ className, id = 'lw' }: { className?: string; id?: string }) {
  const top = logo.meta.WY - 14
  const h = logo.meta.capH + 28
  return (
    <svg className={className} viewBox={`-14 ${top} 1028 ${h}`} role="img" aria-label="Connect Auto">
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".55" stopColor="#F4F6F8" />
          <stop offset="1" stopColor="#B9C1CC" />
        </linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8AE3A5" />
          <stop offset="1" stopColor="#2EC95C" />
        </linearGradient>
      </defs>
      <g transform={W.transform}>
        <path d={W.connect} fill={`url(#${id}w)`} fillRule="evenodd" />
        <path d={W.auto} fill={`url(#${id}a)`} fillRule="evenodd" />
        <circle cx={W.hub[0]} cy={W.hub[1]} r="11" fill="#2EC95C" />
      </g>
    </svg>
  )
}

/** La voiture du logo, en trait. */
export function CarArt({ className, ink = '#F4F6F8', accent = '#2EC95C' }: { className?: string; ink?: string; accent?: string }) {
  return (
    <svg className={className} viewBox={`-14 -14 1028 ${logo.meta.span[1] + 28}`} aria-hidden>
      {logo.static.map((p, i) =>
        p.k === 'fill' ? (
          <path key={i} d={p.d} fill={p.a ? accent : ink} />
        ) : (
          <path key={i} d={p.d} fill="none" stroke={p.a ? accent : ink} strokeWidth={p.w} />
        ),
      )}
    </svg>
  )
}

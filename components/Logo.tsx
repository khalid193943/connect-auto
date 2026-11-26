import v1 from '@/lib/brand/logo-v1.json'

type Variant = 'full' | 'compact' | 'car'

/**
 * Logo officiel Connect Auto (version « Ligne ») : silhouette d’un trait, feu arrière vert,
 * nom en capitales larges avec le NN relié en vert. full = avec la signature, compact = sans, car = silhouette seule.
 * Les couleurs suivent --l1-ink et --l1-acc (clair / sombre).
 */
export function Logo({ id = 'lg', variant = 'compact', className }: { id?: string; variant?: Variant; className?: string }) {
  const vb = variant === 'full' ? v1.vb : variant === 'car' ? v1.vbCar : v1.vbCompact
  return (
    <svg className={`logo1 ${className ?? ''}`} viewBox={vb} role="img" aria-label="Connect Auto">
      <defs>
        <linearGradient id={`${id}t`} x1="744" y1="0" x2="880" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2EC95C" stopOpacity="0" />
          <stop offset=".35" stopColor="#2EC95C" />
          <stop offset="1" stopColor="#8AE3A5" />
        </linearGradient>
        <filter id={`${id}g`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="l1-car">
        <path className="l1-ink" d={v1.roof} />
        <path className="l1-ink" d={v1.shoulder} opacity=".9" />
        <path className="l1-ink" d={v1.nose} opacity=".75" />
        <path className="l1-tail" d={v1.tail} fill={`url(#${id}t)`} filter={`url(#${id}g)`} />
      </g>
      {variant !== 'car' && (
        <>
          <path className="l1-ink l1-word" d={v1.word} />
          <path className="l1-acc l1-nn" d={v1.nn} />
          <path className="l1-ink l1-auto" d={v1.auto} />
        </>
      )}
      {variant === 'full' && <path className="l1-acc l1-tag" d={v1.tag} />}
    </svg>
  )
}

/** La silhouette du logo seule (décor). */
export function CarArt({ className }: { className?: string; ink?: string; accent?: string }) {
  return <Logo id="carart" variant="car" className={className} />
}

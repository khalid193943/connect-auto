import sizes from '@/lib/brand/logo-sizes.json'

type Variant = 'full' | 'compact' | 'mark'
/** Fond sur lequel le logo est posé : auto = suit le thème du site (clair / sombre). */
type Tone = 'auto' | 'dark' | 'light'

const FILE: Record<Variant, keyof typeof sizes> = { full: 'complet', compact: 'compact', mark: 'utilitaire' }

/**
 * Logo officiel Connect Auto : utilitaire argent vu de trois quarts, nom chromé, « Spécialiste des utilitaires » en vert et route.
 * Fichiers vectoriels dans /public/brand ; les deux versions (fond clair / fond sombre) basculent avec le thème sans rechargement.
 * full = logo complet, compact = utilitaire + nom (en-tête), mark = utilitaire seul.
 */
export function Logo({ variant = 'compact', tone = 'auto', className, label = 'Connect Auto, spécialiste des utilitaires' }: {
  variant?: Variant
  tone?: Tone
  className?: string
  label?: string
  /** conservé pour compatibilité avec les anciens appels */
  id?: string
}) {
  const f = FILE[variant]
  const [w, h] = sizes[f]
  const img = (t: 'clair' | 'sombre') => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`lg-${t}`} src={`/brand/logo-${f}-fond-${t}.svg`} alt="" width={w} height={h} decoding="async" loading="lazy" draggable={false} />
  )
  return (
    <span className={`logo2 logo2-${variant} tone-${tone} ${className ?? ''}`} role="img" aria-label={label} style={{ aspectRatio: `${w} / ${h}` }}>
      {tone !== 'dark' && img('clair')}
      {tone !== 'light' && img('sombre')}
    </span>
  )
}

/** L’utilitaire seul, en grand (bandeaux de pages, 404). */
export function CarArt({ className }: { className?: string; ink?: string; accent?: string }) {
  return <Logo variant="mark" className={className} label="" />
}

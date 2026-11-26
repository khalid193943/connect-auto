/** Logos des marques, repris tels quels du site Connect Auto V0. */
interface BrandLogoProps {
  id: string
  className?: string
}

export function BrandLogo({ id, className = 'w-14 h-9' }: BrandLogoProps) {
  switch (id) {
    /* ========= 1. MARQUES FRANÇAISES ========= */
    case 'renault':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M34.5 6.5 L31 3.5 L18.5 20 L31 36.5 L36.5 29.2 L27.5 17.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M29.5 33.5 L33 36.5 L45.5 20 L33 3.5 L27.5 10.8 L36.5 22.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )

    case 'peugeot':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          {/* Blason officiel Peugeot */}
          <path
            d="M19 4.5 H45 V20.5 C45 29.5 32 36.5 32 36.5 C32 36.5 19 29.5 19 20.5 Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Tête de lion rugissant géométrique */}
          <path
            d="M34.5 9.5 L38 11.5 L36.5 14 L40 15.5 L37.8 18 L40.5 20.5 L37.2 22.5 L38.5 26 L34.5 28.5 L32 31.5 L29.5 26.5 L31.2 22.8 L26.5 21.5 L24 19 L27.5 17.8 L24.5 16.2 L27.8 13.8 L25.5 11.5 L30.5 10.8 Z"
            fill="currentColor"
          />
        </svg>
      )

    case 'citroen':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="20" rx="12" ry="15.5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M24.2 19 L32 11.6 L39.8 19"
            stroke="currentColor"
            strokeWidth="3.1"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M24.2 27.4 L32 20 L39.8 27.4"
            stroke="currentColor"
            strokeWidth="3.1"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )

    case 'dacia':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M10.5 13.5 H25.2 L30.4 20 L25.2 26.5 H10.5"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M53.5 13.5 H38.8 L33.6 20 L38.8 26.5 H53.5"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )

    case 'ds':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          {/* Monogramme géométrique DS facetté */}
          <path
            d="M16 9 H27.5 L33.5 20 L27.5 31 H16 L22 20 Z"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinejoin="miter"
          />
          <path
            d="M47.5 11.5 H37 L33.5 17.5 L42 22.5 L38.5 28.5 H29"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )

    /* ========= 2. MARQUES ALLEMANDES ========= */
    case 'volkswagen':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="20" r="15.5" stroke="currentColor" strokeWidth="2.1" />
          <path
            d="M24.8 7.5 L32 19 L39.2 7.5"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.8 11.5 L26.6 31.2 L32 21.8 L37.4 31.2 L44.2 11.5"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'mercedes':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="20" r="15.5" stroke="currentColor" strokeWidth="2.1" />
          {/* Étoile à 3 branches facettée */}
          <path d="M32 5 L34.2 18.6 L32 20 Z" fill="currentColor" />
          <path d="M32 5 L29.8 18.6 L32 20 Z" fill="currentColor" fillOpacity="0.6" />
          <path d="M45.2 27.5 L33.2 22.1 L32 20 Z" fill="currentColor" />
          <path d="M45.2 27.5 L34.4 18.8 L32 20 Z" fill="currentColor" fillOpacity="0.6" />
          <path d="M18.8 27.5 L29.6 18.8 L32 20 Z" fill="currentColor" />
          <path d="M18.8 27.5 L30.8 22.1 L32 20 Z" fill="currentColor" fillOpacity="0.6" />
        </svg>
      )

    case 'bmw':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="20" r="15.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="20" r="9.6" stroke="currentColor" strokeWidth="1.6" />
          <path d="M32 10.4 A9.6 9.6 0 0 0 22.4 20 H32 Z" fill="currentColor" />
          <path d="M32 20 H41.6 A9.6 9.6 0 0 1 32 29.6 Z" fill="currentColor" />
          <text
            x="32"
            y="8.7"
            textAnchor="middle"
            fill="currentColor"
            fontSize="4.2"
            fontWeight="800"
            letterSpacing="0.8"
            fontFamily="system-ui, sans-serif"
          >
            BMW
          </text>
        </svg>
      )

    case 'audi':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <circle cx="17.5" cy="20" r="6.8" stroke="currentColor" strokeWidth="2.1" />
          <circle cx="27.2" cy="20" r="6.8" stroke="currentColor" strokeWidth="2.1" />
          <circle cx="36.8" cy="20" r="6.8" stroke="currentColor" strokeWidth="2.1" />
          <circle cx="46.5" cy="20" r="6.8" stroke="currentColor" strokeWidth="2.1" />
        </svg>
      )

    case 'opel':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M19.8 14.8 A13.2 13.2 0 0 1 44.2 14.8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M44.2 25.2 A13.2 13.2 0 0 1 19.8 25.2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Éclair Blitz Opel */}
          <path
            d="M8.5 18.8 L35 14.8 L31.6 19.2 L55.5 21.2 L29 25.2 L32.4 20.8 Z"
            fill="currentColor"
          />
        </svg>
      )

    /* ========= 3. AUTRES CONSTRUCTEURS ========= */
    case 'toyota':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="20" rx="19" ry="12.5" stroke="currentColor" strokeWidth="2.2" />
          <ellipse cx="32" cy="20" rx="4.7" ry="11.8" stroke="currentColor" strokeWidth="2.1" />
          <ellipse cx="32" cy="13.8" rx="11.2" ry="4.1" stroke="currentColor" strokeWidth="2.1" />
        </svg>
      )

    case 'nissan':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M19.5 14.8 A13.5 13.5 0 0 1 44.5 14.8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M44.5 25.2 A13.5 13.5 0 0 1 19.5 25.2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <text
            x="32"
            y="22.4"
            textAnchor="middle"
            fill="currentColor"
            fontSize="6.6"
            fontWeight="700"
            letterSpacing="1.6"
            fontFamily="system-ui, sans-serif"
          >
            NISSAN
          </text>
        </svg>
      )

    case 'ford':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="20" rx="23" ry="11.5" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="32" cy="20" rx="20.4" ry="9.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.65" />
          <text
            x="32"
            y="23.5"
            textAnchor="middle"
            fill="currentColor"
            fontSize="12"
            fontWeight="700"
            fontStyle="italic"
            fontFamily="Georgia, serif"
          >
            Ford
          </text>
        </svg>
      )

    case 'fiat':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path d="M13 30 L19.5 10 H24 L17.5 30 Z" fill="currentColor" />
          <path d="M22.5 30 L29 10 H33.5 L27 30 Z" fill="currentColor" />
          <path d="M32 30 L38.5 10 H43 L36.5 30 Z" fill="currentColor" />
          <path d="M41.5 30 L48 10 H52.5 L46 30 Z" fill="currentColor" />
        </svg>
      )

    case 'hyundai':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="20" rx="21.5" ry="12.5" stroke="currentColor" strokeWidth="2.1" />
          <path
            d="M22.5 28 L27.2 12 M36.8 28 L41.5 12 M24.8 20.8 C28.5 18 35.5 22 39.2 19.2"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'kia':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M11 27 V13 M11 21.5 L21.5 13 M15.5 18 L24 27 H29.5 V13 M34.5 27 V13 L45 27 H53 L47 13"
            stroke="currentColor"
            strokeWidth="2.7"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path d="M41.5 22.5 H50.5" stroke="currentColor" strokeWidth="2.3" />
        </svg>
      )

    case 'volvo':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <path
            d="M18.6 18.2 A12 12 0 0 1 41.4 18.2"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M41.4 25.8 A12 12 0 0 1 18.6 25.8"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M38.5 13.5 L46.5 5.5 M40.5 5.5 H46.5 V11.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="13" y="18.2" width="34" height="7.6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <text
            x="30"
            y="23.9"
            textAnchor="middle"
            fill="currentColor"
            fontSize="5.6"
            fontWeight="800"
            letterSpacing="1.2"
            fontFamily="system-ui, sans-serif"
          >
            VOLVO
          </text>
        </svg>
      )

    case 'iveco':
      return (
        <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
          <rect x="8" y="12.5" width="48" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <text
            x="32"
            y="22.8"
            textAnchor="middle"
            fill="currentColor"
            fontSize="9.2"
            fontWeight="800"
            letterSpacing="1.6"
            fontFamily="system-ui, sans-serif"
          >
            IVECO
          </text>
        </svg>
      )

    default:
      return null
  }
}

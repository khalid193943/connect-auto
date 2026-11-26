import type { Settings } from './types'
import { SITE_URL } from './site'

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function businessSchema(s: Settings) {
  const hours = Object.entries(s.hours).flatMap(([d, slots]) =>
    slots.map(([opens, closes]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY[Number(d)], opens, closes })),
  )
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoRepair', 'AutoDealer'],
    '@id': `${SITE_URL}/#garage`,
    name: 'Connect Auto',
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image.png`,
    logo: `${SITE_URL}/brand/icon-512.png`,
    telephone: '+33' + s.phone.replace(/\D/g, '').replace(/^0/, ''),
    address: { '@type': 'PostalAddress', streetAddress: s.street, postalCode: s.zip, addressLocality: s.city, addressRegion: 'Occitanie', addressCountry: 'FR' },
    areaServed: ['Milhaud', 'Nîmes', 'Gard'],
    openingHoursSpecification: hours,
    aggregateRating: s.googleCount ? { '@type': 'AggregateRating', ratingValue: s.googleRating, reviewCount: s.googleCount, bestRating: 5 } : undefined,
    paymentAccepted: 'Carte bancaire',
    hasMap: s.googleUrl,
  }
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE_URL + it.url })),
  }
}

import type { Category } from './types'

export const SITE_URL = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')).replace(/\/$/, '')
/** Le site n'est indexé par Google qu'une fois le vrai nom de domaine renseigné (SITE_URL). */
export const INDEXABLE = !!process.env.SITE_URL

export const CATEGORIES: { key: Category; label: string; singular: string; slot: string; seoTitle: string; seoText: string }[] = [
  {
    key: 'voitures', label: 'Voitures', singular: 'Voiture', slot: 'IMG-02',
    seoTitle: 'Voitures d’occasion à Milhaud, près de Nîmes',
    seoText: 'Citadines, compactes, SUV et familiales d’occasion, contrôlées et préparées dans notre atelier.',
  },
  {
    key: 'utilitaires', label: 'Utilitaires', singular: 'Utilitaire', slot: 'IMG-03',
    seoTitle: 'Utilitaires d’occasion dans le Gard',
    seoText: 'Fourgonnettes, fourgons et grands volumes pour artisans et entreprises, TVA récupérable sur les véhicules éligibles.',
  },
  {
    key: 'camions', label: 'Camions', singular: 'Camion', slot: 'IMG-04',
    seoTitle: 'Camions, bennes et plateaux d’occasion près de Nîmes',
    seoText: 'Bennes, plateaux et porteurs d’occasion pour le BTP, les paysagistes et le transport.',
  },
  {
    key: 'motos', label: 'Motos', singular: 'Moto', slot: 'IMG-05',
    seoTitle: 'Motos d’occasion à Nîmes et dans le Gard',
    seoText: 'Roadsters, trails et motos compatibles permis A2, vérifiées avant la vente.',
  },
]
export const catOf = (k: string) => CATEGORIES.find((c) => c.key === k)

export const NAV = [
  { href: '/occasions', label: 'Occasions' },
  { href: '/services', label: 'Services' },
  { href: '/reprise', label: 'Reprise' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/a-propos', label: 'Le garage' },
  { href: '/conseils', label: 'Conseils' },
  { href: '/contact', label: 'Contact' },
]

export const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const DAY_ORDER = ['1', '2', '3', '4', '5', '6', '0']

export const NEARBY = ['Nîmes', 'Milhaud', 'Bernis', 'Uchaud', 'Vestric-et-Candiac', 'Aubord', 'Caissargues', 'Bouillargues', 'Saint-Gilles', 'Vauvert', 'Caveirac', 'Langlade', 'Vergèze', 'Codognan', 'Générac', 'Beauvoisin']

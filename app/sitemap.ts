import type { MetadataRoute } from 'next'
import { getServices, getVehicles } from '@/lib/data'
import { ARTICLES } from '@/lib/articles'
import { CATEGORIES, SITE_URL } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, vehicles] = await Promise.all([getServices(), getVehicles()])
  const u = (p: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly') => ({ url: SITE_URL + p, priority, changeFrequency })
  return [
    u('/', 1, 'daily'),
    u('/occasions', 0.9, 'daily'),
    ...CATEGORIES.map((c) => u(`/occasions/${c.key}`, 0.9, 'daily')),
    ...vehicles.filter((v) => v.status !== 'vendu').map((v) => ({ ...u(`/occasions/${v.category}/${v.slug}`, 0.6, 'weekly'), lastModified: v.updatedAt })),
    u('/services', 0.8),
    ...services.map((s) => u(`/services/${s.slug}`, 0.8, 'monthly')),
    u('/reprise', 0.8, 'monthly'),
    u('/rendez-vous', 0.7, 'monthly'),
    u('/tarifs', 0.6, 'monthly'),
    u('/a-propos', 0.5, 'yearly'),
    u('/contact', 0.6, 'yearly'),
    u('/conseils', 0.5, 'monthly'),
    ...ARTICLES.map((a) => ({ ...u(`/conseils/${a.slug}`, 0.5, 'yearly'), lastModified: a.date })),
    u('/mentions-legales', 0.1, 'yearly'),
    u('/confidentialite', 0.1, 'yearly'),
  ]
}

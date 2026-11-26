export type Category = 'voitures' | 'utilitaires' | 'camions' | 'motos'
export type VehicleStatus = 'disponible' | 'reserve' | 'vendu'

export interface Vehicle {
  id: string
  slug: string
  ref: string
  category: Category
  brand: string
  model: string
  version: string
  year: number
  km: number
  fuel: string
  gearbox: string
  power?: number
  fiscalPower?: number
  color?: string
  doors?: number
  seats?: number
  critair?: string
  /** utilitaires : volume utile en m³ ; camions : PTAC ; motos : cylindrée… texte libre */
  extra?: string
  price: number
  /** prix HT affiché pour les pros quand la TVA est récupérable */
  vatRecoverable?: boolean
  description: string
  equipment: string[]
  photos: string[]
  status: VehicleStatus
  visible: boolean
  featured: boolean
  demo?: boolean
  /** Registre des achats (livre de police) — jamais affiché sur le site */
  purchase?: {
    date?: string
    sellerName?: string
    sellerAddress?: string
    sellerId?: string
    price?: number
    registration?: string
    vin?: string
  }
  createdAt: string
  updatedAt: string
}

export type RequestType = 'reprise' | 'rdv' | 'contact' | 'vehicule'
export type RequestStatus = 'nouvelle' | 'en_cours' | 'traitee'

export interface Lead {
  id: string
  type: RequestType
  status: RequestStatus
  name: string
  phone: string
  email?: string
  message?: string
  fields: Record<string, string>
  photos: string[]
  vehicleId?: string
  clientId?: string
  demo?: boolean
  createdAt: string
}

export interface Client {
  id: string
  kind: 'particulier' | 'pro'
  name: string
  company?: string
  siret?: string
  phone: string
  email?: string
  address?: string
  notes?: string
  demo?: boolean
  createdAt: string
}

export type DocType = 'devis' | 'commande' | 'facture'
export type DocStatus = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'emise' | 'payee'

export interface DocLine {
  label: string
  qty: number
  /** prix unitaire HT (ou TTC en régime de la marge) */
  unit: number
  vat: number
}

export interface Doc {
  id: string
  type: DocType
  number: string
  status: DocStatus
  /** normal = TVA détaillée ; marge = vente de véhicule d'occasion sous le régime de la marge */
  vatMode: 'normal' | 'marge'
  date: string
  dueDate?: string
  clientId?: string
  client: { name: string; company?: string; siret?: string; address?: string; phone?: string; email?: string }
  lines: DocLine[]
  notes?: string
  vehicleId?: string
  fromId?: string
  token: string
  paidAt?: string
  paymentMethod?: string
  demo?: boolean
  createdAt: string
}

export interface Service {
  id: string
  slug: string
  title: string
  short: string
  intro: string
  points: string[]
  steps: { t: string; d: string }[]
  faq: { q: string; a: string }[]
  icon: string
  priceFrom?: string
  visible: boolean
  order: number
  seoTitle: string
  seoDescription: string
  card: string
  banner: string
}

export interface PriceItem {
  id: string
  group: string
  label: string
  price: string
  note?: string
  order: number
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  visible: boolean
}

export type DayHours = [string, string][]

export interface Settings {
  id: 'site'
  phone: string
  whatsapp: string
  email: string
  street: string
  zip: string
  city: string
  /** 0 = dimanche … 6 = samedi */
  hours: Record<string, DayHours>
  heroEyebrow: string
  heroLine1: string
  heroLine2: string
  heroText: string
  aboutTitle: string
  aboutText: string
  repriseText: string
  announcement: string
  announcementOn: boolean
  googleRating: number
  googleCount: number
  googleUrl: string
  facebookUrl?: string
  instagramUrl?: string
  leboncoinUrl?: string
  images: Record<string, string>
  legal: { company: string; capital: string; rcs: string; siret: string; vat: string; director: string; naf: string }
  docFooter: string
  iban?: string
}

export interface User {
  id: string
  login: string
  name: string
  role: 'gerant' | 'equipe'
  passwordHash: string
  active: boolean
  createdAt: string
}

export interface Collections {
  vehicles: Vehicle
  leads: Lead
  clients: Client
  docs: Doc
  services: Service
  prices: PriceItem
  reviews: Review
  settings: Settings
  users: User
}
export type CollectionName = keyof Collections

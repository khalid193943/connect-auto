import type { Client, Doc, Lead, PriceItem, Review, Settings, Vehicle } from './types'
import { SEED_SERVICES } from './seed-services'

export { SEED_SERVICES }

export const SEED_SETTINGS: Settings = {
  id: 'site',
  phone: '04 66 27 03 64',
  whatsapp: '06 08 50 39 91',
  email: '',
  street: '1520 route de Nîmes',
  zip: '30540',
  city: 'Milhaud',
  hours: {
    '0': [],
    '1': [['08:30', '18:00']],
    '2': [['08:30', '18:00']],
    '3': [['08:30', '13:00'], ['14:00', '18:00']],
    '4': [['08:30', '18:00']],
    '5': [['08:30', '12:30'], ['14:30', '18:00']],
    '6': [['08:30', '15:00']],
  },
  heroEyebrow: 'Garage & véhicules d’occasion · Milhaud, près de Nîmes',
  heroLine1: 'Votre véhicule.',
  heroLine2: 'Notre métier.',
  heroText:
    'Achat, vente et reprise de voitures, utilitaires, camions et motos d’occasion. Entretien, mécanique, carrosserie et pneus dans notre atelier de la route de Nîmes.',
  aboutTitle: 'Un garage indépendant, un seul interlocuteur',
  aboutText:
    'Connect Auto est un garage indépendant installé depuis 2019 au 1520 route de Nîmes, à Milhaud. Ici, la même équipe vend, reprend, entretient et répare votre véhicule : vous savez à qui vous parlez, du premier appel à la remise des clés.',
  repriseText:
    'Vous changez de véhicule ou vous voulez simplement vendre le vôtre ? Envoyez quelques photos et les informations principales : nous vous rappelons avec une proposition.',
  announcement: '',
  announcementOn: false,
  googleRating: 4.3,
  googleCount: 22,
  googleUrl: 'https://www.google.com/maps/search/?api=1&query=Connect+Auto+1520+Route+de+N%C3%AEmes+30540+Milhaud',
  leboncoinUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  images: {},
  legal: {
    company: 'CONNECT AUTO, SAS',
    capital: '',
    rcs: 'RCS Nîmes 850 222 092',
    siret: '850 222 092 00015',
    vat: '',
    director: '',
    naf: '45.20A',
  },
  docFooter:
    'Pénalités de retard : trois fois le taux d’intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 € (clients professionnels). Pas d’escompte pour paiement anticipé.',
  iban: '',
}

const now = '2026-11-20T09:00:00.000Z'
const day = (n: number) => new Date(Date.UTC(2026, 10, 25 - n, 9, 30)).toISOString()

type V = Omit<Vehicle, 'id' | 'slug' | 'ref' | 'photos' | 'status' | 'visible' | 'featured' | 'createdAt' | 'updatedAt' | 'demo'> &
  Partial<Pick<Vehicle, 'status' | 'featured'>>

const slugify = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const mk = (i: number, v: V): Vehicle => {
  const ref = `CA-${String(100 + i)}`
  return {
    id: `v${i}`,
    ref,
    slug: slugify(`${v.brand} ${v.model} ${v.version} ${v.year} ${ref}`),
    photos: [],
    status: v.status ?? 'disponible',
    visible: true,
    featured: v.featured ?? false,
    demo: true,
    createdAt: day(i),
    updatedAt: day(i),
    ...v,
  }
}

export const SEED_VEHICLES: Vehicle[] = [
  mk(1, {
    category: 'utilitaires', brand: 'Renault', model: 'Trafic', version: 'Fourgon L2H1 2.0 Blue dCi 130 Grand Confort',
    year: 2019, km: 98000, fuel: 'Diesel', gearbox: 'Manuelle', power: 130, fiscalPower: 7, seats: 3, color: 'Blanc', critair: '2',
    extra: 'Volume utile 6 m³', price: 21900, vatRecoverable: true, featured: true,
    description:
      'Trafic long en très bon état, entretien suivi. Cloison de séparation, habillage bois du plancher, attelage. Idéal artisan.',
    equipment: ['Climatisation', 'Régulateur de vitesse', 'Radar de recul', 'Attelage', 'Bluetooth', 'Banquette 2 places', 'Cloison', 'Plancher bois'],
  }),
  mk(2, {
    category: 'utilitaires', brand: 'Renault', model: 'Master', version: 'Fourgon L3H2 2.3 dCi 135',
    year: 2018, km: 124000, fuel: 'Diesel', gearbox: 'Manuelle', power: 135, fiscalPower: 8, seats: 3, color: 'Blanc', critair: '2',
    extra: 'Volume utile 13 m³', price: 19490, vatRecoverable: true, featured: true,
    description: 'Grand volume L3H2, porte latérale, distribution faite. Parfait pour le déménagement ou la livraison.',
    equipment: ['Climatisation', 'Radar de recul', 'Porte latérale', 'Galerie de toit', 'Bluetooth'],
  }),
  mk(3, {
    category: 'utilitaires', brand: 'Peugeot', model: 'Partner', version: 'Standard 1.5 BlueHDi 100 Premium',
    year: 2020, km: 76000, fuel: 'Diesel', gearbox: 'Manuelle', power: 100, fiscalPower: 5, seats: 2, color: 'Gris', critair: '2',
    extra: 'Volume utile 3,3 m³', price: 14900, vatRecoverable: true,
    description: 'Petit utilitaire facile à garer, économique, carnet à jour.',
    equipment: ['Climatisation', 'Écran tactile', 'Apple CarPlay', 'Radar de recul'],
  }),
  mk(4, {
    category: 'utilitaires', brand: 'Fiat', model: 'Ducato', version: 'Fourgon 3.3 L2H2 2.3 MultiJet 140',
    year: 2020, km: 89000, fuel: 'Diesel', gearbox: 'Manuelle', power: 140, fiscalPower: 8, seats: 3, color: 'Blanc', critair: '2',
    extra: 'Volume utile 11,5 m³', price: 22500, vatRecoverable: true,
    description: 'Ducato L2H2 bien équipé, première main, révisé avant la vente.',
    equipment: ['Climatisation', 'GPS', 'Caméra de recul', 'Régulateur', 'Bluetooth'],
  }),
  mk(5, {
    category: 'utilitaires', brand: 'Citroën', model: 'Jumpy', version: 'Fourgon Taille M 2.0 BlueHDi 120 Club',
    year: 2019, km: 110000, fuel: 'Diesel', gearbox: 'Manuelle', power: 120, fiscalPower: 6, seats: 3, color: 'Blanc', critair: '2',
    extra: 'Volume utile 5,3 m³', price: 17900, vatRecoverable: true, status: 'reserve',
    description: 'Jumpy taille M, 3 places, double porte latérale.',
    equipment: ['Climatisation', 'Radar de recul', 'Double porte latérale', 'Bluetooth'],
  }),
  mk(6, {
    category: 'voitures', brand: 'Renault', model: 'Clio V', version: '1.0 TCe 90 Business',
    year: 2021, km: 42000, fuel: 'Essence', gearbox: 'Manuelle', power: 90, fiscalPower: 5, doors: 5, seats: 5, color: 'Gris Titanium', critair: '1',
    price: 13490, featured: true,
    description: 'Clio récente, faible kilométrage, idéale jeune conducteur. Crit’Air 1.',
    equipment: ['GPS', 'Climatisation', 'Régulateur', 'Aide au stationnement', 'Apple CarPlay / Android Auto'],
  }),
  mk(7, {
    category: 'voitures', brand: 'Peugeot', model: '308', version: '1.5 BlueHDi 130 Allure EAT8',
    year: 2019, km: 88000, fuel: 'Diesel', gearbox: 'Automatique', power: 130, fiscalPower: 7, doors: 5, seats: 5, color: 'Noir', critair: '2',
    price: 15990, featured: true,
    description: '308 Allure en boîte automatique EAT8, i-Cockpit, très bon état général.',
    equipment: ['GPS', 'Caméra de recul', 'Climatisation automatique', 'Régulateur adaptatif', 'Jantes alliage'],
  }),
  mk(8, {
    category: 'voitures', brand: 'Dacia', model: 'Duster', version: '1.5 Blue dCi 115 4x2 Prestige',
    year: 2020, km: 67000, fuel: 'Diesel', gearbox: 'Manuelle', power: 115, fiscalPower: 6, doors: 5, seats: 5, color: 'Orange Atacama', critair: '2',
    price: 15490,
    description: 'Duster Prestige, caméra multivue, garde au sol appréciable pour les chemins.',
    equipment: ['GPS', 'Caméra multivue', 'Climatisation automatique', 'Démarrage sans clé'],
  }),
  mk(9, {
    category: 'voitures', brand: 'Volkswagen', model: 'Golf VII', version: '1.6 TDI 115 Confortline',
    year: 2018, km: 105000, fuel: 'Diesel', gearbox: 'Manuelle', power: 115, fiscalPower: 6, doors: 5, seats: 5, color: 'Blanc', critair: '2',
    price: 13900, status: 'vendu',
    description: 'Golf Confortline, distribution faite, deux clés.',
    equipment: ['GPS', 'Climatisation automatique', 'Radar avant et arrière', 'Régulateur'],
  }),
  mk(10, {
    category: 'camions', brand: 'Iveco', model: 'Daily', version: '35C14 Benne simple cabine 2.3',
    year: 2017, km: 132000, fuel: 'Diesel', gearbox: 'Manuelle', power: 140, seats: 3, color: 'Blanc', critair: '2',
    extra: 'PTAC 3,5 t · benne basculante', price: 26900, vatRecoverable: true, featured: true,
    description: 'Daily benne, roues jumelées, idéal BTP et paysagistes. Permis B.',
    equipment: ['Benne basculante', 'Coffre à outils', 'Attelage', 'Radio'],
  }),
  mk(11, {
    category: 'camions', brand: 'Renault', model: 'Master', version: 'Plateau benne 2.3 dCi 130 propulsion',
    year: 2018, km: 98000, fuel: 'Diesel', gearbox: 'Manuelle', power: 130, seats: 3, color: 'Blanc', critair: '2',
    extra: 'PTAC 3,5 t · plateau ridelles', price: 24500, vatRecoverable: true,
    description: 'Master propulsion avec benne, ridelles en aluminium, bon état.',
    equipment: ['Benne', 'Ridelles alu', 'Climatisation', 'Attelage'],
  }),
  mk(12, {
    category: 'motos', brand: 'Yamaha', model: 'MT-07', version: '689 cm³ (version 35 kW disponible, permis A2)',
    year: 2020, km: 18000, fuel: 'Essence', gearbox: 'Manuelle', power: 74, color: 'Gris Ice Fluo',
    extra: '689 cm³', price: 6490, featured: true,
    description: 'MT-07 bien entretenue, pneus récents, kit chaîne en bon état.',
    equipment: ['ABS', 'Feu arrière LED', 'Support de plaque court'],
  }),
  mk(13, {
    category: 'motos', brand: 'Honda', model: 'CB500F', version: '471 cm³ permis A2',
    year: 2021, km: 12000, fuel: 'Essence', gearbox: 'Manuelle', power: 48, color: 'Rouge',
    extra: '471 cm³ · permis A2', price: 5290,
    description: 'Roadster idéal pour le permis A2, première main, entretien Honda.',
    equipment: ['ABS', 'Éclairage LED', 'Tableau de bord LCD'],
  }),
]

export const SEED_PRICES: PriceItem[] = [
  { id: 'p1', group: 'Main-d’œuvre', label: 'Taux horaire mécanique', price: '', order: 1 },
  { id: 'p2', group: 'Main-d’œuvre', label: 'Taux horaire carrosserie', price: '', order: 2 },
  { id: 'p3', group: 'Entretien', label: 'Vidange + filtre à huile (voiture)', price: '', note: 'Selon l’huile préconisée', order: 3 },
  { id: 'p4', group: 'Entretien', label: 'Vidange + filtre à huile (utilitaire)', price: '', order: 4 },
  { id: 'p5', group: 'Entretien', label: 'Révision selon carnet constructeur', price: '', order: 5 },
  { id: 'p6', group: 'Freinage', label: 'Plaquettes avant (pose)', price: '', order: 6 },
  { id: 'p7', group: 'Diagnostic', label: 'Diagnostic électronique', price: '', order: 7 },
  { id: 'p8', group: 'Pneus', label: 'Montage + équilibrage (par pneu)', price: '', order: 8 },
  { id: 'p9', group: 'Pneus', label: 'Réparation de crevaison', price: '', order: 9 },
  { id: 'p10', group: 'Carte grise', label: 'Frais de démarche (hors taxes de l’État)', price: '', order: 10 },
]

export const SEED_REVIEWS: Review[] = []

export const SEED_CLIENTS: Client[] = [
  { id: 'c1', kind: 'pro', name: 'Exemple · Karim B.', company: 'Exemple Plomberie', phone: '06 00 00 00 01', address: 'Nîmes', demo: true, createdAt: day(6) },
  { id: 'c2', kind: 'particulier', name: 'Exemple · Sophie M.', phone: '06 00 00 00 02', address: 'Bernis', demo: true, createdAt: day(3) },
]

export const SEED_LEADS: Lead[] = [
  {
    id: 'l1', type: 'reprise', status: 'nouvelle', name: 'Exemple · Julien R.', phone: '06 00 00 00 03', demo: true,
    message: 'Je veux vendre mon Kangoo, il a un petit choc à l’arrière.',
    fields: { Véhicule: 'Renault Kangoo 1.5 dCi', Année: '2016', Kilométrage: '145 000 km', Carburant: 'Diesel' },
    photos: [], createdAt: day(0),
  },
  {
    id: 'l2', type: 'rdv', status: 'nouvelle', name: 'Exemple · Sophie M.', phone: '06 00 00 00 02', demo: true, clientId: 'c2',
    message: 'Bruit au freinage à l’avant.',
    fields: { Prestation: 'Mécanique & diagnostic', Véhicule: 'Peugeot 208', 'Date souhaitée': 'Mardi matin' },
    photos: [], createdAt: day(1),
  },
  {
    id: 'l3', type: 'vehicule', status: 'en_cours', name: 'Exemple · Karim B.', phone: '06 00 00 00 01', demo: true, clientId: 'c1', vehicleId: 'v1',
    message: 'Le Trafic est toujours disponible ? Je peux passer samedi.',
    fields: { Véhicule: 'Renault Trafic CA-101' }, photos: [], createdAt: day(2),
  },
]

export const SEED_DOCS: Doc[] = [
  {
    id: 'd1', type: 'devis', number: 'D-2026-0001', status: 'envoye', vatMode: 'normal', date: '2026-11-23', dueDate: '2026-12-23',
    clientId: 'c1', client: { name: 'Exemple · Karim B.', company: 'Exemple Plomberie', phone: '06 00 00 00 01', address: 'Nîmes' },
    lines: [
      { label: 'Vidange + filtre à huile, Renault Trafic', qty: 1, unit: 95, vat: 20 },
      { label: 'Plaquettes de frein avant (pièces + pose)', qty: 1, unit: 140, vat: 20 },
    ],
    notes: 'Exemple de devis. Délai : 1 journée.', token: 'demo-devis-1', demo: true, createdAt: now,
  },
]

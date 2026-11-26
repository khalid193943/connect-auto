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
  heroEyebrow: 'Garage & occasions · Milhaud, à 10 min de Nîmes',
  heroLine1: 'Achetez malin.',
  heroLine2: 'Roulez serein.',
  heroText:
    'Voitures, utilitaires, camions et motos d’occasion. Reprise de votre véhicule. Atelier toutes marques. Tout au même endroit, route de Nîmes.',
  aboutTitle: 'Un seul garage. Zéro casse-tête.',
  aboutText:
    'Depuis 2019, la même équipe vend, reprend, entretient et répare votre véhicule. Un seul interlocuteur, et un prix annoncé avant chaque intervention.',
  repriseText:
    'Quelques photos, deux minutes, et on vous rappelle avec une proposition. Paiement et papiers : on s’occupe de tout.',
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
const at = (i: number) => new Date(Date.UTC(2026, 10, 26, 13, 30) - i * 3600_000 * 7).toISOString()

type V = Omit<Vehicle, 'id' | 'slug' | 'ref' | 'photos' | 'status' | 'visible' | 'featured' | 'createdAt' | 'updatedAt' | 'demo' | 'equipment'> &
  Partial<Pick<Vehicle, 'status' | 'featured' | 'equipment'>>

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
    equipment: [],
    status: 'disponible',
    visible: true,
    featured: false,
    createdAt: at(i),
    updatedAt: at(i),
    ...v,
  }
}

const LBC = 'https://www.leboncoin.fr/ad/'
const TBP = 'https://www.tresbonplan.fr/vehicule-occasion/milhaud/'
const LBC_MILHAUD = 'https://www.leboncoin.fr/cl/utilitaires/cp_milhaud_30540'
/** Vus sur Très Bon Plan mais absents de leboncoin le 26/11/2026 : sans doute vendus → masqués, à vérifier par Fouad. */
const NOT_ON_LEBONCOIN = new Set(['v13', 'v14', 'v15', 'v17', 'v18', 'v19', 'v21', 'v23', 'v24'])

/** À augmenter quand le stock de départ change : les véhicules jamais modifiés dans l’admin sont alors mis à jour. */
export const SEED_VERSION = 4

/** Anciens textes par défaut : remplacés par les nouveaux s’ils n’ont pas été modifiés dans l’admin. */
export const OLD_TEXTS: Record<string, string> = {"heroEyebrow": "Garage & véhicules d’occasion · Milhaud, près de Nîmes", "heroLine1": "Votre véhicule.", "heroLine2": "Notre métier.", "heroText": "Achat, vente et reprise de voitures, utilitaires, camions et motos d’occasion. Entretien, mécanique, carrosserie et pneus dans notre atelier de la route de Nîmes.", "aboutTitle": "Un garage indépendant, un seul interlocuteur", "aboutText": "Connect Auto est un garage indépendant installé depuis 2019 au 1520 route de Nîmes, à Milhaud. Ici, la même équipe vend, reprend, entretient et répare votre véhicule : vous savez à qui vous parlez, du premier appel à la remise des clés.", "repriseText": "Vous changez de véhicule ou vous voulez simplement vendre le vôtre ? Envoyez quelques photos et les informations principales : nous vous rappelons avec une proposition."}

/**
 * Stock réel de Connect Auto, repris le 26 novembre 2026 de la boutique leboncoin (1192039, 18 annonces)
 * et de la page Très Bon Plan du garage. Photos à ajouter depuis l’admin.
 */
export const SEED_VEHICLES: Vehicle[] = [
  mk(1, {
    category: 'utilitaires', brand: 'Renault', model: 'Master III', version: 'F3300 L2H2 dCi 125 Confort',
    year: 2010, km: 211188, fuel: 'Diesel', gearbox: 'Manuelle', power: 125, fiscalPower: 8, seats: 3, color: 'Blanc',
    price: 7890, vatRecoverable: true,
    description: 'Fourgon Master L2H2 (longueur moyenne, toit haut), 3 places, moteur dCi 125. Première mise en circulation : novembre 2010. Rapport d’historique Autoviza disponible.',
    sourceUrl: LBC + 'utilitaires/3257477593',
  }),
  mk(2, {
    category: 'utilitaires', brand: 'Renault', model: 'Master III', version: 'Camionnette 2.3 dCi FWD',
    year: 2011, km: 217000, fuel: 'Diesel', gearbox: 'Manuelle', power: 125, fiscalPower: 8, color: 'Blanc',
    price: 7990, vatRecoverable: true,
    description: 'Master traction 2.3 dCi, grand volume de chargement. Première mise en circulation : septembre 2011.',
    sourceUrl: LBC + 'utilitaires/3281424415',
  }),
  mk(3, {
    category: 'utilitaires', brand: 'Opel', model: 'Combo', version: 'Camionnette 1.5 D 100',
    year: 2020, km: 108042, fuel: 'Diesel', gearbox: 'Manuelle', power: 102, fiscalPower: 5, seats: 2, color: 'Blanc',
    price: 12990, vatRecoverable: true,
    description: 'Petit utilitaire Opel Combo 1.5 diesel, 2 places. Première mise en circulation : février 2020.',
    sourceUrl: LBC + 'utilitaires/3280880633',
  }),
  mk(4, {
    category: 'utilitaires', brand: 'Ford', model: 'Transit Custom', version: '2.0 EcoBlue 130 cabine approfondie 6 places',
    year: 2019, km: 159000, fuel: 'Diesel', gearbox: 'Manuelle', power: 131, fiscalPower: 7, seats: 6, color: 'Blanc',
    price: 17990, vatRecoverable: true, featured: true,
    description: 'Transit Custom en cabine approfondie : 6 places et un espace de chargement à l’arrière, idéal pour transporter une équipe et son matériel. Première mise en circulation : septembre 2019.',
    sourceUrl: LBC + 'utilitaires/3257477378',
  }),
  mk(5, {
    category: 'utilitaires', brand: 'Nissan', model: 'Primastar', version: 'II L1H1 dCi 130',
    year: 2022, km: 80577, fuel: 'Diesel', gearbox: 'Manuelle', power: 130, fiscalPower: 7, seats: 3, color: 'Blanc',
    price: 18990, vatRecoverable: true,
    description: 'Nissan Primastar nouvelle génération, version L1H1, 3 places, moteur 130 ch. Première mise en circulation : octobre 2022.',
    sourceUrl: LBC + 'utilitaires/3270359945',
  }),
  mk(6, {
    category: 'utilitaires', brand: 'Nissan', model: 'Primastar', version: 'L1H1 2.0 dCi 150 automatique',
    year: 2022, km: 81000, fuel: 'Diesel', gearbox: 'Automatique', power: 150, fiscalPower: 5, seats: 3, color: 'Blanc',
    price: 19990, vatRecoverable: true, featured: true,
    description: 'Primastar L1H1 en boîte automatique, moteur 2.0 dCi 150 ch, 3 places. Première mise en circulation : juin 2022.',
    sourceUrl: LBC + 'utilitaires/3281421679',
  }),
  mk(7, {
    category: 'utilitaires', brand: 'Ford', model: 'Transit Custom', version: 'L1H1 130 Ambiente',
    year: 2019, km: 176380, fuel: 'Diesel', gearbox: 'Manuelle', power: 130, fiscalPower: 7, seats: 3, color: 'Blanc',
    price: 11490, vatRecoverable: true,
    description: 'Transit Custom court (L1H1), finition Ambiente, 3 places. Première mise en circulation : septembre 2019.',
    sourceUrl: LBC + 'utilitaires/3257477526',
  }),
  mk(8, {
    category: 'utilitaires', brand: 'Renault', model: 'Master III', version: 'Camionnette 2.3 dCi FWD',
    year: 2020, km: 188715, fuel: 'Diesel', gearbox: 'Manuelle', power: 146, fiscalPower: 8, seats: 3, color: 'Blanc',
    price: 14990, vatRecoverable: true,
    description: 'Master traction 2.3 dCi, 3 places. Première mise en circulation : février 2020.',
    sourceUrl: LBC + 'utilitaires/3283504675',
  }),
  mk(9, {
    category: 'voitures', brand: 'Peugeot', model: '2008', version: '1.5 BlueHDi 130 S&S Roadtrip EAT8',
    year: 2022, km: 176000, fuel: 'Diesel', gearbox: 'Automatique', power: 131, fiscalPower: 7, doors: 5, seats: 5, color: 'Gris',
    price: 12990, featured: true,
    description: 'SUV compact Peugeot 2008 en finition Roadtrip, boîte automatique EAT8. Première mise en circulation : mai 2022.',
    sourceUrl: LBC + 'voitures/3276262752',
  }),
  mk(10, {
    category: 'utilitaires', brand: 'Citroën', model: 'Berlingo', version: 'Fourgon (K9) 1.5 BlueHDi 130 EAT8',
    year: 2020, km: 65650, fuel: 'Diesel', gearbox: 'Automatique', power: 130, fiscalPower: 5, seats: 3, color: 'Blanc',
    price: 14990, vatRecoverable: true, featured: true,
    description: 'Berlingo fourgon en boîte automatique, faible kilométrage. Révision complète effectuée. Garantie 3 mois moteur et boîte. Première mise en circulation : septembre 2020.',
    sourceUrl: LBC + 'utilitaires/3294359020',
  }),
  mk(11, {
    category: 'camions', brand: 'Renault', model: 'Master', version: '2.3 dCi 130 benne hydraulique',
    year: 2020, km: 81183, fuel: 'Diesel', gearbox: 'Manuelle', power: 130, color: 'Blanc',
    extra: 'Benne basculante hydraulique · plateforme châssis', price: 21990, featured: true,
    description: 'Master plateforme châssis équipé d’une benne hydraulique, pour le BTP et les espaces verts. Première mise en circulation : octobre 2020.',
    sourceUrl: TBP + 'renault/master-2-3dci-130-cv-benne-hydrolique/renault-master-2-3dci-130-cv-benne-hydrolique-plate-formechassis-2020',
  }),
  mk(12, {
    category: 'utilitaires', brand: 'Renault', model: 'Master III', version: 'F3300 L2H2 dCi 135 Générique',
    year: 2020, km: 36400, fuel: 'Diesel', gearbox: 'Manuelle', power: 135,
    price: 19500,
    description: 'Fourgon Master L2H2, moteur dCi 135, kilométrage faible pour l’année.',
    sourceUrl: TBP + 'renault/masteriii/renault-masteriii-f3300-l2h2-dci-135-generique-2020-2',
  }),
  mk(13, {
    category: 'utilitaires', brand: 'Citroën', model: 'Berlingo', version: '1.5 BlueHDi 130 EAT8 Club',
    year: 2019, km: 118347, fuel: 'Diesel', gearbox: 'Automatique', power: 130,
    price: 12490,
    description: 'Berlingo 1.5 BlueHDi 130 en boîte automatique EAT8, finition Club.',
    sourceUrl: TBP + 'citroen/berlingo-1-5hdi-130cv-boite-auto-eat8/citroen-berlingo-1-5hdi-130cv-boite-auto-eat8-club-2019',
  }),
  mk(14, {
    category: 'utilitaires', brand: 'Peugeot', model: 'Expert', version: 'Fourgon 2.0 BlueHDi',
    year: 2018, km: 115045, fuel: 'Diesel', gearbox: 'Manuelle',
    price: 12990,
    description: 'Peugeot Expert fourgon 2.0 BlueHDi.',
    sourceUrl: TBP + 'peugeot/expert/peugeot-expert-camionnette-2-0-bluehdi-2018-2',
  }),
  mk(15, {
    category: 'utilitaires', brand: 'Citroën', model: 'Berlingo', version: '1.5 BlueHDi 130 EAT8',
    year: 2019, km: 85190, fuel: 'Diesel', gearbox: 'Automatique', power: 130,
    price: 12990,
    description: 'Berlingo 1.5 BlueHDi 130 en boîte automatique EAT8.',
    sourceUrl: TBP + 'citroen/berlingo-1-5hdi-130-ch-boite-auto-eat8/citroen-berlingo-1-5hdi-130-ch-boite-auto-eat8-2019',
  }),
  mk(16, {
    category: 'utilitaires', brand: 'Renault', model: 'Kangoo Express', version: '1.5 dCi 80',
    year: 2021, km: 75925, fuel: 'Diesel', gearbox: 'Manuelle', power: 80,
    price: 8990,
    description: 'Kangoo Express 1.5 dCi 80, le petit utilitaire facile à garer en ville.',
    sourceUrl: TBP + 'renault/kangoo/renault-kangoo-express-1-5-dci-80-2021',
  }),
  mk(17, {
    category: 'utilitaires', brand: 'Peugeot', model: 'Partner', version: '1.5 BlueHDi',
    year: 2021, km: 99721, fuel: 'Diesel', gearbox: 'Manuelle',
    price: 8990,
    description: 'Peugeot Partner 1.5 diesel.',
    sourceUrl: TBP + 'peugeot/partner-1-5-hdi/peugeot-partner-1-5-hdi-2021',
  }),
  mk(18, {
    category: 'utilitaires', brand: 'Fiat', model: 'Talento', version: 'L2H1 2.0 EcoJet 145',
    year: 2021, km: 57200, fuel: 'Diesel', gearbox: 'Manuelle', power: 145,
    price: 15990,
    description: 'Fiat Talento long (L2H1), moteur 2.0 EcoJet 145 ch.',
    sourceUrl: TBP + 'fiat/talento-l2h1-2-0dci-145cv/fiat-talento-l2h1-2-0dci-145cv-camionnette-2-0-ecojet-2021',
  }),
  mk(19, {
    category: 'utilitaires', brand: 'Opel', model: 'Combo', version: '1.5 D 100',
    year: 2022, km: 52000, fuel: 'Diesel', gearbox: 'Manuelle', power: 100,
    price: 13990,
    description: 'Opel Combo 1.5 diesel 100 ch, même base que les Citroën Berlingo et Peugeot Partner.',
    sourceUrl: TBP + 'opel/combo-1-5hdi-100cv-idem-berlingo-partner/opel-combo-camionnettemonospace-1-5-d-2022',
  }),
  mk(20, {
    category: 'camions', brand: 'Iveco', model: 'Daily', version: '35C14 plancher cabine caisse 30 m³',
    year: 2019, km: 192000, fuel: 'Diesel', gearbox: 'Manuelle', power: 140,
    extra: 'Caisse 30 m³ · PTAC 3,5 t', price: 21990,
    description: 'Iveco Daily 35C14 en plancher cabine avec caisse de 30 m³, pour le déménagement et la messagerie.',
    sourceUrl: TBP + 'iveco/iveco-35c14-planche-cabine-30m-cube/iveco-iveco-35c14-planche-cabine-30m-cube',
  }),
  mk(21, {
    category: 'utilitaires', brand: 'Renault', model: 'Trafic III', version: '2.0 dCi 130 L2H1 Grand Confort',
    year: 2023, km: 83916, fuel: 'Diesel', gearbox: 'Manuelle', power: 130,
    price: 19990, featured: true,
    description: 'Trafic long (L2H1) récent, finition Grand Confort, moteur 2.0 dCi 130. Référence garage RE91337.',
    sourceUrl: TBP + 'renault/trafic-iii-2-0-dci-130cv-l2h1-grand-confort/renault-trafic-iii-2-0-dci-130cv-l2h1-grand-confort-re91337-2023',
  }),
  mk(22, {
    category: 'utilitaires', brand: 'Renault', model: 'Trafic III', version: '2.0 dCi 130 L2H1 Grand Confort',
    year: 2023, km: 90150, fuel: 'Diesel', gearbox: 'Manuelle', power: 130,
    price: 19990,
    description: 'Trafic long (L2H1) récent, finition Grand Confort, moteur 2.0 dCi 130.',
    sourceUrl: TBP + 'renault/trafic-iii-2-0-dci-130-cv-l2h1-garnd-confort/renault-trafic-iii-2-0-dci-130-cv-l2h1-garnd-confort-2-0-dci-130-fgmy-2023',
  }),
  mk(23, {
    category: 'utilitaires', brand: 'Peugeot', model: 'Expert', version: 'Fourgon long 2.0 BlueHDi 122',
    year: 2018, km: 81000, fuel: 'Diesel', gearbox: 'Manuelle', power: 122,
    price: 13990,
    description: 'Peugeot Expert en version longue, moteur 2.0 BlueHDi 122 ch.',
    sourceUrl: TBP + 'peugeot/expert-2-0-hdi-122cv-long/peugeot-expert-camionnette-2-0-bluehdi-2018',
  }),
  mk(24, {
    category: 'utilitaires', brand: 'Renault', model: 'Trafic', version: '2.0 dCi 145 Energy L1H1 Grand Confort avec nacelle',
    year: 2021, km: 105000, fuel: 'Diesel', gearbox: 'Manuelle', power: 145,
    extra: 'Équipé d’une nacelle', price: 17990,
    description: 'Trafic L1H1 2.0 dCi 145 Energy, finition Grand Confort, équipé d’une nacelle élévatrice.',
    sourceUrl: TBP + 'renault/trafic-2-0dci-145-cv-nacelle-club/renault-trafic-2-0dci-145-cv-nacelle-club-l1h1-1000-2-0-dci-145ch-energy-grand-confort-2021',
  }),  mk(25, {
    category: 'utilitaires', brand: 'Ford', model: 'Transit Custom', version: '300 L2H1 2.0 EcoBlue 130 Ambiente',
    year: 2018, km: 208675, fuel: 'Diesel', gearbox: 'Manuelle', power: 130,
    price: 10490,
    description: 'Transit Custom 300 long (L2H1), moteur 2.0 EcoBlue 130 ch, finition Ambiente.',
    sourceUrl: LBC_MILHAUD,
  }),
  mk(26, {
    category: 'utilitaires', brand: 'Volkswagen', model: 'Transporter', version: 'Fourgon diesel',
    year: 2011, km: 104650, fuel: 'Diesel', gearbox: 'Manuelle',
    price: 12990,
    description: 'Volkswagen Transporter diesel de 2011, 104 650 km.',
    sourceUrl: LBC_MILHAUD,
  }),
  mk(27, {
    category: 'utilitaires', brand: 'Renault', model: 'Trafic', version: '2.0 dCi 170 L2H1 6 places',
    year: 2020, km: 154600, fuel: 'Diesel', gearbox: 'Manuelle', power: 170, seats: 6,
    price: 17999, featured: true,
    description: 'Trafic long (L2H1) en 6 places, moteur 2.0 dCi 170 ch. Moteur changé (voir le détail avec le garage).',
    sourceUrl: LBC_MILHAUD,
  }),
].map((v) => (NOT_ON_LEBONCOIN.has(v.id) ? { ...v, visible: false } : v))

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
    id: 'l3', type: 'vehicule', status: 'en_cours', name: 'Exemple · Karim B.', phone: '06 00 00 00 01', demo: true, clientId: 'c1', vehicleId: 'v6',
    message: 'Le Trafic est toujours disponible ? Je peux passer samedi.',
    fields: { Véhicule: 'Nissan Primastar CA-106' }, photos: [], createdAt: day(2),
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

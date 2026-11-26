/** Emplacements photo du site — mêmes références que l'onglet « Images » du dossier projet. */
export const SLOTS: { id: string; label: string; where: string; ratio: string }[] = [
  { id: 'IMG-01', label: 'Grand bandeau d’accueil', where: 'Accueil, haut de page', ratio: '21/9' },
  { id: 'IMG-02', label: 'Catégorie Voitures', where: 'Accueil', ratio: '4/5' },
  { id: 'IMG-03', label: 'Catégorie Utilitaires', where: 'Accueil', ratio: '4/5' },
  { id: 'IMG-04', label: 'Catégorie Camions', where: 'Accueil', ratio: '4/5' },
  { id: 'IMG-05', label: 'Catégorie Motos', where: 'Accueil', ratio: '4/5' },
  { id: 'IMG-06', label: 'Entretien & vidange', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-07', label: 'Mécanique & diagnostic', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-08', label: 'Pneus', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-09', label: 'Carrosserie & peinture', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-10', label: 'Pare-brise', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-11', label: 'Dépannage', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-12', label: 'Carte grise', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-13', label: 'Utilitaires & pros', where: 'Carte service', ratio: '4/3' },
  { id: 'IMG-14', label: 'Avant réparation', where: 'Carrosserie, avant / après', ratio: '4/3' },
  { id: 'IMG-15', label: 'Après réparation', where: 'Carrosserie, avant / après', ratio: '4/3' },
  { id: 'IMG-16', label: 'Bandeau reprise', where: 'Accueil', ratio: '21/9' },
  { id: 'IMG-17', label: 'Façade de l’atelier', where: 'Accueil, bas de page', ratio: '21/9' },
  { id: 'IMG-18', label: 'Portrait de Fouad', where: 'Le garage', ratio: '4/5' },
  { id: 'IMG-19', label: 'L’équipe', where: 'Le garage', ratio: '3/2' },
  { id: 'IMG-20', label: 'L’atelier en grand', where: 'Le garage', ratio: '21/9' },
  { id: 'IMG-21', label: 'Entrée et parking', where: 'Contact', ratio: '3/2' },
  { id: 'IMG-22', label: 'Expertise de reprise', where: 'Reprise', ratio: '3/2' },
  { id: 'IMG-24-1', label: 'Bandeau Entretien', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-2', label: 'Bandeau Mécanique', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-3', label: 'Bandeau Pneus', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-4', label: 'Bandeau Carrosserie', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-5', label: 'Bandeau Pare-brise', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-6', label: 'Bandeau Dépannage', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-7', label: 'Bandeau Carte grise', where: 'Page service', ratio: '21/9' },
  { id: 'IMG-24-8', label: 'Bandeau Utilitaires', where: 'Page service', ratio: '21/9' },
]

/**
 * Photos livrées avec le site (dossier public/images), reprises du projet Connect-Auto-V0.
 * Ce sont des images d’ambiance : elles seront remplacées par les vraies photos du garage
 * depuis l’admin (Plus → Photos du site), qui ont toujours la priorité.
 */
export const LOCAL_IMAGES: Record<string, string> = {
  'IMG-01': '/images/hero-studio.webp',
  'IMG-02': '/images/cat-voitures.webp',
  'IMG-03': '/images/cat-utilitaires.webp',
  'IMG-04': '/images/cat-camions.webp',
  'IMG-05': '/images/cat-motos.webp',
  'IMG-06': '/images/svc-entretien.webp',
  'IMG-07': '/images/svc-mecanique.webp',
  'IMG-08': '/images/svc-pneus.webp',
  'IMG-09': '/images/svc-carrosserie.webp',
  'IMG-10': '/images/svc-parebrise.webp',
  'IMG-11': '/images/svc-depannage.webp',
  'IMG-12': '/images/svc-cartegrise.webp',
  'IMG-13': '/images/cat-utilitaires.webp',
  'IMG-14': '/images/ba-avant.webp',
  'IMG-15': '/images/ba-apres.webp',
  'IMG-16': '/images/reprise.webp',
  'IMG-17': '/images/atelier.webp',
  'IMG-18': '/images/reprise.webp',
  'IMG-19': '/images/detail-freinage.webp',
  'IMG-20': '/images/atelier.webp',
  'IMG-21': '/images/svc-cartegrise.webp',
  'IMG-22': '/images/reprise.webp',
  'IMG-24-1': '/images/svc-entretien.webp',
  'IMG-24-2': '/images/detail-freinage.webp',
  'IMG-24-3': '/images/svc-pneus.webp',
  'IMG-24-4': '/images/ban-carrosserie.webp',
  'IMG-24-5': '/images/svc-parebrise.webp',
  'IMG-24-6': '/images/svc-depannage.webp',
  'IMG-24-7': '/images/svc-cartegrise.webp',
  'IMG-24-8': '/images/cat-utilitaires.webp',
}

/** Emplacements dont la photo d’ambiance est une image d’illustration (à remplacer par une vraie photo). */
export const ILLUSTRATIVE = new Set(['IMG-14', 'IMG-15'])

export const slotSrc = (images: Record<string, string> | undefined, id: string): string | undefined =>
  images?.[id] || LOCAL_IMAGES[id]

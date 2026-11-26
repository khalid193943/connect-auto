export type BrandOrigin = 'france' | 'allemagne' | 'autres'
export type BrandItem = { id: string; name: string; origin: BrandOrigin }

/** Marques affichées dans le carrousel (liste du site Connect Auto V0). */
export const BRAND_LIST: BrandItem[] = [
  { id: 'renault', name: 'Renault', origin: 'france' },
  { id: 'peugeot', name: 'Peugeot', origin: 'france' },
  { id: 'citroen', name: 'Citroën', origin: 'france' },
  { id: 'dacia', name: 'Dacia', origin: 'france' },
  { id: 'ds', name: 'DS Automobiles', origin: 'france' },
  { id: 'volkswagen', name: 'Volkswagen', origin: 'allemagne' },
  { id: 'mercedes', name: 'Mercedes-Benz', origin: 'allemagne' },
  { id: 'bmw', name: 'BMW', origin: 'allemagne' },
  { id: 'audi', name: 'Audi', origin: 'allemagne' },
  { id: 'opel', name: 'Opel', origin: 'allemagne' },
  { id: 'toyota', name: 'Toyota', origin: 'autres' },
  { id: 'nissan', name: 'Nissan', origin: 'autres' },
  { id: 'ford', name: 'Ford', origin: 'autres' },
  { id: 'fiat', name: 'Fiat', origin: 'autres' },
  { id: 'hyundai', name: 'Hyundai', origin: 'autres' },
  { id: 'kia', name: 'Kia', origin: 'autres' },
  { id: 'volvo', name: 'Volvo', origin: 'autres' },
  { id: 'iveco', name: 'Iveco', origin: 'autres' },
]

'use client'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Category, Vehicle } from '@/lib/types'
import { CATEGORIES } from '@/lib/site'
import { VehicleCard } from './VehicleCard'
import { num } from '@/lib/format'

const SORTS = {
  recent: 'Les plus récents',
  'prix-asc': 'Prix croissant',
  'prix-desc': 'Prix décroissant',
  km: 'Kilométrage le plus bas',
  annee: 'Année la plus récente',
} as const
type SortKey = keyof typeof SORTS

export function Catalogue({ vehicles, category }: { vehicles: Vehicle[]; category?: Category }) {
  const sp = useSearchParams()
  const router = useRouter()
  const path = usePathname()
  const [open, setOpen] = useState(false)

  // Lien venant de la recherche rapide de l’accueil : /occasions?cat=utilitaires&…
  useEffect(() => {
    const cat = sp.get('cat')
    if (!category && cat && CATEGORIES.some((c) => c.key === cat)) {
      const p = new URLSearchParams(sp.toString())
      p.delete('cat')
      for (const [k, v] of [...p.entries()]) if (!v) p.delete(k)
      router.replace(`/occasions/${cat}${p.size ? `?${p}` : ''}`)
    }
  }, [sp, category, router])

  const pool = useMemo(() => (category ? vehicles.filter((v) => v.category === category) : vehicles), [vehicles, category])
  const brands = useMemo(() => [...new Set(pool.map((v) => v.brand))].sort(), [pool])
  const fuels = useMemo(() => [...new Set(pool.map((v) => v.fuel))].sort(), [pool])

  const f = {
    marque: sp.get('marque') ?? '',
    carburant: sp.get('carburant') ?? '',
    boite: sp.get('boite') ?? '',
    prix: sp.get('prix') ?? '',
    km: sp.get('km') ?? '',
    annee: sp.get('annee') ?? '',
    q: sp.get('q') ?? '',
    tri: (sp.get('tri') as SortKey) || 'recent',
    vendus: sp.get('vendus') ?? '',
  }

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString())
    if (v) p.set(k, v)
    else p.delete(k)
    router.replace(`${path}${p.size ? `?${p}` : ''}`, { scroll: false })
  }

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const out = pool.filter(
      (v) =>
        (!f.marque || v.brand === f.marque) &&
        (!f.carburant || v.fuel === f.carburant) &&
        (!f.boite || v.gearbox === f.boite) &&
        (!f.prix || v.price <= Number(f.prix)) &&
        (!f.km || v.km <= Number(f.km)) &&
        (!f.annee || v.year >= Number(f.annee)) &&
        (f.vendus !== 'non' || v.status !== 'vendu') &&
        (!q || `${v.brand} ${v.model} ${v.version} ${v.ref}`.toLowerCase().includes(q)),
    )
    const rank = { disponible: 0, reserve: 1, vendu: 2 }
    const by: Record<SortKey, (a: Vehicle, b: Vehicle) => number> = {
      recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
      'prix-asc': (a, b) => a.price - b.price,
      'prix-desc': (a, b) => b.price - a.price,
      km: (a, b) => a.km - b.km,
      annee: (a, b) => b.year - a.year,
    }
    return out.sort((a, b) => rank[a.status] - rank[b.status] || (by[f.tri] ?? by.recent)(a, b))
  }, [pool, f.q, f.marque, f.carburant, f.boite, f.prix, f.km, f.annee, f.tri, f.vendus])

  const active = ['marque', 'carburant', 'boite', 'prix', 'km', 'annee', 'q', 'vendus'].filter((k) => (f as Record<string, string>)[k]).length
  const maxPrice = Math.max(5000, ...pool.map((v) => v.price))
  const priceSteps = [5000, 8000, 10000, 15000, 20000, 25000, 30000, 40000, 60000].filter((p) => p < maxPrice + 10000)

  return (
    <>
      <div className="cat-tabs" style={{ marginBottom: 28 }}>
        <Link href="/occasions" className={`chip ${!category ? 'on' : ''}`}>Tout le stock ({vehicles.length})</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.key} href={`/occasions/${c.key}`} className={`chip ${category === c.key ? 'on' : ''}`}>
            {c.label} ({vehicles.filter((v) => v.category === c.key).length})
          </Link>
        ))}
      </div>
      <div className="catalog">
        {open && <div className="scrim" onClick={() => setOpen(false)} />}
        <aside className={`filters ${open ? 'open' : ''}`} aria-label="Filtres">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Filtrer</h3>
            {active > 0 && (
              <button className="chip" style={{ minHeight: 34 }} onClick={() => router.replace(path, { scroll: false })}>
                Effacer
              </button>
            )}
            <button className="hdr-burger filters-toggle" style={{ width: 40, height: 40 }} onClick={() => setOpen(false)} aria-label="Fermer les filtres">
              <X />
            </button>
          </div>
          <label className="field"><span>Recherche</span>
            <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Trafic, Master, Berlingo…" />
          </label>
          <label className="field"><span>Marque</span>
            <select value={f.marque} onChange={(e) => set('marque', e.target.value)}>
              <option value="">Toutes</option>
              {brands.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="field"><span>Budget maximum</span>
            <select value={f.prix} onChange={(e) => set('prix', e.target.value)}>
              <option value="">Sans limite</option>
              {priceSteps.map((p) => <option key={p} value={p}>{num(p)} €</option>)}
            </select>
          </label>
          <label className="field"><span>Kilométrage maximum</span>
            <select value={f.km} onChange={(e) => set('km', e.target.value)}>
              <option value="">Sans limite</option>
              {[30000, 50000, 80000, 100000, 150000, 200000].map((k) => <option key={k} value={k}>{num(k)} km</option>)}
            </select>
          </label>
          <div className="range2">
            <label className="field"><span>Année min.</span>
              <select value={f.annee} onChange={(e) => set('annee', e.target.value)}>
                <option value="">Toutes</option>
                {Array.from({ length: 12 }, (_, i) => 2026 - i).map((y) => <option key={y}>{y}</option>)}
              </select>
            </label>
            <label className="field"><span>Boîte</span>
              <select value={f.boite} onChange={(e) => set('boite', e.target.value)}>
                <option value="">Toutes</option>
                <option>Manuelle</option>
                <option>Automatique</option>
              </select>
            </label>
          </div>
          <label className="field"><span>Énergie</span>
            <select value={f.carburant} onChange={(e) => set('carburant', e.target.value)}>
              <option value="">Toutes</option>
              {fuels.map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={f.vendus === 'non'} onChange={(e) => set('vendus', e.target.checked ? 'non' : '')} />
            <span>Masquer les véhicules vendus</span>
          </label>
          <button className="btn btn-accent filters-toggle" onClick={() => setOpen(false)}>
            Voir {list.length} véhicule{list.length > 1 ? 's' : ''}
          </button>
        </aside>

        <div>
          <div className="catalog-top">
            <p style={{ margin: 0 }} aria-live="polite">
              <b className="num">{list.length}</b> <span className="muted">véhicule{list.length > 1 ? 's' : ''}</span>
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-sm filters-toggle" onClick={() => setOpen(true)}>
                <SlidersHorizontal /> Filtres{active ? ` (${active})` : ''}
              </button>
              <div className="field">
                <select aria-label="Trier" value={f.tri} onChange={(e) => set('tri', e.target.value === 'recent' ? '' : e.target.value)}>
                  {Object.entries(SORTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
          {list.length ? (
            <div className="veh-grid">
              {list.map((v, i) => <VehicleCard key={v.id} v={v} priority={i < 3} />)}
            </div>
          ) : (
            <div className="empty">
              <p style={{ margin: 0 }}>Aucun véhicule ne correspond à ces critères pour le moment.</p>
              <p style={{ margin: 0 }} className="small">Notre stock bouge chaque semaine : dites-nous ce que vous cherchez, on vous prévient.</p>
              <Link className="btn btn-accent btn-sm" href="/contact?sujet=recherche">Je cherche un véhicule</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

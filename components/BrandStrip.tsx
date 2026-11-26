/** Bandeau des marques : logos officiels envoyés depuis l’admin, sinon le nom de la marque. */
export function BrandStrip({ brands, logos }: { brands: string[]; logos: Record<string, string> }) {
  const item = (b: string, k: string) =>
    logos[b] ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={k} src={logos[b]} alt={b} loading="lazy" />
    ) : (
      <span key={k} className="bn">{b}</span>
    )
  return (
    <section className="brands" aria-label="Marques entretenues et vendues">
      <p className="brands-head">Toutes marques · entretien, réparation, vente</p>
      <div className="brands-track">
        {brands.map((b) => item(b, b))}
        {brands.map((b) => <span key={'d' + b} aria-hidden style={{ display: 'contents' }}>{item(b, 'x' + b)}</span>)}
      </div>
    </section>
  )
}

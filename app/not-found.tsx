import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
        <p className="eyebrow">Erreur 404</p>
        <h1 className="display h2">Page introuvable</h1>
        <Link href="/" className="btn btn-accent">Retour à l’accueil</Link>
      </div>
    </main>
  )
}

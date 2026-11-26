import Link from 'next/link'
import { CarArt } from '@/components/Logo'

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '80vh', display: 'grid', alignContent: 'center', gap: 24 }}>
      <CarArt className="hero-art" />
      <p className="eyebrow">Erreur 404</p>
      <h1 className="display h1">Sortie de <span className="accent">route</span></h1>
      <p className="lead">Cette page n’existe pas ou plus. Le véhicule que vous cherchiez a peut-être été vendu.</p>
      <div className="hero-ctas">
        <Link href="/" className="btn btn-accent">Retour à l’accueil</Link>
        <Link href="/occasions" className="btn">Voir les occasions</Link>
      </div>
    </section>
  )
}

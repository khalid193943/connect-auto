'use client'
import { useEffect, useRef, useState } from 'react'
import sizes from '@/lib/brand/logo-sizes.json'

/**
 * Ouverture du site : la route se dessine, l’utilitaire arrive, le nom chromé monte avec un reflet, puis le slogan.
 * Les calques sont les fichiers vectoriels du logo (/public/brand/intro-*.svg), dans la version du thème en cours.
 */
export default function IntroLoader({ onReady, onDone }: { onReady: () => void; onDone: () => void }) {
  const [tone] = useState<'clair' | 'sombre'>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'sombre' : 'clair')
  const [go, setGo] = useState(false)
  const loaded = useRef(0)
  const [w, h] = sizes.complet
  const LAYERS = 4

  useEffect(() => {
    onReady()
    const fallback = window.setTimeout(() => setGo(true), 700)   // ne jamais bloquer si une image tarde
    return () => window.clearTimeout(fallback)
  }, [onReady])

  useEffect(() => {
    if (!go) return
    const t = window.setTimeout(onDone, 3300)
    return () => window.clearTimeout(t)
  }, [go, onDone])

  const onLoad = () => { loaded.current += 1; if (loaded.current >= LAYERS) setGo(true) }
  const L = (file: string, cls: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`il ${cls}`} src={`/brand/intro-${file}.svg`} alt="" width={w} height={h} onLoad={onLoad} draggable={false} />
  )

  return (
    <div className={`intro ${go ? 'go' : ''}`} onClick={onDone} role="presentation">
      <div className="intro-stage2" style={{ aspectRatio: `${w} / ${h}` }} role="img" aria-label="Connect Auto, spécialiste des utilitaires">
        {L(`route-fond-${tone}`, 'il-road')}
        {L(`utilitaire-fond-${tone}`, 'il-van')}
        {L(`nom-fond-${tone}`, 'il-name')}
        <span className="il-shine" style={{ WebkitMaskImage: `url(/brand/intro-nom-fond-${tone}.svg)`, maskImage: `url(/brand/intro-nom-fond-${tone}.svg)` }} />
        {L('slogan', 'il-slogan')}
      </div>
      <div className="intro-bar"><i /></div>
      <button className="intro-skip-btn" onClick={onDone}>Passer</button>
    </div>
  )
}

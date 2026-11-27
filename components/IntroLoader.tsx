'use client'
import { useEffect } from 'react'
import v1 from '@/lib/brand/logo-v1.json'

const [cx, cy, cw, ch] = v1.vbCar.split(' ').map(Number)

/** Le logo officiel s’écrit : la silhouette de l’utilitaire apparaît, le filet vert s’allume, le nom suit, puis le véhicule file. */
export default function IntroLoader({ onReady, onDone }: { onReady: () => void; onDone: () => void }) {
  useEffect(() => {
    onReady()
    const t = window.setTimeout(onDone, 3300)
    return () => window.clearTimeout(t)
  }, [onReady, onDone])

  return (
    <div className="intro" onClick={onDone} role="presentation">
      <svg className="intro-logo" viewBox={v1.vb} aria-hidden>
        <defs>
          <linearGradient id="it" x1={v1.tailGrad[0]} y1="0" x2={v1.tailGrad[1]} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2EC95C" stopOpacity="0" />
            <stop offset=".35" stopColor="#2EC95C" />
            <stop offset="1" stopColor="#8AE3A5" />
          </linearGradient>
          <filter id="ig" x="-30%" y="-300%" width="160%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="iclip"><rect className="i-wipe" x={cx} y={cy} width={cw} height={ch} /></clipPath>
        </defs>
        <g className="i-car">
          <g clipPath="url(#iclip)">
            <path d={v1.roof} className="i-ink" />
            <path d={v1.shoulder} className="i-ink" />
            <path d={v1.nose} className="i-ink" opacity=".88" />
          </g>
          <path className="i-tail" d={v1.tail} fill="url(#it)" filter="url(#ig)" />
        </g>
        <g className="i-word">
          <path d={v1.word} className="i-ink" />
          <path d={v1.nn} className="i-acc" />
          <path d={v1.auto} className="i-ink" />
        </g>
        <path className="i-tag i-acc" d={v1.tag} />
      </svg>
      <div className="intro-bar"><i /></div>
      <button className="intro-skip-btn" onClick={onDone}>Passer</button>
    </div>
  )
}

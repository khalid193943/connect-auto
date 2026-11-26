'use client'
import { useEffect } from 'react'
import v1 from '@/lib/brand/logo-v1.json'

/** Le logo officiel s’écrit : la silhouette apparaît, le feu arrière s’allume, le nom suit, puis la voiture file. */
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
          <linearGradient id="it" x1="744" y1="0" x2="880" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2EC95C" stopOpacity="0" />
            <stop offset=".35" stopColor="#2EC95C" />
            <stop offset="1" stopColor="#8AE3A5" />
          </linearGradient>
          <filter id="ig" x="-30%" y="-300%" width="160%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="iclip"><rect className="i-wipe" x="130" y="120" width="780" height="160" /></clipPath>
        </defs>
        <g className="i-car">
          <g clipPath="url(#iclip)">
            <path d={v1.roof} fill="#F4F6F8" />
            <path d={v1.shoulder} fill="#F4F6F8" opacity=".9" />
            <path d={v1.nose} fill="#F4F6F8" opacity=".75" />
          </g>
          <path className="i-tail" d={v1.tail} fill="url(#it)" filter="url(#ig)" />
        </g>
        <path className="i-word" d={v1.word} fill="#F4F6F8" />
        <path className="i-tag" d={v1.tag} fill="#2EC95C" />
      </svg>
      <div className="intro-bar"><i /></div>
      <button className="intro-skip-btn" onClick={onDone}>Passer</button>
    </div>
  )
}

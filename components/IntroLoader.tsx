'use client'
import { useEffect } from 'react'
import anim from '@/lib/brand/car-anim.json'
import logo from '@/lib/brand/logo.json'
import { LogoWord } from './Logo'

const INK = '#F4F6F8'
const ACC = '#2EC95C'
const H = logo.meta.span[1]
const [hx, hy] = logo.meta.head

/** La voiture du logo se dessine, allume ses phares, tourne au ralenti puis démarre. */
export default function IntroLoader({ onReady, onDone }: { onReady: () => void; onDone: () => void }) {
  useEffect(() => {
    onReady()
    const t = window.setTimeout(onDone, 3400)
    return () => window.clearTimeout(t)
  }, [onReady, onDone])

  const item = (it: { d: string; f: boolean; w?: number }, i: number) =>
    it.f ? <path key={i} d={it.d} fill={INK} /> : <path key={i} d={it.d} fill="none" stroke={INK} strokeWidth={it.w} />

  return (
    <div className="intro" onClick={onDone} role="presentation">
      <div className="intro-stage">
        <svg className="intro-car" viewBox={`-60 -30 1120 ${H + 60}`} aria-hidden>
          <defs>
            <radialGradient id="ibeam" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#fff" stopOpacity=".95" />
              <stop offset=".35" stopColor="#eaf6ff" stopOpacity=".35" />
              <stop offset="1" stopColor="#eaf6ff" stopOpacity="0" />
            </radialGradient>
            <filter id="iglow" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="idle">
            <g>
              {anim.draw.map((p, i) => (
                <path key={i} className="ln" d={p.d} pathLength={1} stroke={p.a ? ACC : INK} style={{ ['--i' as string]: i }} />
              ))}
            </g>
            <g className="fl">
              {anim.fills.map(item)}
              <g className="spin">{anim.spinF.map(item)}</g>
              <g className="spin">{anim.spinR.map(item)}</g>
            </g>
            <g className="glow" filter="url(#iglow)">
              {anim.acc.map((d, i) => <path key={i} d={d} fill={ACC} />)}
            </g>
            <g className="beam">
              <ellipse cx={hx - 120} cy={hy + 10} rx="190" ry="44" fill="url(#ibeam)" />
              <ellipse cx={hx} cy={hy} rx="30" ry="10" fill="url(#ibeam)" />
            </g>
          </g>
        </svg>
        <LogoWord className="intro-word" id="introword" />
      </div>
      <div className="intro-bar"><i /></div>
      <button className="intro-skip-btn" onClick={onDone}>Passer</button>
    </div>
  )
}

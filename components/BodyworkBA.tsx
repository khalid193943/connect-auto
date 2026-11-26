'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

const DAMAGES = [
  { x: 46, y: 59, t: 'Rayures profondes', d: 'La peinture est entamée jusqu’à l’apprêt.' },
  { x: 57.5, y: 65.5, t: 'Bosse sur le pare-choc', d: 'Le plastique est enfoncé et doit être redressé.' },
  { x: 37, y: 77, t: 'Bas de pare-choc frotté', d: 'Éraflures et éclats sur l’arête basse.' },
]

const RESULTS = ['Forme d’origine retrouvée', 'Teinte raccordée au reste de la voiture', 'Vernis brillant, contrôlé à la lumière du jour']

const STEPS = [
  { img: '/images/ba-avant.webp', pos: '58% 62%', t: 'Diagnostic et devis', d: 'On relève chaque dégât avec vous, photos à l’appui. Le devis détaillé peut être transmis à votre assurance.' },
  { img: '/images/carro-prep.webp', pos: '50% 50%', t: 'Préparation', d: 'Redressage, ponçage, apprêt, puis masquage de tout ce qui ne doit pas être peint.' },
  { img: '/images/carro-peinture.webp', pos: '45% 50%', t: 'Mise en peinture', d: 'Teinte préparée à la couleur du véhicule, appliquée en couches fines, puis vernis.' },
  { img: '/images/ba-apres.webp', pos: '50% 45%', t: 'Contrôle et restitution', d: 'Vérification à la lumière du jour, nettoyage, et vous récupérez votre véhicule.' },
]

export function BodyworkBA({ before, after, illustrative }: { before: string; after: string; illustrative: boolean }) {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section className="section wrap bw">
      <div className="bw-head">
        <p className="eyebrow">Avant / après</p>
        <h2 className="t6">Du choc à la remise en état. <span>Étape par étape.</span></h2>
        <p className="muted">D’abord ce que l’on constate au diagnostic, puis le résultat rendu au client. Les quatre étapes entre les deux sont expliquées juste en dessous.</p>
      </div>

      <div className="bw-compare">
        <figure className="bw-card">
          <div className="bw-media">
            <img src={before} alt="Avant réparation : pare-choc rayé et enfoncé" loading="lazy" />
            <span className="bw-tag">Avant</span>
            {illustrative &&
              DAMAGES.map((p, i) => (
                <button
                  key={p.t}
                  type="button"
                  className={`bw-dot${active === i ? ' on' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(active === i ? null : i)}
                  aria-label={p.t}
                >
                  {i + 1}
                </button>
              ))}
          </div>
          <figcaption>
            <p className="bw-cap">Ce que l’on constate</p>
            <ol className="bw-list">
              {DAMAGES.map((p, i) => (
                <li
                  key={p.t}
                  className={active === i ? 'on' : ''}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  <b>{i + 1}</b>
                  <span><strong>{p.t}</strong>{p.d}</span>
                </li>
              ))}
            </ol>
          </figcaption>
        </figure>

        <div className="bw-arrow" aria-hidden>
          <span><ArrowRight /></span>
        </div>

        <figure className="bw-card">
          <div className="bw-media">
            <img src={after} alt="Après réparation : carrosserie lisse et vernis brillant" loading="lazy" />
            <span className="bw-tag ok">Après</span>
          </div>
          <figcaption>
            <p className="bw-cap">Ce que vous récupérez</p>
            <ul className="bw-list ok">
              {RESULTS.map((r) => (
                <li key={r}><b><Check /></b><span><strong>{r}</strong></span></li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>

      <ol className="bw-steps">
        {STEPS.map((s, i) => (
          <li key={s.t} className="bw-step" data-reveal>
            <div className="bw-step-img"><img src={s.img} alt="" loading="lazy" style={{ objectPosition: s.pos }} /></div>
            <div className="bw-step-txt">
              <span className="bw-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      {illustrative && <p className="bw-note">Images d’illustration. Les photos de nos propres réparations seront ajoutées prochainement.</p>}
    </section>
  )
}

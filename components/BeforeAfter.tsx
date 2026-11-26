'use client'
import { useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { Slot } from './Slot'
import { slotSrc } from '@/lib/images'

export function BeforeAfter({ images }: { images: Record<string, string> }) {
  const [pos, setPos] = useState(50)
  if (!slotSrc(images, 'IMG-14') || !slotSrc(images, 'IMG-15')) {
    return (
      <div className="ba-fallback" data-reveal>
        <Slot illus="voiture" alt="Carrosserie et peinture chez Connect Auto" />
        <ul>
          {['Débosselage', 'Peinture', 'Pare-chocs', 'Rayures', 'Remise en état'].map((t) => <li key={t} className="tag">{t}</li>)}
        </ul>
      </div>
    )
  }
  return (
    <div className="ba" style={{ ['--pos' as string]: `${pos}%` }} data-reveal>
      <Slot id="IMG-14" images={images} icon="car" alt="Véhicule avant réparation" sizes="(max-width: 1050px) 100vw, 55vw" />
      <div className="ba-after" style={{ position: 'absolute', inset: 0 }}>
        <Slot id="IMG-15" images={images} icon="car" alt="Le même véhicule après réparation" sizes="(max-width: 1050px) 100vw, 55vw" style={{ position: 'absolute', inset: 0 }} />
      </div>
      <span className="illus-badge" style={{ top: 'auto', bottom: 16, left: 16 }}>Images d’illustration</span>
      <span className="tag ba-label l">Avant</span>
      <span className="tag green ba-label r">Après</span>
      <div className="ba-handle"><span className="ba-knob"><ChevronsLeftRight /></span></div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Comparer avant et après" />
    </div>
  )
}

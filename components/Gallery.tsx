'use client'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Slot } from './Slot'

export function Gallery({ photos, alt, icon, refId }: { photos: string[]; alt: string; icon: string; refId: string }) {
  const [i, setI] = useState(0)
  const n = photos.length
  const go = (d: number) => setI((x) => (x + d + n) % n)
  if (!n) {
    return (
      <div className="gallery">
        <div className="gallery-main"><Slot icon={icon} id={refId} label="Photos à venir" /></div>
      </div>
    )
  }
  return (
    <div className="gallery">
      <div
        className="gallery-main"
        onTouchStart={(e) => ((e.currentTarget as HTMLElement).dataset.x = String(e.touches[0].clientX))}
        onTouchEnd={(e) => {
          const x0 = Number((e.currentTarget as HTMLElement).dataset.x)
          const dx = e.changedTouches[0].clientX - x0
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        }}
      >
        <Image src={photos[i]} alt={`${alt} — photo ${i + 1}`} fill priority sizes="(max-width: 1050px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
        {n > 1 && (
          <>
            <button className="gallery-nav prev" onClick={() => go(-1)} aria-label="Photo précédente"><ChevronLeft /></button>
            <button className="gallery-nav next" onClick={() => go(1)} aria-label="Photo suivante"><ChevronRight /></button>
          </>
        )}
        <span className="tag gallery-count num">{i + 1} / {n}</span>
      </div>
      {n > 1 && (
        <div className="gallery-strip">
          {photos.map((p, j) => (
            <button key={p} onClick={() => setI(j)} aria-current={j === i} aria-label={`Voir la photo ${j + 1}`}>
              <Image src={p} alt="" width={220} height={165} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

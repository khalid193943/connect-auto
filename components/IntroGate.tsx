'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const IntroLoader = dynamic(() => import('./IntroLoader'), { ssr: false })

/** Script à placer dans <head> : masque la page tant que l’intro n’a pas démarré (1re visite de la session). */
export const INTRO_SCRIPT = `try{var t=localStorage.getItem('ca_theme');if(t==='light')document.documentElement.dataset.theme='light';}catch(e){}try{if(/[?&]photos=1/.test(location.search))document.documentElement.classList.add('show-slots');if(!sessionStorage.getItem('ca_intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro-on')}}catch(e){}`

export function IntroGate() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains('intro-on')) return
    setShow(true)
    const safety = window.setTimeout(() => html.classList.remove('intro-on'), 4500)
    return () => window.clearTimeout(safety)
  }, [])
  if (!show) return null
  return (
    <IntroLoader
      onReady={() => document.documentElement.classList.remove('intro-on')}
      onDone={() => {
        try { sessionStorage.setItem('ca_intro', '1') } catch {}
        setShow(false)
      }}
    />
  )
}

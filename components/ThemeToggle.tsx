'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/** Bouton clair / sombre (le choix est gardé dans le navigateur). */
export function ThemeToggle() {
  const [light, setLight] = useState(false)
  useEffect(() => setLight(document.documentElement.dataset.theme === 'light'), [])
  const toggle = () => {
    const next = !light
    setLight(next)
    document.documentElement.dataset.theme = next ? 'light' : 'dark'
    try { localStorage.setItem('ca_theme', next ? 'light' : 'dark') } catch {}
  }
  return (
    <button type="button" className="hdr-ico theme-btn" onClick={toggle} aria-label={light ? 'Passer en version sombre' : 'Passer en version claire'} title={light ? 'Version sombre' : 'Version claire'}>
      {light ? <Moon /> : <Sun />}
    </button>
  )
}

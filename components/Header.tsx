'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, MessageCircle, Phone, Search, X } from 'lucide-react'
import { LogoWord } from './Logo'
import { NAV } from '@/lib/site'
import { telHref, waHref } from '@/lib/format'

export function Header({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const path = usePathname()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const current = (href: string) => (path === href || path.startsWith(href + '/') ? 'page' : undefined)

  return (
    <>
      <header className={`hdr ${solid ? 'solid' : ''}`}>
        <Link href="/" className="hdr-logo" aria-label="Connect Auto, accueil">
          <LogoWord id="hdrlogo" />
        </Link>
        <nav className="hdr-nav" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={current(n.href)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-cta">
          <Link className="hdr-ico" href="/occasions" aria-label="Rechercher un véhicule"><Search /></Link>
          <a className="hdr-ico" href={telHref(phone)} aria-label={`Appeler le ${phone}`}><Phone /></a>
          <Link href="/rendez-vous" className="btn btn-accent btn-sm hdr-pill">
            Rendez-vous
          </Link>
        </div>
        <button className="hdr-burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </header>

      <div className={`menu ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className="menu-top">
          <Link href="/" style={{ width: 150 }} aria-label="Accueil">
            <LogoWord id="menulogo" />
          </Link>
          <button className="hdr-burger" style={{ display: 'grid' }} aria-label="Fermer le menu" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav aria-label="Menu mobile">
          <Link href="/">Accueil <ArrowRight /></Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label} <ArrowRight />
            </Link>
          ))}
        </nav>
        <div className="menu-foot">
          <Link href="/rendez-vous" className="btn btn-accent btn-block">Prendre rendez-vous</Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <a className="btn btn-block" href={telHref(phone)}><Phone /> Appeler</a>
            <a className="btn btn-block" href={waHref(whatsapp, 'Bonjour Connect Auto, ')} target="_blank" rel="noopener"><MessageCircle /> WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  )
}

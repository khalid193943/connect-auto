'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import type { R } from '@/app/admin/actions'

/** Formulaire admin : bouton « Enregistrer » collé en bas de l’écran + message de confirmation. */
export function ActionForm({
  action, children, label = 'Enregistrer', className, sticky = true, onDone,
}: {
  action: (prev: R, fd: FormData) => Promise<R>
  children: React.ReactNode
  label?: string
  className?: string
  sticky?: boolean
  onDone?: (r: R) => void
}) {
  const [state, run, pending] = useActionState(action, { ok: false })
  const [dirty, setDirty] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (state.ok) setDirty(false)
    onDone?.(state)
  }, [state, onDone])
  return (
    <form action={run} className={className} onChange={() => setDirty(true)} style={{ display: 'grid', gap: 16 }}>
      {children}
      <div className={sticky ? 'savebar' : ''} style={sticky ? undefined : { display: 'flex', gap: 10, alignItems: 'center' }}>
        <span className={`msg ${state.msg && !dirty ? (state.ok ? 'ok' : 'err') : ''}`} role="status" style={!sticky ? { flex: 1, fontSize: 14.5, fontWeight: 650 } : undefined}>
          {pending ? 'Enregistrement…' : state.msg && !dirty ? <>{state.ok && <Check size={16} style={{ verticalAlign: -3 }} />} {state.msg}</> : dirty ? 'Modifications non enregistrées' : ''}
        </span>
        <button className="b pri" disabled={pending}>
          {pending ? <Loader2 className="spin-ico" /> : <Check />} {label}
        </button>
      </div>
    </form>
  )
}

/** Bouton en deux temps (pas de fenêtre de confirmation) pour les actions définitives. */
export function ConfirmButton({ action, children, confirm = 'Confirmer', className = 'b red' }: { action: () => Promise<void>; children: React.ReactNode; confirm?: string; className?: string }) {
  const [armed, setArmed] = useState(false)
  const [pending, setPending] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(t)
  }, [armed])
  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={async () => {
        if (!armed) return setArmed(true)
        setPending(true)
        await action()
        setPending(false)
        setArmed(false)
      }}
      style={armed ? { background: 'var(--a-red)', color: '#fff', borderColor: 'var(--a-red)' } : undefined}
    >
      {pending ? <Loader2 className="spin-ico" /> : null}
      {armed ? confirm : children}
    </button>
  )
}

/** Petit bouton qui appelle une action serveur directement. */
export function ActButton({ action, children, className = 'b sm' }: { action: () => Promise<void>; children: React.ReactNode; className?: string }) {
  const [pending, setPending] = useState(false)
  return (
    <button type="button" className={className} disabled={pending} onClick={async () => { setPending(true); await action(); setPending(false) }}>
      {pending ? <Loader2 className="spin-ico" /> : null} {children}
    </button>
  )
}

'use server'
import { put, newId, get } from '@/lib/store'
import type { Lead, RequestType } from '@/lib/types'

export interface LeadInput {
  type: RequestType
  name: string
  phone: string
  email?: string
  message?: string
  fields?: Record<string, string>
  photos?: string[]
  vehicleId?: string
  website?: string
}

const clean = (v: unknown, max = 2000) => String(v ?? '').trim().slice(0, max)

export async function submitLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  if (input.website) return { ok: true } // piège à robots
  const name = clean(input.name, 120)
  const phone = clean(input.phone, 40)
  if (name.length < 2) return { ok: false, error: 'Indiquez votre nom.' }
  if (phone.replace(/\D/g, '').length < 9) return { ok: false, error: 'Indiquez un numéro de téléphone valide.' }
  const types: RequestType[] = ['reprise', 'rdv', 'contact', 'vehicule']
  const type = types.includes(input.type) ? input.type : 'contact'
  const fields: Record<string, string> = {}
  for (const [k, v] of Object.entries(input.fields ?? {}).slice(0, 20)) {
    const val = clean(v, 300)
    if (val) fields[clean(k, 60)] = val
  }
  let vehicleId: string | undefined
  if (input.vehicleId) {
    const v = await get('vehicles', clean(input.vehicleId, 60))
    if (v) {
      vehicleId = v.id
      fields['Véhicule'] = `${v.brand} ${v.model} ${v.version} (${v.ref})`
    }
  }
  const photos = (input.photos ?? [])
    .filter((u) => typeof u === 'string' && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u))
    .slice(0, 10)
  const lead: Lead = {
    id: newId('l'),
    type,
    status: 'nouvelle',
    name,
    phone,
    email: clean(input.email, 160) || undefined,
    message: clean(input.message, 3000) || undefined,
    fields,
    photos,
    vehicleId,
    createdAt: new Date().toISOString(),
  }
  try {
    await put('leads', lead)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Envoi impossible pour le moment. Appelez-nous ou écrivez-nous sur WhatsApp.' }
  }
}

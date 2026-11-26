export const eur = (n: number, digits = 0) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits })
    .format(n)
    .replace(/ | /g, ' ')

export const num = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ')

export const km = (n: number) => `${num(n)} km`

export const dateFr = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', ...opts })

export const dateShort = (iso: string) => dateFr(iso, { day: '2-digit', month: '2-digit', year: 'numeric' })

export const telHref = (phone: string) => 'tel:+33' + phone.replace(/\D/g, '').replace(/^0/, '')

export const waNumber = (phone: string) => '33' + phone.replace(/\D/g, '').replace(/^0/, '')

export const waHref = (phone: string, text?: string) =>
  `https://wa.me/${waNumber(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const slugify = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const priceHT = (ttc: number) => Math.round(ttc / 1.2)

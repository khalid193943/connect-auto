import { requireSession } from '@/lib/auth'
import { getSettings } from '@/lib/data'
import { Back } from '@/components/admin/ui'
import { ActionForm } from '@/components/admin/ActionForm'
import { HoursEditor } from '@/components/admin/HoursEditor'
import { saveContact, saveLegal, saveTexts } from '../../actions'

export default async function Textes() {
  const me = await requireSession()
  const s = await getSettings()
  return (
    <main className="adm-main">
      <Back href="/admin/site" label="Mon site" />
      <h1>Textes & horaires</h1>

      <ActionForm action={saveTexts}>
        <div className="card">
          <h2>Bandeau d’information</h2>
          <p className="hint">Une ligne verte tout en haut du site : fermeture exceptionnelle, congés, nouveauté…</p>
          <label className="toggle"><span className="t"><b>Afficher le bandeau</b></span><input type="checkbox" name="announcementOn" defaultChecked={s.announcementOn} /></label>
          <label className="f"><input name="announcement" defaultValue={s.announcement} placeholder="Ex. Garage fermé le samedi 26 décembre" /></label>
        </div>
        <div className="card">
          <h2>Haut de la page d’accueil</h2>
          <label className="f"><span>Petite ligne au-dessus du titre</span><input name="heroEyebrow" defaultValue={s.heroEyebrow} /></label>
          <div className="grid2">
            <label className="f"><span>Titre, ligne 1 (blanc)</span><input name="heroLine1" defaultValue={s.heroLine1} /></label>
            <label className="f"><span>Titre, ligne 2 (vert)</span><input name="heroLine2" defaultValue={s.heroLine2} /></label>
          </div>
          <label className="f"><span>Texte sous le titre</span><textarea name="heroText" defaultValue={s.heroText} /></label>
        </div>
        <div className="card">
          <h2>Présentation du garage</h2>
          <label className="f"><span>Titre</span><input name="aboutTitle" defaultValue={s.aboutTitle} /></label>
          <label className="f"><span>Texte</span><textarea name="aboutText" defaultValue={s.aboutText} style={{ minHeight: 150 }} /></label>
          <label className="f"><span>Texte de la reprise</span><textarea name="repriseText" defaultValue={s.repriseText} /></label>
        </div>
      </ActionForm>

      <h1 id="horaires" style={{ marginTop: 20 }}>Coordonnées & horaires</h1>
      <ActionForm action={saveContact}>
        <div className="card">
          <div className="grid2">
            <label className="f"><span>Téléphone</span><input name="phone" type="tel" defaultValue={s.phone} /></label>
            <label className="f"><span>WhatsApp</span><input name="whatsapp" type="tel" defaultValue={s.whatsapp} /></label>
          </div>
          <label className="f"><span>E-mail</span><input name="email" type="email" defaultValue={s.email} /></label>
          <label className="f"><span>Adresse</span><input name="street" defaultValue={s.street} /></label>
          <div className="grid2">
            <label className="f"><span>Code postal</span><input name="zip" defaultValue={s.zip} /></label>
            <label className="f"><span>Ville</span><input name="city" defaultValue={s.city} /></label>
          </div>
        </div>
        <div className="card">
          <h2>Horaires d’ouverture</h2>
          <HoursEditor hours={s.hours} />
        </div>
        <div className="card">
          <h2>Google et réseaux</h2>
          <div className="grid2">
            <label className="f"><span>Note Google</span><input name="googleRating" inputMode="decimal" defaultValue={String(s.googleRating).replace('.', ',')} /></label>
            <label className="f"><span>Nombre d’avis</span><input name="googleCount" inputMode="numeric" defaultValue={s.googleCount} /></label>
          </div>
          <label className="f"><span>Lien de la fiche Google</span><input name="googleUrl" defaultValue={s.googleUrl} /></label>
          <label className="f"><span>Page leboncoin</span><input name="leboncoinUrl" defaultValue={s.leboncoinUrl} placeholder="https://www.leboncoin.fr/boutique/…" /></label>
          <label className="f"><span>Facebook</span><input name="facebookUrl" defaultValue={s.facebookUrl} /></label>
          <label className="f"><span>Instagram</span><input name="instagramUrl" defaultValue={s.instagramUrl} /></label>
        </div>
      </ActionForm>

      {me.role === 'gerant' && (
        <>
          <h1 style={{ marginTop: 20 }}>Informations légales</h1>
          <ActionForm action={saveLegal}>
            <div className="card">
              <p className="hint">Affichées dans les mentions légales et en bas des devis et factures.</p>
              <label className="f"><span>Raison sociale</span><input name="company" defaultValue={s.legal.company} /></label>
              <div className="grid2">
                <label className="f"><span>Capital social</span><input name="capital" defaultValue={s.legal.capital} placeholder="ex. 5 000 €" /></label>
                <label className="f"><span>Code NAF</span><input name="naf" defaultValue={s.legal.naf} /></label>
              </div>
              <label className="f"><span>SIRET</span><input name="siret" defaultValue={s.legal.siret} /></label>
              <label className="f"><span>RCS</span><input name="rcs" defaultValue={s.legal.rcs} /></label>
              <label className="f"><span>N° de TVA intracommunautaire</span><input name="vat" defaultValue={s.legal.vat} placeholder="FR…" /></label>
              <label className="f"><span>Directeur de la publication</span><input name="director" defaultValue={s.legal.director} placeholder="Prénom Nom" /></label>
              <label className="f"><span>IBAN (affiché sur les factures)</span><input name="iban" defaultValue={s.iban} /></label>
              <label className="f"><span>Mentions en bas des factures</span><textarea name="docFooter" defaultValue={s.docFooter} /></label>
            </div>
          </ActionForm>
        </>
      )}
    </main>
  )
}

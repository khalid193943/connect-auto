import { list } from '@/lib/store'
import { getSettings } from '@/lib/data'
import { Back } from '@/components/admin/ui'
import { ActionForm, ConfirmButton } from '@/components/admin/ActionForm'
import { deleteReview, saveReview } from '../../actions'
import { dateShort } from '@/lib/format'

export default async function Avis() {
  const [reviews, s] = await Promise.all([list('reviews'), getSettings()])
  return (
    <main className="adm-main">
      <Back href="/admin/site" label="Mon site" />
      <h1>Avis clients</h1>
      <p className="sub">Note actuelle affichée : {String(s.googleRating).replace('.', ',')}/5 ({s.googleCount} avis). Modifiable dans Textes & horaires.</p>
      <p className="banner info" style={{ margin: 0 }}>Recopiez ici de vrais avis laissés sur Google (avec le prénom affiché sur Google). Le site ne doit jamais afficher d’avis inventés.</p>
      <ActionForm action={saveReview} label="Ajouter l’avis" sticky={false}>
        <div className="card">
          <div className="grid2">
            <label className="f"><span>Prénom / nom affiché</span><input name="author" placeholder="Karim B." /></label>
            <label className="f"><span>Note</span><select name="rating" defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}</select></label>
          </div>
          <label className="f"><span>Date de l’avis</span><input type="date" name="date" /></label>
          <label className="f"><span>Texte de l’avis</span><textarea name="text" /></label>
        </div>
      </ActionForm>
      <div className="card flat">
        <div className="rows">
          {reviews.length ? reviews.sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
            <div key={r.id} className="row" style={{ alignItems: 'flex-start' }}>
              <span className="main"><b>{r.author} · {'★'.repeat(r.rating)}</b><span style={{ whiteSpace: 'normal' }}>{r.text}</span><span>{dateShort(r.date)}</span></span>
              <ConfirmButton className="b sm red" action={deleteReview.bind(null, r.id)} confirm="Retirer ?">Retirer</ConfirmButton>
            </div>
          )) : <p className="empty-a">Aucun avis affiché pour l’instant : le site montre la note Google et un lien vers les avis.</p>}
        </div>
      </div>
    </main>
  )
}

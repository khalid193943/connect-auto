# Connect Auto — site web et espace garage

Site du garage **Connect Auto** (1520 route de Nîmes, 30540 Milhaud) : vente et reprise de voitures, utilitaires, camions et motos d’occasion, atelier (entretien, mécanique, carrosserie, pneus, pare-brise, dépannage, carte grise).

- **Site public** : accueil pleine largeur avec écran de chargement animé (la voiture du logo démarre), stock avec filtres, fiches véhicules, 8 pages services, reprise avec photos, rendez-vous et devis, tarifs, le garage, contact, conseils, pages légales. SEO : métadonnées par page, données structurées (garage, véhicules, FAQ, articles), sitemap.
- **Espace garage** (`/admin`), pensé pour le téléphone : véhicules et photos, demandes reçues, clients, devis / bons de commande / factures en PDF (envoi WhatsApp), tarifs, services, textes et horaires, photos du site, avis, registre des achats (livre de police), équipe (6 comptes), sauvegarde.

Next.js 16 · React 19 · Postgres (Neon) · Vercel Blob · aucune autre dépendance de service.

## Mise en ligne sur Vercel

1. **Importer** le dépôt GitHub dans Vercel (Add New → Project → `connect-auto`) et déployer. Sans base de données, le site fonctionne en **mode démonstration** (données d’exemple, admin `fouad` / `demo`, rien n’est conservé).
2. **Base de données** : onglet *Storage* du projet → *Create Database* → **Neon (Postgres)** → relier au projet. La variable `DATABASE_URL` est ajoutée automatiquement. Les tables se créent seules au premier passage.
3. **Photos** : *Storage* → *Create* → **Blob** → relier au projet (`BLOB_READ_WRITE_TOKEN` est ajouté).
4. **Compte du gérant** : *Settings → Environment Variables* → `ADMIN_PASSWORD` = mot de passe de Fouad (identifiant : `fouad`). Il pourra le changer depuis *Mon compte*.
5. **Redéployer** (Deployments → … → Redeploy).
6. Quand le nom de domaine est prêt : l’ajouter dans *Settings → Domains*, puis définir `SITE_URL=https://www.exemple.fr` et redéployer. **Tant que `SITE_URL` n’est pas défini, le site demande à Google de ne pas l’indexer** (version de travail).

Variables optionnelles : `AUTH_SECRET` (clé de session ; sinon dérivée de la base).

## Photos du site

Chaque emplacement porte une référence (IMG-01 … IMG-24-8), visible sur le site tant que la photo manque. Deux façons de les ajouter :

- depuis l’admin : **Plus → Photos du site** (recommandé, rien à redéployer) ;
- dans le code : déposer le fichier dans `public/images/` et l’ajouter à `LOCAL_IMAGES` dans `lib/images.ts`.

Les photos des véhicules se prennent directement depuis chaque annonce dans l’admin.

## Développement

```bash
npm install
npm run dev        # http://localhost:3000  (admin : /admin, fouad / demo)
npm run build
```

Structure : `app/(site)` pages publiques · `app/admin` espace garage · `app/api` PDF, envoi de photos, exports · `lib/` données, contenus (services, articles), authentification · `components/` interface.

import type { Service } from './types'

const s = (o: Omit<Service, 'visible' | 'id'> & { id?: string }): Service => ({ visible: true, id: o.id ?? o.slug, ...o })

export const SEED_SERVICES: Service[] = [
  s({
    slug: 'entretien-vidange',
    order: 1,
    icon: 'oil',
    card: 'IMG-06',
    banner: 'IMG-24-1',
    title: 'Entretien & vidange',
    short: 'Vidange, filtres et révision selon le carnet constructeur, pour voitures et utilitaires.',
    intro:
      "Un entretien régulier, c'est un moteur qui dure et un véhicule qui garde sa valeur à la revente. Nous réalisons la vidange et la révision de votre voiture ou de votre utilitaire en suivant le plan d'entretien prévu par le constructeur, avec des pièces de qualité équivalente à l'origine. Le carnet est mis à jour et la facture détaille chaque opération.",
    points: [
      'Vidange moteur et filtre à huile',
      'Filtres à air, habitacle et carburant',
      "Révision selon le carnet d'entretien",
      'Contrôle des niveaux, des freins et de l’éclairage',
      'Kit de distribution et pompe à eau',
      'Batterie, balais d’essuie-glace, ampoules',
      'Pièces détachées sur commande',
    ],
    steps: [
      { t: 'Vous prenez rendez-vous', d: 'Par téléphone, WhatsApp ou le formulaire : indiquez le modèle et le kilométrage.' },
      { t: 'Le prix est annoncé avant', d: 'Vous validez le devis avant toute intervention, sans surprise à la fin.' },
      { t: 'Vous repartez serein', d: 'Carnet à jour, facture détaillée et la prochaine échéance notée pour vous.' },
    ],
    faq: [
      {
        q: 'Faire entretenir mon véhicule chez vous fait-il perdre la garantie constructeur ?',
        a: "Non. La réglementation européenne permet de faire entretenir un véhicule encore sous garantie par le garage de son choix, à condition de respecter le plan d'entretien du constructeur et d'utiliser des pièces de qualité équivalente. C'est exactement ce que nous faisons.",
      },
      {
        q: 'Tous les combien faut-il faire la vidange ?',
        a: "Cela dépend du moteur et de l'huile préconisée : le plus souvent entre 10 000 et 30 000 km, ou une fois par an pour qui roule peu. Le carnet d'entretien fait foi, nous le vérifions avec vous.",
      },
      {
        q: 'Entretenez-vous aussi les utilitaires ?',
        a: "Oui, c'est même une grande partie de notre activité : fourgons, camionnettes et véhicules de société.",
      },
    ],
    seoTitle: 'Entretien et vidange à Milhaud, près de Nîmes',
    seoDescription:
      "Vidange, révision constructeur, filtres et distribution pour voitures et utilitaires. Devis avant intervention, garage Connect Auto à Milhaud (30).",
  }),
  s({
    slug: 'mecanique-diagnostic',
    order: 2,
    icon: 'gauge',
    card: 'IMG-07',
    banner: 'IMG-24-2',
    title: 'Mécanique & diagnostic',
    short: 'Voyant allumé, bruit suspect, perte de puissance : on trouve la panne avant de réparer.',
    intro:
      "Un voyant au tableau de bord ne dit pas toujours ce qui ne va pas. Nous branchons la valise de diagnostic, lisons les codes défaut et contrôlons sur le véhicule avant de proposer une réparation. Vous savez ce qui est fait, pourquoi, et combien cela coûte.",
    points: [
      'Lecture des codes défaut, diagnostic électronique',
      'Freinage : plaquettes, disques, liquide',
      'Embrayage et boîte de vitesses',
      'Distribution, courroie d’accessoires',
      'Suspension, direction, trains roulants',
      'Échappement, filtre à particules, vanne EGR',
      'Démarrage et charge : batterie, alternateur, démarreur',
    ],
    steps: [
      { t: 'Diagnostic', d: 'Lecture électronique puis contrôle sur le véhicule.' },
      { t: 'Explication et devis', d: 'Nous vous expliquons la panne et le prix avant d’intervenir.' },
      { t: 'Réparation et essai', d: 'Pièces de qualité, essai routier, facture détaillée.' },
    ],
    faq: [
      {
        q: 'Combien de temps prend un diagnostic ?',
        a: "La lecture des codes défaut se fait rapidement. Une panne intermittente peut demander davantage de recherche : dans ce cas, nous vous prévenons avant d'aller plus loin.",
      },
      {
        q: 'Réparez-vous toutes les marques ?',
        a: 'Oui, nous intervenons sur les voitures et les utilitaires de toutes marques.',
      },
      {
        q: 'Mon voyant moteur est allumé, puis-je encore rouler ?',
        a: "Un voyant orange signale un défaut à faire vérifier rapidement. Un voyant rouge ou qui clignote demande de s'arrêter dès que possible : appelez-nous plutôt que de risquer une casse moteur.",
      },
    ],
    seoTitle: 'Garage mécanique et diagnostic auto à Milhaud, Nîmes',
    seoDescription:
      'Diagnostic électronique, freinage, embrayage, distribution, suspension : réparation toutes marques avec devis avant intervention. Connect Auto, Milhaud (30).',
  }),
  s({
    slug: 'pneus',
    order: 3,
    icon: 'tyre',
    card: 'IMG-08',
    banner: 'IMG-24-3',
    title: 'Pneus',
    short: 'Montage, équilibrage, permutation : des pneus adaptés à votre véhicule et à votre budget.',
    intro:
      "Les pneus sont le seul contact entre votre véhicule et la route. Nous vérifions l'usure et la date de fabrication, vous conseillons la bonne dimension et le bon indice de charge, un point essentiel sur un utilitaire chargé, puis nous montons et équilibrons les roues.",
    points: [
      'Pneus toutes dimensions sur commande',
      'Montage et équilibrage',
      'Permutation avant / arrière',
      'Réparation de crevaison quand elle est possible',
      'Contrôle de la pression et de l’usure',
      'Pneus utilitaires renforcés',
    ],
    steps: [
      { t: 'Contrôle', d: 'Usure, date, dimension et indice de charge.' },
      { t: 'Choix et prix', d: 'Plusieurs gammes selon votre usage et votre budget.' },
      { t: 'Montage', d: 'Montage, équilibrage et pression ajustée.' },
    ],
    faq: [
      {
        q: 'Quand faut-il changer ses pneus ?',
        a: "Au plus tard quand les sculptures atteignent 1,6 mm de profondeur, le minimum légal. Pour garder une bonne adhérence sur route mouillée, mieux vaut ne pas attendre ce seuil.",
      },
      {
        q: 'Faut-il changer les pneus par deux ?',
        a: 'Oui : sur un même essieu, les deux pneus doivent être identiques en dimension, en modèle et en usure.',
      },
    ],
    seoTitle: 'Pneus à Milhaud : montage et équilibrage près de Nîmes',
    seoDescription:
      'Pneus voiture et utilitaire, montage, équilibrage, permutation et réparation de crevaison. Conseil sur la dimension et l’indice de charge. Connect Auto, Milhaud.',
  }),
  s({
    slug: 'carrosserie-peinture',
    order: 4,
    icon: 'car',
    card: 'IMG-09',
    banner: 'IMG-24-4',
    title: 'Carrosserie & peinture',
    short: 'Rayure, choc, tôle froissée : redressage, remplacement et peinture dans notre atelier.',
    intro:
      "Notre atelier de carrosserie remet en état voitures et utilitaires : redressage de tôle, remplacement d'éléments, préparation et mise en peinture. Le devis détaillé vous est remis avant le début des travaux et peut être transmis à votre assurance en cas de sinistre.",
    points: [
      'Débosselage et redressage de tôle',
      'Remplacement de pare-chocs, ailes, portières',
      'Préparation, apprêt et mise en peinture',
      'Raccords de teinte',
      'Rayures, éclats et petits chocs',
      'Remise en état avant revente',
    ],
    steps: [
      { t: 'Expertise', d: 'Nous examinons les dégâts avec vous, photos à l’appui.' },
      { t: 'Devis détaillé', d: 'Pièces, main-d’œuvre, peinture et délai.' },
      { t: 'Réparation', d: 'Tôle, peinture, contrôle final à la lumière du jour.' },
    ],
    faq: [
      {
        q: 'Combien de temps dure une réparation de carrosserie ?',
        a: 'Cela dépend des pièces à commander et du temps de séchage : quelques heures pour un petit choc, plusieurs jours pour un sinistre important. Le délai figure sur le devis.',
      },
      {
        q: 'Le devis peut-il servir pour mon assurance ?',
        a: 'Oui. Le devis détaille les pièces, la main-d’œuvre et la peinture ; vous pouvez le transmettre tel quel à votre assureur.',
      },
    ],
    seoTitle: 'Carrosserie et peinture auto à Milhaud, près de Nîmes',
    seoDescription:
      'Débosselage, redressage, remplacement d’éléments et peinture pour voitures et utilitaires. Devis détaillé avant travaux. Atelier Connect Auto, Milhaud (Gard).',
  }),
  s({
    slug: 'pare-brise',
    order: 5,
    icon: 'windscreen',
    card: 'IMG-10',
    banner: 'IMG-24-5',
    title: 'Pare-brise',
    short: 'Impact qui s’étend ou pare-brise fissuré : remplacement sur voitures et utilitaires.',
    intro:
      "Un impact sur le pare-brise finit souvent en fissure, et une fissure dans le champ de vision peut entraîner une contre-visite au contrôle technique. Nous remplaçons le pare-brise de votre voiture ou de votre utilitaire et contrôlons l'étanchéité avant de vous rendre le véhicule.",
    points: [
      'Remplacement de pare-brise',
      'Autres vitrages sur commande selon le modèle',
      'Contrôle de l’étanchéité',
      'Balais d’essuie-glace neufs',
      'Documents pour la garantie bris de glace',
    ],
    steps: [
      { t: 'Photo de l’impact', d: 'Envoyez-la par WhatsApp : nous vérifions la référence du vitrage.' },
      { t: 'Commande', d: 'Le pare-brise est commandé et le rendez-vous fixé.' },
      { t: 'Pose', d: 'Pose, temps de séchage de la colle, contrôle final.' },
    ],
    faq: [
      {
        q: 'Mon assurance prend-elle en charge le pare-brise ?',
        a: 'Si votre contrat comprend la garantie bris de glace, oui, avec parfois une franchise qui dépend de votre contrat. Nous vous remettons les documents à transmettre à votre assureur.',
      },
      {
        q: 'Combien de temps mon véhicule est-il immobilisé ?',
        a: 'En général quelques heures : le temps de la pose puis du séchage de la colle avant de reprendre la route.',
      },
    ],
    seoTitle: 'Remplacement de pare-brise à Milhaud, près de Nîmes',
    seoDescription:
      'Remplacement de pare-brise pour voitures et utilitaires, contrôle d’étanchéité et documents pour la garantie bris de glace. Connect Auto, Milhaud (30).',
  }),
  s({
    slug: 'depannage',
    order: 6,
    icon: 'warning',
    card: 'IMG-11',
    banner: 'IMG-24-6',
    title: 'Dépannage',
    short: 'En panne autour de Nîmes ? Nous ramenons votre véhicule à l’atelier.',
    intro:
      "Batterie à plat, moteur qui refuse de démarrer, véhicule immobilisé : appelez-nous pendant nos horaires d'ouverture. Nous organisons le remorquage de votre voiture ou de votre utilitaire jusqu'à notre atelier de Milhaud, où le diagnostic et la réparation se font sur place.",
    points: [
      'Remorquage jusqu’à l’atelier',
      'Autour de Milhaud et de Nîmes',
      'Voitures et utilitaires légers',
      'Diagnostic et réparation sur place',
      'Devis avant toute réparation',
    ],
    steps: [
      { t: 'Vous appelez', d: 'Dites-nous où vous êtes et ce qui se passe.' },
      { t: 'Nous venons', d: 'Le véhicule est chargé et amené à l’atelier.' },
      { t: 'Nous réparons', d: 'Diagnostic, devis, puis réparation avec votre accord.' },
    ],
    faq: [
      {
        q: 'Mon assurance couvre-t-elle le dépannage ?',
        a: "Beaucoup de contrats incluent une assistance. Appelez d'abord le numéro d'assistance de votre assureur : vous pouvez lui demander que le véhicule soit amené chez nous.",
      },
      {
        q: 'Que faire en attendant le dépanneur ?',
        a: 'Allumez les feux de détresse, enfilez le gilet, placez le triangle si vous pouvez le faire sans danger et attendez derrière la glissière de sécurité.',
      },
    ],
    seoTitle: 'Dépannage et remorquage auto à Milhaud et Nîmes',
    seoDescription:
      'Véhicule en panne près de Nîmes ? Remorquage de votre voiture ou utilitaire jusqu’à l’atelier Connect Auto de Milhaud, diagnostic et réparation sur place.',
  }),
  s({
    slug: 'carte-grise',
    order: 7,
    icon: 'card',
    card: 'IMG-12',
    banner: 'IMG-24-7',
    title: 'Carte grise',
    short: 'Achat, vente, changement d’adresse : nous nous occupons des démarches d’immatriculation.',
    intro:
      "Depuis la fermeture des guichets en préfecture, la carte grise se fait en ligne, et une erreur de saisie peut retarder l'immatriculation de plusieurs semaines. Apportez vos documents : nous réalisons la démarche pour vous et vous annonçons le montant exact avant de la lancer.",
    points: [
      'Carte grise d’un véhicule d’occasion',
      'Changement de titulaire',
      'Changement d’adresse',
      'Duplicata en cas de perte, vol ou détérioration',
      'Déclaration de cession',
    ],
    steps: [
      { t: 'Vos documents', d: 'Nous vous disons exactement quoi apporter.' },
      { t: 'Le montant', d: 'Taxes et frais annoncés avant la démarche.' },
      { t: 'La démarche', d: 'Nous la réalisons ; vous recevez la carte grise chez vous.' },
    ],
    faq: [
      {
        q: 'Quels documents faut-il fournir ?',
        a: "En général : l'ancienne carte grise barrée et signée, le certificat de cession, une pièce d'identité, un justificatif de domicile de moins de six mois, l'attestation d'assurance et, pour un véhicule de plus de quatre ans, un contrôle technique de moins de six mois.",
      },
      {
        q: 'Combien coûte une carte grise ?',
        a: 'Le prix dépend surtout de la taxe régionale, calculée selon la puissance fiscale du véhicule, à laquelle s’ajoutent des taxes fixes. Nous vous donnons le montant exact avant la démarche.',
      },
    ],
    seoTitle: 'Carte grise à Milhaud, près de Nîmes : démarches faites pour vous',
    seoDescription:
      'Changement de titulaire, d’adresse, duplicata, déclaration de cession : Connect Auto réalise vos démarches de carte grise à Milhaud (Gard).',
  }),
  s({
    slug: 'utilitaires-flottes',
    order: 8,
    icon: 'van',
    card: 'IMG-13',
    banner: 'IMG-24-8',
    title: 'Utilitaires & pros',
    short: 'Fourgons, camionnettes, bennes : entretien, réparation et vente pour artisans et entreprises.',
    intro:
      "Un utilitaire immobilisé, c'est une journée de travail perdue. Les utilitaires sont au cœur de notre activité : nous entretenons et réparons fourgons, plateaux et bennes, et nous vendons des utilitaires d'occasion, avec la TVA récupérable sur les véhicules éligibles.",
    points: [
      'Entretien et réparation de fourgons, plateaux et bennes',
      'Vente d’utilitaires et de camions d’occasion',
      'Prix HT affiché et TVA récupérable sur les véhicules éligibles',
      'Reprise de votre ancien utilitaire',
      'Facturation au nom de votre société',
      'Suivi de plusieurs véhicules d’une même entreprise',
    ],
    steps: [
      { t: 'Votre besoin', d: 'Volume, charge utile, budget : on en parle.' },
      { t: 'La proposition', d: 'Véhicule du stock, recherche ou réparation du vôtre.' },
      { t: 'Le suivi', d: 'Entretien planifié pour éviter les immobilisations.' },
    ],
    faq: [
      {
        q: 'La TVA est-elle récupérable sur vos utilitaires d’occasion ?',
        a: "Elle l'est quand le véhicule est vendu avec TVA apparente : l'annonce l'indique, avec le prix HT et la mention « TVA récupérable ». Les véhicules vendus sous le régime de la marge n'ouvrent pas droit à récupération.",
      },
      {
        q: 'Pouvez-vous suivre plusieurs véhicules de mon entreprise ?',
        a: 'Oui. Nous regroupons les interventions et la facturation au nom de votre société.',
      },
    ],
    seoTitle: 'Utilitaires d’occasion et entretien pour pros près de Nîmes',
    seoDescription:
      'Vente d’utilitaires d’occasion avec TVA récupérable sur les véhicules éligibles, entretien et réparation de fourgons et bennes. Connect Auto, Milhaud (30).',
  }),
]

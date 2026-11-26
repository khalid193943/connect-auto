export type Block = { h2?: string; p?: string; ul?: string[]; note?: string }
export interface Article {
  slug: string
  title: string
  description: string
  date: string
  tag: string
  minutes: number
  body: Block[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'acheter-utilitaire-occasion-points-a-verifier',
    title: 'Acheter un utilitaire d’occasion : les points à vérifier avant de signer',
    description:
      'Embrayage, distribution, charge utile, TVA récupérable, historique : la liste des contrôles à faire avant d’acheter un fourgon ou une camionnette d’occasion.',
    date: '2026-11-26',
    tag: 'Utilitaires',
    minutes: 6,
    body: [
      {
        p: 'Un utilitaire d’occasion a souvent mené une vie plus dure qu’une voiture : démarrages fréquents, charges lourdes, trajets courts en ville. Bien choisi, c’est un excellent investissement ; mal choisi, il passe plus de temps au garage que sur les chantiers. Voici ce que nous regardons nous-mêmes avant de proposer un fourgon à la vente.',
      },
      { h2: '1. Le besoin réel : volume, longueur, charge utile' },
      {
        p: 'Avant de parler mécanique, partez de votre usage. La longueur (L1, L2, L3) et la hauteur (H1, H2, H3) déterminent le volume utile, mais c’est la charge utile qui fixe ce que vous pouvez transporter légalement : PTAC moins poids à vide. Un fourgon aménagé (étagères, plancher, galerie) perd une partie de cette charge utile.',
      },
      {
        note: 'Avec le permis B, vous pouvez conduire un véhicule jusqu’à 3,5 tonnes de PTAC. Au-delà, il faut le permis C1 ou C.',
      },
      { h2: '2. L’historique et le kilométrage' },
      {
        ul: [
          'Le carnet d’entretien et les factures : vidanges régulières, distribution, embrayage.',
          'La cohérence du kilométrage avec l’usure du volant, du siège conducteur et des pédales.',
          'Le rapport Histovec, que le vendeur peut partager gratuitement : il retrace l’historique administratif du véhicule (propriétaires, sinistres déclarés, contrôles techniques).',
          'Le contrôle technique : il doit dater de moins de six mois pour un véhicule de plus de quatre ans.',
        ],
      },
      { h2: '3. Les organes qui souffrent sur un utilitaire' },
      {
        ul: [
          'L’embrayage : patinage en montée chargée, point de patinage très haut, bruits au débrayage.',
          'La distribution : courroie ou chaîne, l’échéance doit être connue et la facture présente si elle est passée.',
          'Le train arrière et les suspensions : un utilitaire souvent surchargé s’affaisse, use ses amortisseurs et ses pneus de façon irrégulière.',
          'Le freinage : disques et plaquettes, mais aussi le comportement au freinage appuyé.',
          'La caisse : rouille sous le plancher, bas de caisse, rails et galets de porte latérale.',
        ],
      },
      { h2: '4. L’essai routier' },
      {
        p: 'Un essai d’une dizaine de minutes en conditions réelles en dit plus qu’une longue inspection : démarrage à froid, montée des rapports, tenue de cap sur route droite, bruits de transmission en virage, absence de voyant au tableau de bord.',
      },
      { h2: '5. La TVA et la facture' },
      {
        p: 'Pour une entreprise, un utilitaire vendu avec TVA apparente permet de récupérer la TVA. L’annonce et la facture doivent l’indiquer clairement : prix HT, montant de TVA, prix TTC. Un véhicule vendu sous le régime de la marge (souvent ceux repris à des particuliers) n’ouvre pas ce droit. Demandez toujours la facture au nom de votre société.',
      },
      { h2: 'Chez Connect Auto' },
      {
        p: 'Les utilitaires sont au cœur de notre activité. Chaque véhicule mis en vente passe par notre atelier, l’annonce précise si la TVA est récupérable, et nous pouvons assurer l’entretien ensuite. Une question sur un véhicule ? Appelez-nous ou passez le voir à Milhaud.',
      },
    ],
  },
  {
    slug: 'vendre-sa-voiture-garage-ou-particulier',
    title: 'Vendre sa voiture : reprise par un garage ou vente entre particuliers ?',
    description:
      'Prix, délai, sécurité du paiement, responsabilité après la vente et démarches : ce qui change selon que vous vendez à un professionnel ou à un particulier.',
    date: '2026-11-26',
    tag: 'Vente & reprise',
    minutes: 5,
    body: [
      {
        p: 'Vendre son véhicule à un particulier rapporte souvent un peu plus sur le papier. Vendre à un garage est plus rapide et plus simple. Le bon choix dépend de ce que vous attendez : le prix le plus haut possible, ou une vente réglée en quelques jours sans risque.',
      },
      { h2: 'Ce que la vente entre particuliers implique' },
      {
        ul: [
          'Rédiger et mettre en ligne l’annonce, répondre aux appels, organiser les visites et les essais.',
          'Négocier, parfois longtemps, avec des acheteurs qui ne se présentent pas toujours.',
          'Sécuriser le paiement : les escroqueries au faux chèque de banque restent fréquentes. Un virement reçu et vérifié sur votre compte avant la remise des clés est la solution la plus sûre.',
          'Rester responsable après la vente : le vendeur particulier doit la garantie des vices cachés prévue par le Code civil.',
        ],
      },
      { h2: 'Ce que change la reprise par un garage' },
      {
        p: 'Le professionnel achète le véhicule en connaissant son état : il l’examine, le fait rouler, puis fait une proposition ferme. Le paiement est sécurisé, les papiers sont préparés avec vous, et vous n’avez pas à gérer les visites. L’écart de prix avec une vente entre particuliers correspond au travail de remise en état, aux garanties que le garage devra ensuite assurer et au temps de revente.',
      },
      { h2: 'Les documents à préparer dans les deux cas' },
      {
        ul: [
          'La carte grise, barrée avec la mention « Vendu le … à … », datée et signée.',
          'Le certificat de cession (formulaire cerfa 15776), en deux exemplaires.',
          'Le certificat de situation administrative, dit « non-gage », de moins de quinze jours.',
          'Le procès-verbal de contrôle technique de moins de six mois si le véhicule a plus de quatre ans.',
          'La déclaration de cession à faire en ligne dans les quinze jours suivant la vente.',
        ],
      },
      { h2: 'Comment obtenir une proposition chez Connect Auto' },
      {
        p: 'Envoyez quelques photos et les informations principales depuis notre page Reprise ou sur WhatsApp. Nous vous rappelons avec une première proposition, confirmée après un coup d’œil au véhicule à Milhaud. Voitures, utilitaires, camions et motos.',
      },
    ],
  },
  {
    slug: 'garantie-vehicule-occasion-professionnel',
    title: 'Véhicule d’occasion acheté chez un professionnel : quelles garanties ?',
    description:
      'Garantie légale de conformité, garantie des vices cachés, garantie commerciale : ce qui vous protège quand vous achetez une occasion à un garage.',
    date: '2026-11-26',
    tag: 'Achat',
    minutes: 5,
    body: [
      {
        p: 'Acheter un véhicule d’occasion à un professionnel plutôt qu’à un particulier, c’est d’abord bénéficier de garanties prévues par la loi. Elles s’appliquent automatiquement, sans supplément de prix, quand le véhicule est vendu à un consommateur.',
      },
      { h2: 'La garantie légale de conformité' },
      {
        p: 'Le Code de la consommation oblige le vendeur professionnel à livrer un bien conforme au contrat et à l’usage attendu. Cette garantie dure deux ans à compter de la livraison. Pour un bien d’occasion, un défaut qui apparaît dans les douze mois suivant la livraison est présumé exister au moment de la vente : c’est alors au vendeur de prouver le contraire.',
      },
      {
        p: 'En cas de défaut, l’acheteur peut demander la réparation ou le remplacement du bien. Si ce n’est pas possible ou pas fait dans un délai raisonnable, il peut obtenir une réduction du prix ou l’annulation de la vente.',
      },
      { h2: 'La garantie des vices cachés' },
      {
        p: 'Prévue par le Code civil, elle concerne les défauts graves, non visibles au moment de l’achat, qui rendent le véhicule impropre à son usage. L’action doit être engagée dans les deux ans suivant la découverte du vice. Elle s’applique aussi aux ventes entre particuliers.',
      },
      { h2: 'La garantie commerciale' },
      {
        p: 'Certains vendeurs proposent en plus une garantie commerciale, gratuite ou payante, dont la durée et le contenu sont libres : elle doit être décrite par écrit. Elle s’ajoute aux garanties légales, elle ne les remplace jamais.',
      },
      {
        note: 'Cet article donne des repères généraux. Pour une situation précise, rapprochez-vous d’une association de consommateurs ou d’un professionnel du droit.',
      },
    ],
  },
  {
    slug: 'vignette-critair-vehicule-occasion',
    title: 'Vignette Crit’Air : comment connaître la classe d’un véhicule d’occasion',
    description:
      'Énergie, norme Euro, date de première immatriculation : comment se calcule la classe Crit’Air d’une voiture d’occasion et pourquoi elle compte avant d’acheter.',
    date: '2026-11-26',
    tag: 'Pratique',
    minutes: 4,
    body: [
      {
        p: 'La vignette Crit’Air classe les véhicules selon leurs émissions polluantes. Elle est obligatoire pour circuler dans les zones à faibles émissions (ZFE) mises en place par certaines agglomérations, et lors des épisodes de pollution quand la circulation différenciée est décidée. Avant d’acheter une occasion, connaître sa classe évite les mauvaises surprises.',
      },
      { h2: 'Ce qui détermine la classe' },
      {
        p: 'La classe dépend de l’énergie du véhicule et de sa norme Euro, que l’on retrouve souvent grâce à la date de première immatriculation (case B de la carte grise). Pour les voitures particulières, les repères les plus courants sont les suivants :',
      },
      {
        ul: [
          'Électrique ou hydrogène : vignette verte, la meilleure classe.',
          'Hybride rechargeable et gaz : Crit’Air 1.',
          'Essence immatriculée à partir de 2011 (Euro 5 et 6) : Crit’Air 1.',
          'Diesel immatriculé à partir de 2011 (Euro 5 et 6) : Crit’Air 2.',
          'Essence de 2006 à 2010 (Euro 4) : Crit’Air 2.',
          'Diesel de 2006 à 2010 (Euro 4) : Crit’Air 3.',
        ],
      },
      {
        note: 'Les dates diffèrent pour les utilitaires, les poids lourds et les deux-roues. La norme Euro inscrite sur la carte grise (case V.9) fait foi.',
      },
      { h2: 'Où commander la vignette' },
      {
        p: 'La vignette se commande uniquement sur le site officiel du ministère, certificat-air.gouv.fr, avec la carte grise du véhicule. Méfiez-vous des sites qui la proposent à un prix plus élevé.',
      },
      { h2: 'Et autour de Nîmes ?' },
      {
        p: 'Les règles des zones à faibles émissions, leur périmètre et leur calendrier évoluent d’une agglomération à l’autre et d’une année à l’autre. Si vous travaillez ou circulez régulièrement dans une grande agglomération comme Montpellier, vérifiez les règles en vigueur sur le site de la métropole avant de choisir votre véhicule. Nous indiquons la classe Crit’Air sur nos annonces quand elle est connue.',
      },
    ],
  },
]

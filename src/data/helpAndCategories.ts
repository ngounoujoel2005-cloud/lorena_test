import { CategorySlug, ProductReview } from '../types/store';

export interface SubCategoryGroup {
  groupFr: string;
  groupEn: string;
  items: { labelFr: string; labelEn: string; query?: string }[];
}

export const CATEGORY_SUBMENUS: Record<CategorySlug, SubCategoryGroup[]> = {
  all: [],
  electronique: [
    {
      groupFr: 'Téléviseurs',
      groupEn: 'Televisions',
      items: [
        { labelFr: 'Téléviseurs smart', labelEn: 'Smart TVs', query: 'Smart TV' },
        { labelFr: 'Téléviseurs numériques', labelEn: 'Digital TVs', query: 'Téléviseur' },
        { labelFr: 'Téléviseurs 4K UHD', labelEn: '4K UHD TVs', query: '4K' },
      ],
    },
    {
      groupFr: 'Audio & Hifi',
      groupEn: 'Audio & Hi-Fi',
      items: [
        { labelFr: 'Casques sans fil ANC', labelEn: 'Wireless ANC Headphones', query: 'Casque' },
        { labelFr: 'Enceintes portables', labelEn: 'Portable Speakers', query: 'Enceinte' },
      ],
    },
  ],
  fashion: [
    {
      groupFr: 'Accessoires & Horlogerie',
      groupEn: 'Accessories & Watches',
      items: [
        { labelFr: 'Montres connectées', labelEn: 'Smartwatches', query: 'Montre' },
      ],
    },
  ],
  'gros-electromenager': [
    {
      groupFr: 'Froid & Conservation',
      groupEn: 'Cooling & Storage',
      items: [
        { labelFr: 'Réfrigérateurs combinés', labelEn: 'Combi Refrigerators', query: 'Réfrigérateur' },
        { labelFr: 'Réfrigérateurs américains', labelEn: 'American Fridges', query: 'Américain' },
        { labelFr: 'Congélateurs coffres', labelEn: 'Chest Freezers', query: 'Congélateur' },
      ],
    },
    {
      groupFr: 'Climatisation',
      groupEn: 'Air Conditioning',
      items: [
        { labelFr: 'Climatiseurs Split', labelEn: 'Split AC Units', query: 'Climatiseur' },
      ],
    },
  ],
  'sante-beaute': [
    {
      groupFr: 'Soins Visage & Corps',
      groupEn: 'Face & Body Care',
      items: [
        { labelFr: 'Laits & Baumes hydratants', labelEn: 'Hydrating Lotions', query: 'Hydratant' },
        { labelFr: 'Crèmes visage', labelEn: 'Facial Creams', query: 'Crème' },
      ],
    },
  ],
  'maison-bureau': [
    {
      groupFr: 'Mobilier & Ergonomie',
      groupEn: 'Furniture & Ergonomics',
      items: [
        { labelFr: "Chaises d'étude & bureau", labelEn: 'Study & Office Chairs', query: 'Chaise' },
      ],
    },
  ],
  'telephones-tablettes': [
    {
      groupFr: 'Smartphones & Accessoires',
      groupEn: 'Smartphones & Accessories',
      items: [
        { labelFr: 'Smartphones neufs', labelEn: 'New Smartphones', query: 'Pro' },
        { labelFr: 'Seconde main certifiée', labelEn: 'Certified Pre-Owned', query: 'Seconde Main' },
        { labelFr: 'Batteries externes', labelEn: 'Power Banks', query: 'Batterie' },
      ],
    },
  ],
  'petit-electromenager': [
    {
      groupFr: 'Cuisine & Boissons',
      groupEn: 'Kitchen & Drinks',
      items: [
        { labelFr: 'Blenders & Mixeurs', labelEn: 'Blenders & Mixers', query: 'Blender' },
        { labelFr: 'Bouilloires électriques', labelEn: 'Electric Kettles', query: 'Bouilloire' },
      ],
    },
    {
      groupFr: 'Ventilation',
      groupEn: 'Fans & Cooling',
      items: [
        { labelFr: 'Ventilateurs sur pied', labelEn: 'Pedestal Fans', query: 'Ventilateur' },
        { labelFr: 'Ventilateurs rechargeables', labelEn: 'Rechargeable Fans', query: 'Rechargeable' },
      ],
    },
  ],
  informatique: [
    {
      groupFr: 'Énergie & Secours',
      groupEn: 'Backup Power',
      items: [
        { labelFr: 'Stations solaires & onduleurs', labelEn: 'Solar Stations & UPS', query: 'Volta' },
      ],
    },
  ],
  bebe: [
    {
      groupFr: 'Soins & bien-être bébé',
      groupEn: 'Baby Care & Wellness',
      items: [
        { labelFr: 'Soin de la peau bébé', labelEn: 'Baby Skincare', query: '' },
        { labelFr: 'Chambre & veilleuses', labelEn: 'Nursery & Nightlights', query: '' },
      ],
    },
  ],
  supermarche: [
    {
      groupFr: 'Essentiels du quotidien',
      groupEn: 'Daily Essentials',
      items: [
        { labelFr: 'Équipement maison', labelEn: 'Home Essentials', query: '' },
      ],
    },
  ],
  autres: [
    {
      groupFr: 'Divers & Outillage',
      groupEn: 'Tools & Misc',
      items: [
        { labelFr: 'Accessoires multi-usages', labelEn: 'Multi-purpose Accessories', query: '' },
      ],
    },
  ],
};

export interface HelpFaqItem {
  id: string;
  qFr: string;
  qEn: string;
  aFr: string;
  aEn: string;
}

export interface HelpTopic {
  id: string;
  labelFr: string;
  labelEn: string;
  questions: HelpFaqItem[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'paiements',
    labelFr: 'Paiements',
    labelEn: 'Payments',
    questions: [
      {
        id: 'p1',
        qFr: 'Quels modes de paiement sont acceptés sur Lorena Market ?',
        qEn: 'Which payment methods are accepted on Lorena Market?',
        aFr: 'Nous acceptons MTN Mobile Money (*126#), Orange Money (#150#) et le Paiement à la livraison (espèces en XAF) dans les villes desservies.',
        aEn: 'We accept MTN Mobile Money (*126#), Orange Money (#150#), and Cash on Delivery (XAF) across supported cities.',
      },
      {
        id: 'p2',
        qFr: 'Dans quelle mesure mes informations de paiement sont-elles sécurisées sur Lorena Market ?',
        qEn: 'How secure are my payment details on Lorena Market?',
        aFr: 'Aucun code PIN Mobile Money n’est jamais saisi sur notre site : vous validez exclusivement la transaction sur votre téléphone via le prompt USSD officiel de votre opérateur.',
        aEn: 'Your Mobile Money PIN is never entered on our site; you authorize each transaction directly on your handset via the official operator USSD prompt.',
      },
      {
        id: 'p3',
        qFr: 'Puis-je payer à la livraison de mon produit ?',
        qEn: 'Can I pay upon delivery of my order?',
        aFr: 'Oui, le paiement à la livraison (COD) est disponible à Douala, Yaoundé et dans les principales villes. Vérifiez votre colis avant de régler le livreur.',
        aEn: 'Yes, Cash on Delivery (COD) is available in Douala, Yaoundé, and major cities. Inspect your package before paying the courier.',
      },
      {
        id: 'p4',
        qFr: 'Y a-t-il des frais supplémentaires pour les paiements par Mobile Money ?',
        qEn: 'Are there extra fees for Mobile Money payments?',
        aFr: 'Lorena Market ne facture aucun frais caché. Seuls les éventuels frais standards de votre opérateur s’appliquent.',
        aEn: 'Lorena Market charges zero hidden fees. Only standard carrier fees apply where applicable.',
      },
      {
        id: 'p5',
        qFr: 'Mon paiement a échoué, que faire ?',
        qEn: 'My payment failed, what should I do?',
        aFr: 'Vérifiez votre solde disponible et réessayez la validation USSD, ou choisissez le Paiement à la livraison puis contactez notre support au 693 71 25 25.',
        aEn: 'Check your wallet balance and retry the USSD prompt, or switch to Cash on Delivery and call 693 71 25 25.',
      },
    ],
  },
  {
    id: 'livraison',
    labelFr: 'Livraison',
    labelEn: 'Delivery',
    questions: [
      {
        id: 'l1',
        qFr: 'Quels sont les délais de livraison après le paiement ?',
        qEn: 'What are the delivery times after payment?',
        aFr: 'À Douala et Yaoundé, la livraison s’effectue le même jour (2–5h) ou le lendemain matin. Pour Bafoussam, Buea, Limbe et Kribi, comptez 1 à 2 jours ouvrés.',
        aEn: 'In Douala and Yaoundé, delivery takes 2–5 hours same-day or next morning. Regional cities take 1–2 business days.',
      },
      {
        id: 'l2',
        qFr: 'Comment modifier l’adresse de livraison après avoir effectué le paiement ?',
        qEn: 'How can I change my delivery address after paying?',
        aFr: 'Contactez immédiatement notre service client par WhatsApp ou au 693 71 25 25 avec votre numéro de commande avant le départ du livreur.',
        aEn: 'Contact our support desk via WhatsApp or at 693 71 25 25 with your order ID before courier dispatch.',
      },
    ],
  },
  {
    id: 'retours',
    labelFr: 'Retours & Remboursements',
    labelEn: 'Returns & Refunds',
    questions: [
      {
        id: 'r1',
        qFr: 'Comment fonctionne la politique de retour sous 7 jours ?',
        qEn: 'How does the 7-day return policy work?',
        aFr: 'Tout produit non conforme ou présentant un défaut au déballage est échangé ou remboursé sous 7 jours calendaires sur présentation du certificat de garantie.',
        aEn: 'Any defective or mismatched product is exchanged or refunded within 7 calendar days with your warranty serial.',
      },
      {
        id: 'r2',
        qFr: 'Sous quel délai suis-je remboursé ?',
        qEn: 'How quickly are refunds processed?',
        aFr: 'Les remboursements validés sont crédités sous 24 à 48 heures directement sur votre compte MTN MoMo ou Orange Money.',
        aEn: 'Approved refunds are credited within 24–48 hours directly to your MTN MoMo or Orange Money wallet.',
      },
    ],
  },
  {
    id: 'bons',
    labelFr: "Bons d'achats",
    labelEn: 'Promo Codes',
    questions: [
      {
        id: 'b1',
        qFr: 'Comment utiliser un code promo Lorena Market ?',
        qEn: 'How do I apply a Lorena Market promo code?',
        aFr: 'Ouvrez la page « Mon Panier » et saisissez votre code (ex : LORENA10 ou BIENVENUE) dans la section Code promo avant de passer à la commande.',
        aEn: 'Open the full Cart page and enter your code (e.g., LORENA10 or BIENVENUE) in the Promo Code box before checkout.',
      },
    ],
  },
  {
    id: 'produits',
    labelFr: 'Produits & Garantie',
    labelEn: 'Products & Warranty',
    questions: [
      {
        id: 'pr1',
        qFr: 'Les appareils sont-ils couverts par une garantie ?',
        qEn: 'Are products covered by a warranty?',
        aFr: 'Oui, chaque appareil neuf dispose d’une garantie de 6 à 24 mois et les smartphones « Seconde Main Certifiée » d’une garantie de 3 mois vérifiable via notre outil ci-dessous.',
        aEn: 'Yes, new electronics carry 6–24 months warranty and Certified Pre-Owned phones include a 3-month warranty verifiable below.',
      },
    ],
  },
  {
    id: 'compte',
    labelFr: 'Compte',
    labelEn: 'Account',
    questions: [
      {
        id: 'c1',
        qFr: 'Comment créer un compte client ?',
        qEn: 'How do I create a customer account?',
        aFr: 'Cliquez sur « Compte » dans la barre supérieure et connectez-vous simplement avec votre numéro +237 ou votre adresse e-mail.',
        aEn: 'Click Account in the top header and sign in using your +237 phone number or email address.',
      },
    ],
  },
  {
    id: 'commandes',
    labelFr: 'Commandes',
    labelEn: 'Orders',
    questions: [
      {
        id: 'co1',
        qFr: 'Comment suivre ma commande en temps réel ?',
        qEn: 'How do I track my order in real time?',
        aFr: 'Rendez-vous dans la rubrique « Suivi de commande » et entrez votre référence (ex : LR-8492) pour voir chaque étape d’expédition.',
        aEn: 'Open Order Tracking and enter your order reference (e.g., LR-8492) to view live dispatch progress.',
      },
    ],
  },
  {
    id: 'confidentialite',
    labelFr: 'Confidentialité & CGV',
    labelEn: 'Privacy & Terms',
    questions: [
      {
        id: 'cf1',
        qFr: 'Comment Lorena Market protège-t-il mes données personnelles ?',
        qEn: 'How does Lorena Market protect my personal data?',
        aFr: 'Vos coordonnées (+237, quartier, repère) sont utilisées uniquement pour l’acheminement de vos commandes et la gestion de votre garantie.',
        aEn: 'Your contact details (+237, quarter, landmark) are used strictly for order delivery and warranty service.',
      },
    ],
  },
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'fridge-ocean-130',
    author: 'Ntolo Ngaondoua Naomie',
    rating: 5,
    date: '02 Nov 2026',
    comment: 'Livré à Bonapriso en 3 heures, refroidit vite et très silencieux. Le livreur a attendu que je vérifie l’appareil avant de régler par MoMo.',
    verified: true,
    helpfulCount: 4,
  },
  {
    id: 'rev-2',
    productId: 'iphone-13-pro-sm',
    author: 'Brice Tchoupo',
    rating: 4,
    date: '14 Nov 2026',
    comment: 'Téléphone propre comme neuf, batterie à 91 % et garantie remise avec la facture.',
    verified: true,
    helpfulCount: 2,
  },
  {
    id: 'rev-3',
    productId: 'tv-cosmic-32',
    author: 'Clarisse Mballa',
    rating: 5,
    date: '19 Nov 2026',
    comment: 'Image nette pour le salon, bon rapport qualité-prix en XAF.',
    verified: true,
    helpfulCount: 3,
  },
];

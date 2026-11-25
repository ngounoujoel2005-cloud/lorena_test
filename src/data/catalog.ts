import { CategorySlug, OrderRecord, Product, RegionZone } from '../types/store';

export const FREE_DELIVERY_THRESHOLD = 150000;

export const IMAGES = {
  heroAudio: '/src/assets/images/hero_flagship_audio_1795596121667.jpg',
  heroChair: '/src/assets/images/hero_ergonomic_chair_1795598621027.jpg',
  headphones: '/src/assets/images/product_headphones_pro_1795596121642.jpg',
  smartphone: '/src/assets/images/product_smartphone_ultra_1795596122051.jpg',
  powerStation: '/src/assets/images/product_power_station_1795596122090.jpg',
  earbuds: '/src/assets/images/product_earbuds_anc_1795596123460.jpg',
  smartwatch: '/src/assets/images/product_smartwatch_steel_1795596124291.jpg',
  speaker: '/src/assets/images/product_speaker_portable_1795596124134.jpg',
  fridge: '/src/assets/images/product_fridge_silver_1795598619099.jpg',
  freezer: '/src/assets/images/product_freezer_chest_1795598618084.jpg',
  smartTv: '/src/assets/images/product_smart_tv_4k_1795598619255.jpg',
  blender: '/src/assets/images/product_blender_kitchen_1795598618858.jpg',
  kettle: '/src/assets/images/product_kettle_airfryer_1795598620420.jpg',
  acUnit: '/src/assets/images/product_ac_split_fan_1795598619787.jpg',
  fan: '/src/assets/images/product_pedestal_fan_1795598620072.jpg',
  beauty: '/src/assets/images/product_beauty_skincare_1795598620439.jpg',
  powerbank: '/src/assets/images/product_powerbank_fast_1795598621272.jpg',
};

export interface CategoryMeta {
  slug: CategorySlug;
  badgeTextFr: string;
  badgeTextEn: string;
  labelFr: string;
  labelEn: string;
  image: string;
  showInTopNav?: boolean;
}

export const CATEGORIES_META: CategoryMeta[] = [
  {
    slug: 'electronique',
    badgeTextFr: 'ÉLECTRONIQUE',
    badgeTextEn: 'ELECTRONICS',
    labelFr: 'Électronique',
    labelEn: 'Electronics',
    image: IMAGES.speaker,
    showInTopNav: true,
  },
  {
    slug: 'fashion',
    badgeTextFr: 'FASHION',
    badgeTextEn: 'FASHION',
    labelFr: 'Fashion',
    labelEn: 'Fashion',
    image: IMAGES.smartwatch,
    showInTopNav: true,
  },
  {
    slug: 'gros-electromenager',
    badgeTextFr: 'GROS ÉLECTRO-MÉNAGER',
    badgeTextEn: 'LARGE APPLIANCES',
    labelFr: 'Gros électroménager',
    labelEn: 'Large Appliances',
    image: IMAGES.fridge,
    showInTopNav: true,
  },
  {
    slug: 'sante-beaute',
    badgeTextFr: 'SANTÉ & BEAUTÉ',
    badgeTextEn: 'HEALTH & BEAUTY',
    labelFr: 'Santé & Beauté',
    labelEn: 'Health & Beauty',
    image: IMAGES.beauty,
    showInTopNav: true,
  },
  {
    slug: 'maison-bureau',
    badgeTextFr: 'MAISON & BUREAU',
    badgeTextEn: 'HOME & OFFICE',
    labelFr: 'Maison & Bureau',
    labelEn: 'Home & Office',
    image: IMAGES.heroChair,
    showInTopNav: true,
  },
  {
    slug: 'telephones-tablettes',
    badgeTextFr: 'TÉLÉPHONES & TABLETTES',
    badgeTextEn: 'PHONES & TABLETS',
    labelFr: 'Téléphones & Tablettes',
    labelEn: 'Phones & Tablets',
    image: IMAGES.smartphone,
    showInTopNav: true,
  },
  {
    slug: 'petit-electromenager',
    badgeTextFr: 'PETIT ÉLECTRO-MÉNAGER',
    badgeTextEn: 'SMALL APPLIANCES',
    labelFr: 'Petit Électroménager',
    labelEn: 'Small Appliances',
    image: IMAGES.blender,
    showInTopNav: true,
  },
  {
    slug: 'informatique',
    badgeTextFr: 'INFORMATIQUE',
    badgeTextEn: 'COMPUTING',
    labelFr: 'Informatique',
    labelEn: 'Computing',
    image: IMAGES.powerStation,
    showInTopNav: true,
  },
  {
    slug: 'bebe',
    badgeTextFr: 'PRODUITS POUR BÉBÉ',
    badgeTextEn: 'BABY CARE',
    labelFr: 'Produits pour bébé',
    labelEn: 'Baby Products',
    image: IMAGES.beauty,
    showInTopNav: false,
  },
  {
    slug: 'supermarche',
    badgeTextFr: 'SUPERMARCHÉ',
    badgeTextEn: 'SUPERMARKET',
    labelFr: 'Supermarché',
    labelEn: 'Supermarket',
    image: IMAGES.kettle,
    showInTopNav: false,
  },
  {
    slug: 'autres',
    badgeTextFr: 'AUTRES CATÉGORIES',
    badgeTextEn: 'OTHER CATEGORIES',
    labelFr: 'Autres catégories',
    labelEn: 'Other Categories',
    image: IMAGES.powerbank,
    showInTopNav: false,
  },
];

export const SUGGESTED_BENTO_CARDS = [
  {
    id: 'bento-beauty',
    titleFr: 'RÉVÉLEZ VOTRE BEAUTÉ AU QUOTIDIEN !',
    titleEn: 'REVEAL YOUR DAILY GLOW!',
    category: 'sante-beaute' as CategorySlug,
    image: IMAGES.beauty,
  },
  {
    id: 'bento-fashion',
    titleFr: 'VOTRE LOOK, VOTRE IDENTITÉ !',
    titleEn: 'YOUR LOOK, YOUR IDENTITY!',
    category: 'fashion' as CategorySlug,
    image: IMAGES.smartwatch,
  },
  {
    id: 'bento-kitchen',
    titleFr: 'SIMPLIFIEZ-VOUS LA VIE AU QUOTIDIEN !',
    titleEn: 'SIMPLIFY YOUR DAILY ROUTINE!',
    category: 'petit-electromenager' as CategorySlug,
    image: IMAGES.blender,
  },
  {
    id: 'bento-power',
    titleFr: 'ÉNERGIE FIABLE, TRAVAILLEZ MIEUX !',
    titleEn: 'RELIABLE POWER, WORK BETTER!',
    category: 'informatique' as CategorySlug,
    image: IMAGES.powerStation,
  },
  {
    id: 'bento-audio',
    titleFr: "FAITES MONTER L'AMBIANCE !",
    titleEn: 'TURN UP THE VIBES!',
    category: 'electronique' as CategorySlug,
    image: IMAGES.headphones,
  },
  {
    id: 'bento-tv',
    titleFr: 'VIVEZ CHAQUE IMAGE EN GRAND !',
    titleEn: 'EXPERIENCE EVERY FRAME BIG!',
    category: 'electronique' as CategorySlug,
    image: IMAGES.smartTv,
  },
  {
    id: 'bento-watch',
    titleFr: 'RESTEZ TOUJOURS CONNECTÉ OÙ QUE VOUS SOYEZ !',
    titleEn: 'STAY CONNECTED ANYWHERE!',
    category: 'telephones-tablettes' as CategorySlug,
    image: IMAGES.earbuds,
  },
  {
    id: 'bento-office',
    titleFr: 'TRAVAILLEZ MIEUX, ALLEZ PLUS LOIN !',
    titleEn: 'WORK BETTER, GO FURTHER!',
    category: 'maison-bureau' as CategorySlug,
    image: IMAGES.heroChair,
  },
];

export const PRODUCTS: Product[] = [
  // --- BEST OFFERS (NEW & CLEARANCE) ---
  {
    id: 'tv-cosmic-32',
    sku: 'LR-TV-320',
    brand: 'Cosmic',
    category: 'electronique',
    sections: ['best_offers_new', 'smart_tv'],
    nameFr: 'Téléviseur LED Numérique — Cosmic 32 Pouces HD',
    nameEn: 'Cosmic 32" Digital HD LED TV',
    shortNoteFr: 'HDMI, USB, décodeur intégré et garantie 6 mois',
    shortNoteEn: 'HDMI, USB, built-in tuner & 6-month warranty',
    descriptionFr:
      'Téléviseur LED 32 pouces offrant des couleurs nettes, deux ports HDMI, lecture multimédia USB directe et faible consommation adaptée au réseau domestique.',
    descriptionEn:
      '32-inch LED television delivering crisp colors, dual HDMI ports, direct USB media playback, and low energy draw.',
    price: 62500,
    oldPrice: 105000,
    discountPct: 40,
    badgeType: 'new',
    image: IMAGES.smartTv,
    warrantyMonths: 6,
    stockQty: 14,
    variants: [
      { id: '32-hd', labelFr: '32" HD Standard', labelEn: '32" Standard HD', priceDelta: 0 },
      { id: '32-wall', labelFr: '32" + Support mural', labelEn: '32" + Wall Mount', priceDelta: 6500 },
    ],
    specs: [
      { labelFr: 'Diagonale', labelEn: 'Screen Size', value: '32 Pouces (80 cm)' },
      { labelFr: 'Connectique', labelEn: 'Ports', value: '2x HDMI, 2x USB, AV' },
      { labelFr: 'Garantie', labelEn: 'Warranty', value: '6 Mois Lorena Certifiée' },
    ],
  },
  {
    id: 'fan-mewe-18',
    sku: 'LR-CLM-180',
    brand: 'Mewe',
    category: 'petit-electromenager',
    sections: ['best_offers_new', 'cooling'],
    nameFr: 'Ventilateur sur pied Mewe 18 Pouces — 3 Vitesses',
    nameEn: 'Mewe 18" Standing Pedestal Fan — 3 Speeds',
    shortNoteFr: 'Moteur silencieux 5 pales haute ventilation',
    shortNoteEn: 'Quiet motor with 5 high-airflow blades',
    descriptionFr:
      'Ventilateur sur pied robuste réglable en hauteur avec oscillation grand angle et grille renforcée pour salon et bureau.',
    descriptionEn:
      'Sturdy height-adjustable pedestal fan with wide oscillation and reinforced safety grille.',
    price: 24950,
    oldPrice: 35000,
    discountPct: 29,
    badgeType: 'new',
    image: IMAGES.fan,
    warrantyMonths: 6,
    stockQty: 22,
    variants: [
      { id: 'noir', labelFr: 'Noir Mat 18"', labelEn: 'Matte Black 18"', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Diamètre', labelEn: 'Diameter', value: '18 Pouces' },
      { labelFr: 'Puissance', labelEn: 'Power', value: '60W Silencieux' },
    ],
  },
  {
    id: 'fan-ubit-solar',
    sku: 'LR-CLM-205',
    brand: 'Ubit',
    category: 'petit-electromenager',
    sections: ['best_offers_new', 'cooling'],
    nameFr: 'Ventilateur Rechargeable Ubit 18 Pouces — Batterie 12h',
    nameEn: 'Ubit 18" Rechargeable Fan — 12h Battery',
    shortNoteFr: 'Autonomie longue durée + port USB secours',
    shortNoteEn: 'Long battery autonomy + emergency USB port',
    descriptionFr:
      'Ventilateur rechargeable pensé pour les coupures électriques : jusqu’à 12 heures d’autonomie sur batterie intégrée et lampe LED nocturne.',
    descriptionEn:
      'Rechargeable standing fan built for backup comfort with up to 12 hours of cordless operation.',
    price: 59950,
    oldPrice: 90000,
    discountPct: 33,
    badgeType: 'new',
    image: IMAGES.fan,
    warrantyMonths: 6,
    stockQty: 9,
    variants: [
      { id: 'std', labelFr: 'Batterie simple', labelEn: 'Single Battery', priceDelta: 0 },
      { id: 'solar', labelFr: 'Avec panneau solaire', labelEn: 'With Solar Panel', priceDelta: 15000 },
    ],
    specs: [
      { labelFr: 'Autonomie', labelEn: 'Runtime', value: '8 à 12 Heures' },
      { labelFr: 'Recharge', labelEn: 'Charging', value: 'Secteur AC + Solaire DC' },
    ],
  },
  {
    id: 'kettle-winning-18',
    sku: 'LR-KIT-108',
    brand: 'Winning Star',
    category: 'petit-electromenager',
    sections: ['best_offers_new', 'best_offers_clearance', 'kitchen'],
    nameFr: 'Bouilloire électrique Inox & Verre 1.8L — 1500W',
    nameEn: 'Winning Star 1.8L Stainless & Glass Electric Kettle',
    shortNoteFr: 'Arrêt automatique, ébullition rapide en 3 minutes',
    shortNoteEn: 'Auto shut-off, rapid 3-minute boil',
    descriptionFr:
      'Bouilloire en acier inoxydable brossé et corps résistant à la chaleur, socle rotatif 360° et protection contre la chauffe à sec.',
    descriptionEn:
      'Brushed stainless steel kettle with 360-degree swivel base and boil-dry safety protection.',
    price: 14500,
    oldPrice: 25000,
    discountPct: 42,
    badgeType: 'new',
    image: IMAGES.kettle,
    warrantyMonths: 6,
    stockQty: 30,
    variants: [
      { id: '1.8l', labelFr: '1.8 Litres Noir/Inox', labelEn: '1.8L Black/Steel', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Capacité', labelEn: 'Capacity', value: '1.8 Litres' },
      { labelFr: 'Puissance', labelEn: 'Power', value: '1500W' },
    ],
  },
  {
    id: 'fridge-ocean-130',
    sku: 'LR-FRG-130',
    brand: 'Ocean',
    category: 'gros-electromenager',
    sections: ['daily_selection', 'freezers'],
    nameFr: 'Réfrigérateur Combiné Ocean DDOS — 130 Litres Silver',
    nameEn: 'Ocean Double-Door Refrigerator — 130 Liters',
    shortNoteFr: 'Classe énergétique A+, compresseur silencieux, garantie 6 mois',
    shortNoteEn: 'Energy Class A+, quiet compressor, 6-month warranty',
    descriptionFr:
      'Réfrigérateur compact double porte idéal pour studios et appartements modernes avec compartiment congélateur séparé et clayettes en verre trempé.',
    descriptionEn:
      'Compact double-door refrigerator ideal for apartments with dedicated top freezer and tempered glass shelves.',
    price: 129900,
    oldPrice: 180000,
    discountPct: 28,
    image: IMAGES.fridge,
    warrantyMonths: 6,
    stockQty: 11,
    variants: [
      { id: '130l', labelFr: '130 Litres · Inox', labelEn: '130L · Silver', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Volume Total', labelEn: 'Total Volume', value: '130 Litres' },
      { labelFr: 'Classe', labelEn: 'Rating', value: 'A+ Économie d’énergie' },
    ],
  },
  {
    id: 'fridge-ocean-350',
    sku: 'LR-FRG-350',
    brand: 'Ocean',
    category: 'gros-electromenager',
    sections: ['daily_selection'],
    nameFr: 'Réfrigérateur Combiné Ocean CNF350 — 350 Litres Inox',
    nameEn: 'Ocean Combi Refrigerator — 350 Liters Stainless',
    shortNoteFr: 'Froid ventilé No-Frost et afficheur digital frontal',
    shortNoteEn: 'No-Frost cooling with digital front display',
    descriptionFr:
      'Grand réfrigérateur familial 350L à dégivrage automatique No-Frost, finition inox brossé anti-traces et contrôle digital de température.',
    descriptionEn:
      'Family-size 350L No-Frost refrigerator with brushed stainless finish and digital temperature control.',
    price: 325000,
    oldPrice: 400000,
    discountPct: 19,
    image: IMAGES.fridge,
    warrantyMonths: 12,
    stockQty: 7,
    variants: [
      { id: '350l', labelFr: '350 Litres Inox', labelEn: '350L Stainless', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Volume', labelEn: 'Volume', value: '350 Litres' },
      { labelFr: 'Technologie', labelEn: 'Cooling', value: 'Total No-Frost' },
    ],
  },
  {
    id: 'fridge-hisense-225',
    sku: 'LR-FRG-225',
    brand: 'Hisense',
    category: 'gros-electromenager',
    sections: ['daily_selection', 'best_offers_clearance'],
    nameFr: 'Réfrigérateur Hisense RD29DC — 225 Litres Gris',
    nameEn: 'Hisense 225L Refrigerator — Metallic Gray',
    shortNoteFr: 'Format 153cm × 55cm · Congélation rapide',
    shortNoteEn: '153cm × 55cm footprint · Rapid freezing',
    descriptionFr:
      'Fiabilité Hisense avec grande capacité utile de 225L, éclairage LED intérieur et bac à légumes à contrôle d’humidité.',
    descriptionEn:
      'Reliable Hisense 225L refrigerator with interior LED lighting and humidity-controlled crisper drawer.',
    price: 235000,
    oldPrice: 387000,
    discountPct: 39,
    badgeType: 'clearance',
    image: IMAGES.fridge,
    warrantyMonths: 12,
    stockQty: 5,
    variants: [
      { id: '225l', labelFr: '225 Litres Gris', labelEn: '225L Gray', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Dimensions', labelEn: 'Dimensions', value: '153 × 55 cm' },
      { labelFr: 'Garantie', labelEn: 'Warranty', value: '12 Mois Officielle' },
    ],
  },
  {
    id: 'fridge-american-480',
    sku: 'LR-FRG-480',
    brand: 'Ocean',
    category: 'gros-electromenager',
    sections: ['daily_selection', 'best_offers_new'],
    nameFr: 'Réfrigérateur Américain Multi-Portes — 480 Litres',
    nameEn: 'American Multi-Door Refrigerator — 480 Liters',
    shortNoteFr: 'Double tiroir congélation et panneau tactile LED',
    shortNoteEn: 'Dual freezer drawers & LED touch control',
    descriptionFr:
      'Réfrigérateur multi-portes grand volume 480L doté d’un compresseur Inverter ultra-silencieux et d’un contrôle tactile en façade.',
    descriptionEn:
      'Large 480L multi-door refrigerator equipped with ultra-quiet Inverter compressor and front touch panel.',
    price: 550000,
    oldPrice: 620000,
    discountPct: 11,
    badgeType: 'new',
    image: IMAGES.fridge,
    warrantyMonths: 12,
    stockQty: 4,
    variants: [
      { id: '480l-inox', labelFr: '480L Inox Brossé', labelEn: '480L Brushed Steel', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Volume', labelEn: 'Capacity', value: '480 Litres' },
      { labelFr: 'Compresseur', labelEn: 'Compressor', value: 'Digital Inverter' },
    ],
  },

  // --- COOLING & TRENDING ---
  {
    id: 'ac-icona-125',
    sku: 'LR-CLM-900',
    brand: 'Icona',
    category: 'gros-electromenager',
    sections: ['cooling', 'best_offers_clearance'],
    nameFr: 'Climatiseur Split Icona 1.25 CV — 9000 BTU',
    nameEn: 'Icona 1.25HP Split Air Conditioner — 9000 BTU',
    shortNoteFr: 'Gaz R410 écologique, kit tuyauterie inclus',
    shortNoteEn: 'Eco R410 refrigerant, installation pipe kit included',
    descriptionFr:
      'Climatiseur Split mural 1.25 CV conçu pour refroidir rapidement chambres et bureaux jusqu’à 22 m², même par forte chaleur.',
    descriptionEn:
      '1.25HP wall-mounted split AC engineered for rapid cooling in rooms up to 22 m².',
    price: 157900,
    oldPrice: 195000,
    discountPct: 19,
    badgeType: 'clearance',
    image: IMAGES.acUnit,
    warrantyMonths: 12,
    stockQty: 8,
    variants: [
      { id: '125cv', labelFr: '1.25 CV (9000 BTU)', labelEn: '1.25 HP (9000 BTU)', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Puissance', labelEn: 'Cooling Power', value: '9 000 BTU / 1.25 CV' },
      { labelFr: 'Surface couverte', labelEn: 'Coverage', value: '15 à 22 m²' },
    ],
  },
  {
    id: 'ac-tcl-15cv',
    sku: 'LR-CLM-1200',
    brand: 'TCL',
    category: 'gros-electromenager',
    sections: ['cooling'],
    nameFr: 'Climatiseur Split TCL Inverter 1.5 CV — 12000 BTU',
    nameEn: 'TCL 1.5HP Inverter Split AC — 12000 BTU',
    shortNoteFr: 'Technologie Inverter -40% consommation électrique',
    shortNoteEn: 'Inverter technology saves up to 40% energy',
    descriptionFr:
      'Climatiseur TCL Inverter 1.5 CV blanc haute efficacité avec redémarrage automatique après coupure et mode nuit silencieux.',
    descriptionEn:
      'High-efficiency TCL 1.5HP Inverter AC with auto-restart and quiet sleep mode.',
    price: 215000,
    oldPrice: 320000,
    discountPct: 33,
    image: IMAGES.acUnit,
    warrantyMonths: 12,
    stockQty: 6,
    variants: [
      { id: '15cv', labelFr: '1.5 CV Inverter', labelEn: '1.5 HP Inverter', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Puissance', labelEn: 'Capacity', value: '12 000 BTU / 1.5 CV' },
      { labelFr: 'Garantie', labelEn: 'Warranty', value: '12 Mois Compresseur' },
    ],
  },

  // --- KITCHEN & BLENDERS ---
  {
    id: 'blender-kenwood-15',
    sku: 'LR-KIT-450',
    brand: 'Kenwood',
    category: 'petit-electromenager',
    sections: ['blenders', 'kitchen'],
    nameFr: 'Blender Kenwood Smoothie Maker — 1.5L + 2 Bols',
    nameEn: 'Kenwood Smoothie Blender — 1.5L + 2 Jars',
    shortNoteFr: 'Lames acier inoxydable + moulin à épices sec',
    shortNoteEn: 'Stainless blades + dry spice grinder mill',
    descriptionFr:
      'Mixeur puissant avec bol principal gradué 1.5L et double moulin pour épices, café et purées de fruits.',
    descriptionEn:
      'Powerful countertop blender with 1.5L main pitcher and dual dry spice grinding bowls.',
    price: 57000,
    oldPrice: 70000,
    discountPct: 19,
    image: IMAGES.blender,
    warrantyMonths: 6,
    stockQty: 18,
    variants: [
      { id: '1.5l-inox', labelFr: '1.5L + 2 Bols', labelEn: '1.5L + 2 Bowls', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Puissance', labelEn: 'Power', value: '600W + Fonction Pulse' },
      { labelFr: 'Accessoires', labelEn: 'Accessories', value: '2 moulins secs inclus' },
    ],
  },
  {
    id: 'blender-binatone-410',
    sku: 'LR-KIT-410',
    brand: 'Binatone',
    category: 'petit-electromenager',
    sections: ['blenders', 'kitchen', 'best_offers_clearance'],
    nameFr: 'Blender Binatone BLG-410 — 1.5L + Bol à sec',
    nameEn: 'Binatone BLG-410 Blender — 1.5L + Dry Mill',
    shortNoteFr: 'Moteur cuivre durable 220/240V — 50/60Hz',
    shortNoteEn: 'Durable copper motor 220/240V — 50/60Hz',
    descriptionFr:
      'Le classique familial Binatone avec bol incassable 1.5L et moulin à épices intégré pour préparations quotidiennes.',
    descriptionEn:
      'Family-favorite Binatone blender with shatterproof 1.5L jar and included spice mill.',
    price: 17500,
    oldPrice: 32000,
    discountPct: 45,
    badgeType: 'clearance',
    image: IMAGES.blender,
    warrantyMonths: 6,
    stockQty: 25,
    variants: [
      { id: 'blg410', labelFr: 'Standard 1.5L', labelEn: 'Standard 1.5L', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Capacité', labelEn: 'Capacity', value: '1.5 Litres' },
      { labelFr: 'Moteur', labelEn: 'Motor', value: '350W Cuivre' },
    ],
  },
  {
    id: 'blender-pro-digital',
    sku: 'LR-KIT-730',
    brand: 'Vitamix Pro',
    category: 'petit-electromenager',
    sections: ['blenders', 'kitchen'],
    nameFr: 'Blender Multifonctions Inox Digital — Bol Verre 1.8L',
    nameEn: 'Digital Stainless Glass Blender — 1.8L Jar',
    shortNoteFr: 'Écran minuteur LED et fonction glace pilée',
    shortNoteEn: 'LED timer display and ice-crushing mode',
    descriptionFr:
      'Blender haut de gamme en acier brossé avec minuterie digitale, variateur continu et bol en verre épais résistant aux chocs thermiques.',
    descriptionEn:
      'Brushed stainless steel digital blender with heavy-duty thermal glass jar.',
    price: 149999,
    oldPrice: 210000,
    discountPct: 29,
    image: IMAGES.blender,
    warrantyMonths: 12,
    stockQty: 6,
    variants: [
      { id: '1.8l-pro', labelFr: '1.8L Verre Trempé', labelEn: '1.8L Tempered Glass', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Puissance', labelEn: 'Power', value: '1200W Haute Vitesse' },
      { labelFr: 'Commandes', labelEn: 'Controls', value: 'Écran LED + Molette' },
    ],
  },

  // --- FREEZERS ---
  {
    id: 'freezer-delta-96',
    sku: 'LR-FRZ-096',
    brand: 'Delta',
    category: 'gros-electromenager',
    sections: ['freezers'],
    nameFr: 'Mini Congélateur Coffre Delta — 96 Litres Classe A+',
    nameEn: 'Delta Mini Chest Freezer — 96 Liters Class A+',
    shortNoteFr: 'Format compact 87cm × 56cm · Maintien froid 36h',
    shortNoteEn: 'Compact 87cm × 56cm · 36h hold-over time',
    descriptionFr:
      'Congélateur coffre compact économique avec serrure de sécurité et panier amovible.',
    descriptionEn:
      'Energy-saving compact chest freezer with security lock and removable wire basket.',
    price: 93900,
    oldPrice: 125000,
    discountPct: 25,
    image: IMAGES.freezer,
    warrantyMonths: 6,
    stockQty: 12,
    variants: [
      { id: '96l', labelFr: '96 Litres', labelEn: '96 Liters', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Volume', labelEn: 'Capacity', value: '96 Litres' },
      { labelFr: 'Maintien froid', labelEn: 'Autonomy', value: '36h sans courant' },
    ],
  },
  {
    id: 'freezer-oscar-271',
    sku: 'LR-FRZ-271',
    brand: 'Oscar',
    category: 'gros-electromenager',
    sections: ['freezers'],
    nameFr: 'Congélateur Coffre Oscar — 271 Litres Silver',
    nameEn: 'Oscar Chest Freezer — 271 Liters Silver',
    shortNoteFr: 'Refroidissement rapide · Serrure et roulettes',
    shortNoteEn: 'Fast freeze · Lock & heavy-duty casters',
    descriptionFr:
      'Congélateur horizontal 271L robuste à parois isolantes haute densité et contrôle électronique frontal.',
    descriptionEn:
      'Heavy-duty 271L chest freezer with high-density insulation and front digital readout.',
    price: 185000,
    oldPrice: 230000,
    discountPct: 20,
    image: IMAGES.freezer,
    warrantyMonths: 6,
    stockQty: 9,
    variants: [
      { id: '271l', labelFr: '271 Litres', labelEn: '271 Liters', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Volume', labelEn: 'Capacity', value: '271 Litres' },
      { labelFr: 'Dimensions', labelEn: 'Dimensions', value: '95 × 80 cm' },
    ],
  },
  {
    id: 'freezer-oscar-480',
    sku: 'LR-FRZ-480',
    brand: 'Oscar',
    category: 'gros-electromenager',
    sections: ['freezers'],
    nameFr: 'Congélateur Coffre Grand Volume Oscar — 423 Litres',
    nameEn: 'Oscar Large Chest Freezer — 423 Liters',
    shortNoteFr: 'Double panier + thermostat réglable · 06 mois garantie',
    shortNoteEn: 'Dual baskets + adjustable thermostat · 6m warranty',
    descriptionFr:
      'Conçu pour les familles et commerces alimentaires, avec double panier métallique et évacuation facile de dégivrage.',
    descriptionEn:
      'Designed for large households and food businesses with dual baskets and easy defrost drain.',
    price: 295300,
    oldPrice: 345000,
    discountPct: 14,
    image: IMAGES.freezer,
    warrantyMonths: 6,
    stockQty: 5,
    variants: [
      { id: '423l', labelFr: '423 Litres', labelEn: '423 Liters', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Volume', labelEn: 'Capacity', value: '423 Litres' },
      { labelFr: 'Usage', labelEn: 'Grade', value: 'Domestique & Pro' },
    ],
  },

  // --- SECOND HAND ("L'UNIVERS DES SUSPENDUS") & HIGH-TECH ---
  {
    id: 'iphone-13-pro-sm',
    sku: 'LR-MOB-13P',
    brand: 'Apple',
    category: 'telephones-tablettes',
    sections: ['second_hand', 'hightech'],
    nameFr: 'iPhone 13 Pro Seconde Main — 128Go / 6Go RAM — 6.1"',
    nameEn: 'Pre-Owned iPhone 13 Pro — 128GB / 6GB RAM — 6.1"',
    shortNoteFr: 'Grade A+ testé 32 points · Batterie > 88%',
    shortNoteEn: 'Grade A+ 32-point tested · Battery > 88%',
    descriptionFr:
      'Smartphone certifié seconde main contrôlé par nos techniciens Lorena : écran OLED ProMotion 120Hz intact, Face ID fonctionnel et garantie 3 mois.',
    descriptionEn:
      'Certified pre-owned smartphone inspected across 32 hardware checkpoints with intact 120Hz OLED display and 3-month warranty.',
    price: 255000,
    oldPrice: 365000,
    discountPct: 30,
    badgeType: 'second_hand',
    image: IMAGES.smartphone,
    warrantyMonths: 3,
    stockQty: 6,
    swatches: [
      { name: 'Titane Bleu', hex: '#5A5AA1' },
      { name: 'Graphite', hex: '#1A1A1A' },
    ],
    variants: [
      { id: '128gb', labelFr: '128 Go · Grade A+', labelEn: '128GB · Grade A+', priceDelta: 0 },
      { id: '256gb', labelFr: '256 Go · Grade A+', labelEn: '256GB · Grade A+', priceDelta: 35000 },
    ],
    specs: [
      { labelFr: 'État', labelEn: 'Condition', value: 'Seconde Main Certifiée Grade A+' },
      { labelFr: 'Stockage', labelEn: 'Storage', value: '128 Go NVMe' },
    ],
  },
  {
    id: 'iphone-12-pro-sm',
    sku: 'LR-MOB-12P',
    brand: 'Apple',
    category: 'telephones-tablettes',
    sections: ['second_hand'],
    nameFr: 'iPhone 12 Pro Seconde Main — 256Go / 6Go RAM',
    nameEn: 'Pre-Owned iPhone 12 Pro — 256GB / 6GB RAM',
    shortNoteFr: 'Débloqué tous opérateurs MTN & Orange 4G/5G',
    shortNoteEn: 'Unlocked for MTN & Orange 4G/5G',
    descriptionFr:
      'iPhone 12 Pro reconditionné certifié avec triple capteur photo LiDAR et châssis acier chirurgical.',
    descriptionEn:
      'Certified pre-owned iPhone 12 Pro with LiDAR triple camera and stainless frame.',
    price: 195000,
    oldPrice: 275000,
    discountPct: 29,
    badgeType: 'second_hand',
    image: IMAGES.smartphone,
    warrantyMonths: 3,
    stockQty: 4,
    variants: [
      { id: '256gb', labelFr: '256 Go Débloqué', labelEn: '256GB Unlocked', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Écran', labelEn: 'Display', value: '6.1" Super Retina XDR' },
      { labelFr: 'Réseau', labelEn: 'Network', value: '5G + eSIM' },
    ],
  },
  {
    id: 'iphone-16-plus-oos',
    sku: 'LR-MOB-16P',
    brand: 'Apple',
    category: 'telephones-tablettes',
    sections: ['hightech'],
    nameFr: 'iPhone 16 Plus — 512 Go / 8Go RAM — 6.7" Neuf Scellé',
    nameEn: 'iPhone 16 Plus — 512GB / 8GB RAM — 6.7" Sealed',
    shortNoteFr: 'Puce A18 · Garantie officielle 12 mois',
    shortNoteEn: 'A18 Chip · 12-month official warranty',
    descriptionFr:
      'Grand écran Super Retina XDR 6.7 pouces avec autonomie record et double caméra Fusion 48MP.',
    descriptionEn:
      '6.7-inch Super Retina XDR display with all-day battery and 48MP Fusion camera.',
    price: 720000,
    oldPrice: 850000,
    discountPct: 15,
    image: IMAGES.smartphone,
    warrantyMonths: 12,
    stockQty: 0, // Out of stock demo matching NKCL screenshot!
    swatches: [
      { name: 'Lavande', hex: '#A084E8' },
      { name: 'Or', hex: '#F4BE38' },
      { name: 'Blanc', hex: '#E5E7EB' },
    ],
    variants: [
      { id: '512gb', labelFr: '512 Go Scellé', labelEn: '512GB Sealed', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Stockage', labelEn: 'Storage', value: '512 Go' },
      { labelFr: 'Disponibilité', labelEn: 'Availability', value: 'Réapprovisionnement en cours' },
    ],
  },
  {
    id: 'titan-x5-pro',
    sku: 'LR-MOB-15P',
    brand: 'Aurelia / Pro',
    category: 'telephones-tablettes',
    sections: ['hightech', 'best_offers_new'],
    nameFr: 'Smartphone Titan 15 Pro Max — 256Go / 8Go RAM — 6.7"',
    nameEn: 'Titan 15 Pro Max — 256GB / 8GB RAM — 6.7"',
    shortNoteFr: 'Châssis Titane · Nano SIM + eSIM · 12 mois garantie',
    shortNoteEn: 'Titanium frame · Dual SIM + eSIM · 12m warranty',
    descriptionFr:
      'Smartphone flagship en titane brossé équipé d’un écran LTPO 120Hz, triple capteur 50MP stabilisé et charge rapide USB-C.',
    descriptionEn:
      'Flagship brushed titanium smartphone with 120Hz LTPO OLED display and 50MP stabilized camera.',
    price: 610000,
    oldPrice: 790000,
    discountPct: 23,
    badgeType: 'new',
    image: IMAGES.smartphone,
    warrantyMonths: 12,
    stockQty: 10,
    swatches: [
      { name: 'Titane Naturel', hex: '#9CA3AF' },
      { name: 'Noir Sidéral', hex: '#000000' },
    ],
    variants: [
      { id: '256gb', labelFr: '256 Go · Titane', labelEn: '256GB · Titanium', priceDelta: 0 },
      { id: '512gb', labelFr: '512 Go · Titane', labelEn: '512GB · Titanium', priceDelta: 65000 },
    ],
    specs: [
      { labelFr: 'Écran', labelEn: 'Display', value: '6.7" 120Hz OLED' },
      { labelFr: 'Batterie', labelEn: 'Battery', value: '5000 mAh · Charge 45W' },
    ],
  },
  {
    id: 'iphone-15-plus-swatches',
    sku: 'LR-MOB-15L',
    brand: 'Apple',
    category: 'telephones-tablettes',
    sections: ['hightech'],
    nameFr: 'iPhone 15 Plus — 512 Go / 6Go RAM — 6.7" — Garantie 12 mois',
    nameEn: 'iPhone 15 Plus — 512GB / 6GB RAM — 6.7" — 12m Warranty',
    shortNoteFr: 'USB-C · Dynamic Island · Disponible en 4 coloris',
    shortNoteEn: 'USB-C · Dynamic Island · 4 colors available',
    descriptionFr:
      'Écran 6.7 pouces lumineux, connecteur universel USB-C et appareil photo principal 48 Mpx.',
    descriptionEn:
      'Bright 6.7-inch display, universal USB-C port, and 48MP main camera.',
    price: 695000,
    oldPrice: 715000,
    discountPct: 3,
    image: IMAGES.smartphone,
    warrantyMonths: 12,
    stockQty: 8,
    swatches: [
      { name: 'Violet Doux', hex: '#A084E8' },
      { name: 'Noir', hex: '#000000' },
      { name: 'Jaune Or', hex: '#F4BE38' },
    ],
    variants: [
      { id: '512gb', labelFr: '512 Go', labelEn: '512GB', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Stockage', labelEn: 'Storage', value: '512 Go' },
      { labelFr: 'Connecteur', labelEn: 'Port', value: 'USB-C' },
    ],
  },

  // --- BEAUTY & CARE ---
  {
    id: 'aura-lotion-set',
    sku: 'LR-BTY-101',
    brand: 'Aura Care',
    category: 'sante-beaute',
    sections: ['beauty'],
    nameFr: 'Coffret Aura Lait Hydratant 200ml + Crème Visage Velours',
    nameEn: 'Aura Hydrating Body Lotion 200ml + Velvet Face Cream',
    shortNoteFr: 'Hydratation intense 48h · Formule peaux sensibles',
    shortNoteEn: '48h intense moisture · Sensitive skin formula',
    descriptionFr:
      'Duo quotidien associant un lait corporel apaisant à l’acide hyaluronique et une crème visage texture velours non grasse.',
    descriptionEn:
      'Daily skincare duo pairing soothing hyaluronic body lotion with a non-greasy velvet facial cream.',
    price: 18500,
    oldPrice: 28000,
    discountPct: 34,
    image: IMAGES.beauty,
    warrantyMonths: 1,
    stockQty: 26,
    variants: [
      { id: 'duo', labelFr: 'Coffret Duo (Lait + Crème)', labelEn: 'Duo Set (Lotion + Cream)', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Contenance', labelEn: 'Volume', value: '200ml + 50ml' },
      { labelFr: 'Origine', labelEn: 'Certification', value: 'Testé dermatologiquement' },
    ],
  },
  {
    id: 'aura-lipikar-400',
    sku: 'LR-BTY-400',
    brand: 'Aura Derm',
    category: 'sante-beaute',
    sections: ['beauty'],
    nameFr: 'Baume Relipidant Anti-Irritations — Flacon Pompe 400ml',
    nameEn: 'Soothing Lipid-Replenishing Balm — 400ml Pump',
    shortNoteFr: 'Soin corps famille · Sans parfum, beurre de karité',
    shortNoteEn: 'Family body care · Fragrance-free shea butter',
    descriptionFr:
      'Soin émollient grand format enrichi en niacinamide et beurre de karité pur pour restaurer la barrière cutanée.',
    descriptionEn:
      'Large 400ml soothing balm enriched with niacinamide and pure shea butter.',
    price: 14900,
    oldPrice: 21000,
    discountPct: 29,
    image: IMAGES.beauty,
    warrantyMonths: 1,
    stockQty: 19,
    variants: [
      { id: '400ml', labelFr: '400 ml Pompe', labelEn: '400ml Pump', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Contenance', labelEn: 'Size', value: '400 ml' },
      { labelFr: 'Type de peau', labelEn: 'Skin Type', value: 'Sèche à très sèche' },
    ],
  },

  // --- SMART TV & AUDIO & POWERBANKS ("TOP RÉDUCTIONS") ---
  {
    id: 'tv-hisense-40',
    sku: 'LR-TV-400',
    brand: 'Hisense',
    category: 'electronique',
    sections: ['smart_tv'],
    nameFr: 'Smart TV Hisense 40 Pouces Full HD — VIDAA OS',
    nameEn: 'Hisense 40" Full HD Smart TV — VIDAA OS',
    shortNoteFr: 'YouTube, Netflix, Prime Video intégrés · 6 mois garantie',
    shortNoteEn: 'YouTube, Netflix, Prime Video built-in · 6m warranty',
    descriptionFr:
      'Smart TV Full HD avec accès instantané à vos plateformes streaming en Wi-Fi, son DTS Virtual:X et bordures ultra-fines.',
    descriptionEn:
      'Full HD Smart TV with Wi-Fi streaming apps, DTS Virtual:X audio, and ultra-slim bezels.',
    price: 151000,
    oldPrice: 210000,
    discountPct: 28,
    image: IMAGES.smartTv,
    warrantyMonths: 6,
    stockQty: 10,
    variants: [
      { id: '40-fhd', labelFr: '40" Full HD', labelEn: '40" Full HD', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Système', labelEn: 'OS', value: 'VIDAA Smart TV Wi-Fi' },
      { labelFr: 'Résolution', labelEn: 'Resolution', value: '1920 × 1080 Full HD' },
    ],
  },
  {
    id: 'tv-lg-43-uhd',
    sku: 'LR-TV-430',
    brand: 'LG',
    category: 'electronique',
    sections: ['smart_tv'],
    nameFr: 'Smart TV LG 43" 4K UHD — webOS + Magic Remote',
    nameEn: 'LG 43" 4K UHD Smart TV — webOS + Magic Remote',
    shortNoteFr: 'HDR10 Pro · Processeur α5 AI 4K · Garantie 12 mois',
    shortNoteEn: 'HDR10 Pro · α5 AI 4K Processor · 12m warranty',
    descriptionFr:
      'Téléviseur 4K UHD authentique avec télécommande pointeur Magic Remote, AirPlay et mode jeu faible latence.',
    descriptionEn:
      'True 4K UHD Smart TV with Magic Remote, AirPlay, and low-latency game optimizer.',
    price: 215800,
    oldPrice: 300000,
    discountPct: 28,
    image: IMAGES.smartTv,
    warrantyMonths: 12,
    stockQty: 7,
    variants: [
      { id: '43-4k', labelFr: '43" 4K UHD', labelEn: '43" 4K UHD', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Résolution', labelEn: 'Resolution', value: '3840 × 2160 (4K UHD)' },
      { labelFr: 'Garantie', labelEn: 'Warranty', value: '12 Mois Officielle LG' },
    ],
  },
  {
    id: 'tv-innova-65-oos',
    sku: 'LR-TV-650',
    brand: 'Innova',
    category: 'electronique',
    sections: ['smart_tv'],
    nameFr: 'Smart TV Innova 65 Pouces 4K Ultra HD — Google TV',
    nameEn: 'Innova 65" 4K Ultra HD Smart TV — Google TV',
    shortNoteFr: 'Grand écran cinéma 65" · Chromecast intégré',
    shortNoteEn: '65" cinema screen · Built-in Chromecast',
    descriptionFr:
      'Dalle géante 65 pouces 4K HDR avec commande vocale Google Assistant.',
    descriptionEn:
      'Giant 65-inch 4K HDR panel with Google Assistant voice remote.',
    price: 279000,
    oldPrice: 415000,
    discountPct: 33,
    image: IMAGES.smartTv,
    warrantyMonths: 6,
    stockQty: 0, // Out of stock demo matching smart TV screenshot!
    variants: [
      { id: '65-4k', labelFr: '65" 4K UHD', labelEn: '65" 4K UHD', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Diagonale', labelEn: 'Size', value: '65 Pouces (165 cm)' },
    ],
  },
  {
    id: 'powerbank-hoco-20k',
    sku: 'LR-PWR-200',
    brand: 'Hoco',
    category: 'telephones-tablettes',
    sections: ['top_discounts', 'best_offers_clearance'],
    nameFr: 'Batterie Externe Hoco 20 000mAh — Charge Rapide LED 22.5W',
    nameEn: 'Hoco 20,000mAh Power Bank — 22.5W LED Fast Charge',
    shortNoteFr: 'Affichage pourcentage digital · Double port USB-C & USB-A',
    shortNoteEn: 'Digital percentage readout · Dual USB-C & USB-A',
    descriptionFr:
      'Batterie de secours haute capacité 20 000 mAh capable de recharger un smartphone jusqu’à 4 fois avec affichage numérique précis.',
    descriptionEn:
      'High-capacity 20,000mAh portable power bank delivering up to 4 full phone charges with crisp percentage readout.',
    price: 11500,
    oldPrice: 18000,
    discountPct: 36,
    badgeType: 'clearance',
    image: IMAGES.powerbank,
    warrantyMonths: 6,
    stockQty: 40,
    variants: [
      { id: '20k', labelFr: '20 000 mAh Noir', labelEn: '20,000 mAh Black', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Capacité', labelEn: 'Capacity', value: '20 000 mAh / 74Wh' },
      { labelFr: 'Sortie Max', labelEn: 'Output', value: '22.5W PD + QC 3.0' },
    ],
  },
  {
    id: 'volta-sp500',
    sku: 'LR-PWR-500',
    brand: 'VoltaCore',
    category: 'informatique',
    sections: ['top_discounts', 'hightech'],
    nameFr: 'Station Solaire Portable Volta SP500 — 512Wh LiFePO4',
    nameEn: 'Volta SP500 Portable Solar Station — 512Wh LiFePO4',
    shortNoteFr: 'Alimente box Wi-Fi, PC portables & TV pendant les coupures',
    shortNoteEn: 'Powers Wi-Fi routers, laptops & TVs during outages',
    descriptionFr:
      'Station d’énergie portable 512Wh à batterie LiFePO4 longue durée, sortie pure sinus AC 500W et double USB-C 60W.',
    descriptionEn:
      'Compact 512Wh LiFePO4 backup power station with pure sine 500W AC and dual 60W USB-C ports.',
    price: 245000,
    oldPrice: 295000,
    discountPct: 17,
    image: IMAGES.powerStation,
    warrantyMonths: 24,
    stockQty: 8,
    variants: [
      { id: '512wh', labelFr: 'Station 512Wh seule', labelEn: '512Wh Station Only', priceDelta: 0 },
      { id: '512wh-solar', labelFr: 'Station + Panneau 100W', labelEn: 'Station + 100W Solar Panel', priceDelta: 65000 },
    ],
    specs: [
      { labelFr: 'Capacité', labelEn: 'Capacity', value: '512Wh / 500W AC' },
      { labelFr: 'Garantie', labelEn: 'Warranty', value: '24 Mois Certifiée' },
    ],
  },
  {
    id: 'headphones-studio-anc',
    sku: 'LR-AUD-104',
    brand: 'SennCraft',
    category: 'electronique',
    sections: ['top_discounts', 'best_offers_new'],
    nameFr: 'Casque Audio Sans Fil Studio ANC — Autonomie 45h',
    nameEn: 'Studio ANC Wireless Headphones — 45h Battery',
    shortNoteFr: 'Réduction active du bruit · Finition noir & laiton',
    shortNoteEn: 'Active noise cancellation · Obsidian & brass finish',
    descriptionFr:
      'Casque audio circum-aural haute fidélité avec réduction active du bruit hybride et charge rapide USB-C.',
    descriptionEn:
      'High-fidelity over-ear headphones with hybrid ANC and rapid USB-C charging.',
    price: 49500,
    oldPrice: 75000,
    discountPct: 34,
    badgeType: 'new',
    image: IMAGES.headphones,
    warrantyMonths: 12,
    stockQty: 15,
    variants: [
      { id: 'obsidian', labelFr: 'Obsidian / Laiton', labelEn: 'Obsidian / Brass', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Autonomie', labelEn: 'Battery', value: '45 Heures ANC' },
      { labelFr: 'Bluetooth', labelEn: 'Wireless', value: 'Bluetooth 5.3 Multipoint' },
    ],
  },
  {
    id: 'speaker-sonus-360',
    sku: 'LR-AUD-408',
    brand: 'SonusCraft',
    category: 'electronique',
    sections: ['top_discounts'],
    nameFr: 'Enceinte Portable Sonus 360° — 40W IP67 Étanche',
    nameEn: 'Sonus 360° Portable Speaker — 40W IP67 Waterproof',
    shortNoteFr: 'Son puissant 360° · Tissu acoustique & aluminium',
    shortNoteEn: '360° room-filling audio · Acoustic weave & aluminum',
    descriptionFr:
      'Enceinte Bluetooth 40W résistante à l’eau et à la poussière avec 18 heures d’autonomie continue.',
    descriptionEn:
      'Water-resistant 40W Bluetooth speaker with 18 hours of playback.',
    price: 38900,
    oldPrice: 55000,
    discountPct: 29,
    image: IMAGES.speaker,
    warrantyMonths: 12,
    stockQty: 13,
    variants: [
      { id: 'charcoal', labelFr: 'Charbon / Aluminium', labelEn: 'Charcoal / Aluminum', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Puissance', labelEn: 'Output', value: '40W RMS' },
      { labelFr: 'Étanchéité', labelEn: 'Rating', value: 'IP67' },
    ],
  },
  {
    id: 'watch-chronos-steel',
    sku: 'LR-FSH-310',
    brand: 'NordicPulse',
    category: 'fashion',
    sections: ['top_discounts', 'hightech'],
    nameFr: 'Montre Connectée Chronos Acier — AMOLED & GPS',
    nameEn: 'Chronos Steel Smartwatch — AMOLED & Dual GPS',
    shortNoteFr: 'Boîtier acier inoxydable · Étanche 5 ATM · 14j autonomie',
    shortNoteEn: 'Stainless steel case · 5 ATM waterproof · 14-day battery',
    descriptionFr:
      'Montre connectée élégante en acier brossé avec suivi cardiaque, GPS double bande et bracelet tissé respirant.',
    descriptionEn:
      'Brushed stainless steel smartwatch with heart-rate tracking, dual-band GPS, and woven strap.',
    price: 68000,
    oldPrice: 95000,
    discountPct: 28,
    image: IMAGES.smartwatch,
    warrantyMonths: 12,
    stockQty: 9,
    variants: [
      { id: '44mm-slate', labelFr: '44mm · Bracelet Tissé', labelEn: '44mm · Woven Strap', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Boîtier', labelEn: 'Case', value: 'Acier 316L + Verre Saphir' },
      { labelFr: 'Autonomie', labelEn: 'Battery', value: 'Jusqu’à 14 Jours' },
    ],
  },
  {
    id: 'chair-ergo-study',
    sku: 'LR-OFC-550',
    brand: 'ErgoDesk',
    category: 'maison-bureau',
    sections: ['best_offers_new'],
    nameFr: 'Chaise Ergonomique d’Étude & Bureau avec Tablette',
    nameEn: 'Ergonomic Study & Office Chair with Writing Tablet',
    shortNoteFr: 'Dossier mesh respirant · Tablette rabattable · Roulettes 360°',
    shortNoteEn: 'Breathable mesh back · Foldable desk arm · 360° casters',
    descriptionFr:
      'Le confort au service de l’apprentissage et du télétravail : appui-tête réglable, soutien lombaire et tablette support ordinateur portable.',
    descriptionEn:
      'Built for study and remote work comfort with lumbar support, adjustable headrest, and foldable laptop tablet.',
    price: 55000,
    oldPrice: 78000,
    discountPct: 29,
    badgeType: 'new',
    image: IMAGES.heroChair,
    warrantyMonths: 12,
    stockQty: 16,
    variants: [
      { id: 'black-tablet', labelFr: 'Noir Mesh + Tablette', labelEn: 'Black Mesh + Tablet', priceDelta: 0 },
    ],
    specs: [
      { labelFr: 'Charge max', labelEn: 'Max Load', value: '130 kg' },
      { labelFr: 'Assise', labelEn: 'Seat', value: 'Mousse haute densité' },
    ],
  },
];

export const LOGISTICS_REGIONS: RegionZone[] = [
  {
    name: 'Littoral',
    cities: [
      {
        name: 'Douala',
        quarters: [
          { name: 'Akwa', etaFr: 'Même jour (2–4h)', etaEn: 'Same-day (2–4h)', fee: 1500 },
          { name: 'Bonapriso', etaFr: 'Même jour (2–4h)', etaEn: 'Same-day (2–4h)', fee: 1500 },
          { name: 'Bonanjo', etaFr: 'Même jour (2–4h)', etaEn: 'Same-day (2–4h)', fee: 1500 },
          { name: 'Makepe', etaFr: 'Même jour (3–5h)', etaEn: 'Same-day (3–5h)', fee: 2000 },
          { name: 'Logpom', etaFr: 'Lendemain matin', etaEn: 'Next-day morning', fee: 2500 },
          { name: 'Bonabéri', etaFr: 'Lendemain matin', etaEn: 'Next-day morning', fee: 2500 },
        ],
      },
      {
        name: 'Edéa',
        quarters: [
          { name: 'Centre Commercial', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3500 },
        ],
      },
    ],
  },
  {
    name: 'Centre',
    cities: [
      {
        name: 'Yaoundé',
        quarters: [
          { name: 'Bastos', etaFr: 'Même jour (3–5h)', etaEn: 'Same-day (3–5h)', fee: 2000 },
          { name: 'Nlongkak', etaFr: 'Même jour (3–5h)', etaEn: 'Same-day (3–5h)', fee: 2000 },
          { name: 'Poste Centrale', etaFr: 'Même jour (3–5h)', etaEn: 'Same-day (3–5h)', fee: 2000 },
          { name: 'Biyem-Assi', etaFr: 'Lendemain matin', etaEn: 'Next-day morning', fee: 2500 },
          { name: 'Mvan', etaFr: 'Lendemain matin', etaEn: 'Next-day morning', fee: 2500 },
          { name: 'Odza', etaFr: 'Lendemain après-midi', etaEn: 'Next-day afternoon', fee: 3000 },
        ],
      },
    ],
  },
  {
    name: 'Ouest',
    cities: [
      {
        name: 'Bafoussam',
        quarters: [
          { name: 'Tamdja', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3500 },
          { name: 'Djeleng', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3500 },
        ],
      },
    ],
  },
  {
    name: 'Sud-Ouest',
    cities: [
      {
        name: 'Buea',
        quarters: [
          { name: 'Molyko', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3000 },
          { name: 'GRA', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3000 },
        ],
      },
      {
        name: 'Limbe',
        quarters: [
          { name: 'Down Beach', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3000 },
        ],
      },
    ],
  },
  {
    name: 'Sud',
    cities: [
      {
        name: 'Kribi',
        quarters: [
          { name: 'Centre / Dombe', etaFr: '1–2 jours ouvrés', etaEn: '1–2 business days', fee: 3500 },
        ],
      },
    ],
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'LR-8492',
    createdAt: '2026-11-24T14:20:00Z',
    customer: {
      fullName: 'Amadou Mbarga',
      phone: '+237 693 71 25 25',
      region: 'Littoral',
      city: 'Douala',
      quarter: 'Bonapriso',
      landmark: 'Face Pharmacie des Fleurs, Rue Njo-Njo',
    },
    paymentMethod: 'mtn_momo',
    paymentPhone: '+237 677 41 28 90',
    paymentReference: 'MOMO-237-994182',
    paymentVerified: true,
    items: [
      {
        productId: 'fridge-ocean-130',
        variantId: '130l',
        variantLabel: '130 Litres · Inox',
        name: 'Réfrigérateur Combiné Ocean DDOS — 130 Litres Silver',
        brand: 'Ocean',
        image: IMAGES.fridge,
        unitPrice: 129900,
        warrantyMonths: 6,
        quantity: 1,
      },
    ],
    subtotal: 129900,
    deliveryFee: 1500,
    total: 131400,
    deliveryEta: 'Même jour (2–4h)',
    warrantySerial: 'LR-WRN-26-8492A',
    stageIndex: 2,
  },
];

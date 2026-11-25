import { Locale, Product } from '../types/store';

export type FaqTopic = 'battery' | 'compatibility' | 'usage' | 'warranty';

export interface ProductFaqItem {
  id: string;
  topic: FaqTopic;
  topicLabel: string;
  question: string;
  answer: string;
}

function findSpecValue(product: Product, keywords: string[]): string | null {
  for (const spec of product.specs) {
    const combined = `${spec.labelFr} ${spec.labelEn} ${spec.value}`.toLowerCase();
    if (keywords.some((kw) => combined.includes(kw))) {
      return spec.value;
    }
  }
  return null;
}

export function getProductFaqs(
  product: Product,
  locale: Locale
): ProductFaqItem[] {
  const isFr = locale === 'fr';
  const name = isFr ? product.nameFr : product.nameEn;
  const specSummary = product.specs
    .map((s) => `${isFr ? s.labelFr : s.labelEn}: ${s.value}`)
    .join(' · ');

  const batterySpec = findSpecValue(product, [
    'batterie',
    'battery',
    'autonomie',
    'mah',
    'wh',
    'solaire',
    'solar',
    'recharge',
  ]);
  const powerSpec = findSpecValue(product, [
    'puissance',
    'power',
    'watt',
    'w ',
    'tension',
    'voltage',
    'classe',
  ]);
  const connectSpec = findSpecValue(product, [
    'connect',
    'port',
    'hdmi',
    'usb',
    'bluetooth',
    'wifi',
    'sim',
    'réseau',
    'network',
    'compatib',
  ]);

  const isMobileTech =
    product.category === 'telephones-tablettes' ||
    product.category === 'electronique' ||
    product.category === 'informatique';

  const isAppliance =
    product.category === 'gros-electromenager' ||
    product.category === 'petit-electromenager';

  const textLower = `${product.nameFr} ${product.descriptionFr} ${specSummary}`.toLowerCase();
  const hasBatteryKeyword =
    Boolean(batterySpec) ||
    /batterie|mah|wh|powerbank|solaire|recharge|sans fil|wireless|earbuds|watch|smartphone|iphone|laptop/.test(
      textLower
    );

  // 1. Battery Life & Power
  const batteryFaq: ProductFaqItem = hasBatteryKeyword
    ? {
        id: `${product.id}-battery`,
        topic: 'battery',
        topicLabel: isFr ? 'Batterie & Autonomie' : 'Battery & Power',
        question: isFr
          ? `Quelle est l'autonomie et les options de recharge pour ${name} ?`
          : `What is the battery life and charging setup for ${name}?`,
        answer: isFr
          ? `${
              batterySpec
                ? `Ce modèle ${product.brand} intègre : ${batterySpec}. `
                : `Ce modèle ${product.brand} est optimisé pour offrir une autonomie fiable au quotidien en utilisation continue. `
            }Pour préserver la durée de vie de la batterie, utilisez un chargeur ou bloc secteur stable (220V–240V) et évitez les décharges complètes répétées.`
          : `${
              batterySpec
                ? `This ${product.brand} unit features: ${batterySpec}. `
                : `This ${product.brand} device is engineered for reliable daily runtime under normal load. `
            }To maximize battery longevity, charge with a regulated 220V–240V adapter and avoid frequent deep discharges.`,
      }
    : {
        id: `${product.id}-battery`,
        topic: 'battery',
        topicLabel: isFr ? 'Alimentation & Énergie' : 'Power & Efficiency',
        question: isFr
          ? `Quelle alimentation électrique est requise pour ${name} (secteur / onduleur) ?`
          : `What power supply does ${name} require, and does it work with inverters?`,
        answer: isFr
          ? `${
              powerSpec
                ? `Spécification énergétique : ${powerSpec}. `
                : `Cet équipement ${product.brand} fonctionne sur le réseau standard camerounais 220V–240V / 50Hz. `
            }${
              isAppliance
                ? 'Nous recommandons un régulateur de tension ou parasurtenseur adapté en cas de fluctuations électriques, ainsi qu’un onduleur/groupe dimensionné si vous utilisez une source de secours.'
                : 'Il est compatible avec les régulateurs de tension standards et les installations de secours domestiques.'
            }`
          : `${
              powerSpec
                ? `Power rating: ${powerSpec}. `
                : `This ${product.brand} unit runs on standard 220V–240V / 50Hz AC mains. `
            }${
              isAppliance
                ? 'We recommend pairing it with a surge protector or voltage stabilizer during grid fluctuations, or an appropriately rated inverter/generator.'
                : 'It works safely with standard surge protectors and home backup inverters.'
            }`,
      };

  // 2. Compatibility & Connectivity
  const compatibilityFaq: ProductFaqItem = {
    id: `${product.id}-compat`,
    topic: 'compatibility',
    topicLabel: isFr ? 'Compatibilité' : 'Compatibility',
    question: isFr
      ? `Avec quels appareils, réseaux ou accessoires ${name} est-il compatible ?`
      : `Which devices, accessories, or standards is ${name} compatible with?`,
    answer: isFr
      ? `${
          connectSpec
            ? `Connectique et compatibilité confirmées : ${connectSpec}. `
            : ''
        }${
          isMobileTech
            ? `Ce produit ${product.brand} (réf. ${product.sku}) est compatible avec les standards universels (cartes SIM camerounaises MTN/Orange le cas échéant, accessoires USB/HDMI/Bluetooth courants et prises secteur 220V).`
            : isAppliance
            ? `Conçu pour les installations domestiques et professionnelles au Cameroun (prises secteur standard 220V–240V). Les variantes disponibles (${product.variants
                .map((v) => v.labelFr)
                .join(', ')}) s'adaptent sans adaptateur spécial.`
            : `Cet article ${product.brand} (réf. ${product.sku}) respecte les standards courants d'usage quotidien et est compatible avec nos accessoires Lorena Market.`
        }`
      : `${
          connectSpec ? `Verified connectivity & compatibility: ${connectSpec}. ` : ''
        }${
          isMobileTech
            ? `This ${product.brand} device (${product.sku}) supports universal standards (Cameroon MTN/Orange networks where applicable, standard USB/HDMI/Bluetooth peripherals, and 220V power).`
            : isAppliance
            ? `Built for Cameroon residential and office setups (standard 220V–240V mains). Available configurations (${product.variants
                .map((v) => v.labelEn)
                .join(', ')}) work right out of the box.`
            : `This ${product.brand} item (${product.sku}) follows universal sizing/usage standards and pairs cleanly with standard accessories.`
        }`,
  };

  // 3. Usage, Setup & Maintenance
  const usageFaq: ProductFaqItem = {
    id: `${product.id}-usage`,
    topic: 'usage',
    topicLabel: isFr ? 'Utilisation & Entretien' : 'Usage & Care',
    question: isFr
      ? `Comment bien utiliser et entretenir ${name} au quotidien ?`
      : `What are the best practices for daily usage and maintenance of ${name}?`,
    answer: isFr
      ? `${product.descriptionFr} ${
          isAppliance
            ? 'Avant la première mise en marche, laissez l’appareil reposer à plat (en particulier pour les réfrigérateurs/congélateurs pendant 4h après transport) et nettoyez les surfaces avec un chiffon doux non abrasif.'
            : isMobileTech
            ? 'Lors de la première utilisation, vérifiez les mises à jour système et utilisez uniquement des câbles certifiés pour préserver les ports et performances.'
            : 'Suivez les instructions de la notice incluse et conservez l’article à l’abri de l’humidité excessive pour préserver ses performances d’origine.'
        }`
      : `${product.descriptionEn} ${
          isAppliance
            ? 'Before first startup, let cooling appliances settle upright for 4 hours after delivery, and wipe surfaces with a soft dry or lightly dampened cloth.'
            : isMobileTech
            ? 'On first setup, complete initial calibration/updates and use certified cables to protect ports and peak performance.'
            : 'Follow the included care guide and store in a dry, well-ventilated space for lasting durability.'
        }`,
  };

  // 4. Warranty & Return Policy
  const warrantyFaq: ProductFaqItem = {
    id: `${product.id}-warranty`,
    topic: 'warranty',
    topicLabel: isFr ? 'Garantie & SAV' : 'Warranty & Support',
    question: isFr
      ? `Quelle garantie et quel support après-vente couvrent ${name} ?`
      : `What warranty coverage and after-sales support apply to ${name}?`,
    answer: isFr
      ? `Cet article ${product.brand} bénéficie d'une garantie certifiée Lorena Market de ${product.warrantyMonths} mois (n° de série délivré sur votre facture PDF après achat) et d'un droit de retour sous 7 jours. Nos équipes SAV vous accueillent à Douala (Yassa / Akwa) et Yaoundé.`
      : `This ${product.brand} product includes a ${product.warrantyMonths}-month Lorena Market Certified Warranty (serial printed on your post-purchase PDF invoice) plus 7-day return coverage at our Douala (Yassa / Akwa) and Yaoundé service counters.`,
  };

  return [batteryFaq, compatibilityFaq, usageFaq, warrantyFaq];
}

export type Locale = 'fr' | 'en';

export type AppScreen =
  | 'home'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'invoice'
  | 'tracking'
  | 'wishlist'
  | 'account'
  | 'help'
  | 'compare';

export type CategorySlug =
  | 'all'
  | 'electronique'
  | 'fashion'
  | 'gros-electromenager'
  | 'sante-beaute'
  | 'maison-bureau'
  | 'telephones-tablettes'
  | 'petit-electromenager'
  | 'informatique'
  | 'bebe'
  | 'supermarche'
  | 'autres';

export type HomeSectionKey =
  | 'best_offers_new'
  | 'best_offers_clearance'
  | 'daily_selection'
  | 'kitchen'
  | 'cooling'
  | 'second_hand'
  | 'hightech'
  | 'beauty'
  | 'smart_tv'
  | 'freezers'
  | 'blenders'
  | 'top_discounts';

export interface ProductSpec {
  labelFr: string;
  labelEn: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  labelFr: string;
  labelEn: string;
  priceDelta: number;
}

export interface ProductSwatch {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  sku: string;
  brand: string;
  category: CategorySlug;
  subCategoryFr?: string;
  subCategoryEn?: string;
  sections: HomeSectionKey[];
  nameFr: string;
  nameEn: string;
  shortNoteFr: string;
  shortNoteEn: string;
  descriptionFr: string;
  descriptionEn: string;
  price: number;
  oldPrice?: number;
  discountPct?: number;
  badgeType?: 'new' | 'clearance' | 'second_hand';
  image: string;
  warrantyMonths: number;
  stockQty: number;
  swatches?: ProductSwatch[];
  variants: ProductVariant[];
  specs: ProductSpec[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  variantLabel: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  warrantyMonths: number;
  quantity: number;
}

export interface QuarterZone {
  name: string;
  etaFr: string;
  etaEn: string;
  fee: number;
}

export interface CityZone {
  name: string;
  quarters: QuarterZone[];
}

export interface RegionZone {
  name: string;
  cities: CityZone[];
}

export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'cod';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  region: string;
  city: string;
  quarter: string;
  landmark: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customer: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentPhone?: string;
  paymentReference: string;
  paymentVerified: boolean;
  items: CartItem[];
  subtotal: number;
  discountAmount?: number;
  deliveryFee: number;
  total: number;
  deliveryEta: string;
  warrantySerial: string;
  stageIndex: 0 | 1 | 2 | 3;
}

export interface UserSession {
  fullName: string;
  phone: string;
  email: string;
  provider: 'phone' | 'email' | 'google';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  model?: string;
  createdAt: string;
  error?: boolean;
}

export interface WaitlistEntry {
  productId: string;
  email: string;
  createdAt: string;
}

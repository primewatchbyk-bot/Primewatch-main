export type StockStatus = 'Available' | 'Limited Stock' | 'Sold Out';

export interface WatchProduct {
  id: string;
  code: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  categories: string[];
  strapMaterial: string;
  movementType: string;
  caseMaterial: string;
  colors: string[];
  stockStatus: StockStatus;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  packageContents: string[];
  photos: string[];
  orderIndex: number;
  createdAt: string;
}

export interface StoreSettings {
  whatsAppNumber: string;
  instagramHandle: string;
  tiktokHandle: string;
  facebookHandle: string;
  email: string;
  businessHours: string;
  location: string;
  currencySymbol: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;

  leatherCategoryImage: string;
rubberCategoryImage: string;
steelCategoryImage: string;
automaticCategoryImage: string;
dressCategoryImage: string;
sportsCategoryImage: string;
mensCategoryImage: string;
womensCategoryImage: string;
}

export type PageView = 'home' | 'collection' | 'new-arrivals' | 'best-sellers' | 'about' | 'contact' | 'privacy' | 'terms' | 'admin';

export interface FilterState {
  search: string;
  category: string;
  strapType: string;
  movementType: string;
  color: string;
  stockOnly: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

import { WatchProduct, StoreSettings } from '../types';
import { INITIAL_WATCHES, INITIAL_SETTINGS } from '../data/initialData';
import { supabase, WATCH_IMAGES_BUCKET } from './supabaseClient';

/* ---------------------------------------------------------------------- */
/* Pure utilities (unchanged from the localStorage version)               */
/* ---------------------------------------------------------------------- */

export function formatPrice(amount: number, currencySymbol = '₦'): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currencySymbol}${formatted}`;
}

export function buildWhatsAppLink(phone: string, productCode: string, productName: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = `Hello, I'm interested in Product [${productCode}] - ${productName}. Is it available?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildGeneralWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = message || "Hello Kayode, I saw your PrimeWatch catalog and I'd like to make an inquiry.";
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Compress an image file in-browser to a small JPEG Blob, ready to upload.
 */
export async function compressImageFile(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Failed to compress image'))),
          'image/jpeg',
          quality
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a compressed photo Blob to the `watch-images` Storage bucket and
 * return its public URL. This URL is what gets stored in a watch's `photos`
 * array - never the image data itself.
 */
export async function uploadProductPhoto(blob: Blob, productId = 'unfiled'): Promise<string> {
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(WATCH_IMAGES_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    throw new Error(`Photo upload failed: ${error.message}`);
  }
  const { data } = supabase.storage.from(WATCH_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Best-effort deletion of a photo from Storage given its public URL. Safe to
 * call on external (non-Supabase-hosted) URLs - it does nothing for those,
 * since only files this app actually put in Storage should ever be removed.
 */
export async function deleteProductPhoto(publicUrl: string): Promise<void> {
  try {
    const marker = `/storage/v1/object/public/${WATCH_IMAGES_BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return; // not a Storage URL from this bucket - nothing to delete
    const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
    await supabase.storage.from(WATCH_IMAGES_BUCKET).remove([path]);
  } catch (err) {
    console.warn('Could not delete photo from storage (non-fatal):', err);
  }
}

/* ---------------------------------------------------------------------- */
/* DB <-> app shape mapping (Postgres uses snake_case, the app uses        */
/* camelCase - this is the single place that translation happens)         */
/* ---------------------------------------------------------------------- */

type DbWatchRow = {
  id: number; // bigint identity column in Supabase - auto-generated, never written by the app
  code: string;
  name: string;
  brand: string;
  price: number;
  original_price: number | null;
  categories: string[];
  strap_material: string;
  movement_type: string;
  case_material: string;
  colors: string[];
  stock_status: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  short_description: string;
  full_description: string;
  features: string[];
  package_contents: string[];
  photos: string[];
  order_index: number;
  created_at: string;
};

// Shape used for inserts: identical to DbWatchRow but without `id`, since
// Supabase generates that value itself - the app must never supply one.
type DbWatchInsert = Omit<DbWatchRow, 'id'>;

/** Converts the app's string id (e.g. "42") to the numeric id Supabase expects. */
function toDbId(id: string): number {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    throw new Error(`Invalid watch id "${id}" - expected a numeric Supabase id.`);
  }
  return numericId;
}

// Note: `id` is intentionally absent here. The app's string `id` is a
// client-side concern (see fromDbWatch/toDbId below) and is never part of
// what gets written to the database - the human-readable identifier that
// belongs in the database is `code` (e.g. "PW-101"), not `id`.
const WATCH_KEY_MAP: Record<Exclude<keyof WatchProduct, 'id'>, keyof DbWatchInsert> = {
  code: 'code',
  name: 'name',
  brand: 'brand',
  price: 'price',
  originalPrice: 'original_price',
  categories: 'categories',
  strapMaterial: 'strap_material',
  movementType: 'movement_type',
  caseMaterial: 'case_material',
  colors: 'colors',
  stockStatus: 'stock_status',
  isNewArrival: 'is_new_arrival',
  isBestSeller: 'is_best_seller',
  isFeatured: 'is_featured',
  shortDescription: 'short_description',
  fullDescription: 'full_description',
  features: 'features',
  packageContents: 'package_contents',
  photos: 'photos',
  orderIndex: 'order_index',
  createdAt: 'created_at',
};

function fromDbWatch(row: DbWatchRow): WatchProduct {
  return {
    id: String(row.id), // numeric DB id -> app-facing string id, so every existing
    // component (React keys, DOM ids, Map-based diffing) keeps working unchanged
    code: row.code,
    name: row.name,
    brand: row.brand,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    categories: row.categories ?? [],
    strapMaterial: row.strap_material,
    movementType: row.movement_type,
    caseMaterial: row.case_material,
    colors: row.colors ?? [],
    stockStatus: row.stock_status as WatchProduct['stockStatus'],
    isNewArrival: row.is_new_arrival,
    isBestSeller: row.is_best_seller,
    isFeatured: row.is_featured,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    features: row.features ?? [],
    packageContents: row.package_contents ?? [],
    photos: row.photos ?? [],
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}

function toDbWatch(w: WatchProduct): DbWatchInsert {
  // `w.id` is deliberately not read here. For existing rows it's derived
  // from the real DB id and updates target it via `.eq()`, not by writing
  // it back; for a new row it's just a temporary client-side placeholder
  // that Supabase's generated `id` will replace after insert.
  return {
    code: w.code,
    name: w.name,
    brand: w.brand,
    price: w.price,
    original_price: w.originalPrice ?? null,
    categories: w.categories,
    strap_material: w.strapMaterial,
    movement_type: w.movementType,
    case_material: w.caseMaterial,
    colors: w.colors,
    stock_status: w.stockStatus,
    is_new_arrival: w.isNewArrival,
    is_best_seller: w.isBestSeller,
    is_featured: w.isFeatured,
    short_description: w.shortDescription,
    full_description: w.fullDescription,
    features: w.features,
    package_contents: w.packageContents,
    photos: w.photos,
    order_index: w.orderIndex,
    created_at: w.createdAt,
  };
}

/** Builds a DB-shaped partial containing only the keys present in `patch`. Never
 *  includes `id` - WATCH_KEY_MAP has no entry for it, so it's always skipped
 *  even if the caller's patch object happens to include one. */
function toDbWatchPatch(patch: Partial<WatchProduct>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  (Object.keys(patch) as (keyof WatchProduct)[]).forEach((key) => {
    if (key === 'id') return;
    const dbKey = WATCH_KEY_MAP[key as Exclude<keyof WatchProduct, 'id'>];
    if (dbKey) result[dbKey] = patch[key];
  });
  if ('originalPrice' in patch && patch.originalPrice === undefined) {
    result.original_price = null;
  }
  return result;
}

type DbSettingsRow = {
  whatsapp_number: string;
  instagram_handle: string;
  tiktok_handle: string;
  facebook_handle: string;
  email: string;
  business_hours: string;
  location: string;
  currency_symbol: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
};

function fromDbSettings(row: DbSettingsRow): StoreSettings {
  return {
    whatsAppNumber: row.whatsapp_number,
    instagramHandle: row.instagram_handle,
    tiktokHandle: row.tiktok_handle,
    facebookHandle: row.facebook_handle,
    email: row.email,
    businessHours: row.business_hours,
    location: row.location,
    currencySymbol: row.currency_symbol,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    heroImageUrl: row.hero_image_url,
  };
}

function toDbSettings(s: StoreSettings): DbSettingsRow {
  return {
    whatsapp_number: s.whatsAppNumber,
    instagram_handle: s.instagramHandle,
    tiktok_handle: s.tiktokHandle,
    facebook_handle: s.facebookHandle,
    email: s.email,
    business_hours: s.businessHours,
    location: s.location,
    currency_symbol: s.currencySymbol,
    hero_title: s.heroTitle,
    hero_subtitle: s.heroSubtitle,
    hero_image_url: s.heroImageUrl,
  };
}

/* ---------------------------------------------------------------------- */
/* Equality check used to diff old vs. new watch arrays before syncing to  */
/* Supabase. Deliberately field-by-field rather than JSON.stringify -     */
/* stringify compares serialized text, so two objects with identical      */
/* values but different key insertion order would wrongly register as     */
/* "changed" and trigger an unnecessary update call. This compares values */
/* directly instead, so key order never matters.                          */
/* ---------------------------------------------------------------------- */

function arraysEqual(a: string[] = [], b: string[] = []): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

export function areWatchesEqual(a: WatchProduct, b: WatchProduct): boolean {
  return (
    a.code === b.code &&
    a.name === b.name &&
    a.brand === b.brand &&
    a.price === b.price &&
    (a.originalPrice ?? null) === (b.originalPrice ?? null) &&
    arraysEqual(a.categories, b.categories) &&
    a.strapMaterial === b.strapMaterial &&
    a.movementType === b.movementType &&
    a.caseMaterial === b.caseMaterial &&
    arraysEqual(a.colors, b.colors) &&
    a.stockStatus === b.stockStatus &&
    a.isNewArrival === b.isNewArrival &&
    a.isBestSeller === b.isBestSeller &&
    a.isFeatured === b.isFeatured &&
    a.shortDescription === b.shortDescription &&
    a.fullDescription === b.fullDescription &&
    arraysEqual(a.features, b.features) &&
    arraysEqual(a.packageContents, b.packageContents) &&
    arraysEqual(a.photos, b.photos) &&
    a.orderIndex === b.orderIndex
    // `id` is already the map key used to pair a with b, and `createdAt` is
    // set once at insert time and never meant to change - both deliberately
    // excluded rather than overlooked.
  );
}

/* ---------------------------------------------------------------------- */
/* Watches - granular CRUD against Supabase                               */
/* ---------------------------------------------------------------------- */

export async function fetchWatches(): Promise<WatchProduct[]> {
  const { data, error } = await supabase.from('watches').select('*').order('order_index', { ascending: true });
  if (error) {
    console.error('Error fetching watches from Supabase:', error);
    throw new Error(`Could not load products: ${error.message}`);
  }
  // No auto-seeding here. This runs on every storefront page load for every
  // visitor, authenticated or not - and RLS correctly forbids anonymous
  // writes, so attempting to seed here caused the "new row violates row-level
  // security policy" error for public visitors. An empty table now just
  // means an empty catalog; sample data can be (re)loaded on demand via the
  // existing "Reset Catalog" button in Admin -> Settings, which only ever
  // runs after an authenticated login.
  return ((data ?? []) as DbWatchRow[]).map(fromDbWatch);
}

export async function insertWatch(watch: WatchProduct): Promise<WatchProduct> {
  const { data, error } = await supabase.from('watches').insert(toDbWatch(watch)).select().single();
  if (error) throw new Error(`Could not save new watch: ${error.message}`);
  return fromDbWatch(data as DbWatchRow);
}

export async function updateWatch(id: string, patch: Partial<WatchProduct>): Promise<WatchProduct> {
  const { data, error } = await supabase.from('watches').update(toDbWatchPatch(patch)).eq('id', toDbId(id)).select().single();
  if (error) throw new Error(`Could not update watch: ${error.message}`);
  return fromDbWatch(data as DbWatchRow);
}

export async function deleteWatch(id: string): Promise<void> {
  const dbId = toDbId(id);
  const { data: existing } = await supabase.from('watches').select('photos').eq('id', dbId).single();
  const { error } = await supabase.from('watches').delete().eq('id', dbId);
  if (error) throw new Error(`Could not delete watch: ${error.message}`);
  if (existing?.photos?.length) {
    await Promise.all((existing.photos as string[]).map((url) => deleteProductPhoto(url)));
  }
}

/** Inserts multiple watches and returns the rows Supabase actually created
 *  (real generated ids included) - never the input array, since the ids on
 *  that input are just client-side placeholders. */
export async function bulkInsertWatches(watches: WatchProduct[]): Promise<WatchProduct[]> {
  if (watches.length === 0) return [];
  const { data, error } = await supabase.from('watches').insert(watches.map(toDbWatch)).select();
  if (error) throw new Error(`Could not seed catalog: ${error.message}`);
  return ((data as DbWatchRow[]) || []).map(fromDbWatch);
}

/* ---------------------------------------------------------------------- */
/* Settings                                                                */
/* ---------------------------------------------------------------------- */

export async function loadSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
  if (error || !data) {
    console.error('Error loading settings from Supabase:', error);
    return INITIAL_SETTINGS;
  }
  return fromDbSettings(data as DbSettingsRow);
}

export async function saveSettings(settings: StoreSettings): Promise<boolean> {
  const { error } = await supabase.from('store_settings').update(toDbSettings(settings)).eq('id', 1);
  if (error) {
    console.error('Error saving settings to Supabase:', error);
    return false;
  }
  return true;
}

/* ---------------------------------------------------------------------- */
/* Reset to sample data (existing admin "Reset Catalog" feature)          */
/* ---------------------------------------------------------------------- */

export async function resetToDefaults(): Promise<{ settings: StoreSettings; watches: WatchProduct[] }> {
  const { data: existing } = await supabase.from('watches').select('id, photos');
  if (existing && existing.length > 0) {
    await Promise.all(
      (existing as { id: number; photos: string[] }[]).flatMap((w) => (w.photos || []).map((url) => deleteProductPhoto(url)))
    );
    await supabase.from('watches').delete().not('id', 'is', null);
  }
  const insertedWatches = await bulkInsertWatches(INITIAL_WATCHES);
  await supabase.from('store_settings').update(toDbSettings(INITIAL_SETTINGS)).eq('id', 1);
  return { settings: INITIAL_SETTINGS, watches: insertedWatches };
}

import { WatchProduct, StoreSettings } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  whatsAppNumber: '2348123456789',
  instagramHandle: 'primewatch_by_kayode',
  tiktokHandle: 'primewatch_kayode',
  facebookHandle: 'primewatchbykayode',
  email: 'kayode@primewatch.com',
  businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM',
  location: 'Lekki Phase 1, Lagos, Nigeria',
  currencySymbol: '₦',
  heroTitle: 'Timeless Elegance, Handcrafted Precision.',
  heroSubtitle: 'Curated luxury and premium timepieces for the modern individual. Browse our exclusive collection and order directly on WhatsApp.',
  heroImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',

  leatherCategoryImage: '',
  rubberCategoryImage: '',
  steelCategoryImage: '',
  automaticCategoryImage: '',
  dressCategoryImage: '',
  sportsCategoryImage: '',
  mensCategoryImage: '',
  womensCategoryImage: '',
};

export const INITIAL_WATCHES: WatchProduct[] = [
  {
    id: 'pw-101',
    code: 'PW-101',
    name: 'Royal Chronograph Gold Emerald',
    brand: 'PrimeWatch Heritage',
    price: 245000,
    originalPrice: 280000,
    categories: ['Leather Strap Watches', 'Automatic Watches', 'Dress Watches', "Men's Collection"],
    strapMaterial: 'Genuine Italian Calf Leather',
    movementType: 'Automatic Self-Winding',
    caseMaterial: '18K Gold Plated 316L Stainless Steel',
    colors: ['Emerald Green', 'Gold', 'Dark Brown'],
    stockStatus: 'Available',
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    shortDescription: 'A majestic gold chronograph featuring a rich sunburst emerald green dial and genuine leather strap.',
    fullDescription: 'The Royal Chronograph Gold Emerald embodies the pinnacle of classic luxury. Designed with a high-grade 18K gold-plated stainless steel casing and an exquisite emerald green dial, this timepiece commands attention in every setting. Powered by an ultra-precise automatic mechanical movement, it offers seamless chronograph sub-dials and luminous markers.',
    features: [
      'Exquisite Emerald Green Dial with Sunburst Finish',
      '18K Gold Electroplated 316L Stainless Steel Case',
      'Scratch-Resistant Sapphire Crystal Glass',
      'Automatic Mechanical Self-Winding Movement (42h Power Reserve)',
      'Water Resistant up to 5 ATM (50 Meters)',
      'Hand-stitched Italian Leather Strap with Quick-Release Clasp'
    ],
    packageContents: [
      'PrimeWatch Signature Velvet Luxury Box',
      'Authenticity Guarantee Card',
      'Microfiber Cleaning Cloth',
      'International 1-Year Warranty Booklet'
    ],
    photos: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 1,
    createdAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'pw-102',
    code: 'PW-102',
    name: 'Nautilus Ocean Diver Professional',
    brand: 'Geneva Marine',
    price: 195000,
    categories: ['Rubber Strap Watches', 'Sports Watches', 'Automatic Watches', "Men's Collection"],
    strapMaterial: 'High-Density Fluororubber Strap',
    movementType: 'Automatic Mechanical Caliber',
    caseMaterial: 'Brushed 316L Surgical Stainless Steel',
    colors: ['Midnight Navy', 'Silver', 'Ocean Blue'],
    stockStatus: 'Available',
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    shortDescription: 'Built for extreme adventure and effortless daily wear with 200m water resistance and fluororubber strap.',
    fullDescription: 'Crafted for modern explorers, the Nautilus Ocean Diver combines rugged performance with sleek refined aesthetics. Featuring a unidirectional ceramic rotating bezel, Super-LumiNova indexes for dark environment visibility, and a supple fluororubber strap that withstands moisture, heat, and active lifestyles.',
    features: [
      'Unidirectional 120-Click Ceramic Rotating Bezel',
      '20 ATM (200m) Deep Ocean Water Resistance',
      'Japanese Automatic Movement with Hack Function',
      'Swiss Super-LumiNova Hands & Hour Markers',
      'Flexible Anti-Dust Vulcanized Fluororubber Strap'
    ],
    packageContents: [
      'PrimeWatch Heavy-Duty Travel Storage Case',
      'Authenticity & Pressure Test Certificate',
      'Strap Adjustment Tool',
      '1-Year Warranty Card'
    ],
    photos: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 2,
    createdAt: '2026-07-05T12:30:00.000Z'
  },
  {
    id: 'pw-103',
    code: 'PW-103',
    name: 'Presidential Silver Jubilee Classic',
    brand: 'PrimeWatch Signature',
    price: 320000,
    originalPrice: 350000,
    categories: ['Steel Watches', 'Dress Watches', 'Automatic Watches', "Men's Collection"],
    strapMaterial: '316L Jubilee Stainless Steel Bracelet',
    movementType: 'Swiss Precision Automatic Movement',
    caseMaterial: 'Solid 316L Stainless Steel with Fluted Bezel',
    colors: ['Silver', 'Ice Blue', 'Champagne Gold'],
    stockStatus: 'Limited Stock',
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    shortDescription: 'An iconic executive timepiece with a fluted bezel, cyclops date window, and Jubilee link bracelet.',
    fullDescription: 'The Presidential Silver Jubilee Classic is the ultimate statement of prestige and achievement. Featuring an iconic fluted bezel, a crisp ice-blue sunray dial with a magnified date window, and a fluid five-link Jubilee bracelet that wraps smoothly around the wrist.',
    features: [
      'Iconic Fluted Bezel in High-Polish Steel',
      'Magnified Cyclops Date Window at 3 o’clock',
      'High Precision Swiss-Grade Mechanical Movement',
      'Folding Oysterclasp with Easylink extension',
      'Scratchproof Sapphire Crystal with Anti-Reflective Coating'
    ],
    packageContents: [
      'PrimeWatch Wooden Piano-Finish Presentation Box',
      'Gold Embossed Certificate of Authenticity',
      'Extra Bracelet Links',
      '2-Year Premium Care Warranty'
    ],
    photos: [
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 3,
    createdAt: '2026-06-15T08:00:00.000Z'
  },
  {
    id: 'pw-104',
    code: 'PW-104',
    name: 'Symphony Rose Pearl Elegance',
    brand: 'Geneva Femme',
    price: 175000,
    categories: ['Steel Watches', 'Dress Watches', "Women's Collection"],
    strapMaterial: 'Rose Gold & Steel Mesh Mesh Bracelet',
    movementType: 'Swiss Quartz Movement',
    caseMaterial: 'Rose Gold PVD Coated Stainless Steel',
    colors: ['Rose Gold', 'Mother of Pearl', 'White'],
    stockStatus: 'Available',
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    shortDescription: 'Delicate women’s watch featuring a natural Mother of Pearl dial accented with sparkling crystal hour markers.',
    fullDescription: 'Designed specifically for women who appreciate understated luxury, the Symphony Rose Pearl Elegance combines a shimmering natural Mother of Pearl dial with a refined rose gold mesh strap. Light and comfortable for all-day elegance.',
    features: [
      'Genuine Natural Mother of Pearl Dial',
      'Hand-Set Austrian Crystal Hour Markers',
      'Ultra-Slim 7mm Case Profile',
      'Magnetic Adjustable Mesh Strap',
      '3 ATM Splash & Rain Water Resistance'
    ],
    packageContents: [
      'PrimeWatch Soft Rose Leatherette Gift Box',
      'Authenticity Card',
      'Sizing & Care Guide'
    ],
    photos: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 4,
    createdAt: '2026-07-10T15:00:00.000Z'
  },
  {
    id: 'pw-105',
    code: 'PW-105',
    name: 'Monaco Vintage Roadster Chrono',
    brand: 'Heritage Motors',
    price: 210000,
    categories: ['Leather Strap Watches', 'Sports Watches', "Men's Collection"],
    strapMaterial: 'Perforated Racing Leather Strap',
    movementType: 'Precision Seiko Mecha-Quartz',
    caseMaterial: '316L Stainless Steel with Matte Finish',
    colors: ['Cognac Tan', 'Matte Black', 'Silver'],
    stockStatus: 'Available',
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
    shortDescription: 'Classic 1970s vintage racing chronograph with dual sub-dials and perforated breathable leather strap.',
    fullDescription: 'Inspired by classic grand prix racing, the Monaco Vintage Roadster features a distinct dual-register panda dial and a perforated GT leather strap. The hybrid mecha-quartz movement delivers the crisp sweep of a mechanical chronograph with quartz reliability.',
    features: [
      'Panda Dual Sub-Dial Racing Chronograph Layout',
      'Tachymeter Scale Bezel for Speed Measurement',
      'Breathable Perforated Genuine Calfskin Leather',
      'Mecha-Quartz Instant Zero-Reset Pushers',
      'Hardlex Crystal Glass'
    ],
    packageContents: [
      'PrimeWatch Vintage Leather Travel Pouch',
      'Authenticity Card',
      'User Manual'
    ],
    photos: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 5,
    createdAt: '2026-06-20T11:00:00.000Z'
  },
  {
    id: 'pw-106',
    code: 'PW-106',
    name: 'AeroMaster Tactical Pilot Blackout',
    brand: 'PrimeWatch Tactical',
    price: 165000,
    categories: ['Rubber Strap Watches', 'Sports Watches', "Men's Collection"],
    strapMaterial: 'Military-Grade Tactical Rubber',
    movementType: 'High Torque Quartz',
    caseMaterial: 'Matte Black PVD Coated Alloy',
    colors: ['Stealth Black', 'Charcoal Grey'],
    stockStatus: 'Available',
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    shortDescription: 'Stealth blackout pilot watch with high-contrast luminescent hands and rugged military rubber strap.',
    fullDescription: 'Designed for tactical precision, the AeroMaster Stealth Blackout offers optimal legibility with its bold dial indices and high-contrast night glow. Built to take tough daily impacts without losing a second.',
    features: [
      'Matte Non-Reflective Stealth PVD Coating',
      'Dual Time Zone & Date Display',
      'Impact Resistant Shock Absorption Structure',
      '10 ATM Water Resistance',
      'Heavy-Duty Tactical Buckle'
    ],
    packageContents: [
      'PrimeWatch Tactical Hard Case',
      'Warranty Card',
      'Cleaning Cloth'
    ],
    photos: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 6,
    createdAt: '2026-07-12T09:15:00.000Z'
  },
  {
    id: 'pw-107',
    code: 'PW-107',
    name: 'Celestial Skeleton Open-Heart Gold',
    brand: 'PrimeWatch Signature',
    price: 295000,
    categories: ['Steel Watches', 'Automatic Watches', 'Dress Watches', "Men's Collection"],
    strapMaterial: 'Integrated Two-Tone Stainless Steel Bracelet',
    movementType: 'Automatic Skeleton Mechanical Movement',
    caseMaterial: 'Polished Stainless Steel & 18K Gold Accent',
    colors: ['Two-Tone Gold & Steel', 'Silver'],
    stockStatus: 'Limited Stock',
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    shortDescription: 'Captivating open-heart skeleton watch revealing the intricate gears and heartbeat of automatic mechanical precision.',
    fullDescription: 'Marvel at the art of horology with the Celestial Skeleton. Both front sapphire glass and exhibition caseback reveal the spinning rotor and balance wheel in motion. An extraordinary conversation starter for connoisseurs.',
    features: [
      'Full Front & Back Exhibition Sapphire Windows',
      'Detailed Skeletonized Gear Work with Jewels',
      'No Battery Required - Powered by Wrist Movement',
      'Dual Tone Gold & Silver Brushed Bracelet',
      'Butterfly Deployment Clasp'
    ],
    packageContents: [
      'PrimeWatch Luxury Wood Presentation Box',
      'Authenticity Certificate',
      'Instruction Guide'
    ],
    photos: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 7,
    createdAt: '2026-06-01T14:00:00.000Z'
  },
  {
    id: 'pw-108',
    code: 'PW-108',
    name: 'Chrono Minimalist Sapphire Minimal',
    brand: 'Geneva Elite',
    price: 140000,
    categories: ['Leather Strap Watches', 'Dress Watches', "Women's Collection", "Men's Collection"],
    strapMaterial: 'Supple Tan Nappa Leather',
    movementType: 'Japanese Quartz Caliber',
    caseMaterial: 'Ultra-Thin Brushed Stainless Steel',
    colors: ['Minimalist White', 'Tan', 'Silver'],
    stockStatus: 'Sold Out',
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
    shortDescription: 'Clean minimalist dress watch with ultra-slim profile and butter-soft Nappa leather strap.',
    fullDescription: 'Understated elegance at its finest. The Chrono Minimalist eliminates dial clutter in favor of clean crisp stick markers and an ultra-thin 6mm case that slides effortlessly under suit cuffs.',
    features: [
      'Ultra-Thin 6mm Lightweight Case',
      'Scratchproof Sapphire Crystal',
      'Supple Nappa Leather Strap with Quick Release',
      'Battery Life up to 3 Years'
    ],
    packageContents: [
      'PrimeWatch Slim Gift Box',
      'Warranty Card'
    ],
    photos: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop'
    ],
    orderIndex: 8,
    createdAt: '2026-05-20T10:00:00.000Z'
  }
];

export const ALL_CATEGORIES = [
  'Leather Strap Watches',
  'Rubber Strap Watches',
  'Steel Watches',
  'Automatic Watches',
  'Dress Watches',
  'Sports Watches',
  "Men's Collection",
  "Women's Collection"
];

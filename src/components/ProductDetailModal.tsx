import React, { useState } from 'react';
import { WatchProduct, StoreSettings } from '../types';
import { formatPrice, buildWhatsAppLink } from '../lib/storage';
import { 
  X, MessageCircle, Check, Sparkles, Flame, ShieldCheck, 
  Share2, Maximize2, Layers, Cpu, Watch, Palette, Truck, PackageCheck 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: WatchProduct | null;
  settings: StoreSettings;
  allProducts: WatchProduct[];
  onClose: () => void;
  onSelectProduct: (product: WatchProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  allProducts,
  onClose,
  onSelectProduct,
}) => {
  if (!product) return null;

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const photos = product.photos && product.photos.length > 0
    ? product.photos
    : ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop'];

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsAppNumber,
    product.code,
    product.name
  );

  const isSoldOut = product.stockStatus === 'Sold Out';
  const isLimited = product.stockStatus === 'Limited Stock';

  // Related products from same main category excluding current product
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.categories.some(cat => product.categories.includes(cat)))
    .slice(0, 3);

  const handleCopyShare = () => {
    const text = `Check out the ${product.name} (${product.code}) on PrimeWatch by Kayode: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        className="bg-[#FAF6EE] text-[#2B2A26] rounded-3xl border border-[#E8E2D5] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative my-auto"
        onClick={(e) => e.stopPropagation()}
        id="product-detail-modal-container"
      >
        {/* Sticky Close Header */}
        <div className="sticky top-0 right-0 z-20 flex items-center justify-between p-4 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8E2D5]">
          <div className="flex items-center gap-2">
            <span className="bg-[#5C6B3A] text-white font-mono text-xs font-semibold px-2.5 py-1 rounded-md">
              {product.code}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#615E57] font-semibold">
              {product.brand}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-full hover:bg-[#E8E2D5] text-[#2B2A26] transition-colors"
              title="Share Watch Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#2B2A26] text-white hover:bg-[#5C6B3A] transition-colors"
              aria-label="Close modal"
              id="close-product-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Photo Gallery */}
            <div className="space-y-3">
              {/* Main Photo with Fullscreen Zoom Icon */}
              <div className="relative aspect-4/5 rounded-2xl bg-white border border-[#E8E2D5] overflow-hidden group shadow-xs">
                <img
                  src={photos[activePhotoIndex]}
                  alt={`${product.name} view ${activePhotoIndex + 1}`}
                  className="w-full h-full object-cover object-center cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />

                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-3 right-3 p-2.5 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-black transition-colors"
                  title="Full Screen Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                  {product.isNewArrival && (
                    <span className="inline-flex items-center gap-1 bg-[#5C6B3A] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      New Arrival
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="inline-flex items-center gap-1 bg-[#B8952E] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                      <Flame className="w-3.5 h-3.5" />
                      Best Seller
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails row */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                        activePhotoIndex === idx 
                          ? 'border-[#5C6B3A] ring-2 ring-[#5C6B3A]/30 scale-105' 
                          : 'border-[#E8E2D5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Order Action */}
            <div className="space-y-6">
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#5C6B3A] uppercase tracking-widest">
                    {product.brand}
                  </span>
                  <span className="text-xs text-[#8C887F]">•</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isSoldOut ? 'bg-gray-200 text-gray-700' : isLimited ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {product.stockStatus}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A26] leading-tight mb-2">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 my-3">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2B2A26]">
                    {formatPrice(product.price, settings.currencySymbol)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#8C887F] line-through font-medium">
                      {formatPrice(product.originalPrice, settings.currencySymbol)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#615E57] leading-relaxed">
                  {product.fullDescription || product.shortDescription}
                </p>
              </div>

              {/* Specifications Card */}
              <div className="bg-white rounded-2xl p-4 border border-[#E8E2D5] space-y-3 text-xs">
                <h3 className="font-serif text-sm font-bold text-[#2B2A26] border-b border-[#E8E2D5] pb-2 flex items-center gap-2">
                  <Watch className="w-4 h-4 text-[#5C6B3A]" />
                  Watch Specifications
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#8C887F] block text-[10px] uppercase font-semibold">Movement</span>
                      <span className="font-medium text-[#2B2A26]">{product.movementType}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#8C887F] block text-[10px] uppercase font-semibold">Strap Material</span>
                      <span className="font-medium text-[#2B2A26]">{product.strapMaterial}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Watch className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#8C887F] block text-[10px] uppercase font-semibold">Case Material</span>
                      <span className="font-medium text-[#2B2A26]">{product.caseMaterial}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Palette className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#8C887F] block text-[10px] uppercase font-semibold">Available Colors</span>
                      <span className="font-medium text-[#2B2A26]">
                        {product.colors.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-serif text-sm font-bold text-[#2B2A26] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5C6B3A]" />
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#615E57]">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-[#E8E2D5]/60">
                        <Check className="w-3.5 h-3.5 text-[#5C6B3A] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Included */}
              {product.packageContents && product.packageContents.length > 0 && (
                <div className="space-y-1.5 text-xs text-[#615E57]">
                  <span className="font-bold text-[#2B2A26] flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#B8952E]" />
                    What’s Included in Box:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.packageContents.map((item, idx) => (
                      <span key={idx} className="bg-white border border-[#E8E2D5] px-2.5 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Order on WhatsApp Primary CTA */}
              <div className="pt-3 space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    isSoldOut
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none'
                      : 'bg-[#25D366] text-white hover:bg-[#20ba5a] active:scale-[0.99]'
                  }`}
                  id="modal-order-whatsapp-btn"
                >
                  <MessageCircle className="w-6 h-6 fill-white text-transparent" />
                  <span>{isSoldOut ? 'Currently Sold Out' : 'Order on WhatsApp Now'}</span>
                </a>

                <div className="flex items-center justify-center gap-4 text-xs text-[#8C887F] pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5C6B3A]" />
                    100% Authentic
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#5C6B3A]" />
                    Nationwide Delivery
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#E8E2D5]">
              <h3 className="font-serif text-lg font-bold text-[#2B2A26] mb-4">
                Similar Timepieces You Might Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setActivePhotoIndex(0);
                    }}
                    className="bg-white rounded-xl p-3 border border-[#E8E2D5] flex items-center gap-3 cursor-pointer hover:border-[#5C6B3A] transition-all"
                  >
                    <img
                      src={rel.photos[0]}
                      alt={rel.name}
                      className="w-16 h-16 object-cover rounded-lg bg-[#FAF6EE]"
                    />
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-[#5C6B3A]">
                        {rel.code}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-[#2B2A26] line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="font-serif text-xs font-semibold text-[#B8952E] mt-0.5">
                        {formatPrice(rel.price, settings.currencySymbol)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/20 text-white rounded-full hover:bg-white/40"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={photos[activePhotoIndex]}
            alt="Full size watch preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}

    </div>
  );
};

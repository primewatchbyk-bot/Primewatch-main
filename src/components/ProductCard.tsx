import React from 'react';
import { WatchProduct, StoreSettings } from '../types';
import { formatPrice, buildWhatsAppLink } from '../lib/storage';
import { MessageCircle, Sparkles, Flame, Eye } from 'lucide-react';

interface ProductCardProps {
  product: WatchProduct;
  settings: StoreSettings;
  onSelectProduct: (product: WatchProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onSelectProduct,
}) => {
  const whatsappUrl = buildWhatsAppLink(
    settings.whatsAppNumber,
    product.code,
    product.name
  );

  const mainPhoto = product.photos && product.photos.length > 0 
    ? product.photos[0] 
    : 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop';

  const isSoldOut = product.stockStatus === 'Sold Out';
  const isLimited = product.stockStatus === 'Limited Stock';

  return (
    <div 
      className="group bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
      id={`product-card-${product.id}`}
    >
      {/* Top Image Container */}
      <div 
        className="relative aspect-4/5 bg-[#FAF6EE] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={mainPhoto}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isSoldOut ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Badges Stack */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start z-10">
          {product.isNewArrival && (
            <span className="inline-flex items-center gap-1 bg-[#5C6B3A] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 text-[#FAF6EE]" />
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-[#B8952E] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              <Flame className="w-3 h-3 text-white" />
              Best Seller
            </span>
          )}
        </div>

        {/* Stock Status Pill top-right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isSoldOut ? (
            <span className="bg-[#2B2A26]/85 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
              Sold Out
            </span>
          ) : isLimited ? (
            <span className="bg-amber-600/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs animate-pulse">
              Limited Stock
            </span>
          ) : null}
        </div>

        {/* Quick View overlay button on hover (desktop) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none md:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="bg-white/90 hover:bg-white text-[#2B2A26] px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Watch Details</span>
          </button>
        </div>

        {/* Product Code Badge bottom right */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[#2B2A26] text-[10px] font-mono px-2 py-0.5 rounded border border-[#E8E2D5] font-semibold">
          {product.code}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category pill */}
          <div className="flex items-center justify-between text-[11px] text-[#615E57] mb-1">
            <span className="font-semibold uppercase tracking-wider text-[#5C6B3A] truncate max-w-[120px]">
              {product.brand}
            </span>
            <span className="truncate max-w-[100px] text-[#8C887F]">
              {product.movementType.split(' ')[0]}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-serif text-sm sm:text-base font-bold text-[#2B2A26] hover:text-[#5C6B3A] transition-colors cursor-pointer line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#615E57] line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Call-to-Action Footer */}
        <div className="pt-2 border-t border-[#E8E2D5]/70">
          <div className="flex items-baseline justify-between mb-2.5">
            <div>
              <span className="font-serif text-base sm:text-lg font-bold text-[#2B2A26]">
                {formatPrice(product.price, settings.currencySymbol)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#8C887F] line-through ml-2">
                  {formatPrice(product.originalPrice, settings.currencySymbol)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#615E57] font-medium">
              {product.strapMaterial.split(' ')[0]} Strap
            </span>
          </div>

          {/* WhatsApp Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isSoldOut
                ? 'bg-[#E8E2D5] text-[#8C887F] cursor-not-allowed pointer-events-none'
                : 'bg-[#25D366] text-white hover:bg-[#20ba5a] active:scale-[0.98]'
            }`}
            id={`whatsapp-btn-${product.id}`}
          >
            <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
            <span>{isSoldOut ? 'Sold Out - Inquire' : 'Order on WhatsApp'}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

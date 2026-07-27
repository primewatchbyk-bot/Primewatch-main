import React, { useState, useMemo } from 'react';
import { WatchProduct, StoreSettings, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FilterDrawer } from '../components/FilterDrawer';
import { ALL_CATEGORIES } from '../data/initialData';
import { SlidersHorizontal, ArrowUpDown, Search, RotateCcw, PackageX } from 'lucide-react';

interface CollectionViewProps {
  watches: WatchProduct[];
  settings: StoreSettings;
  initialCategory?: string;
  presetFilterType?: 'new-arrivals' | 'best-sellers';
  onSelectProduct: (product: WatchProduct) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  watches,
  settings,
  initialCategory = '',
  presetFilterType,
  onSelectProduct,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    category: initialCategory,
    strapType: '',
    movementType: '',
    color: '',
    stockOnly: false,
    minPrice: null,
    maxPrice: null,
    sortBy: 'featured',
  });

  const handleResetFilters = () => {
    setFilter({
      search: '',
      category: '',
      strapType: '',
      movementType: '',
      color: '',
      stockOnly: false,
      minPrice: null,
      maxPrice: null,
      sortBy: 'featured',
    });
  };

  // Filter & Sort Logic
  const filteredWatches = useMemo(() => {
    return watches.filter((w) => {
      // Preset filters from top nav (New Arrivals / Best Sellers)
      if (presetFilterType === 'new-arrivals' && !w.isNewArrival) return false;
      if (presetFilterType === 'best-sellers' && !w.isBestSeller) return false;

      // Text search: matches name, code, brand, or categories
      if (filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        const matchName = w.name.toLowerCase().includes(q);
        const matchCode = w.code.toLowerCase().includes(q);
        const matchBrand = w.brand.toLowerCase().includes(q);
        const matchCat = w.categories.some(c => c.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchBrand && !matchCat) return false;
      }

      // Category filter
      if (filter.category && !w.categories.includes(filter.category)) {
        return false;
      }

      // Strap Material
      if (filter.strapType && !w.strapMaterial.toLowerCase().includes(filter.strapType.toLowerCase())) {
        return false;
      }

      // Movement Type
      if (filter.movementType && !w.movementType.toLowerCase().includes(filter.movementType.toLowerCase())) {
        return false;
      }

      // Color filter
      if (filter.color && !w.colors.some(c => c.toLowerCase().includes(filter.color.toLowerCase()))) {
        return false;
      }

      // In stock only
      if (filter.stockOnly && w.stockStatus === 'Sold Out') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-asc') return a.price - b.price;
      if (filter.sortBy === 'price-desc') return b.price - a.price;
      if (filter.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      
      // Default: Featured / Manual Order Index
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });
  }, [watches, filter, presetFilterType]);

  const pageTitle = presetFilterType === 'new-arrivals'
    ? 'New Arrivals Collection'
    : presetFilterType === 'best-sellers'
    ? 'Best Sellers Collection'
    : filter.category
    ? `${filter.category}`
    : 'All Timepieces Catalog';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="mb-8 border-b border-[#E8E2D5] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5C6B3A] block mb-1">
              PrimeWatch by Kayode • Browsable Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2A26]">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#615E57] mt-1">
              Showing {filteredWatches.length} of {watches.length} available timepieces
            </p>
          </div>

          {/* Quick Category Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setFilter({ ...filter, category: '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                !filter.category
                  ? 'bg-[#5C6B3A] text-white shadow-xs'
                  : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
              }`}
            >
              All Watches
            </button>
            {ALL_CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter({ ...filter, category: cat })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  filter.category === cat
                    ? 'bg-[#5C6B3A] text-white shadow-xs'
                    : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filter Component */}
        <FilterDrawer
          filter={filter}
          onChangeFilter={setFilter}
          onReset={handleResetFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
          totalResults={filteredWatches.length}
        />

        {/* Catalog Main Panel */}
        <div className="flex-1 w-full">
          
          {/* Top Control Bar: Mobile Filter Toggle + Sort Dropdown */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D5] mb-6 flex items-center justify-between gap-3 shadow-xs">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-[#FAF6EE] text-[#2B2A26] border border-[#E8E2D5] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#E8E2D5]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#5C6B3A]" />
              <span>Filters</span>
              {(filter.category || filter.search || filter.strapType || filter.movementType) && (
                <span className="w-2 h-2 rounded-full bg-[#B8952E]" />
              )}
            </button>

            {/* Active search query feedback */}
            {filter.search && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#615E57]">
                <span>Results for "<strong className="text-[#2B2A26]">{filter.search}</strong>"</span>
              </div>
            )}

            {/* Sort Selector */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-4 h-4 text-[#8C887F]" />
              <span className="text-xs text-[#615E57] hidden sm:inline font-medium">Sort by:</span>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                className="bg-[#FAF6EE] border border-[#E8E2D5] text-[#2B2A26] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#5C6B3A]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

          </div>

          {/* Product Grid (2 columns on mobile, 3 columns on desktop) */}
          {filteredWatches.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredWatches.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  settings={settings}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D5] space-y-4 max-w-md mx-auto my-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EE] text-[#8C887F] flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8 text-[#B8952E]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B2A26]">
                No Timepieces Found
              </h3>
              <p className="text-xs text-[#615E57] leading-relaxed">
                We couldn't find any watches matching your current filters or search terms. Try clearing some criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-[#5C6B3A] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#47542B] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

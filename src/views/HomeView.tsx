import React from 'react';
import { WatchProduct, StoreSettings, PageView } from '../types';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ALL_CATEGORIES } from '../data/initialData';
import { ArrowRight, Sparkles, Flame, MessageCircle, Layers } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../lib/storage';

interface HomeViewProps {
  watches: WatchProduct[];
  settings: StoreSettings;
  onNavigate: (view: PageView, filterCategory?: string) => void;
  onSelectProduct: (product: WatchProduct) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  watches,
  settings,
  onNavigate,
  onSelectProduct,
}) => {
  const newArrivals = watches.filter(w => w.isNewArrival).slice(0, 4);
  const bestSellers = watches.filter(w => w.isBestSeller).slice(0, 4);

  const closingWhatsappUrl = buildGeneralWhatsAppLink(
    settings.whatsAppNumber,
    "Hello Kayode, I am looking for a specific watch model on PrimeWatch. Can you help me?"
  );

  // Category tile icons & covers map
  const categoryImages: Record<string, string> = {
    'Leather Strap Watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    'Rubber Strap Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    'Steel Watches': 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800&auto=format&fit=crop',
    'Automatic Watches': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    'Dress Watches': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop',
    'Sports Watches': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop',
    "Men's Collection": 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
    "Women's Collection": 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop'
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <Hero settings={settings} onNavigate={onNavigate} />

      {/* Category Tile Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5C6B3A] block mb-1">
              Explore By Style
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A26]">
              Browse Watch Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('collection')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5C6B3A] hover:text-[#47542B] group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {ALL_CATEGORIES.map((cat) => {
            const count = watches.filter(w => w.categories.includes(cat)).length;
            const bgImg = categoryImages[cat] || categoryImages['Leather Strap Watches'];

            return (
              <div
                key={cat}
                onClick={() => onNavigate('collection', cat)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-xs cursor-pointer hover:shadow-lg transition-all"
              >
                <img
                  src={bgImg}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                  <h3 className="font-serif text-sm sm:text-base font-bold group-hover:text-[#B8952E] transition-colors leading-tight">
                    {cat}
                  </h3>
                  <span className="text-[11px] text-gray-300 font-medium mt-0.5">
                    {count} {count === 1 ? 'watch' : 'watches'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* New Arrivals Preview Row */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#5C6B3A]/10 text-[#5C6B3A]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5C6B3A] block">
                  Fresh Additions
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A26]">
                  New Arrivals
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigate('new-arrivals')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5C6B3A] hover:text-[#47542B] group"
            >
              <span className="hidden sm:inline">See All New Arrivals</span>
              <span className="sm:hidden">All New</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers Preview Row */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#B8952E]/10 text-[#B8952E]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B8952E] block">
                  Customer Favorites
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A26]">
                  Best Sellers
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigate('best-sellers')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5C6B3A] hover:text-[#47542B] group"
            >
              <span className="hidden sm:inline">See All Best Sellers</span>
              <span className="sm:hidden">All Top</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* PRD §5.1 Closing WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#5C6B3A] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#47542B]">
          
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8952E] bg-black/20 px-3 py-1 rounded-full inline-block">
              Personal Watch Concierge
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Looking for a Specific Watch Model or Special Gift?
            </h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              Kayode sources authentic watches directly from trusted international distributors. If you don't see what you're looking for, send us a photo or model name on WhatsApp!
            </p>

            <div className="pt-2">
              <a
                href={closingWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#20ba5a] transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                <span>Message Kayode on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

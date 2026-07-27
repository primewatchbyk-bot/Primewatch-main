import React from 'react';
import { PageView, StoreSettings } from '../types';
import { MessageCircle, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../lib/storage';

interface HeroProps {
  settings: StoreSettings;
  onNavigate: (view: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onNavigate }) => {
  const whatsappUrl = buildGeneralWhatsAppLink(
    settings.whatsAppNumber,
    "Hello Kayode, I saw your PrimeWatch website hero and would like to inquire about your watch collection."
  );

  const heroImage = settings.heroImageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop';

  return (
    <section className="relative bg-[#FAF6EE] overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 border-b border-[#E8E2D5]">
      
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 -z-0 w-96 h-96 bg-[#5C6B3A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-0 w-80 h-80 bg-[#B8952E]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Text Content (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-[#5C6B3A]/10 text-[#5C6B3A] border border-[#5C6B3A]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#B8952E] animate-ping" />
              <span>Mobile-First Online Watch Catalog</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2B2A26] leading-tight tracking-tight">
              {settings.heroTitle || 'Timeless Elegance, Handcrafted Precision.'}
            </h1>

            <p className="text-base sm:text-lg text-[#615E57] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings.heroSubtitle || 'Curated luxury and premium timepieces for the modern individual. Browse our exclusive collection and order directly on WhatsApp with Kayode.'}
            </p>

            {/* CTAs Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onNavigate('collection')}
                className="w-full sm:w-auto bg-[#5C6B3A] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#47542B] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                id="hero-browse-collection-btn"
              >
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Hero Image Showcase (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 max-w-md mx-auto group">
              <img
                src={heroImage}
                alt="PrimeWatch Hero Watch"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#B8952E] font-semibold">
                  Curated Catalog • PrimeWatch
                </span>
                <h3 className="font-serif text-lg font-bold">
                  Hand-Inspected Luxury Timepieces
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* PRD §5.1 Trust Row */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D5] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5C6B3A]/10 text-[#5C6B3A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B2A26]">Guaranteed Quality</h4>
              <p className="text-xs text-[#615E57]">Every watch is thoroughly tested & inspected before dispatch.</p>
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B2A26]">1-Tap WhatsApp Ordering</h4>
              <p className="text-xs text-[#615E57]">No cart or checkout friction — message Kayode to confirm.</p>
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8952E]/10 text-[#B8952E] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B2A26]">Swift Delivery</h4>
              <p className="text-xs text-[#615E57]">Fast, secure, insured courier delivery nationwide.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

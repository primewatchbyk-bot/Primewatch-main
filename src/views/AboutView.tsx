import React from 'react';
import { PageView, StoreSettings } from '../types';
import { Watch, ShieldCheck, MessageCircle, Award, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../lib/storage';

interface AboutViewProps {
  settings: StoreSettings;
  onNavigate: (view: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, onNavigate }) => {
  const whatsappUrl = buildGeneralWhatsAppLink(
    settings.whatsAppNumber,
    "Hello Kayode, I read about PrimeWatch on your website and would like to ask a few questions."
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#5C6B3A] bg-[#5C6B3A]/10 px-3.5 py-1.5 rounded-full inline-block">
          The Story Behind The Brand
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2A26]">
          Crafted with Passion, Curated by Kayode
        </h1>
        <p className="text-sm sm:text-base text-[#615E57] leading-relaxed">
          PrimeWatch was founded with a singular vision: to bring authentic, high-grade luxury timepieces directly to watch enthusiasts without the inflated retail markup.
        </p>
      </div>

      {/* Main Narrative Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D5] shadow-xs">
        <div className="space-y-4 text-sm text-[#615E57] leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#2B2A26]">
            Reinventing the Online Watch Buying Experience
          </h2>
          <p>
            Traditional online watch stores often feel impersonal or flooded with automated checkout steps. At PrimeWatch by Kayode, we believe buying a fine watch is a personal journey.
          </p>
          <p>
            That is why we built a clean, transparent, mobile-first catalog where every watch is photographed, documented, and presented with exact specifications — while keeping direct WhatsApp communication with Kayode as our core ordering channel.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5C6B3A] text-white flex items-center justify-center font-serif font-bold text-lg">
              K
            </div>
            <div>
              <span className="font-serif font-bold text-[#2B2A26] block text-sm">Kayode</span>
              <span className="text-xs text-[#8C887F]">Founder & Lead Horology Curator</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] aspect-4/3">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
            alt="PrimeWatch Craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-[#B8952E]" />
              <span>100% Hand-Inspected Before Every Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#5C6B3A]/10 text-[#5C6B3A] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2B2A26]">
            Guaranteed Authenticity
          </h3>
          <p className="text-xs text-[#615E57] leading-relaxed">
            Every movement, crystal, strap, and case detail is thoroughly verified against strict quality benchmarks before being listed on our catalog.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2B2A26]">
            Direct Personal Service
          </h3>
          <p className="text-xs text-[#615E57] leading-relaxed">
            Have questions about wrist fit, strap adjustments, or movement mechanics? Message Kayode directly on WhatsApp for instant 1-on-1 assistance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#B8952E]/10 text-[#B8952E] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2B2A26]">
            Transparent Pricing
          </h3>
          <p className="text-xs text-[#615E57] leading-relaxed">
            No hidden fees or unexpected surge charges. What you see in our catalog is the exact price you pay, backed by our 1-year warranty.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-8 border border-[#E8E2D5] space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#2B2A26] border-b border-[#E8E2D5] pb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-serif font-bold text-[#2B2A26] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#5C6B3A]" />
              How do I place an order?
            </h4>
            <p className="text-xs text-[#615E57] mt-1 pl-6 leading-relaxed">
              Simply click the "Order on WhatsApp" button on any watch page. It will automatically generate a message with the watch name and product code, sending it directly to Kayode.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[#2B2A26] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#5C6B3A]" />
              Do I pay online on this website?
            </h4>
            <p className="text-xs text-[#615E57] mt-1 pl-6 leading-relaxed">
              No. This website is a self-service browsable catalog. All orders, delivery address confirmations, and payment arrangements happen securely directly on WhatsApp with Kayode.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[#2B2A26] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#5C6B3A]" />
              How fast is delivery?
            </h4>
            <p className="text-xs text-[#615E57] mt-1 pl-6 leading-relaxed">
              Orders within Lagos are delivered same-day or within 24 hours. Inter-state nationwide deliveries take 24–48 hours via insured courier service.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-[#5C6B3A] text-white rounded-3xl p-8 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Ready to Elevate Your Wrist Game?</h2>
        <p className="text-xs sm:text-sm text-gray-200 max-w-lg mx-auto">
          Explore our complete collection or send us a message on WhatsApp for custom requests.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('collection')}
            className="bg-white text-[#2B2A26] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#FAF6EE] transition-colors"
          >
            Browse Full Catalog
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#20ba5a] transition-colors inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white text-transparent" />
            <span>Chat with Kayode</span>
          </a>
        </div>
      </div>

    </div>
  );
};

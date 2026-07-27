import React, { useState } from 'react';
import { PageView } from '../types';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyTermsViewProps {
  initialTab: 'privacy' | 'terms';
  onNavigate: (view: PageView) => void;
}

export const PrivacyTermsView: React.FC<PrivacyTermsViewProps> = ({
  initialTab,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C6B3A] hover:text-[#47542B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Header Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-4">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'bg-[#5C6B3A] text-white shadow-xs'
              : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'terms'
              ? 'bg-[#5C6B3A] text-white shadow-xs'
              : 'bg-white text-[#2B2A26] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs text-xs text-[#615E57] space-y-6 leading-relaxed">
        {activeTab === 'privacy' ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-[#2B2A26]">
              Privacy Policy — PrimeWatch by Kayode
            </h1>
            <p className="text-[#8C887F]">Effective Date: July 21, 2026</p>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">1. Overview</h2>
              <p>
                PrimeWatch by Kayode ("we", "our", "us") respects your privacy. This Privacy Policy describes how information is handled when you browse our online watch catalog.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">2. Information We Collect</h2>
              <p>
                Our catalog website does not collect personal financial data or force account creation. When you initiate a WhatsApp conversation by clicking an order button, any personal details (such as your name or delivery address) are provided voluntarily by you directly through WhatsApp.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">3. Local Storage</h2>
              <p>
                We use browser local storage purely to store catalog preference states (such as active filter views) to ensure a smooth browsing experience. No tracking cookies or advertising pixels are injected.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">4. Contact Us</h2>
              <p>
                If you have questions regarding this privacy notice, please reach out to Kayode directly via WhatsApp or email at kayode@primewatch.com.
              </p>
            </section>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold text-[#2B2A26]">
              Terms of Service — PrimeWatch by Kayode
            </h1>
            <p className="text-[#8C887F]">Effective Date: July 21, 2026</p>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">1. Catalog Functionality</h2>
              <p>
                PrimeWatch by Kayode is an interactive product showcase. Displayed items, specifications, and prices are subject to real-time availability and final confirmation via WhatsApp.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">2. Ordering & Payment</h2>
              <p>
                All actual purchase agreements, stock verification, and payment transactions take place off-site through direct WhatsApp communications with Kayode. No automated payments take place on this domain.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-bold text-[#2B2A26]">3. Authenticity & Warranty</h2>
              <p>
                All timepieces listed in our catalog are hand-inspected and guaranteed authentic as described. Every watch comes accompanied by our 1-year store warranty card.
              </p>
            </section>
          </>
        )}
      </div>

    </div>
  );
};

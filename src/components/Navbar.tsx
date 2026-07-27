import React, { useState } from 'react';
import { PageView, StoreSettings } from '../types';
import { Menu, X, Watch, MessageCircle, Sparkles, Flame, Phone } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../lib/storage';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView, filterCategory?: string) => void;
  settings: StoreSettings;
  totalProductsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  settings,
  totalProductsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as PageView, label: 'Home' },
    { id: 'collection' as PageView, label: 'Collection' },
    { id: 'new-arrivals' as PageView, label: 'New Arrivals', badge: <Sparkles className="w-3 h-3 text-[#B8952E] inline ml-1" /> },
    { id: 'best-sellers' as PageView, label: 'Best Sellers', badge: <Flame className="w-3 h-3 text-[#B8952E] inline ml-1" /> },
    { id: 'about' as PageView, label: 'About' },
    { id: 'contact' as PageView, label: 'Contact' },
  ];

  const handleNavClick = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappLink = buildGeneralWhatsAppLink(
    settings.whatsAppNumber,
    "Hello Kayode, I saw your catalog on PrimeWatch and would like to make an inquiry."
  );

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      {/* Top Banner Alert / Trust Note */}
      <div className="bg-[#5C6B3A] text-white py-1.5 px-4 text-xs text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#B8952E] animate-pulse" />
        <span>Self-Service Catalog • Direct WhatsApp Ordering with Kayode</span>
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 underline ml-2 hover:text-[#FAF6EE] text-[#E8E2D5]"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat Now
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-full bg-[#5C6B3A] text-[#FAF6EE] flex items-center justify-center shadow-sm group-hover:bg-[#47542B] transition-colors">
              <Watch className="w-6 h-6 text-[#FAF6EE]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2B2A26] block leading-none">
                PrimeWatch
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#B8952E] font-semibold block mt-0.5">
                by Kayode
              </span>
            </div>
          </button>



          {/* 3-Bar (Hamburger) Navigation Menu Toggle */}
          <div className="relative flex items-center gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white px-3.5 py-2 rounded-full text-xs font-semibold hover:bg-[#20ba5a] transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-[#E8E2D5]/60 hover:bg-[#E8E2D5] text-[#2B2A26] transition-colors focus:outline-none border border-[#DCD5C5]"
              aria-label="Toggle navigation menu"
              id="main-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#2B2A26]" /> : <Menu className="w-5 h-5 text-[#2B2A26]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E8E2D5] bg-[#FAF6EE] px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between transition-colors ${
                    isActive 
                      ? 'bg-[#5C6B3A] text-white font-semibold' 
                      : 'text-[#2B2A26] hover:bg-[#E8E2D5]/60'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge}
                  </span>
                  {item.id === 'collection' && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-[#2B2A26] font-normal border border-[#E8E2D5]">
                      {totalProductsCount} items
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E8E2D5] mt-2 sm:hidden">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 rounded-xl font-medium text-sm text-center shadow-xs"
              >
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

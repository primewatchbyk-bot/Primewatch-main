import React from 'react';
import { PageView, StoreSettings } from '../types';
import { Watch, MessageCircle, Instagram, Mail, MapPin, Clock, Lock, ShieldCheck } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../lib/storage';

interface FooterProps {
  onNavigate: (view: PageView, filterCategory?: string) => void;
  settings: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const whatsappUrl = buildGeneralWhatsAppLink(settings.whatsAppNumber);

  return (
    <footer className="bg-[#2B2A26] text-[#FAF6EE] pt-14 pb-8 border-t border-[#3D3B36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3D3B36]">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5C6B3A] text-white flex items-center justify-center">
                <Watch className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight block text-white">
                  PrimeWatch
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#B8952E] font-semibold block">
                  by Kayode
                </span>
              </div>
            </div>
            <p className="text-sm text-[#8C887F] leading-relaxed">
              Mobile-first online catalog for authentic luxury and lifestyle timepieces. Browse our collection and order directly on WhatsApp.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#8C887F]">
              <ShieldCheck className="w-4 h-4 text-[#5C6B3A]" />
              <span>Direct WhatsApp Inquiry • No Online Payment Required</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-[#3D3B36] pb-2">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8C887F]">
              <li>
                <button 
                  onClick={() => onNavigate('collection')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  All Watches Collection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('new-arrivals')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('best-sellers')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  About PrimeWatch
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-[#3D3B36] pb-2">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8C887F]">
              <li>
                <button 
                  onClick={() => onNavigate('collection', 'Leather Strap Watches')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Leather Strap Watches
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('collection', 'Automatic Watches')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Automatic Mechanical
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('collection', 'Steel Watches')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Steel Bracelet Watches
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('collection', 'Rubber Strap Watches')} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Sports & Rubber Straps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('collection', "Women's Collection")} 
                  className="hover:text-[#B8952E] transition-colors"
                >
                  Women's Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-[#3D3B36] pb-2">
              Connect & Visit
            </h4>
            <div className="space-y-3 text-sm text-[#8C887F]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B8952E] shrink-0" />
                <span>{settings.businessHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8952E] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-5 flex items-center gap-3">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              {settings.instagramHandle && (
                <a 
                  href={`https://instagram.com/${settings.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#3D3B36] text-white hover:bg-[#E1306C] flex items-center justify-center transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.tiktokHandle && (
                <a 
                  href={`https://tiktok.com/@${settings.tiktokHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#3D3B36] text-white hover:bg-black flex items-center justify-center transition-all"
                  title="TikTok"
                >
                  <span className="font-bold text-xs">TT</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar with discreet Admin link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C887F]">
          <div>
            © {new Date().getFullYear()} PrimeWatch by Kayode. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onNavigate('terms')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            
            {/* Discreet Admin Portal Link */}
            <button 
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1 text-[#615E57] hover:text-[#B8952E] transition-colors underline text-[11px]"
              title="Kayode's Admin Dashboard Access"
              id="discreet-admin-footer-link"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

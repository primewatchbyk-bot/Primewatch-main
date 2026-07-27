import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { MessageCircle, Instagram, Mail, MapPin, Clock, Phone, Send, CheckCircle2 } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../lib/storage';

interface ContactViewProps {
  settings: StoreSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [customMsg, setCustomMsg] = useState('');

  const directWhatsappUrl = buildGeneralWhatsAppLink(
    settings.whatsAppNumber,
    customMsg || "Hello Kayode, I saw your PrimeWatch website and would like to make an inquiry."
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#5C6B3A] bg-[#5C6B3A]/10 px-3.5 py-1.5 rounded-full inline-block">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2A26]">
          Contact Kayode directly
        </h1>
        <p className="text-sm sm:text-base text-[#615E57] leading-relaxed">
          We respond fastest on WhatsApp. Feel free to message us with any product questions, custom watch sourcing, or delivery inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left: Contact Info Cards */}
        <div className="space-y-4">
          
          {/* WhatsApp Direct Hero Card */}
          <div className="bg-[#25D366] text-white p-6 rounded-3xl shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 fill-white text-transparent" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">WhatsApp Primary Channel</h3>
                  <span className="text-xs text-white/90 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Typical response in &lt; 15 mins
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/90 leading-relaxed">
              For real-time stock verification, photo requests, and placing orders directly with Kayode.
            </p>

            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-[#20ba5a] hover:bg-[#FAF6EE] py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-[#20ba5a] text-transparent" />
              <span>Open WhatsApp Direct</span>
            </a>
          </div>

          {/* Location & Hours Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-4 shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#2B2A26] border-b border-[#E8E2D5] pb-2">
              Business Information
            </h3>

            <div className="space-y-3 text-xs text-[#615E57]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B2A26] block">Physical Showroom / Hub:</strong>
                  <span>{settings.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B2A26] block">Business Hours:</strong>
                  <span>{settings.businessHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#B8952E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B2A26] block">Email Support:</strong>
                  <a href={`mailto:${settings.email}`} className="text-[#5C6B3A] underline">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-3 shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#2B2A26] border-b border-[#E8E2D5] pb-2">
              Social Media Pages
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {settings.instagramHandle && (
                <a
                  href={`https://instagram.com/${settings.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl border border-[#E8E2D5] hover:border-[#E1306C] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#E1306C]" />
                  <span className="truncate font-medium">@{settings.instagramHandle}</span>
                </a>
              )}

              {settings.tiktokHandle && (
                <a
                  href={`https://tiktok.com/@${settings.tiktokHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl border border-[#E8E2D5] hover:border-black transition-colors"
                >
                  <span className="font-bold text-xs text-black">TT</span>
                  <span className="truncate font-medium">@{settings.tiktokHandle}</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Right: Instant Pre-Filled WhatsApp Message Generator */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-5">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2B2A26]">
              Quick Message Builder
            </h3>
            <p className="text-xs text-[#615E57] mt-1">
              Type your question below to generate a pre-formatted WhatsApp message for Kayode.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#615E57] block mb-2">
                Your Inquiry or Watch Request:
              </label>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="E.g., Hi Kayode, do you have the Royal Chronograph Gold Emerald in stock? Can I request extra live photos on WhatsApp?"
                className="w-full bg-[#FAF6EE] border border-[#E8E2D5] rounded-2xl p-3.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#5C6B3A] focus:ring-1 focus:ring-[#5C6B3A]"
              />
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#8C887F] font-medium block">Or choose a quick query template:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCustomMsg("Hi Kayode, I want to confirm if you deliver to my location and how fast.")}
                  className="bg-[#FAF6EE] border border-[#E8E2D5] hover:border-[#5C6B3A] text-[#2B2A26] text-[11px] px-2.5 py-1 rounded-lg"
                >
                  Delivery question
                </button>
                <button
                  type="button"
                  onClick={() => setCustomMsg("Hello Kayode, I am looking for a specific watch model not listed in your catalog.")}
                  className="bg-[#FAF6EE] border border-[#E8E2D5] hover:border-[#5C6B3A] text-[#2B2A26] text-[11px] px-2.5 py-1 rounded-lg"
                >
                  Sourcing custom watch
                </button>
                <button
                  type="button"
                  onClick={() => setCustomMsg("Hi Kayode, what warranty covers the watches in your catalog?")}
                  className="bg-[#FAF6EE] border border-[#E8E2D5] hover:border-[#5C6B3A] text-[#2B2A26] text-[11px] px-2.5 py-1 rounded-lg"
                >
                  Warranty inquiry
                </button>
              </div>
            </div>

            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#20ba5a] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Pre-Filled Message on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};

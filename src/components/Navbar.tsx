import React from 'react';
import { FloorPlanModel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import {
  Phone,
  Globe,
  Sparkles,
  Layers,
  ChevronDown,
  Building,
  Home,
  Check,
} from 'lucide-react';

interface NavbarProps {
  currentModel?: FloorPlanModel;
  onOpenBooking: () => void;
  onSelectCommunity?: () => void;
  onSelectTab?: (tab: 'order' | 'catalog' | 'about' | 'contact') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModel,
  onOpenBooking,
  onSelectCommunity,
  onSelectTab,
}) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs font-sans transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-[#000000] text-[#FFFFFF] text-[10px] sm:text-[11px] py-1 px-3 sm:px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8407] animate-pulse shrink-0"></span>
            <span className="font-bold text-[#FF8407] shrink-0">
              {lang === 'es' ? 'Miami-Dade & Homestead' : 'Miami-Dade & Homestead'}
            </span>
            <span className="hidden sm:inline text-[#64748B]">•</span>
            <span className="hidden sm:inline text-[#CBD5E1] truncate">
              {t('stairBadge')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#CBD5E1] shrink-0">
            <a
              href="tel:7866583677"
              className="hover:text-[#FF8407] transition-colors flex items-center gap-1 font-bold text-[10px] sm:text-xs"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF8407]" />
              <span>(786) 658-3677</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onSelectTab ? onSelectTab('order') : onSelectCommunity?.()}
          className="flex items-center shrink-0 cursor-pointer bg-transparent border-0 p-0 text-left"
        >
          <Logo variant="dark" size="sm" showTagline={false} className="sm:hidden" />
          <Logo variant="dark" size="md" showTagline={true} className="hidden sm:flex" />
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold text-[#4B5563]">
          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('order') : onSelectCommunity?.()}
            className="hover:text-[#000000] transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            {lang === 'es' ? 'Cotizador & Planos' : 'Estimator & Plans'}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('catalog') : onSelectCommunity?.()}
            className="hover:text-[#000000] transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            {lang === 'es' ? 'Catálogo 3D SPC' : 'SPC Catalog 3D'}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab ? onSelectTab('about') : onSelectCommunity?.()}
            className="hover:text-[#000000] transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            {lang === 'es' ? 'Nosotros & Garantía' : 'About & Warranty'}
          </button>
        </nav>

        {/* Right Controls: Language Selector + CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher Button (EN / ES) */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-[#E2E8F0] shadow-2xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#000000]'
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                lang === 'es'
                  ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#000000]'
              }`}
              title="Cambiar a Español"
            >
              ES
            </button>
          </div>

          {/* Quick Quote CTA Button */}
          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-xs flex items-center gap-1.5 shadow-sm shadow-[#FF8407]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('getFreeQuote')}</span>
            <span className="xs:hidden">{lang === 'es' ? 'Cotizar' : 'Quote'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

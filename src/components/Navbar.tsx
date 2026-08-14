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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModel,
  onOpenBooking,
  onSelectCommunity,
}) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs font-sans transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-[#000000] text-[#FFFFFF] text-[11px] py-1.5 px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8407] animate-pulse"></span>
            <span className="font-bold text-[#FF8407]">
              {lang === 'es' ? 'Homestead & Miami-Dade' : 'Miami-Dade & Homestead'}
            </span>
            <span className="hidden sm:inline text-[#94A3B8]">•</span>
            <span className="hidden sm:inline text-[#CBD5E1]">
              {t('stairBadge')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#CBD5E1]">
            <a
              href="tel:7866583677"
              className="hover:text-[#FF8407] transition-colors flex items-center gap-1 font-bold"
            >
              <Phone className="w-3 h-3 text-[#FF8407]" />
              <span>(786) 658-3677</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3">
          <Logo variant="dark" size="md" />
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#4B5563]">
          <a href="#models" className="hover:text-[#000000] transition-colors">
            {lang === 'es' ? 'Modelos & Planos' : 'Floor Plans & Models'}
          </a>
          <a href="#visualizer" className="hover:text-[#000000] transition-colors">
            {lang === 'es' ? 'Colores & Visualizador' : 'Color Studio'}
          </a>
          <a href="#pricing" className="hover:text-[#000000] transition-colors">
            {lang === 'es' ? '4 Paquetes' : '4 Pricing Packages'}
          </a>
          <a href="#scope" className="hover:text-[#000000] transition-colors">
            {lang === 'es' ? 'Proceso & Garantía' : 'Scope & Process'}
          </a>
          <a href="#catalog" className="hover:text-[#000000] transition-colors">
            {lang === 'es' ? 'Catálogo SPC' : 'SPC Specs'}
          </a>
        </nav>

        {/* Right Controls: Language Selector + CTA */}
        <div className="flex items-center gap-3">
          {/* Prominent Language Switcher Button (EN / ES) */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
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
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#FF8407]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden xs:inline">{t('getFreeQuote')}</span>
            <span className="xs:hidden">Quote</span>
          </button>
        </div>
      </div>
    </header>
  );
};

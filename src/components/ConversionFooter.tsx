import React from 'react';
import { FloorPlanModel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import {
  Phone,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Globe,
  MapPin,
  Clock,
  HeartHandshake,
} from 'lucide-react';

interface ConversionFooterProps {
  model?: FloorPlanModel;
  onOpenBooking: () => void;
}

export const ConversionFooter: React.FC<ConversionFooterProps> = ({ model, onOpenBooking }) => {
  const { lang, t } = useLanguage();

  return (
    <>
      {/* Sticky Bottom Quick-Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E8F0] py-3 px-4 shadow-2xl font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#000000] text-[#FF8407] items-center justify-center font-black text-sm shadow-md">
              QS
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-[#000000]">
                {model
                  ? lang === 'es'
                    ? `¿Listo para renovar tu ${model.name}?`
                    : `Ready to upgrade your ${model.name}?`
                  : t('footerReadyPrompt')}
              </p>
              <p className="text-[11px] text-[#FF8407] font-bold">
                {t('footerStartingFrom')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:7866583677"
              className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#000000] text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF8407]" />
              <span>(786) 658-3677</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FF8407]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {model
                  ? lang === 'es'
                    ? `Reservar ${model.name}`
                    : `Book ${model.name}`
                  : t('bookNowBtn')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Size Footer */}
      <footer className="bg-[#000000] text-[#FFFFFF] pt-16 pb-28 border-t border-[#1E293B] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Badges Bar matching PPT Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#334155]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1E293B] text-[#FF8407] flex items-center justify-center flex-shrink-0 border border-[#FF8407]/30">
                <ShieldCheck className="w-6 h-6 text-[#FF8407]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#FFFFFF]">{t('warranty25')}</p>
                <p className="text-[11px] text-[#94A3B8]">{t('warranty25Desc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1E293B] text-[#FF8407] flex items-center justify-center flex-shrink-0 border border-[#FF8407]/30">
                <Award className="w-6 h-6 text-[#FF8407]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#FFFFFF]">{t('waterproof100')}</p>
                <p className="text-[11px] text-[#94A3B8]">{t('waterproof100Desc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1E293B] text-[#FF8407] flex items-center justify-center flex-shrink-0 border border-[#FF8407]/30">
                <HeartHandshake className="w-6 h-6 text-[#FF8407]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#FFFFFF]">{t('customSteps15')}</p>
                <p className="text-[11px] text-[#94A3B8]">{t('customSteps15Desc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1E293B] text-[#FF8407] flex items-center justify-center flex-shrink-0 border border-[#FF8407]/30">
                <Clock className="w-6 h-6 text-[#FF8407]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#FFFFFF]">{t('turnkey2Days')}</p>
                <p className="text-[11px] text-[#94A3B8]">{t('turnkey2DaysDesc')}</p>
              </div>
            </div>
          </div>

          {/* Footer Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="space-y-4">
              <Logo variant="light" size="md" />
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {lang === 'es'
                  ? 'Especialistas en pisos de vinil SPC de alta gama para comunidades residenciales de Lennar en el Sur de la Florida.'
                  : "South Florida's leading luxury vinyl flooring service for Lennar residential communities."}
              </p>
              <a
                href="https://quicksurfaces.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FF8407] font-mono hover:underline block"
              >
                quicksurfaces.com
              </a>
            </div>

            {/* Communities */}
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] mb-3">
                {lang === 'es' ? 'Conjuntos Disponibles' : 'Featured Communities'}
              </h5>
              <ul className="space-y-2 text-xs text-[#94A3B8] font-medium">
                <li>Altamira (Castellon, Granada, Andalucia)</li>
                <li>Terra Sol (Waterfront Enclave)</li>
                <li>Luminara (Horizon Collection)</li>
                <li>Paradis (The Boulevard)</li>
                <li>Homestead Del Mar (Seaview)</li>
              </ul>
            </div>

            {/* Flooring Collections */}
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] mb-3">
                {lang === 'es' ? 'Gama de Pisos SPC' : 'Flooring Range'}
              </h5>
              <ul className="space-y-2 text-xs text-[#94A3B8] font-medium">
                <li>8.0mm Flagship SPC (22 Mils Wear Layer)</li>
                <li>5.5mm Classic SPC (20 Mils Wear Layer)</li>
                <li>6.0mm PulseShield XL (20 Mils)</li>
                <li>15 Escalones con Tablones Originales</li>
                <li>Bajo Piso Acústico HD EVA Integrado</li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] mb-3">
                {lang === 'es' ? 'Contacto Directo' : 'Direct Contact'}
              </h5>
              <p className="text-xs text-[#94A3B8] mb-2">
                {lang === 'es'
                  ? 'Atención inmediata para coordinar fechas de entrega en tu conjunto:'
                  : 'Direct assistance for scheduling and material delivery:'}
              </p>
              <a
                href="tel:7866583677"
                className="inline-flex items-center gap-2 text-base font-black text-[#FFFFFF] hover:text-[#FF8407] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF8407]" />
                <span>(786) 658-3677</span>
              </a>
              <p className="text-[11px] text-[#94A3B8] mt-2">
                Miami-Dade, Kendall, Homestead & Broward, FL.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#334155] text-center text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} QuickSurfaces. {lang === 'es' ? 'Todos los derechos reservados.' : 'All Rights Reserved.'}
          </div>
        </div>
      </footer>
    </>
  );
};

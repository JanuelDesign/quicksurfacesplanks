import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { FloorPlanModel } from '../types';

interface SienaReserveHeroProps {
  model?: FloorPlanModel;
}

export const SienaReserveHero: React.FC<SienaReserveHeroProps> = () => {
  const { lang } = useLanguage();
  const BANNER_CANDIDATES = [
    'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/banners/siena-reserve-entrance.webp',
    '/images/banners/siena-reserve-entrance.webp',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  ];

  const [candidateIdx, setCandidateIdx] = useState<number>(0);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0] bg-[#0A0A0B] text-white font-sans">
      {/* Background Architectural Facade Image with Gradient Overlays */}
      <div className="relative h-[240px] sm:h-[280px] md:h-[320px] w-full overflow-hidden">
        <img
          key={candidateIdx}
          src={BANNER_CANDIDATES[candidateIdx] || BANNER_CANDIDATES[BANNER_CANDIDATES.length - 1]}
          alt="Fachada Siena Reserve Homestead FL - Entrada Principal"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 hover:scale-100 brightness-[1.08] contrast-[1.02] saturate-[1.05]"
          referrerPolicy="no-referrer"
          onError={() => {
            if (candidateIdx < BANNER_CANDIDATES.length - 1) {
              setCandidateIdx((prev) => prev + 1);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/95 via-[#0A0A0B]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/80 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF8407] text-[#000000] text-xs font-black tracking-wider uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            Siena Reserve
          </span>
        </div>

        {/* Verified Community Watermark */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-white/80 font-medium">
            {lang === 'es' ? 'Planos Verificados para Townhomes' : 'Verified Townhome Floorplans'}
          </span>
        </div>

        {/* Banner Hero Main Content */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#FF8407] uppercase">
                {lang === 'es' ? 'SOLUCIÓN ESPECIALIZADA DE PISOS PARA:' : 'SPECIALIZED FLOORING SOLUTION FOR:'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Siena Reserve Townhomes
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              {lang === 'es'
                ? 'A medida para Modelos B, C, MC, R & V. Pisos 100% impermeables SPC Luxury Vinyl, Laminados y Madera de Ingeniería con 17 escalones Square Step Nose a medida.'
                : 'Custom-fit for Models B, C, MC, R & V. 100% waterproof SPC Luxury Vinyl, Laminate and Engineered Hardwood with 17 custom Square Step Noses.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


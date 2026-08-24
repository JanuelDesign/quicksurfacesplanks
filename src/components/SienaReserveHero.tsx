import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, MapPin, Sparkles, Layers } from 'lucide-react';
import { FloorScope, FloorPlanModel } from '../types';

interface SienaReserveHeroProps {
  floorScope: FloorScope;
  onChangeFloorScope: (scope: FloorScope) => void;
  model?: FloorPlanModel;
  onContinueToQuote?: () => void;
}

export const SienaReserveHero: React.FC<SienaReserveHeroProps> = ({
  floorScope,
  onChangeFloorScope,
  model,
}) => {
  const { lang } = useLanguage();
  const BANNER_CANDIDATES = [
    '/images/banners/siena-reserve-entrance.webp',
    'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/banners/siena-reserve-entrance.webp',
    '/images/banners/siena-reserve-entrance.jpg',
    '/images/banners/siena-reserve-entrance.png',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  ];

  const [candidateIdx, setCandidateIdx] = useState<number>(0);

  // Metraje calculations based on active model or Bandol defaults
  const f1Rec = model?.sqftFirstFloorRec || 560;
  const f2Rec = model?.sqftSecondFloorRec || 520;
  const bothRec = model?.sqftMaterialRecommended || 1080;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0] bg-[#0A0A0B] text-white font-sans mb-6">
      {/* Background Architectural Facade Image with Gradient Overlays */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[390px] w-full overflow-hidden">
        {/* Background Architectural Facade Image with Enhanced Clarity */}
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
        {/* Soft, Transparent Gradients to maintain vibrant image brightness while keeping text legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/85 via-[#0A0A0B]/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/60 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8407] text-[#000000] text-xs font-black tracking-wider uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            Adora Collection
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/15">
            <MapPin className="w-3 h-3 text-[#FF8407]" />
            12705 SW 232nd St, Homestead FL 33032
          </span>
        </div>

        {/* Verified Community Watermark */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-white/80 font-medium">Planos Verificados para Townhomes</span>
        </div>

        {/* Banner Hero Main Content */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold tracking-widest text-[#FF8407] uppercase">
                {lang === 'es' ? 'Solución Oficial de Pisos para' : 'Official Flooring Solution for'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Siena Reserve <span className="text-[#FF8407]">Townhomes</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl line-clamp-2 leading-relaxed">
              {lang === 'es'
                ? 'Modelos Bandol, Casis, Monte Carlo, Reserve y Vence. Instalación especializada de Pisos Vinílicos SPC 100% impermeables, Laminados y Madera con 15 escalones Flush Stair Nose al ras.'
                : 'Bandol, Casis, Monte Carlo, Reserve & Vence models. 100% waterproof SPC Luxury Vinyl, Laminate and Engineered Hardwood with 15 custom Flush Stair Noses.'}
            </p>
          </div>
        </div>
      </div>

      {/* Scope Selector Sub-Bar (1er Piso / 2do Piso / Casa Completa) */}
      <div className="bg-[#121215] border-t border-white/10 px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF8407]" />
              <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                {lang === 'es' ? '¿Qué área de tu casa deseas remodelar?' : 'Which area do you want to remodel?'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'es'
                ? 'El metraje y el plano 2D se ajustarán automáticamente según tu selección.'
                : 'Floor plan and sqft calculations will update automatically based on your choice.'}
            </p>
          </div>

          {/* Interactive 3-Way Pill Switcher */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto bg-[#1C1C22] p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => onChangeFloorScope('floor1')}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                floorScope === 'floor1'
                  ? 'bg-[#FF8407] text-[#000000] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-center sm:text-left">
                {lang === 'es' ? 'Solo 1er Piso' : '1st Floor Only'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                floorScope === 'floor1' ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-slate-400'
              }`}>
                ~{f1Rec} SF
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeFloorScope('floor2')}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                floorScope === 'floor2'
                  ? 'bg-[#FF8407] text-[#000000] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-center sm:text-left">
                {lang === 'es' ? 'Solo 2do Piso' : '2nd Floor Only'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                floorScope === 'floor2' ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-slate-400'
              }`}>
                ~{f2Rec} SF
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeFloorScope('both')}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                floorScope === 'both'
                  ? 'bg-[#FF8407] text-[#000000] shadow-md ring-2 ring-[#FF8407]/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-center sm:text-left">
                {lang === 'es' ? 'Casa Completa' : 'Whole House'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                floorScope === 'both' ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-slate-400'
              }`}>
                ~{bothRec} SF
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


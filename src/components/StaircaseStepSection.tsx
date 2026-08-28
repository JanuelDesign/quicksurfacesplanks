import React, { useState } from 'react';
import { FlooringProduct } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, getStairMaterialCost } from '../utils/pricingCalculator';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  Info,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';

interface StaircaseStepSectionProps {
  selectedProduct: FlooringProduct;
}

export const StaircaseStepSection: React.FC<StaircaseStepSectionProps> = ({
  selectedProduct,
}) => {
  const { lang } = useLanguage();
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedCardModal, setSelectedCardModal] = useState<'360' | 'installed' | null>(null);

  const stairCost = selectedProduct.stairMaterialCost || getStairMaterialCost(selectedProduct.category);

  const rotateNext = () => {
    setRotationAngle((prev) => (prev + 45) % 360);
  };

  return (
    <div
      id="staircase-step-section"
      className="mt-6 bg-[#FFFFFF] rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] shadow-xl overflow-hidden font-sans animate-fadeIn"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#000000] text-[#FF8407] text-[10px] font-black tracking-widest uppercase">
              <Layers className="w-3 h-3 text-[#FF8407]" />
              {lang === 'es' ? 'Detalle de Escaleras' : 'Staircase Specification'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {lang === 'es' ? '17 Escalones Square Step Nose' : '17 Square Step Noses'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-[#000000] tracking-tight">
            Square Step Nose — {lang === 'es' ? '17 Escalones a Juego' : '17 Matching Custom Steps'}
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            {lang === 'es'
              ? `Fabricados exclusivamente en el mismo tono #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness}) para Siena Reserve.`
              : `Manufactured in the exact matching tone #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness}) for Siena Reserve.`}
          </p>
        </div>

        {/* Cost & Summary Tag */}
        <div className="flex items-center gap-3 bg-[#FFFBF7] p-3 rounded-2xl border border-[#FF8407]/30 self-start sm:self-center">
          <div>
            <span className="text-[10px] font-black uppercase text-[#64748B] block">
              {lang === 'es' ? 'Costo Material (17 Escalones)' : 'Stair Material (17 Steps)'}
            </span>
            <span className="text-xl font-black text-[#FF8407] block leading-tight">
              {formatCurrency(stairCost)}
            </span>
          </div>
          <div className="h-8 w-px bg-[#FF8407]/20"></div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 block">
              {lang === 'es' ? 'Perfil Square Step' : 'Square Step Profile'}
            </span>
            <span className="text-xs font-black text-slate-900">
              100% Waterproof
            </span>
          </div>
        </div>
      </div>

      {/* 2 Main Visual Cards Grid: 360 Piece View & Installed Illustration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* CARD 1: 360° Square Step Nose Piece */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#CBD5E1] flex flex-col justify-between relative group hover:border-[#FF8407]/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#000000] text-[#FF8407] flex items-center justify-center font-bold text-xs">
                  360°
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                    {lang === 'es' ? 'Pieza Square Step Nose (Perfil al Ras)' : 'Square Step Nose Piece (Square Profile)'}
                  </h4>
                  <span className="text-[10px] text-[#64748B]">
                    {lang === 'es' ? 'Transición al ras sin pestañas sobresalientes' : 'Seamless square transition without raised lips'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={rotateNext}
                className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] font-bold text-[#0F172A] hover:bg-[#F1F5F9] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                title={lang === 'es' ? 'Girar pieza' : 'Rotate piece'}
              >
                <RotateCw className="w-3 h-3 text-[#FF8407]" />
                <span>{lang === 'es' ? 'Girar' : 'Rotate'}</span>
              </button>
            </div>

            {/* Interactive 3D / Angle Step Nose Canvas Rendering */}
            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] border border-[#334155] flex items-center justify-center p-4">
              <div
                className="relative transition-transform duration-500 ease-out flex flex-col items-center justify-center"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                {/* Visual Architectural Profile Drawing of the Square Step Nose */}
                <svg width="220" height="130" viewBox="0 0 220 130" className="drop-shadow-2xl">
                  <defs>
                    <linearGradient id="stairNoseWood" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={selectedProduct.colorHex || '#C5A986'} />
                      <stop offset="50%" stopColor={selectedProduct.secondaryColorHex || '#8C6C46'} />
                      <stop offset="100%" stopColor={selectedProduct.colorHex || '#C5A986'} />
                    </linearGradient>
                    <linearGradient id="coreRigid" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                  </defs>

                  {/* Stair Tread Board */}
                  <rect x="20" y="30" width="160" height="18" rx="2" fill="url(#stairNoseWood)" stroke="#FF8407" strokeWidth="1.5" />
                  
                  {/* Square Bullnose / Front Drop */}
                  <path
                    d="M 180 30 L 198 30 L 198 75 L 180 75 Z"
                    fill="url(#stairNoseWood)"
                    stroke="#FF8407"
                    strokeWidth="1.5"
                  />

                  {/* SPC Core Layer View */}
                  <rect x="25" y="36" width="150" height="7" fill="url(#coreRigid)" />
                  <rect x="183" y="36" width="10" height="34" fill="url(#coreRigid)" />

                  {/* Click-lock interlocking groove on the back edge */}
                  <path d="M 20 30 L 14 34 L 14 44 L 20 48 Z" fill="#334155" stroke="#94A3B8" strokeWidth="1" />

                  {/* Riser underneath */}
                  <rect x="162" y="75" width="18" height="50" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" />

                  {/* Acoustic pad indicator */}
                  <line x1="20" y1="48" x2="180" y2="48" stroke="#10B981" strokeWidth="2.5" strokeDasharray="4 2" />

                  {/* Measurement Callouts */}
                  <text x="100" y="24" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                    SQUARE STEP SPC WEAR LAYER ({selectedProduct.wearLayer})
                  </text>
                  <text x="190" y="90" fill="#FF8407" fontSize="9" fontWeight="900" textAnchor="start">
                    SQUARE NOSE
                  </text>
                  <text x="100" y="62" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">
                    Acoustic Pad 1.5-2.0mm
                  </text>
                </svg>
              </div>

              {/* Angle Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] text-slate-300 font-mono flex items-center gap-1 border border-white/10">
                <Compass className="w-3 h-3 text-[#FF8407]" />
                <span>{rotationAngle}° / 360° Profile</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCardModal('360')}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black text-white cursor-pointer transition-all border border-white/10"
                title={lang === 'es' ? 'Ver en grande' : 'Enlarge view'}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{lang === 'es' ? 'Sistema:' : 'System:'}</span>
              <span>{lang === 'es' ? 'Click-Lock al ras continuo' : 'Continuous flush Click-Lock'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{lang === 'es' ? 'Espesor:' : 'Thickness:'}</span>
              <span className="font-black text-[#FF8407]">{selectedProduct.thickness}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Photorealistic Illustration of Installed Stairs */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#CBD5E1] flex flex-col justify-between relative group hover:border-[#FF8407]/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FF8407] text-black flex items-center justify-center font-black text-xs">
                  17
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                    {lang === 'es' ? 'Ilustración Escalera Instalada' : 'Installed Staircase Illustration'}
                  </h4>
                  <span className="text-[10px] text-[#64748B]">
                    {lang === 'es' ? 'Acabado en Siena Reserve Townhomes' : 'Finished look in Siena Reserve Townhomes'}
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {lang === 'es' ? '17 Pasos' : '17 Treads'}
              </span>
            </div>

            {/* Staircase Render Image Frame */}
            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-300">
              <img
                src={
                  selectedProduct.staircasePreviewUrl ||
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
                }
                alt="Escalera Square Step Nose Instalada en Siena Reserve"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between p-2 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] border border-white/10">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full border border-white shrink-0"
                    style={{ backgroundColor: selectedProduct.colorHex }}
                  ></span>
                  <span className="font-bold truncate">#{selectedProduct.code} {selectedProduct.name}</span>
                </div>
                <span className="text-[10px] font-black text-[#FF8407] shrink-0">
                  {lang === 'es' ? 'Flujo Continuo' : 'Seamless Flow'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCardModal('installed')}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black text-white cursor-pointer transition-all border border-white/10"
                title={lang === 'es' ? 'Ver en grande' : 'Enlarge view'}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{lang === 'es' ? 'Adherencia:' : 'Bonding:'}</span>
              <span>{lang === 'es' ? 'Pegado estructural de alta resistencia' : 'Heavy-duty structural bonding'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{lang === 'es' ? 'Garantía:' : 'Warranty:'}</span>
              <span className="text-emerald-700 font-bold">{lang === 'es' ? '100% contra desprendimiento' : '100% against detachment'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-3.5 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-start gap-3 text-xs text-[#334155]">
        <Info className="w-4 h-4 text-[#FF8407] mt-0.5 shrink-0" />
        <div>
          <strong className="text-[#0F172A] block">
            {lang === 'es'
              ? 'Especificaciones Técnicas Square Step Nose'
              : 'Square Step Nose Technical Notes'}
          </strong>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            {lang === 'es'
              ? 'El modelo Square Step Nose elimina los perfiles sobresalientes tradicionales (bullnose) que generan tropiezos. Se ensambla al ras con el tablón del piso y el riser, logrando una estética moderna y limpia en los 17 escalones de los townhomes de Siena Reserve.'
              : 'The Square Step Nose model replaces bulky protruding overlap nosing to eliminate trip hazards. It clicks flush into your SPC plank and riser, ensuring a clean, modern aesthetic across all 17 steps in Siena Reserve townhomes.'}
          </p>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {selectedCardModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedCardModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-2xl w-full border border-slate-300 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <h4 className="font-black text-base text-slate-900">
                {selectedCardModal === '360'
                  ? lang === 'es' ? 'Perfil Arquitectónico Square Step Nose' : 'Square Step Nose Architectural Profile'
                  : lang === 'es' ? 'Escalera de 17 Pasos Instalada' : 'Installed 17-Step Staircase'}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedCardModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedCardModal === '360' ? (
              <div className="h-80 w-full rounded-2xl bg-[#0F172A] flex items-center justify-center p-6 border border-slate-700">
                <div className="text-center text-white">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-[#FF8407]/20 border border-[#FF8407] flex items-center justify-center">
                    <Layers className="w-12 h-12 text-[#FF8407]" />
                  </div>
                  <h5 className="font-black text-lg">Square Step Nose Profile (17 Steps)</h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {lang === 'es'
                      ? 'Pieza monobloque moldeada con la misma película de desgaste y veta de tu piso SPC elegido.'
                      : 'Precision-molded single piece matching the wear layer and grain of your selected SPC flooring.'}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#FF8407] font-bold">
                    <span>{selectedProduct.name} ({selectedProduct.thickness}) • {formatCurrency(stairCost)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={
                    selectedProduct.staircasePreviewUrl ||
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Stairs Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

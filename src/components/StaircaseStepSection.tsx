import React, { useState, useEffect } from 'react';
import { FlooringProduct } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, getStairMaterialCost } from '../utils/pricingCalculator';
import {
  StairTechnicalImage,
  StairVerticalCard,
  StairProjectItem,
  STAIR_TECHNICAL_IMAGES,
  STAIR_VERTICAL_CARDS,
  INSTALLED_STAIRS_CAROUSEL,
} from '../data/stairsGallery';
import {
  Layers,
  CheckCircle2,
  Info,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';

interface StaircaseStepSectionProps {
  selectedProduct: FlooringProduct;
  stairTechnicalImages?: StairTechnicalImage[];
  stairVerticalCards?: StairVerticalCard[];
  stairCarouselItems?: StairProjectItem[];
}

export const StaircaseStepSection: React.FC<StaircaseStepSectionProps> = ({
  selectedProduct,
  stairTechnicalImages = STAIR_TECHNICAL_IMAGES,
  stairVerticalCards = STAIR_VERTICAL_CARDS,
  stairCarouselItems = INSTALLED_STAIRS_CAROUSEL,
}) => {
  const { lang } = useLanguage();
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);
  const [selectedLightbox, setSelectedLightbox] = useState<{
    src: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const stairCost = selectedProduct.stairMaterialCost || getStairMaterialCost(selectedProduct.category);

  // Carousel autoplay
  useEffect(() => {
    if (isCarouselPaused || stairCarouselItems.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % stairCarouselItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isCarouselPaused, stairCarouselItems.length]);

  const handleNextCarousel = () => {
    if (stairCarouselItems.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % stairCarouselItems.length);
  };

  const handlePrevCarousel = () => {
    if (stairCarouselItems.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + stairCarouselItems.length) % stairCarouselItems.length);
  };

  const activeStairProject = stairCarouselItems[carouselIndex] || stairCarouselItems[0];

  return (
    <div
      id="staircase-step-section"
      className="mt-6 bg-[#FFFFFF] rounded-3xl p-4 sm:p-7 border border-[#E2E8F0] shadow-xl overflow-hidden font-sans animate-fadeIn space-y-6"
    >
      {/* ================= SECTION HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#000000] text-[#FF8407] text-[10px] font-black tracking-widest uppercase">
              <Layers className="w-3 h-3 text-[#FF8407]" />
              <span>{lang === 'es' ? 'Detalle de Escaleras' : 'Staircase Specification'}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{lang === 'es' ? '17 Escalones Square Step Nose' : '17 Square Step Noses'}</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-[#000000] tracking-tight">
            Square Step Nose — <span>{lang === 'es' ? '17 Escalones a Juego' : '17 Matching Custom Steps'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            {lang === 'es'
              ? `Fabricados exclusivamente en el mismo tono #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness}) para Siena Reserve.`
              : `Manufactured in the exact matching tone #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness}) for Siena Reserve.`}
          </p>
        </div>

        {/* Cost Tag */}
        <div className="flex items-center gap-3 bg-[#FFFBF7] p-3 rounded-2xl border border-[#FF8407]/30 self-start sm:self-center shrink-0">
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

      {/* =========================================================================
          ROW 1: TWO TECHNICAL IMAGES (Perfil Square Step Nose y Diagrama de Ensamble)
      ========================================================================= */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F172A]">
              <span>{lang === 'es' ? '1. Perfil y Diagrama de Ensamble' : '1. Profile & Assembly Technical Images'}</span>
            </h4>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {lang === 'es' ? '2 Imágenes Técnicas' : '2 Technical Images'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stairTechnicalImages.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#CBD5E1] flex flex-col justify-between group hover:border-[#FF8407] transition-all shadow-xs"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-[#0F172A]">
                      {lang === 'es' ? item.title : item.titleEn}
                    </h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {lang === 'es' ? item.subtitle : item.subtitleEn}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/30 text-[10px] font-black uppercase shrink-0">
                    {lang === 'es' ? item.tag : item.tagEn}
                  </span>
                </div>

                {/* Clean Image Container with Zoom capability */}
                <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={lang === 'es' ? item.title : item.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Zoom Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedLightbox({
                        src: item.imageUrl,
                        title: lang === 'es' ? item.title : item.titleEn,
                        subtitle: lang === 'es' ? item.subtitle : item.subtitleEn,
                      })
                    }
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition-all border border-white/20 shadow-md"
                    title={lang === 'es' ? 'Ver imagen en grande' : 'Enlarge view'}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-bold text-slate-700">
                  {lang === 'es' ? 'Acabado:' : 'Finish:'}
                </span>
                <span className="font-bold text-emerald-700">
                  {lang === 'es' ? 'Zero Overlap • Cero Tropiezos' : 'Zero Overlap • Smooth Flush'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ROW 2: TWO 9:16 VERTICAL CARDS (CLEAN IMAGES WITHOUT OVERLAY TEXT)
      ========================================================================= */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F172A]">
              <span>{lang === 'es' ? '2. Formato Vertical 9:16' : '2. Vertical 9:16 Showcase'}</span>
            </h4>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {lang === 'es' ? 'Fotografía Limpia' : 'Clean Photography'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {stairVerticalCards.map((card) => {
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#CBD5E1] shadow-md flex flex-col group hover:border-[#FF8407] transition-all"
              >
                {/* 9:16 Clean Photo Frame (No text covering the photo) */}
                <div className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={card.imageUrl}
                    alt={lang === 'es' ? card.title : card.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Top Badge & Zoom Button */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-black text-[#FF8407] border border-white/20 uppercase tracking-wider">
                      {lang === 'es' ? card.badge : card.badgeEn}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedLightbox({
                          src: card.imageUrl,
                          title: lang === 'es' ? card.title : card.titleEn,
                          subtitle: lang === 'es' ? card.subtitle : card.subtitleEn,
                        })
                      }
                      className="p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition-all border border-white/20 shadow-md"
                      title={lang === 'es' ? 'Ver en grande' : 'Enlarge view'}
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                    </button>
                  </div>
                </div>

                {/* Clean Caption Card Below Photo */}
                <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <h5 className="text-sm font-black text-[#0F172A]">
                    {lang === 'es' ? card.title : card.titleEn}
                  </h5>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {lang === 'es' ? card.subtitle : card.subtitleEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ROW 3: CAROUSEL CARD (CLEAN PHOTOS WITHOUT OVERLAY TEXT)
      ========================================================================= */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F172A]">
              <span>{lang === 'es' ? '3. Galería de Escaleras Instaladas' : '3. Installed Staircases Gallery'}</span>
            </h4>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {carouselIndex + 1} / {stairCarouselItems.length}
          </span>
        </div>

        <div
          className="relative bg-white rounded-3xl overflow-hidden border border-[#CBD5E1] shadow-xl group"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
        >
          {/* Main Slide Image (Completely clean without text blocks) */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-950">
            <img
              key={activeStairProject.id}
              src={activeStairProject.imageUrl}
              alt={lang === 'es' ? activeStairProject.title : activeStairProject.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-700 animate-fadeIn"
            />

            {/* Discreet Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-black text-[#FF8407] border border-white/20">
                {activeStairProject.community}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FF8407] text-black text-[10px] font-black">
                {activeStairProject.stepsCount} {lang === 'es' ? 'Escalones' : 'Steps'}
              </span>
            </div>

            {/* Zoom Button */}
            <button
              type="button"
              onClick={() =>
                setSelectedLightbox({
                  src: activeStairProject.imageUrl,
                  title: lang === 'es' ? activeStairProject.title : activeStairProject.titleEn,
                  subtitle: `${activeStairProject.community} • ${activeStairProject.colorName}`,
                })
              }
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition-all border border-white/20 shadow-lg"
              title={lang === 'es' ? 'Ver en pantalla completa' : 'Full screen'}
            >
              <Maximize2 className="w-4 h-4 text-[#FF8407]" />
            </button>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrevCarousel}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 cursor-pointer transition-all hover:scale-110 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={handleNextCarousel}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 cursor-pointer transition-all hover:scale-110 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Clean Description & Thumbnails Below Photo */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="text-base font-black text-[#0F172A]">
                {lang === 'es' ? activeStairProject.title : activeStairProject.titleEn}
              </h5>
              <p className="text-xs text-[#64748B] mt-0.5">
                {lang === 'es' ? activeStairProject.description : activeStairProject.descriptionEn}
              </p>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto shrink-0">
              {stairCarouselItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-11 w-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    carouselIndex === idx
                      ? 'border-[#FF8407] scale-105 ring-2 ring-[#FF8407]/40'
                      : 'border-slate-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= TECHNICAL NOTICE BOX ================= */}
      <div className="p-4 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-start gap-3 text-xs text-[#334155]">
        <Info className="w-4 h-4 text-[#FF8407] mt-0.5 shrink-0" />
        <div>
          <strong className="text-[#0F172A] block font-black">
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

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {selectedLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setSelectedLightbox(null)}
        >
          <div
            className="bg-[#0F172A] rounded-3xl p-4 sm:p-5 max-w-5xl w-full border border-slate-700 shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
              <div>
                <h4 className="font-black text-base sm:text-lg text-white">
                  {selectedLightbox.title}
                </h4>
                {selectedLightbox.subtitle && (
                  <p className="text-xs text-slate-400 mt-0.5">{selectedLightbox.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedLightbox(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[78vh] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedLightbox.src}
                alt={selectedLightbox.title}
                referrerPolicy="no-referrer"
                className="max-h-[78vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

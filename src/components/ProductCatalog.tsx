import React, { useState, useRef, useEffect } from 'react';
import { FlooringCategory, FlooringProduct } from '../types';
import { FLOORING_PRODUCTS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Layers,
  Search,
  Eye,
  Check,
  ShieldAlert,
  ShieldCheck,
  Package,
  Ruler,
  SlidersHorizontal,
  Star,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Camera,
} from 'lucide-react';

interface ProductCatalogProps {
  selectedProduct: FlooringProduct;
  productsList?: FlooringProduct[];
  onSelectProduct: (product: FlooringProduct) => void;
  onOpenBookingWithProduct?: (product: FlooringProduct) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedProduct,
  productsList = FLOORING_PRODUCTS,
  onSelectProduct,
  onOpenBookingWithProduct,
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<FlooringCategory>('8mm');
  const [toneFilter, setToneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<FlooringProduct | null>(null);

  const thicknessScrollRef = useRef<HTMLDivElement>(null);
  const toneScrollRef = useRef<HTMLDivElement>(null);

  const ROOMVO_VISUALIZER_URL = 'https://www.roomvo.com/my/flooringwaterproof/';

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Auto-scroll active filter chips into view
  useEffect(() => {
    if (thicknessScrollRef.current) {
      const activeEl = thicknessScrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (toneScrollRef.current) {
      const activeEl = toneScrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [toneFilter]);

  const filteredProducts = productsList.filter((prod) => {
    if (prod.category !== activeTab) return false;
    if (toneFilter !== 'all' && prod.tone !== toneFilter) return false;
    if (searchQuery.trim() && !prod.name.toLowerCase().includes(searchQuery.toLowerCase()) && !prod.code.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  const categorySpecs = {
    '8mm': {
      collection: lang === 'es' ? 'Colección Flagship SPC Impermeable' : 'Waterproof Rigid Core SPC Flagship',
      wearLayer: '22 Mil (Ultra Heavy Commercial)',
      thickness: '8.0 mm',
      padding: '2.0 mm HD EVA Acoustic Shield',
      plankSize: '7" x 48" / 9" x 60"',
      planksBox: lang === 'es' ? '6 Tablones' : '6 Planks',
      sqftBox: '20.15 sq ft',
      finish: 'Satin Luxury Embossed (EIR)',
      installation: 'Precision Angle-Angle Click',
    },
    '5.5mm': {
      collection: lang === 'es' ? 'Colección Clásica SPC Impermeable' : 'Waterproof Rigid Core SPC Classic',
      wearLayer: '20 Mil (Commercial Grade)',
      thickness: '5.5 mm',
      padding: '1.5 mm HD EVA Attached',
      plankSize: '7" x 48"',
      planksBox: lang === 'es' ? '9 Tablones' : '9 Planks',
      sqftBox: '24.26 sq ft',
      finish: 'Satin Embossed Texture',
      installation: 'Angle-Angle Click',
    },
    '6mm': {
      collection: 'PulseShield XL Extended',
      wearLayer: '20 Mil',
      thickness: '6.0 mm',
      padding: '1.5 mm HD EVA Attached',
      plankSize: '9" x 60" (Grand XL)',
      planksBox: lang === 'es' ? '7 Tablones' : '7 Planks',
      sqftBox: '26.60 sq ft',
      finish: 'Satin EIR Embossed',
      installation: 'Angle-Angle Click',
    },
  };

  const currentSpecs = categorySpecs[activeTab];

  return (
    <section id="catalog" className="w-full py-6 sm:py-10 bg-[#FFFFFF] text-[#111827] font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================
            TOP ACTION: ROOM VISUALIZER (ROOMVO) CALLOUT BUTTON
            (Placed cleanly first as requested)
        ======================================================== */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4 sm:p-5 rounded-3xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-[#334155]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8407]/20 border border-[#FF8407]/40 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-[#FF8407]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white">
                  {lang === 'es' ? 'Room Visualizer 3D (Roomvo)' : '3D Room Visualizer Studio (Roomvo)'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF8407] text-black uppercase tracking-wider">
                  Live 3D
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed">
                {lang === 'es'
                  ? 'Sube una foto de tu habitación o sala para previsualizar los colores de pisos SPC en tu espacio real.'
                  : 'Upload or snap a photo of your space to test genuine SPC vinyl plank textures in realistic 3D.'}
              </p>
            </div>
          </div>

          <a
            href={ROOMVO_VISUALIZER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-2xl bg-[#FF8407] hover:bg-[#ff952a] text-black flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-black shrink-0" />
            <span className="truncate">
              {lang === 'es' ? 'Abrir Room Visualizer 3D' : 'Open 3D Room Visualizer'}
            </span>
            <ExternalLink className="w-4 h-4 text-black shrink-0" />
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'COLECCIÓN & ACABADOS' : 'SHOWROOM FINISHES'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
            Waterproof Rigid Core <span className="text-[#FF8407]">SPC Vinyl Floor</span>
          </h2>
          <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
            {lang === 'es'
              ? 'Espesor de 8.0mm con capa de desgaste de 22 Mils y 5.5mm con 20 Mils. 100% impermeable con escaleras fabricadas con los mismos tablones.'
              : '8.0mm Flagship with 22 Mils wear layer & 5.5mm Classic with 20 Mils. 100% waterproof with stairs crafted from matching planks.'}
          </p>
        </div>

        {/* Search & Filter Controls: Clean Stacked Hierarchy */}
        <div className="space-y-4 bg-[#F8FAFC] p-4 sm:p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
          {/* Row 1: Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                lang === 'es'
                  ? 'Buscar color por nombre o código (ej: Liv Oak, #347)...'
                  : 'Search color or code (e.g. Liv Oak, #347)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF8407] focus:border-[#FF8407] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9] cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Row 2: Thickness & Wear Layer Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                {lang === 'es' ? '1. Espesor SPC & Capa de Desgaste:' : '1. SPC Thickness & Wear Layer:'}
              </span>
              <span className="text-[10px] text-[#94A3B8] sm:hidden font-medium">
                {lang === 'es' ? 'Desliza horizontalmente →' : 'Scroll horizontally →'}
              </span>
            </div>

            <div className="relative group">
              {/* Desktop Scroll Arrows */}
              <button
                type="button"
                onClick={() => scrollHorizontally(thicknessScrollRef, -200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Anterior espesor"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally(thicknessScrollRef, 200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Siguiente espesor"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Gradient Fade Cue */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10"></div>

              <div
                ref={thicknessScrollRef}
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth p-1 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {(['8mm', '5.5mm', '6mm'] as FlooringCategory[]).map((cat) => {
                  const isActive = activeTab === cat;
                  const count = productsList.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      data-active={isActive ? 'true' : 'false'}
                      onClick={() => {
                        setActiveTab(cat);
                        setToneFilter('all');
                      }}
                      className={`snap-start shrink-0 min-w-fit px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#000000] text-[#FFFFFF] shadow-sm ring-1 ring-black'
                          : 'text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#000000]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{cat} SPC</span>
                        <span className="text-[10px] opacity-85 font-bold">
                          ({cat === '8mm' ? '22 Mils Flagship' : '20 Mils'})
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/10 text-current font-bold">
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Wood Tone Filters */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                {lang === 'es' ? '2. Tono de Madera / Matiz:' : '2. Wood Tone & Shade:'}
              </span>
              <span className="text-[10px] text-[#94A3B8] sm:hidden font-medium">
                {lang === 'es' ? 'Desliza horizontalmente →' : 'Scroll horizontally →'}
              </span>
            </div>

            <div className="relative group">
              {/* Desktop Scroll Arrows */}
              <button
                type="button"
                onClick={() => scrollHorizontally(toneScrollRef, -200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Anterior tono"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally(toneScrollRef, 200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Siguiente tono"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Gradient Fade Cue */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-10"></div>

              <div
                ref={toneScrollRef}
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth p-1 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {[
                  { id: 'all', label: lang === 'es' ? 'Todos los Tonos' : 'All Tones' },
                  { id: 'warm', label: lang === 'es' ? 'Cálido / Roble Dorado' : 'Warm Oak' },
                  { id: 'cool', label: lang === 'es' ? 'Gris / Loft Moderno' : 'Cool Gray' },
                  { id: 'natural', label: lang === 'es' ? 'Roble Natural' : 'Natural Oak' },
                  { id: 'dark', label: lang === 'es' ? 'Oscuro / Nogal' : 'Dark Walnut' },
                  { id: 'light', label: lang === 'es' ? 'Claro / Lino Nórdico' : 'Light Nordic' },
                ].map((t) => {
                  const isActive = toneFilter === t.id;
                  return (
                    <button
                      key={t.id}
                      data-active={isActive ? 'true' : 'false'}
                      onClick={() => setToneFilter(t.id)}
                      className={`snap-start shrink-0 min-w-fit px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#FF8407] text-black shadow-xs font-black ring-1 ring-[#FF8407]'
                          : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Banner */}
        <div className="bg-[#F8FAFC] text-[#111827] rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E2E8F0]">
            <div>
              <span className="text-[10px] font-black text-[#FF8407] uppercase tracking-widest">
                {lang === 'es' ? 'FICHA TÉCNICA QUICK SURFACES' : 'QUICK SURFACES SPEC SHEET'}
              </span>
              <h3 className="text-xl font-black text-[#000000] tracking-tight">
                {currentSpecs.collection} ({activeTab})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/40">
                100% Waterproof Rigid Core
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFFFFF] text-[#000000] border border-[#E2E8F0]">
                {lang === 'es' ? 'Muestras Físicas en Mano' : 'Doorstep Samples'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Wear Layer</p>
              <p className="font-black text-[#FF8407] text-sm mt-0.5">{currentSpecs.wearLayer}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">{lang === 'es' ? 'Espesor' : 'Thickness'}</p>
              <p className="font-black text-[#000000] text-sm mt-0.5">{currentSpecs.thickness}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Padding</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.padding}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">{lang === 'es' ? 'Tablones / Caja' : 'Planks / Box'}</p>
              <p className="font-bold text-[#000000] text-sm mt-0.5">{currentSpecs.planksBox}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">{lang === 'es' ? 'Dimensiones' : 'Plank Size'}</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.plankSize}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Sqft / Box</p>
              <p className="font-black text-[#FF8407] text-sm mt-0.5">{currentSpecs.sqftBox}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">{lang === 'es' ? 'Acabado' : 'Finish'}</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.finish}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">{lang === 'es' ? 'Instalación' : 'Installation'}</p>
              <p className="font-bold text-[#FF8407] text-xs mt-0.5">{currentSpecs.installation}</p>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isCurrentlyVisualized = prod.id === selectedProduct.id;

            return (
              <div
                key={prod.id}
                className={`group rounded-3xl bg-[#FFFFFF] border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isCurrentlyVisualized
                    ? 'border-[#FF8407] shadow-xl ring-2 ring-[#FF8407]/40'
                    : 'border-[#E2E8F0] shadow-sm hover:border-[#94A3B8]'
                }`}
              >
                <div>
                  {/* Swatch Image Preview */}
                  <div className="relative h-48 bg-[#F1F5F9] overflow-hidden">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tone Color Bar */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-3 border-t border-black/10"
                      style={{ backgroundColor: prod.colorHex }}
                    ></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/80 text-[#FFFFFF] px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        #{prod.code}
                      </span>
                      {prod.category === '8mm' && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF8407] text-[#000000] px-2 py-0.5 rounded-full shadow-sm">
                          8.0mm / 22 Mil
                        </span>
                      )}
                      {prod.stockStatus === 'low_stock' && (
                        <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                          {lang === 'es' ? 'Poco Stock' : 'Low Stock'}
                        </span>
                      )}
                      {prod.stockStatus === 'out_of_stock' && (
                        <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          {lang === 'es' ? 'Agotado' : 'Out of Stock'}
                        </span>
                      )}
                      {prod.stockStatus === 'coming_soon' && (
                        <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          {lang === 'es' ? 'Próximamente' : 'Coming Soon'}
                        </span>
                      )}
                      {(!prod.stockStatus || prod.stockStatus === 'in_stock') && (
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          {lang === 'es' ? 'En Stock' : 'In Stock'}
                        </span>
                      )}
                    </div>

                    {isCurrentlyVisualized && (
                      <div className="absolute top-3 right-3 bg-[#FF8407] text-[#000000] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{lang === 'es' ? 'Activo' : 'Active'}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black text-[#FF8407] uppercase tracking-wider">
                        {prod.collectionName}
                      </span>
                      <span className="text-xs text-[#64748B] font-medium capitalize">
                        {prod.tone} {lang === 'es' ? 'Tono' : 'Tone'}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-[#000000] tracking-tight group-hover:text-[#FF8407] transition-colors">
                      {prod.name}
                    </h4>

                    <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#64748B] block">{lang === 'es' ? 'Espesor:' : 'Thickness:'}</span>
                        <span className="font-bold text-[#000000]">{prod.thickness}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">{lang === 'es' ? 'Capa Desgaste:' : 'Wear Layer:'}</span>
                        <span className="font-bold text-[#FF8407]">{prod.wearLayer}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => onSelectProduct(prod)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCurrentlyVisualized
                        ? 'bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]'
                        : 'bg-[#000000] hover:bg-[#1E293B] text-[#FFFFFF] shadow-xs'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FF8407]" />
                    <span>
                      {isCurrentlyVisualized
                        ? lang === 'es'
                          ? 'En Visualizador'
                          : 'Selected'
                        : lang === 'es'
                        ? 'Ver en Modelo'
                        : 'View on Model'}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveModalProduct(prod)}
                    className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#94A3B8] text-[#000000] text-xs font-bold bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    title={lang === 'es' ? 'Ver Ficha' : 'View Specs'}
                  >
                    {lang === 'es' ? 'Ficha' : 'Specs'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Technical Specs */}
        {activeModalProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 sm:p-7 text-[#111827] relative shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#FF8407] uppercase">
                    {lang === 'es' ? 'Ficha Técnica & Tablón Real' : 'Technical Specs & Genuine Plank'}
                  </span>
                  <h4 className="text-xl font-black text-[#000000]">{activeModalProduct.name}</h4>
                </div>
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#000000] flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Plank Photo Preview in Modal */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] h-32 relative">
                  <img
                    src={activeModalProduct.plankImageUrl || activeModalProduct.imageUrl}
                    alt={activeModalProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/80 text-[#FFFFFF] text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {lang === 'es' ? 'Tablón HD' : 'HD Plank'}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] h-32 relative">
                  <img
                    src={activeModalProduct.roomPreviewUrl || activeModalProduct.imageUrl}
                    alt={activeModalProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/80 text-[#FFFFFF] text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {lang === 'es' ? 'Instalación' : 'Room View'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">{lang === 'es' ? 'Código:' : 'Item Code:'}</span>
                  <span className="font-mono font-bold text-[#000000]">#{activeModalProduct.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">{lang === 'es' ? 'Espesor Total:' : 'Total Thickness:'}</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.thickness}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">{lang === 'es' ? 'Capa de Desgaste (Wear Layer):' : 'Wear Layer:'}</span>
                  <span className="font-bold text-[#FF8407]">{activeModalProduct.wearLayer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">{lang === 'es' ? 'Dimensiones de Tablón:' : 'Plank Dimensions:'}</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.plankDimensions}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">{lang === 'es' ? 'Bajo Piso Acústico:' : 'Acoustic Underlayment:'}</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.padding}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">{lang === 'es' ? 'Instalación en Escaleras:' : 'Staircase Match:'}</span>
                  <span className="font-bold text-[#FF8407]">
                    {lang === 'es' ? '15 Escalones con mismos tablones' : '15 Custom Matching Steps'}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    onSelectProduct(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-xs cursor-pointer shadow-md"
                >
                  {lang === 'es' ? 'Aplicar al Visualizador / Cotizar' : 'Apply to Floor Plan / Quote'}
                </button>
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#000000] font-bold text-xs cursor-pointer"
                >
                  {lang === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

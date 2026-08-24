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
  Package,
  Ruler,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Camera,
  ShieldCheck,
  Zap,
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
  const { lang } = useLanguage();
  
  // Three-Level Filtering matching StepWizard Step 2
  const [selectedProductType, setSelectedProductType] = useState<'vinyl' | 'laminate' | 'hardwood'>('vinyl');
  const [activeCategory, setActiveCategory] = useState<'all' | FlooringCategory>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<FlooringProduct | null>(null);

  const productTypeScrollRef = useRef<HTMLDivElement>(null);
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
  }, [activeCategory]);

  useEffect(() => {
    if (toneScrollRef.current) {
      const activeEl = toneScrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [toneFilter]);

  const filteredProducts = productsList.filter((prod) => {
    // 1. Filter by Product Type (vinyl / laminate / hardwood)
    const prodType = prod.productType || 'vinyl';
    if (prodType !== selectedProductType) return false;

    // 2. Filter by Specific SPC Category / Thickness (if vinyl)
    if (selectedProductType === 'vinyl' && activeCategory !== 'all') {
      if (prod.category !== activeCategory) return false;
    }

    // 3. Filter by Color Tone
    if (toneFilter !== 'all' && prod.tone !== toneFilter) return false;

    // 4. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchCode = prod.code.toLowerCase().includes(q);
      const matchColl = prod.collectionName.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchColl) return false;
    }

    return true;
  });

  // Dynamic Technical Specs Sheet based on current selection
  const getCategorySpecs = () => {
    if (selectedProductType === 'laminate') {
      return {
        collection: lang === 'es' ? 'Colección Laminate Elite AC4' : 'Laminate Elite AC4 Collection',
        wearLayer: 'AC4 Commercial Scratch Resistance',
        thickness: '12.0 mm',
        padding: '2.0 mm Acoustic Underlayment',
        plankSize: '7.7" x 50.6"',
        planksBox: lang === 'es' ? '8 Tablones' : '8 Planks',
        sqftBox: '21.50 sq ft',
        finish: 'Real Wood Texture Matte',
        installation: 'Uniclic Angle-Tap Floating',
      };
    }
    if (selectedProductType === 'hardwood') {
      return {
        collection: lang === 'es' ? 'Colección Hardwood Prestige 1/2"' : 'Hardwood Prestige 1/2" Collection',
        wearLayer: '3.0 mm Real European Sawn Face',
        thickness: '1/2" (12.7 mm)',
        padding: 'Acoustic Sound Barrier Glue-Down',
        plankSize: '7.5" x Random up to 75"',
        planksBox: lang === 'es' ? '6 Tablones' : '6 Planks',
        sqftBox: '22.80 sq ft',
        finish: 'UV Cured Matte Urethane',
        installation: 'Tongue & Groove / Glue-Assist',
      };
    }
    // SPC Vinyl
    if (activeCategory === '5.5mm') {
      return {
        collection: lang === 'es' ? 'Colección Pulse Select (5.5mm)' : 'Pulse Select Collection (5.5mm)',
        wearLayer: '20 Mil Commercial Grade',
        thickness: '5.5 mm',
        padding: '1.5 mm HD EVA Foam Attached',
        plankSize: '7" x 48"',
        planksBox: lang === 'es' ? '9 Tablones' : '9 Planks',
        sqftBox: '24.26 sq ft',
        finish: 'Embossed in Register (EIR)',
        installation: 'Unilin Click-Lock System',
      };
    }
    if (activeCategory === '6mm') {
      return {
        collection: lang === 'es' ? 'Colección Pulse Shield XL (6.0mm)' : 'Pulse Shield XL Collection (6.0mm)',
        wearLayer: '20 Mil Commercial Grade',
        thickness: '6.0 mm',
        padding: '1.5 mm HD EVA Sound Insulation',
        plankSize: '9" x 60" (Grand XL)',
        planksBox: lang === 'es' ? '7 Tablones' : '7 Planks',
        sqftBox: '26.60 sq ft',
        finish: 'EIR Grand Plank Surface',
        installation: 'Drop-Lock XL System',
      };
    }
    // Default 8.0mm or all
    return {
      collection: lang === 'es' ? 'Colección Flagship XL Pulse (8.0mm)' : 'Flagship XL Pulse Collection (8.0mm)',
      wearLayer: '22 Mil (Ultra Heavy Commercial)',
      thickness: '8.0 mm',
      padding: '2.0 mm High-Density IXPE Sound Pad',
      plankSize: '9" x 60" (Grand Plank)',
      planksBox: lang === 'es' ? '5 Tablones' : '5 Planks',
      sqftBox: '19.29 sq ft',
      finish: 'Satin Luxury Embossed (EIR)',
      installation: 'Click-Lock Heavy Duty',
    };
  };

  const currentSpecs = getCategorySpecs();

  return (
    <section id="catalog" className="w-full py-4 sm:py-8 bg-[#FFFFFF] text-[#111827] font-sans">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        
        {/* ========================================================
            TOP ACTION: ROOM VISUALIZER (ROOMVO) CALLOUT BANNER
        ======================================================== */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4 sm:p-5 rounded-3xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-[#334155]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8407]/20 border border-[#FF8407]/40 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-[#FF8407]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white">
                  {lang === 'es' ? 'Room Visualizer 3D (Roomvo Studio)' : '3D Room Visualizer Studio (Roomvo)'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF8407] text-black uppercase tracking-wider">
                  Live 3D
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed">
                {lang === 'es'
                  ? 'Sube una foto de tu espacio en Siena Reserve para probar los pisos en tu habitación real.'
                  : 'Upload or snap a photo of your space to test genuine flooring shades in realistic 3D.'}
              </p>
            </div>
          </div>

          <a
            href={ROOMVO_VISUALIZER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#ff952a] text-black flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-black shrink-0" />
            <span className="truncate">
              {lang === 'es' ? 'Abrir Visualizador 3D' : 'Open 3D Visualizer'}
            </span>
            <ExternalLink className="w-4 h-4 text-black shrink-0" />
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'CATÁLOGO DE PISOS & ACABADOS' : 'SHOWROOM FINISHES & CATALOG'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#000000] tracking-tight">
            Materiales Premium & <span className="text-[#FF8407]">Pisos SPC Impermeables</span>
          </h2>
          <p className="mt-2 text-[#4B5563] text-xs sm:text-sm leading-relaxed">
            {lang === 'es'
              ? 'Explora las colecciones certificadas de pisos vinílicos SPC rígidos, laminados AC4 y maderas nobles diseñadas para Siena Reserve.'
              : 'Browse certified waterproof rigid core SPC, AC4 laminates and engineered hardwoods designed for Siena Reserve.'}
          </p>
        </div>

        {/* ========================================================
            FILTER CONTROLS CONTAINER: SYNCHRONIZED WITH STEP 2
        ======================================================== */}
        <div className="space-y-4 bg-[#F8FAFC] p-3.5 sm:p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
          {/* Row 1: Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                lang === 'es'
                  ? 'Buscar por nombre, código (#01, #3.2...) o colección...'
                  : 'Search by color, code (#01, #3.2...) or collection...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF8407] focus:border-[#FF8407] shadow-2xs transition-all"
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

          {/* Row 2: Filter 1 - Product Type (Vinyl / Laminate / Hardwood) */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A] block mb-2 px-0.5">
              {lang === 'es' ? '1. Tipo de Material / Producto:' : '1. Product Type / Material:'}
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedProductType('vinyl');
                  setActiveCategory('all');
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between min-h-[48px] ${
                  selectedProductType === 'vinyl'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                    : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black block">Pisos Vinílicos SPC</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#FF8407] text-black font-black rounded-sm uppercase">Top</span>
                  </div>
                  <span className="text-[10px] opacity-75">100% Impermeables • 5.5mm a 8.0mm</span>
                </div>
                {selectedProductType === 'vinyl' && <Check className="w-4 h-4 text-[#FF8407] shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProductType('laminate');
                  setActiveCategory('all');
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between min-h-[48px] ${
                  selectedProductType === 'laminate'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                    : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm font-black block">Piso Laminado AC4</span>
                  <span className="text-[10px] opacity-75">12.0mm • Scratch Guard Ultra</span>
                </div>
                {selectedProductType === 'laminate' && <Check className="w-4 h-4 text-[#FF8407] shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProductType('hardwood');
                  setActiveCategory('all');
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between min-h-[48px] ${
                  selectedProductType === 'hardwood'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                    : 'bg-[#FFFFFF] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm font-black block">Madera de Ingeniería</span>
                  <span className="text-[10px] opacity-75">1/2&quot; Roble Europeo Genuino</span>
                </div>
                {selectedProductType === 'hardwood' && <Check className="w-4 h-4 text-[#FF8407] shrink-0" />}
              </button>
            </div>
          </div>

          {/* Row 3: Filter 2 - Specific SPC Collection & Thickness (Only if Vinyl is chosen) */}
          {selectedProductType === 'vinyl' && (
            <div>
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A]">
                  {lang === 'es' ? '2. Colección & Espesor SPC:' : '2. SPC Collection & Thickness:'}
                </span>
                <span className="text-[10px] text-[#94A3B8] sm:hidden font-medium">
                  {lang === 'es' ? 'Desliza →' : 'Slide →'}
                </span>
              </div>

              <div className="relative group">
                <button
                  type="button"
                  onClick={() => scrollHorizontally(thicknessScrollRef, -180)}
                  className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Anterior espesor"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollHorizontally(thicknessScrollRef, 180)}
                  className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Siguiente espesor"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div
                  ref={thicknessScrollRef}
                  className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth p-1 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {[
                    { id: 'all', label: 'Todos los Espesores' },
                    { id: '5.5mm', label: '5.5 mm — Pulse Select' },
                    { id: '6mm', label: '6.0 mm — Pulse Shield XL' },
                    { id: '8mm', label: '8.0 mm — XL Pulse (Flagship)' },
                  ].map((item) => {
                    const isActive = activeCategory === item.id;
                    const count = item.id === 'all' 
                      ? productsList.filter(p => p.productType === 'vinyl').length
                      : productsList.filter(p => p.productType === 'vinyl' && p.category === item.id).length;

                    return (
                      <button
                        key={item.id}
                        data-active={isActive ? 'true' : 'false'}
                        type="button"
                        onClick={() => setActiveCategory(item.id as any)}
                        className={`snap-start shrink-0 min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#FF8407] text-black shadow-xs font-black ring-1 ring-[#FF8407]'
                            : 'bg-[#F8FAFC] text-[#64748B] border border-[#CBD5E1] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-current font-bold">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Row 4: Filter 3 - Color Tone */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A]">
                {selectedProductType === 'vinyl' ? '3. Tono de Color:' : '2. Tono de Color:'}
              </span>
              <span className="text-[10px] text-[#94A3B8] sm:hidden font-medium">
                {lang === 'es' ? 'Desliza →' : 'Slide →'}
              </span>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => scrollHorizontally(toneScrollRef, -180)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Anterior tono"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally(toneScrollRef, 180)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Siguiente tono"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div
                ref={toneScrollRef}
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth p-1 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {[
                  { id: 'all', label: lang === 'es' ? 'Todos los Tonos' : 'All Tones' },
                  { id: 'warm', label: lang === 'es' ? 'Cálido (Warm)' : 'Warm Oak' },
                  { id: 'cool', label: lang === 'es' ? 'Frío / Gris (Cool)' : 'Cool Gray' },
                  { id: 'natural', label: lang === 'es' ? 'Natural' : 'Natural Oak' },
                  { id: 'light', label: lang === 'es' ? 'Claro (Light)' : 'Light Nordic' },
                  { id: 'dark', label: lang === 'es' ? 'Oscuro (Dark)' : 'Dark Walnut' },
                ].map((t) => {
                  const isActive = toneFilter === t.id;
                  return (
                    <button
                      key={t.id}
                      data-active={isActive ? 'true' : 'false'}
                      type="button"
                      onClick={() => setToneFilter(t.id)}
                      className={`snap-start shrink-0 min-h-[38px] px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#0F172A] text-white shadow-xs font-black ring-1 ring-[#0F172A]'
                          : 'bg-[#F8FAFC] text-[#64748B] border border-[#CBD5E1] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
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
        <div className="bg-[#F8FAFC] text-[#111827] rounded-3xl p-4 sm:p-6 border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#E2E8F0]">
            <div>
              <span className="text-[10px] font-black text-[#FF8407] uppercase tracking-widest block">
                {lang === 'es' ? 'FICHA TÉCNICA CERTIFICADA' : 'CERTIFIED SPEC SHEET'}
              </span>
              <h3 className="text-base sm:text-xl font-black text-[#000000] tracking-tight">
                {currentSpecs.collection}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{selectedProductType === 'vinyl' ? '100% Waterproof Rigid Core' : 'Premium Finish'}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">Wear Layer</p>
              <p className="font-black text-[#FF8407] text-xs sm:text-sm mt-0.5 truncate">{currentSpecs.wearLayer}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">{lang === 'es' ? 'Espesor' : 'Thickness'}</p>
              <p className="font-black text-[#000000] text-xs sm:text-sm mt-0.5">{currentSpecs.thickness}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">Padding</p>
              <p className="font-bold text-[#000000] text-[11px] mt-0.5 truncate">{currentSpecs.padding}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">{lang === 'es' ? 'Tablones / Caja' : 'Planks / Box'}</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.planksBox}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">{lang === 'es' ? 'Dimensiones' : 'Plank Size'}</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5 truncate">{currentSpecs.plankSize}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">Sqft / Box</p>
              <p className="font-black text-[#FF8407] text-xs sm:text-sm mt-0.5">{currentSpecs.sqftBox}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">{lang === 'es' ? 'Acabado' : 'Finish'}</p>
              <p className="font-bold text-[#000000] text-[11px] mt-0.5 truncate">{currentSpecs.finish}</p>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold">{lang === 'es' ? 'Instalación' : 'Installation'}</p>
              <p className="font-bold text-[#FF8407] text-[11px] mt-0.5 truncate">{currentSpecs.installation}</p>
            </div>
          </div>
        </div>

        {/* Product Cards Grid with Mobile Touch-First Layout */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
              {lang === 'es'
                ? `Colores Disponibles (${filteredProducts.length})`
                : `Available Finishes (${filteredProducts.length})`}
            </span>
            <span className="text-[11px] text-[#64748B]">
              {lang === 'es' ? 'Toca para aplicar al cotizador' : 'Tap to apply to quote'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-3xl p-8 text-center">
              <p className="text-sm font-bold text-[#64748B]">
                {lang === 'es' ? 'No se encontraron colores con los filtros seleccionados.' : 'No flooring finishes found.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setToneFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold cursor-pointer"
              >
                {lang === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => {
                const isCurrentlyVisualized = prod.id === selectedProduct.id;

                return (
                  <div
                    key={prod.id}
                    className={`group rounded-3xl bg-[#FFFFFF] border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                      isCurrentlyVisualized
                        ? 'border-[#FF8407] shadow-xl ring-2 ring-[#FF8407]/50'
                        : 'border-[#E2E8F0] shadow-xs hover:border-[#94A3B8] hover:shadow-md'
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
                          <span className="text-[10px] font-black uppercase tracking-wider bg-black/85 text-[#FFFFFF] px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                            #{prod.code}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF8407] text-[#000000] px-2 py-0.5 rounded-full shadow-xs">
                            {prod.thickness}
                          </span>
                          {prod.stockStatus === 'low_stock' && (
                            <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                              {lang === 'es' ? 'Poco Stock' : 'Low Stock'}
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
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-black text-[#FF8407] uppercase tracking-wider">
                            {prod.collectionName}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-medium capitalize">
                            {prod.tone} {lang === 'es' ? 'Tono' : 'Tone'}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-[#000000] tracking-tight group-hover:text-[#FF8407] transition-colors">
                          {prod.name}
                        </h4>

                        <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px]">
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
                    <div className="p-4 sm:p-5 pt-0 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(prod)}
                        className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrentlyVisualized
                            ? 'bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]'
                            : 'bg-[#000000] hover:bg-[#1E293B] text-[#FFFFFF] shadow-xs active:scale-[0.98]'
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
                        type="button"
                        onClick={() => setActiveModalProduct(prod)}
                        className="px-3 min-h-[44px] rounded-xl border border-[#CBD5E1] hover:border-[#94A3B8] text-[#000000] text-xs font-bold bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0"
                        title={lang === 'es' ? 'Ver Ficha' : 'View Specs'}
                      >
                        {lang === 'es' ? 'Ficha' : 'Specs'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal for Technical Specs */}
        {activeModalProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-5 sm:p-7 text-[#111827] relative shadow-2xl animate-fadeIn">
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
                  <span className="text-[#64748B]">{lang === 'es' ? 'Colección:' : 'Collection:'}</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.collectionName}</span>
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
                  <span className="text-[#64748B]">{lang === 'es' ? 'Metros / Caja:' : 'Sqft / Box:'}</span>
                  <span className="font-bold text-[#FF8407]">{activeModalProduct.sqftPerBox} sq ft</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    onSelectProduct(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                  className="flex-1 min-h-[44px] py-3 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-xs cursor-pointer shadow-md active:scale-[0.98]"
                >
                  {lang === 'es' ? 'Aplicar al Visualizador / Cotizar' : 'Apply to Floor Plan / Quote'}
                </button>
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 min-h-[44px] py-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#000000] font-bold text-xs cursor-pointer"
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

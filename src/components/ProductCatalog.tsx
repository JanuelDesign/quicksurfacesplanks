import React, { useState, useRef, useEffect } from 'react';
import { FlooringCategory, FlooringProduct } from '../types';
import { FLOORING_PRODUCTS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { StaircaseStepSection } from './StaircaseStepSection';
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
  
  // Thickness Filter (5.5mm, 6.0mm, 8.0mm, all)
  const [activeCategory, setActiveCategory] = useState<'all' | FlooringCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<FlooringProduct | null>(null);

  const ROOMVO_VISUALIZER_URL = 'https://www.roomvo.com/my/flooringwaterproof/';

  const filteredProducts = productsList.filter((prod) => {
    // 1. Only SPC vinyl
    if (prod.productType && prod.productType !== 'vinyl') return false;

    // 2. Filter by Specific SPC Category / Thickness
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }

    // 3. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchCode = prod.code.toLowerCase().includes(q);
      const matchColl = prod.collectionName.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchColl) return false;
    }

    return true;
  });

  return (
    <section id="catalog-section" className="py-10 bg-[#FFFFFF] text-[#111827] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Roomvo 3D Visualizer Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4 sm:p-5 rounded-3xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border border-[#334155]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8407]/20 border border-[#FF8407]/40 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-[#FF8407]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white">
                  {lang === 'es' ? 'Simulador 3D Roomvo en tu Espacio' : '3D Simulator in Your Real Space'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FF8407] text-black uppercase">
                  Roomvo
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {lang === 'es'
                  ? 'Toma una foto de tu espacio en Siena Reserve y prueba los tonos de piso en tiempo real.'
                  : 'Take a photo of your room in Siena Reserve and test flooring shades in real-time.'}
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
            <span>{lang === 'es' ? 'CATÁLOGO DE PISOS VINÍLICOS SPC' : 'SPC LUXURY VINYL CATALOG'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#000000] tracking-tight">
            {lang === 'es' ? (
              <>
                Pisos SPC Impermeables & <span className="text-[#FF8407]">15 Escalones Flush Stair Nose</span>
              </>
            ) : (
              <>
                Waterproof SPC Flooring & <span className="text-[#FF8407]">15 Flush Stair Noses</span>
              </>
            )}
          </h2>
          <p className="mt-2 text-[#4B5563] text-xs sm:text-sm leading-relaxed">
            {lang === 'es'
              ? 'Colecciones certificadas de pisos vinílicos SPC rígidos de 5.5mm, 6.0mm y 8.0mm con piezas Flush Stair Nose a juego para Siena Reserve.'
              : 'Certified rigid core SPC luxury vinyl in 5.5mm, 6.0mm and 8.0mm with matching custom Flush Stair Nose steps for Siena Reserve.'}
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
                  ? 'Buscar por nombre, código (#01, #02, #3.2...) o colección...'
                  : 'Search by color, code (#01, #02, #3.2...) or collection...'
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

          {/* Row 2: Enlarged SPC Collection & Thickness Buttons (No Tone Filter, No Flagship) */}
          <div>
            <div className="flex items-center justify-between mb-2 px-0.5">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F172A]">
                {lang === 'es' ? 'Colección & Espesor SPC:' : 'SPC Collection & Thickness:'}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                {lang === 'es' ? `${filteredProducts.length} tonos disponibles` : `${filteredProducts.length} shades available`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setActiveCategory(activeCategory === '5.5mm' ? 'all' : '5.5mm')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  activeCategory === '5.5mm'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg ring-2 ring-[#FF8407]'
                    : 'bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base font-black">5.5 mm</span>
                    {activeCategory === '5.5mm' && <Check className="w-4 h-4 text-[#FF8407]" />}
                  </div>
                  <span className="text-xs font-bold block opacity-90">Pulse Select</span>
                  <span className="text-[11px] opacity-75 block mt-0.5">20 Mil Wear Layer</span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/40 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF8407]">$1.69 / SF</span>
                  <span className="text-[10px] opacity-70">7" x 48"</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory(activeCategory === '6mm' ? 'all' : '6mm')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  activeCategory === '6mm'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg ring-2 ring-[#FF8407]'
                    : 'bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base font-black">6.0 mm</span>
                    {activeCategory === '6mm' && <Check className="w-4 h-4 text-[#FF8407]" />}
                  </div>
                  <span className="text-xs font-bold block opacity-90">Pulse Shield XL</span>
                  <span className="text-[11px] opacity-75 block mt-0.5">20 Mil • Gran Formato XL</span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/40 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF8407]">$1.89 / SF</span>
                  <span className="text-[10px] opacity-70">9" x 60" XL</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory(activeCategory === '8mm' ? 'all' : '8mm')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  activeCategory === '8mm'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg ring-2 ring-[#FF8407]'
                    : 'bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base font-black">8.0 mm</span>
                    {activeCategory === '8mm' && <Check className="w-4 h-4 text-[#FF8407]" />}
                  </div>
                  <span className="text-xs font-bold block opacity-90">XL Pulse</span>
                  <span className="text-[11px] opacity-75 block mt-0.5">22 Mil Heavy Commercial • Pad IXPE</span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/40 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF8407]">$2.39 / SF</span>
                  <span className="text-[10px] opacity-70">9" x 60" XL</span>
                </div>
              </button>
            </div>

            {activeCategory !== 'all' && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs text-[#FF8407] hover:underline font-bold cursor-pointer"
                >
                  {lang === 'es' ? 'Mostrar todos los espesores' : 'Show all thicknesses'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center bg-[#F8FAFC] rounded-3xl border border-[#CBD5E1]">
              <p className="text-sm text-[#64748B] font-bold">
                {lang === 'es' ? 'No se encontraron productos con estos filtros.' : 'No products found with these filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                          <span className="text-[11px] font-bold text-slate-700">
                            ${prod.pricePerSqft.toFixed(2)} / SF
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

        {/* STAIRCASE SPECIFICATION & 17 STEPS SECTION */}
        <StaircaseStepSection selectedProduct={selectedProduct} />

        {/* Modal for Technical Specs (No staircase photos as per request) */}
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

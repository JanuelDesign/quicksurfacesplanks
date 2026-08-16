import React, { useState } from 'react';
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

  const filteredProducts = productsList.filter((prod) => {
    if (prod.category !== activeTab) return false;
    if (toneFilter !== 'all' && prod.tone !== toneFilter) return false;
    if (searchQuery.trim() && !prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const categorySpecs = {
    '8mm': {
      collection: 'Waterproof Rigid Core SPC Flagship',
      wearLayer: '22 Mil (Ultra Heavy Commercial)',
      thickness: '8.0 mm',
      padding: '2.0 mm HD EVA Acoustic Shield',
      plankSize: '7" x 48" or 9" x 60"',
      planksBox: '6 Planks',
      sqftBox: '20.15 sq ft',
      finish: 'Satin Luxury Embossed (EIR)',
      installation: 'Precision Angle-Angle Click',
    },
    '5.5mm': {
      collection: 'Waterproof Rigid Core SPC Classic',
      wearLayer: '20 Mil (Commercial Grade)',
      thickness: '5.5 mm',
      padding: '1.5 mm HD EVA Attached',
      plankSize: '7" x 48"',
      planksBox: '9 Planks',
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
      planksBox: '7 Planks',
      sqftBox: '26.60 sq ft',
      finish: 'Satin EIR Embossed',
      installation: 'Angle-Angle Click',
    },
  };

  const currentSpecs = categorySpecs[activeTab];

  return (
    <section id="catalog" className="py-16 bg-[#FFFFFF] text-[#111827] border-b border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Slide 8 */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'COLECCIÓN & ACABADOS' : 'SHOWROOM FINISHES'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
            Waterproof Rigid Core <span className="text-[#FF8407]">SPC Vinyl Floor</span>
          </h2>
          <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
            {t('catalogHeaderSubtitle')}
          </p>
        </div>

        {/* Thickness Category Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] w-full sm:w-auto">
            {(['8mm', '5.5mm', '6mm'] as FlooringCategory[]).map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    setToneFilter('all');
                  }}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#000000] text-[#FFFFFF] shadow-md'
                      : 'text-[#64748B] hover:text-[#000000]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{cat} SPC</span>
                    <span className="text-[10px] opacity-80">
                      ({cat === '8mm' ? '22 Mils Flagship' : '20 Mils'})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Tone Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'es' ? 'Buscar color o código...' : 'Search color or code...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF8407] w-full sm:w-52"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] text-xs">
              <button
                onClick={() => setToneFilter('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  toneFilter === 'all' ? 'bg-[#FFFFFF] text-[#000000] shadow-2xs' : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setToneFilter('warm')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  toneFilter === 'warm' ? 'bg-[#FFFFFF] text-[#000000] shadow-2xs' : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                Warm
              </button>
              <button
                onClick={() => setToneFilter('cool')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  toneFilter === 'cool' ? 'bg-[#FFFFFF] text-[#000000] shadow-2xs' : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                Cool / Gray
              </button>
              <button
                onClick={() => setToneFilter('natural')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  toneFilter === 'natural' ? 'bg-[#FFFFFF] text-[#000000] shadow-2xs' : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                Natural Oak
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs Banner matching Slide 8 Specs */}
        <div className="mb-10 bg-[#F8FAFC] text-[#111827] rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E2E8F0]">
            <div>
              <span className="text-[10px] font-black text-[#FF8407] uppercase tracking-widest">
                FICHA TÉCNICA QUICK SURFACES
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
                Muestras Físicas en Mano
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Wear Layer</p>
              <p className="font-black text-[#FF8407] text-sm mt-0.5">{currentSpecs.wearLayer}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Thickness</p>
              <p className="font-black text-[#000000] text-sm mt-0.5">{currentSpecs.thickness}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Padding</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.padding}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Planks / Box</p>
              <p className="font-bold text-[#000000] text-sm mt-0.5">{currentSpecs.planksBox}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Plank Size</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.plankSize}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Sqft / Box</p>
              <p className="font-black text-[#FF8407] text-sm mt-0.5">{currentSpecs.sqftBox}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Finish</p>
              <p className="font-bold text-[#000000] text-xs mt-0.5">{currentSpecs.finish}</p>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px]">Installation</p>
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
                        {prod.code}
                      </span>
                      {prod.category === '8mm' && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF8407] text-[#000000] px-2 py-0.5 rounded-full shadow-sm">
                          8.0mm / 22 Mil
                        </span>
                      )}
                      {prod.stockStatus === 'low_stock' && (
                        <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                          Poco Stock
                        </span>
                      )}
                      {prod.stockStatus === 'out_of_stock' && (
                        <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          Agotado
                        </span>
                      )}
                      {prod.stockStatus === 'coming_soon' && (
                        <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          Próximamente
                        </span>
                      )}
                      {(!prod.stockStatus || prod.stockStatus === 'in_stock') && (
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          En Stock
                        </span>
                      )}
                    </div>

                    {isCurrentlyVisualized && (
                      <div className="absolute top-3 right-3 bg-[#FF8407] text-[#000000] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Activo</span>
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
                        {prod.tone} Tone
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
                        <span className="text-[#64748B] block">Espesor:</span>
                        <span className="font-bold text-[#000000]">{prod.thickness}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Capa Desgaste:</span>
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
                    <span>{isCurrentlyVisualized ? 'En Visualizador' : 'Ver en Modelo'}</span>
                  </button>

                  <button
                    onClick={() => setActiveModalProduct(prod)}
                    className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#94A3B8] text-[#000000] text-xs font-bold bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    title="Ver Ficha"
                  >
                    Ficha
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
                  <span className="text-[10px] font-bold text-[#FF8407] uppercase">Ficha Técnica & Tablón Real</span>
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
                    Tablón HD
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
                    Instalación
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Código:</span>
                  <span className="font-mono font-bold text-[#000000]">{activeModalProduct.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Espesor Total:</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.thickness}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Capa de Desgaste (Wear Layer):</span>
                  <span className="font-bold text-[#FF8407]">{activeModalProduct.wearLayer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Dimensiones de Tablón:</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.plankDimensions}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Bajo Piso Acústico:</span>
                  <span className="font-bold text-[#000000]">{activeModalProduct.padding}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Instalación en Escaleras:</span>
                  <span className="font-bold text-[#FF8407]">15 Escalones con mismos tablones</span>
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
                  Aplicar al Visualizador
                </button>
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#000000] font-bold text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

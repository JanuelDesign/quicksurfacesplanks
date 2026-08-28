import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FlooringProduct } from '../types';
import { X, Check, Eye, ZoomIn, CheckCircle2, Sparkles, Box } from 'lucide-react';

interface ColorSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: FlooringProduct[];
  selectedProduct: FlooringProduct;
  onSelectProduct: (product: FlooringProduct) => void;
  thicknessFilter: string;
  onChangeThicknessFilter: (filter: string) => void;
}

export const ColorSelectorModal: React.FC<ColorSelectorModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onSelectProduct,
  thicknessFilter,
  onChangeThicknessFilter,
}) => {
  const { lang } = useLanguage();
  const [modalViewMode, setModalViewMode] = useState<'room' | 'plank'>('room');
  const modalPreviewRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    if (thicknessFilter !== 'all' && p.category !== thicknessFilter) return false;
    return true;
  });

  const handleSelectAndScrollTop = (product: FlooringProduct) => {
    onSelectProduct(product);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyAndClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#E2E8F0] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center">
              <Eye className="w-4 h-4 text-[#FF8407]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0F172A]">
                {lang === 'es' ? 'Selector de Color & Previsualizador en Vivo' : 'Live Color Selector & Room View'}
              </h3>
              <p className="text-[11px] text-[#64748B]">
                {lang === 'es'
                  ? 'Toca cualquier color para previsualizarlo de inmediato en el render sin tener que desplazarte.'
                  : 'Tap any swatch to preview it immediately in the room scene without scrolling.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Live Preview Stage (Sticky/prominent at top of modal) */}
          <div ref={modalPreviewRef} className="bg-[#0F172A] rounded-2xl p-3 sm:p-4 text-white border border-[#334155] shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              {/* Mode toggle */}
              <div className="flex bg-[#1E293B] p-1 rounded-xl border border-[#334155]">
                <button
                  type="button"
                  onClick={() => setModalViewMode('room')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalViewMode === 'room'
                      ? 'bg-[#FF8407] text-black font-black shadow-xs'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Render Habitación' : 'Room View'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalViewMode('plank')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalViewMode === 'plank'
                      ? 'bg-[#FF8407] text-black font-black shadow-xs'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Foto Tablón' : 'Plank Closeup'}</span>
                </button>
              </div>

              {/* Active Color Info Pill */}
              <div className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407] animate-pulse"></span>
                <span className="text-xs font-black text-white">
                  #{selectedProduct.code} {selectedProduct.name}
                </span>
                <span className="text-[10px] text-[#94A3B8] font-bold">
                  ({selectedProduct.thickness} • {selectedProduct.wearLayer})
                </span>
                <span className="text-[10px] font-black text-[#FF8407] ml-1">
                  ${selectedProduct.pricePerSqft?.toFixed(2)}/SF
                </span>
              </div>
            </div>

            {/* Stage Image */}
            <div className="relative h-48 sm:h-64 w-full rounded-xl overflow-hidden bg-[#1E293B] border border-[#334155]">
              <img
                src={
                  modalViewMode === 'room'
                    ? selectedProduct.roomPreviewUrl || selectedProduct.imageUrl
                    : selectedProduct.plankImageUrl || selectedProduct.imageUrl
                }
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white font-bold border border-white/10">
                {modalViewMode === 'room'
                  ? (lang === 'es' ? 'Simulación Fotorrealista de Espacio' : 'Photorealistic Space Preview')
                  : (lang === 'es' ? 'Textura y Textura EIR Real Wood' : 'EIR Real Wood Plank Texture')}
              </div>
            </div>
          </div>

          {/* Thickness Quick Filter Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                {lang === 'es' ? 'Filtrar por Espesor:' : 'Filter by Thickness:'}
              </span>
              <span className="text-[11px] text-[#64748B]">
                {filtered.length} {lang === 'es' ? 'tonos disponibles' : 'available shades'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onChangeThicknessFilter('all')}
                className={`py-2 px-3 rounded-xl text-xs font-black text-center cursor-pointer transition-all border ${
                  thicknessFilter === 'all'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                {lang === 'es' ? 'Todos los Espesores' : 'All Thicknesses'}
              </button>

              <button
                type="button"
                onClick={() => onChangeThicknessFilter('5.5mm')}
                className={`py-2 px-3 rounded-xl text-xs font-black text-center cursor-pointer transition-all border ${
                  thicknessFilter === '5.5mm'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                5.5mm (Pulse Select)
              </button>

              <button
                type="button"
                onClick={() => onChangeThicknessFilter('6mm')}
                className={`py-2 px-3 rounded-xl text-xs font-black text-center cursor-pointer transition-all border ${
                  thicknessFilter === '6mm'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                6.0mm (Shield XL)
              </button>

              <button
                type="button"
                onClick={() => onChangeThicknessFilter('8mm')}
                className={`py-2 px-3 rounded-xl text-xs font-black text-center cursor-pointer transition-all border ${
                  thicknessFilter === '8mm'
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                8.0mm (XL Pulse)
              </button>
            </div>
          </div>

          {/* Swatches Grid */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-[#0F172A] uppercase tracking-wider block">
              {lang === 'es' ? 'Toca cualquier color para probarlo:' : 'Click any color to test live:'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filtered.map((p, idx) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <button
                    key={`${p.id}-${idx}`}
                    type="button"
                    onClick={() => handleSelectAndScrollTop(p)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF8407] bg-[#FFFBF7] shadow-md ring-2 ring-[#FF8407]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="relative h-20 w-full rounded-xl overflow-hidden mb-1.5 bg-[#E2E8F0]">
                        <img
                          src={p.plankImageUrl || p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-[#FF8407] text-black p-1 rounded-lg shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <span className="font-black text-xs text-[#0F172A] truncate">
                          #{p.code} {p.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        {p.collectionName}
                      </span>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#FF8407]">{p.thickness}</span>
                      <span className="font-black text-[#0F172A]">
                        ${p.pricePerSqft?.toFixed(2)}/SF
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#64748B] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF8407] shrink-0" />
            <span>
              {lang === 'es'
                ? `Color seleccionado: #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness})`
                : `Active color: #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness})`}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-black shadow-md transition-all cursor-pointer"
          >
            {lang === 'es' ? 'Aplicar Color y Continuar' : 'Apply Color & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

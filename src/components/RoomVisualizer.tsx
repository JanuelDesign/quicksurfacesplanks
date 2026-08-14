import React, { useState } from 'react';
import { FlooringProduct, FloorPlanModel } from '../types';
import { FLOORING_PRODUCTS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ExternalLink,
  Check,
  Eye,
  Layers,
  Palette,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  ZoomIn,
  Image as ImageIcon,
} from 'lucide-react';

interface RoomVisualizerProps {
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  onSelectProduct: (product: FlooringProduct) => void;
  onOpenBooking?: () => void;
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({
  model,
  selectedProduct,
  onSelectProduct,
  onOpenBooking,
}) => {
  const { lang, t } = useLanguage();
  const [toneFilter, setToneFilter] = useState<string>('all');
  const [selectedViewMode, setSelectedViewMode] = useState<'room' | 'plank' | 'stairs'>('room');

  const filteredProducts = FLOORING_PRODUCTS.filter((prod) => {
    if (toneFilter !== 'all' && prod.tone !== toneFilter) return false;
    return true;
  });

  const ROOMVO_VISUALIZER_URL = 'https://www.roomvo.com/my/flooringwaterproof/';

  const viewScenes = {
    room: {
      title: lang === 'es' ? "Vista en Habitación (Owner's Suite)" : "Room Installation (Owner's Suite)",
      desc: lang === 'es' ? "Instalación continua sin juntas visibles en recámara y vestidores" : "Continuous layout without visual transition strips in master & closets",
      image: selectedProduct.roomPreviewUrl || selectedProduct.imageUrl,
    },
    plank: {
      title: lang === 'es' ? `Tablón Real HD: ${selectedProduct.name}` : `Macro Plank Texture: ${selectedProduct.name}`,
      desc: lang === 'es' ? `Textura realista sincronizada (EIR), bisel micro-bevel y grosor ${selectedProduct.thickness}` : `Embossed in register grain, micro-bevel edge & ${selectedProduct.thickness} core`,
      image: selectedProduct.plankImageUrl || selectedProduct.imageUrl,
    },
    stairs: {
      title: lang === 'es' ? "15 Escalones a Medida (Staircase)" : "15 Custom Matching Stair Steps",
      desc: lang === 'es' ? "Peldaños pegados con los mismos tablones para continuidad total" : "Stair treads bonded with matching planks for seamless transition",
      image: selectedProduct.staircasePreviewUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    },
  };

  const currentScene = viewScenes[selectedViewMode];

  return (
    <section id="visualizer" className="py-16 bg-[#F8FAFC] text-[#111827] border-y border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
              <Palette className="w-3.5 h-3.5" />
              <span>{t('visualizerTitle')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
              {lang === 'es'
                ? 'Muestrario de Colores y Tablones de Pisos SPC'
                : 'Luxury Vinyl Flooring Planks & Color Studio'}
            </h2>
            <p className="mt-2 text-[#4B5563] text-sm sm:text-base leading-relaxed">
              {lang === 'es'
                ? 'Explora las fotos de tablones reales, tonos de madera y prueba tus pisos en 3D con nuestro simulador oficial de Roomvo.'
                : 'Inspect genuine SPC vinyl plank textures, wood grains, and test finishes in full 3D with our official Roomvo Room Visualizer.'}
            </p>
          </div>

          {/* External Roomvo Visualizer Launch Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={ROOMVO_VISUALIZER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#000000] hover:bg-[#1E293B] text-[#FFFFFF] text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 shadow-lg shadow-black/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF8407]" />
              <span>{lang === 'es' ? 'Abrir Room Visualizer 3D (Roomvo)' : 'Open 3D Room Visualizer (Roomvo)'}</span>
              <ExternalLink className="w-4 h-4 text-[#FF8407]" />
            </a>
          </div>
        </div>

        {/* Main Color Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Preview Box (Room / Real Plank Macro / Stairs) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-md flex flex-col justify-between">
            <div>
              {/* Scene View Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
                  <button
                    onClick={() => setSelectedViewMode('room')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedViewMode === 'room'
                        ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                        : 'text-[#64748B] hover:text-[#000000]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Habitación 3D' : 'Room View'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedViewMode('plank')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedViewMode === 'plank'
                        ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                        : 'text-[#64748B] hover:text-[#000000]'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#FF8407]" />
                    <span>{lang === 'es' ? 'Foto de Tablón' : 'Plank Closeup'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedViewMode('stairs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedViewMode === 'stairs'
                        ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                        : 'text-[#64748B] hover:text-[#000000]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? '15 Escalones' : '15 Stairs'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: selectedProduct.colorHex }}></span>
                  <span className="text-[#000000]">{selectedProduct.name}</span>
                  <span className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md font-mono">{selectedProduct.category}</span>
                </div>
              </div>

              {/* Main Visual Image (Crisp Plank or Room) */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#1E293B] shadow-inner group">
                <img
                  src={currentScene.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FFFFFF]">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF8407] bg-black/75 px-3 py-1 rounded-full backdrop-blur-xs border border-[#FF8407]/40 inline-block mb-1.5">
                        {selectedProduct.category} SPC Rigid Core • {selectedProduct.wearLayer}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-[#FFFFFF] tracking-tight">
                        {currentScene.title}
                      </h4>
                      <p className="text-xs text-[#CBD5E1] mt-0.5">{currentScene.desc}</p>
                    </div>

                    <a
                      href={ROOMVO_VISUALIZER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#FF8407] hover:bg-[#e67400] text-[#000000] px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'es' ? 'Simular en Mi Sala' : 'Try in My Room'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Bar Under Image */}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#F8FAFC]">
                <span className="text-[#64748B] block text-[10px]">Plank Dimensions</span>
                <span className="font-black text-[#000000]">{selectedProduct.plankDimensions}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F8FAFC]">
                <span className="text-[#64748B] block text-[10px]">Wear Layer</span>
                <span className="font-black text-[#000000]">{selectedProduct.wearLayer}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F8FAFC]">
                <span className="text-[#64748B] block text-[10px]">Acoustic Pad</span>
                <span className="font-bold text-[#000000]">{selectedProduct.padding}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F8FAFC]">
                <span className="text-[#64748B] block text-[10px]">Stairs Match</span>
                <span className="font-black text-[#FF8407]">15 Steps Exact</span>
              </div>
            </div>
          </div>

          {/* Right Swatch Palette & Plank Catalog */}
          <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-lg font-black text-[#000000]">
                    {lang === 'es' ? 'Muestrario de Tablones' : 'Plank & Color Catalog'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {lang === 'es' ? 'Haz clic en cualquier muestra para ver su tablón y acabado' : 'Click any swatch to view genuine plank textures & specifications'}
                  </p>
                </div>
              </div>

              {/* Tone Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-4 text-xs">
                {[
                  { id: 'all', label: 'All (13)' },
                  { id: 'natural', label: 'Natural Oak' },
                  { id: 'warm', label: 'Warm Oak / Pine' },
                  { id: 'cool', label: 'Cool / Silver' },
                  { id: 'light', label: 'Blonde / Light' },
                  { id: 'dark', label: 'Dark / Walnut' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setToneFilter(tone.id)}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-colors cursor-pointer text-xs ${
                      toneFilter === tone.id
                        ? 'bg-[#000000] text-[#FFFFFF]'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#000000]'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>

              {/* Swatches Grid with Real Plank Thumbnails */}
              <div className="grid grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredProducts.map((prod) => {
                  const isSelected = prod.id === selectedProduct.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className={`group relative rounded-2xl overflow-hidden border p-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF8407] ring-2 ring-[#FF8407]/40 bg-[#FFF7ED]'
                          : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#94A3B8]'
                      }`}
                    >
                      {/* Swatch Plank Image */}
                      <div className="relative h-16 w-full rounded-xl overflow-hidden mb-1.5 bg-[#E2E8F0]">
                        <img
                          src={prod.plankImageUrl || prod.imageUrl}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1.5"
                          style={{ backgroundColor: prod.colorHex }}
                        ></div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#FF8407] text-[#000000] flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[9px] font-black uppercase text-[#FF8407] block truncate">
                          {prod.category} • #{prod.code}
                        </span>
                        <h5 className="text-xs font-bold text-[#000000] truncate">{prod.name}</h5>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Roomvo Link CTA */}
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2">
              <a
                href={ROOMVO_VISUALIZER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'es' ? 'Simulador en Vivo: roomvo.com' : 'Launch 3D Simulator on roomvo.com'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  fileName: string;
  title: string;
  titleEn: string;
  spaceType?: 'stairs' | 'hallway' | 'bedroom' | 'closet' | 'details' | string;
  spaceLabel?: string;
  spaceLabelEn?: string;
  collection?: '8mm' | '6mm' | '5.5mm' | string;
  productName?: string;
  productCode?: string;
  community?: string;
  location?: string;
  imageUrl: string;
  fallbackUrl?: string;
  tag?: string;
  tagEn?: string;
  description?: string;
  descriptionEn?: string;
  craftHighlights?: string[];
  craftHighlightsEn?: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-01',
    fileName: 'gallery-01.webp',
    title: 'Escaleras 15 Peldaños con Flush Stair Nose',
    titleEn: '15-Step Custom Staircase with Flush Nosing',
    community: 'Siena Reserve / Altamira',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-01.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    tag: '15 Peldaños Flush Nose',
    tagEn: '15-Step Stairs',
    collection: '8mm',
    productName: '8.0mm Liv Oak Flagship',
    productCode: '347',
  },
  {
    id: 'gallery-02',
    fileName: 'gallery-02.webp',
    title: 'Pasillo de Desembarque y 2do Piso Continuo',
    titleEn: 'Continuous 2nd Floor Landing & Hallway Flow',
    community: 'Siena Reserve / Terra Sol',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-02.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    tag: 'Pasillo Continuo Sin Cortes',
    tagEn: 'Seamless Hallway',
    collection: '8mm',
    productName: '8.0mm Montclair Oak',
    productCode: '349',
  },
  {
    id: 'gallery-03',
    fileName: 'gallery-03.webp',
    title: "Owner's Suite Principal en Madera SPC",
    titleEn: "Primary Owner's Suite & Master Bed Flow",
    community: 'Siena Reserve / Luminara',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-03.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    tag: 'Owner Suite Master',
    tagEn: 'Master Suite',
    collection: '8mm',
    productName: '8.0mm Coastal Sand Luxury',
    productCode: '352',
  },
  {
    id: 'gallery-04',
    fileName: 'gallery-04.webp',
    title: 'Detalle Artesanal en Peldaños y Contrahuellas',
    titleEn: 'Square-Edge Custom Stair Tread Detail',
    community: 'Siena Reserve / Paradis',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-04.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    tag: 'Artesanía en Escaleras',
    tagEn: 'Stair Craft Detail',
    collection: '6mm',
    productName: '6.0mm Grand Natural XL',
    productCode: '210',
  },
  {
    id: 'gallery-05',
    fileName: 'gallery-05.webp',
    title: 'Walk-In Closets & Vestidores sin Transición',
    titleEn: 'Walk-In Closet & Dressing Room Integration',
    community: 'Siena Reserve / Altamira',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-05.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85',
    tag: 'Walk-In Closets',
    tagEn: 'Custom Closets',
    collection: '5.5mm',
    productName: '5.5mm Nordic Linen Classic',
    productCode: '104',
  },
  {
    id: 'gallery-06',
    fileName: 'gallery-06.webp',
    title: 'Dormitorio Secundario con Tablones XL Grand',
    titleEn: 'Secondary Bedroom with XL Grand Planks',
    community: 'Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-06.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    tag: 'Tablones XL Grand',
    tagEn: 'XL Grand Planks',
    collection: '6mm',
    productName: '6.0mm Silver Birch XL',
    productCode: '215',
  },
  {
    id: 'gallery-07',
    fileName: 'gallery-07.webp',
    title: 'Área Social y Sala Abierta en Planta Baja',
    titleEn: 'Open Concept Great Room & Living Flow',
    community: 'Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-07.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    tag: 'Sala & Comedor Abierto',
    tagEn: 'Great Room Living',
    collection: '8mm',
    productName: '8.0mm Liv Oak Flagship',
    productCode: '347',
  },
  {
    id: 'gallery-08',
    fileName: 'gallery-08.webp',
    title: 'Cocina con Isla y Acabado 100% Impermeable',
    titleEn: 'Waterfall Island Kitchen with Waterproof SPC',
    community: 'Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-08.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    tag: 'Cocina Impermeable',
    tagEn: 'Waterproof Kitchen',
    collection: '8mm',
    productName: '8.0mm Montclair Oak',
    productCode: '349',
  },
  {
    id: 'gallery-09',
    fileName: 'gallery-09.webp',
    title: 'Entrada Principal y Recibidor Elegante',
    titleEn: 'Grand Foyer & Main Entrance Vinyl Flooring',
    community: 'Siena Reserve / Adora Collection',
    location: 'Homestead, FL',
    imageUrl: '/images/gallery/gallery-09.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=85',
    tag: 'Entrada y Recibidor',
    tagEn: 'Main Entrance Foyer',
    collection: '8mm',
    productName: '8.0mm Coastal Sand Luxury',
    productCode: '352',
  },
];

interface GallerySectionProps {
  onSelectFinishToQuote?: (productName: string, collection: string) => void;
  onGoToEstimator?: () => void;
  items?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onSelectFinishToQuote,
  onGoToEstimator,
  items = GALLERY_ITEMS,
}) => {
  const activeItems = (items && items.length > 0 ? items : GALLERY_ITEMS).slice(0, 9);
  const { lang } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % activeItems.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + activeItems.length) % activeItems.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, activeItems.length]);

  const activeItem = selectedIndex !== null ? activeItems[selectedIndex] : null;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % activeItems.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + activeItems.length) % activeItems.length);
    }
  };

  const handleQuoteClick = (item: GalleryItem) => {
    if (onSelectFinishToQuote && item.productName) {
      onSelectFinishToQuote(item.productName, item.collection || '8mm');
    } else if (onGoToEstimator) {
      onGoToEstimator();
    }
  };

  return (
    <section className="py-6 sm:py-10 bg-[#F8FAFC] text-[#0F172A] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Clean Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-2.5 shadow-2xs">
            <Camera className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'GALERÍA DE PROYECTOS REALES' : 'REAL PROJECTS GALLERY'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
            {lang === 'es' ? 'Instalaciones Reales en ' : 'Real Installations in '}
            <span className="text-[#FF8407]">Siena Reserve</span>
          </h2>
          <p className="mt-1.5 text-[#64748B] text-xs sm:text-sm max-w-lg mx-auto">
            {lang === 'es'
              ? 'Explora las fotos de proyectos terminados en escaleras de 15 peldaños, habitaciones y pasillos continuos.'
              : 'Explore verified photos of completed projects across 15-step staircases, bedrooms, and continuous hallways.'}
          </p>
        </div>

        {/* Clean, Visual-First Photo Gallery Grid (9 Photos) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
          {activeItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className="group relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E2E8F0] border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-[#FF8407] transition-all duration-300 cursor-pointer"
            >
              {/* Full Image */}
              <img
                src={item.imageUrl}
                onError={(e) => {
                  if (item.fallbackUrl && e.currentTarget.src !== item.fallbackUrl) {
                    e.currentTarget.src = item.fallbackUrl;
                  }
                }}
                alt={`Instalación ${idx + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Minimal Clean Center Full View Button on Hover (NO titles or text) */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/75 backdrop-blur-md text-[#FF8407] flex items-center justify-center border border-white/20 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-5 sm:p-7 rounded-3xl border border-[#334155] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-base sm:text-lg font-black text-white">
              {lang === 'es' ? '¿Te gustaría cotizar tu casa con estos acabados?' : 'Want to quote your home with these finishes?'}
            </h3>
            <p className="text-xs text-[#94A3B8]">
              {lang === 'es'
                ? 'Obtén tu presupuesto exacto en minutos para B Model, C Model, M Model, R Model o V Model.'
                : 'Get your exact quote in minutes tailored for B Model, C Model, M Model, R Model, or V Model.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => (onGoToEstimator ? onGoToEstimator() : undefined)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FF8407] hover:bg-[#ff952a] text-black font-black text-xs sm:text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{lang === 'es' ? 'Cotizar en 4 Pasos' : 'Quote in 4 Steps'}</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with Arrows & Clean Overlay */}
      {selectedIndex !== null && activeItem && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar: Counter & Close */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-[#CBD5E1]">
              {selectedIndex + 1} / {activeItems.length}
            </div>

            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="pointer-events-auto p-2.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#FF8407] border border-white/20 transition-colors cursor-pointer shadow-lg"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-[#FF8407] border border-white/10 transition-all cursor-pointer backdrop-blur-md shadow-xl hover:scale-110"
            aria-label="Anterior foto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-[#FF8407] border border-white/10 transition-all cursor-pointer backdrop-blur-md shadow-xl hover:scale-110"
            aria-label="Siguiente foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Photo Container */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl">
              <img
                src={activeItem.imageUrl}
                onError={(e) => {
                  if (activeItem.fallbackUrl && e.currentTarget.src !== activeItem.fallbackUrl) {
                    e.currentTarget.src = activeItem.fallbackUrl;
                  }
                }}
                alt={lang === 'es' ? activeItem.title : activeItem.titleEn}
                className="max-h-[72vh] w-auto max-w-full object-contain mx-auto rounded-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Bottom Minimal Bar in Modal - Only Quote Button */}
              <div className="p-3 sm:p-4 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const item = activeItem;
                    setSelectedIndex(null);
                    handleQuoteClick(item);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#ff952a] text-black font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{lang === 'es' ? 'Cotizar este Acabado' : 'Quote this Finish'}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

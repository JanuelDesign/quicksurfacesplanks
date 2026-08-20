import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  Layers,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  RotateCcw,
} from 'lucide-react';
import { FlooringProduct } from '../types';

export interface GalleryItem {
  id: string;
  fileName: string;
  title: string;
  titleEn: string;
  spaceType: 'stairs' | 'hallway' | 'bedroom' | 'closet' | 'details';
  spaceLabel: string;
  spaceLabelEn: string;
  collection: '8mm' | '6mm' | '5.5mm';
  productName: string;
  productCode: string;
  community: string;
  location: string;
  imageUrl: string;
  tag: string;
  tagEn: string;
  description: string;
  descriptionEn: string;
  craftHighlights: string[];
  craftHighlightsEn: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-01',
    fileName: 'gallery_escaleras_homestead_altamira-01.webp',
    title: 'Escaleras Integradas 15 Peldaños con Flush Nose',
    titleEn: '15-Step Master Custom Staircase with Flush Nosing',
    spaceType: 'stairs',
    spaceLabel: 'Escaleras',
    spaceLabelEn: '15-Step Stairs',
    collection: '8mm',
    productName: '8.0mm Liv Oak Flagship',
    productCode: '347',
    community: 'Altamira / Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    tag: '15 Peldaños Flotantes',
    tagEn: '15 Master Steps',
    description:
      'Instalación premium con pegado directo de máxima adherencia, narices de peldaño integradas sin molduras plásticas sobrepuestas y contrahuellas blancas limpias.',
    descriptionEn:
      'Direct-glue master stair craftsmanship using matching rigid core planks, seamless flush nosing, and clean painted risers with zero overlap lips.',
    craftHighlights: [
      'Nariz de peldaño integrada (Flush Nosing) sin tropiezos',
      'Fijación estructural con adhesivo de poliuretano',
      'Cortes de precisión con ingletadora en cada descanso',
    ],
    craftHighlightsEn: [
      'Seamless flush nosing with zero trip hazard',
      'Structural polyurethane full-spread adhesion',
      'Precision mitered cuts along stringers and landings',
    ],
  },
  {
    id: 'gallery-02',
    fileName: 'gallery_pasillo_desembarque_terra_sol-02.webp',
    title: 'Pasillo de Desembarque Continuo Sin Transición',
    titleEn: 'Continuous 2nd Floor Landing & Hallway Flow',
    spaceType: 'hallway',
    spaceLabel: 'Pasillos',
    spaceLabelEn: 'Hallways & Landing',
    collection: '8mm',
    productName: '8.0mm Montclair Oak',
    productCode: '349',
    community: 'Terra Sol / Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    tag: 'Flujo Continuo Sin Cortes',
    tagEn: 'Seamless Flow',
    description:
      'Transición perfecta del peldaño 15 al pasillo superior sin molduras en T. Todo el segundo piso conectado en una sola superficie impermeable y silenciosa.',
    descriptionEn:
      'Flawless transition from the top stair landing to hallway with zero T-moldings. Complete second story connected seamlessly in ultra-quiet SPC.',
    craftHighlights: [
      'Sin molduras en T entre habitaciones y pasillo',
      'Manta acústica EVA de 2.0mm incorporada',
      'Nivelación previa con compuesto autonivelante',
    ],
    craftHighlightsEn: [
      'No T-moldings between bedrooms and main hall',
      'Built-in 2.0mm HD EVA acoustic underlayment',
      'Pre-leveled substrate with high-strength compound',
    ],
  },
  {
    id: 'gallery-03',
    fileName: 'gallery_suite_principal_luminara-03.webp',
    title: "Owner's Suite Principal con Vista Panorámica",
    titleEn: "Primary Owner's Suite & Master Bed Flow",
    spaceType: 'bedroom',
    spaceLabel: 'Habitaciones',
    spaceLabelEn: 'Bedrooms & Suites',
    collection: '8mm',
    productName: '8.0mm Coastal Sand Luxury',
    productCode: '352',
    community: 'Luminara / Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    tag: 'Suite Master 8mm Flagship',
    tagEn: '8mm Flagship Master',
    description:
      'Instalación en la habitación principal con capa de uso de 22 Mils resistente a muebles pesados y garras de mascotas. Rodapiés de 5-1/4 reinstalados con calafateo premium.',
    descriptionEn:
      'Primary bedroom installation with heavy commercial 22 Mils wear layer resistant to heavy furniture and pets. Reinstalled 5-1/4 baseboards caulked to perfection.',
    craftHighlights: [
      'Rodapiés de 5-1/4 desinstalados, numerados y reinstalados',
      'Capa de uso de 22 Mils anti-rayaduras',
      'Corte de marcos de puerta (undercutting) para encaje perfecto',
    ],
    craftHighlightsEn: [
      '5-1/4 baseboards carefully pulled, tagged and reinstalled',
      '22 Mils scratch & stain shield wear layer',
      'Precision door casing undercutting for snug plank fit',
    ],
  },
  {
    id: 'gallery-04',
    fileName: 'gallery_escaleras_detalle_inglete_paradis-04.webp',
    title: 'Detalle de Peldaños con Remate Cuadrado',
    titleEn: 'Square-Edge Custom Stair Tread Close-Up',
    spaceType: 'details',
    spaceLabel: 'Detalles',
    spaceLabelEn: 'Craft Details',
    collection: '6mm',
    productName: '6.0mm Grand Natural XL',
    productCode: '210',
    community: 'Paradis / Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    tag: 'Artesanía en Escaleras',
    tagEn: 'Custom Stair Craft',
    description:
      'Alineación milimétrica de vetas en los peldaños y contrahuellas. Trabajo artesanal fabricado con los mismos tablones de piso para un tono 100% idéntico.',
    descriptionEn:
      'Millimeter grain matching between treads and risers. Handcrafted using actual floor planks for 100% color & texture consistency.',
    craftHighlights: [
      'Fabricado con el mismo lote de tablones SPC',
      'Cero descalces o diferencias de tono',
      'Superficie anti-deslizante con textura EIR en relieve',
    ],
    craftHighlightsEn: [
      'Milled from the exact same SPC plank lot',
      'Zero color discrepancies or mismatched trim',
      'Slip-resistant embossed-in-register (EIR) texture',
    ],
  },
  {
    id: 'gallery-05',
    fileName: 'gallery_walk_in_closet_altamira-05.webp',
    title: 'Walk-In Closets & Vestidores sin Cortes Visibles',
    titleEn: 'Walk-In Closet & Dressing Room Integration',
    spaceType: 'closet',
    spaceLabel: 'Closets',
    spaceLabelEn: 'Walk-in Closets',
    collection: '5.5mm',
    productName: '5.5mm Nordic Linen Classic',
    productCode: '104',
    community: 'Altamira / Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85',
    tag: 'Closets Integrados',
    tagEn: 'Custom Closets',
    description:
      'Instalación bajo sistemas de estantería y zapateras. Retiro completo de alfombra antigua y sellado perimetral contra humedad.',
    descriptionEn:
      'Seamless installation under custom closet organizers. Full old carpet tear-out and perimeter moisture barrier protection.',
    craftHighlights: [
      'Retiro y descarte responsable de alfombra vieja',
      'Instalación continua sin uniones bajo la puerta',
      'Fácil limpieza y libre de alérgenos y polvo',
    ],
    craftHighlightsEn: [
      'Responsible carpet and pad removal & haul away',
      'Continuous transition through closet door threshold',
      'Hypoallergenic surface free of dust and mites',
    ],
  },
  {
    id: 'gallery-06',
    fileName: 'gallery_dormitorios_secundarios_siena-06.webp',
    title: 'Dormitorios Secundarios con Tablones XL Grand',
    titleEn: 'Secondary Bedrooms with XL Grand Planks',
    spaceType: 'bedroom',
    spaceLabel: 'Habitaciones',
    spaceLabelEn: 'Bedrooms & Suites',
    collection: '6mm',
    productName: '6.0mm Silver Birch XL',
    productCode: '215',
    community: 'Siena Reserve',
    location: 'Homestead, FL',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    tag: 'Formato XL 9" x 60"',
    tagEn: '9" x 60" XL Format',
    description:
      'Los tablones de 9 pulgadas de ancho expanden visualmente los dormitorios, reduciendo el número de juntas y creando una sensación de amplitud y modernidad.',
    descriptionEn:
      '9-inch wide planks visually expand secondary bedrooms, minimizing joint lines and creating an airy, contemporary open aesthetic.',
    craftHighlights: [
      'Formato extra ancho 9" x 60" para mayor amplitud',
      'Bisel micro-biselado de precisión en 4 lados',
      'Resistencia a manchas y fácil mantenimiento con mopa',
    ],
    craftHighlightsEn: [
      '9" x 60" grand plank sizing for expansive feel',
      '4-sided precision micro-bevel edges',
      'Stain resistant and effortless microfiber cleaning',
    ],
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
  const activeItems = items && items.length > 0 ? items : GALLERY_ITEMS;
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string>('all');
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('all');
  const [activeItemModal, setActiveItemModal] = useState<GalleryItem | null>(null);

  const spaceScrollRef = useRef<HTMLDivElement>(null);
  const collectionScrollRef = useRef<HTMLDivElement>(null);

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Auto-scroll active chips into view
  useEffect(() => {
    if (spaceScrollRef.current) {
      const activeEl = spaceScrollRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedSpaceFilter]);

  useEffect(() => {
    if (collectionScrollRef.current) {
      const activeEl = collectionScrollRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCollectionFilter]);

  // Space Options with Counts
  const spaceTabs = [
    { id: 'all', label: lang === 'es' ? 'Todos los Espacios' : 'All Spaces', count: activeItems.length },
    { id: 'stairs', label: lang === 'es' ? 'Escaleras 15 Peldaños' : '15-Step Stairs', count: activeItems.filter((i) => i.spaceType === 'stairs').length },
    { id: 'hallway', label: lang === 'es' ? 'Pasillos & Desembarque' : 'Hallways & Landing', count: activeItems.filter((i) => i.spaceType === 'hallway').length },
    { id: 'bedroom', label: lang === 'es' ? "Owner's Suite & Dormitorios" : 'Bedrooms & Suites', count: activeItems.filter((i) => i.spaceType === 'bedroom').length },
    { id: 'closet', label: lang === 'es' ? 'Walk-in Closets' : 'Walk-in Closets', count: activeItems.filter((i) => i.spaceType === 'closet').length },
    { id: 'details', label: lang === 'es' ? 'Detalles de Artesanía' : 'Craft Details', count: activeItems.filter((i) => i.spaceType === 'details').length },
  ];

  // Collection Options with Counts
  const collectionTabs = [
    { id: 'all', label: lang === 'es' ? 'Todas las Colecciones' : 'All Collections', count: activeItems.length },
    { id: '8mm', label: '8.0mm Flagship (22 Mils)', count: activeItems.filter((i) => i.collection === '8mm').length },
    { id: '6mm', label: '6.0mm XL Grand (20 Mils)', count: activeItems.filter((i) => i.collection === '6mm').length },
    { id: '5.5mm', label: '5.5mm Classic Select (20 Mils)', count: activeItems.filter((i) => i.collection === '5.5mm').length },
  ];

  // Filtering with Search
  const filteredItems = activeItems.filter((item) => {
    if (selectedSpaceFilter !== 'all' && item.spaceType !== selectedSpaceFilter) return false;
    if (selectedCollectionFilter !== 'all' && item.collection !== selectedCollectionFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q) || item.titleEn.toLowerCase().includes(q);
      const matchProduct = item.productName.toLowerCase().includes(q) || item.productCode.includes(q);
      const matchCommunity = item.community.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q) || item.descriptionEn.toLowerCase().includes(q);
      const matchSpace = item.spaceLabel.toLowerCase().includes(q) || item.spaceLabelEn.toLowerCase().includes(q);
      const matchTag = item.tag.toLowerCase().includes(q) || item.tagEn.toLowerCase().includes(q);

      if (!matchTitle && !matchProduct && !matchCommunity && !matchDesc && !matchSpace && !matchTag) {
        return false;
      }
    }
    return true;
  });

  const handleQuoteClick = (item: GalleryItem) => {
    if (onSelectFinishToQuote) {
      onSelectFinishToQuote(item.productName, item.collection);
    } else if (onGoToEstimator) {
      onGoToEstimator();
    }
  };

  const handleResetFilters = () => {
    setSelectedSpaceFilter('all');
    setSelectedCollectionFilter('all');
    setSearchQuery('');
  };

  return (
    <section className="py-6 sm:py-10 bg-[#F8FAFC] text-[#0F172A] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
            <Camera className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'GALERÍA DE INSTALACIONES REALES' : 'REAL INSTALLATION SHOWCASE'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            {lang === 'es' ? 'Trabajos Realizados en ' : 'Real Transformations in '}
            <span className="text-[#FF8407]">Siena Reserve & Homestead</span>
          </h2>
          <p className="mt-2 text-[#475569] text-xs sm:text-base leading-relaxed">
            {lang === 'es'
              ? 'Conoce la calidad de nuestros acabados en 15 peldaños de escaleras, suites principales y pasillos continuos sin alfombras en casas de la zona.'
              : 'Explore the high-precision finish on 15-step custom staircases, master suites, and continuous carpet-free hallway installations.'}
          </p>
        </div>

        {/* Improved Filter Toolbar with Search, Desktop Navigation Chevrons, Gradient Fades, and Badge Counts */}
        <div className="space-y-4 bg-[#FFFFFF] p-4 sm:p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
          {/* Row 1: Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                lang === 'es'
                  ? 'Buscar por espacio, comunidad o código (ej: Escaleras, Altamira, #347, Liv Oak)...'
                  : 'Search by space, community or code (e.g. Stairs, Altamira, #347, Liv Oak)...'
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
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Row 2: Space Type Filter */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#FF8407]" />
                {lang === 'es' ? '1. Tipo de Espacio / Área:' : '1. Space Type:'}
              </span>
              <span className="text-[10px] text-[#94A3B8] sm:hidden font-medium">
                Desliza horizontalmente →
              </span>
            </div>

            <div className="relative group">
              {/* Desktop Scroll Arrows */}
              <button
                type="button"
                onClick={() => scrollHorizontally(spaceScrollRef, -200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Anterior tipo de espacio"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally(spaceScrollRef, 200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Siguiente tipo de espacio"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Gradient Fade Cue on the Right */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent z-10"></div>

              <div
                ref={spaceScrollRef}
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth p-1 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {spaceTabs.map((tab) => {
                  const isActive = selectedSpaceFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      data-active={isActive ? 'true' : 'false'}
                      onClick={() => setSelectedSpaceFilter(tab.id)}
                      className={`snap-start shrink-0 min-w-fit px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#000000] text-[#FFFFFF] shadow-sm ring-1 ring-black'
                          : 'text-[#475569] bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#000000]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: SPC Collection Filter */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF8407]" />
                {lang === 'es' ? '2. Colección SPC Utilizada:' : '2. SPC Collection Used:'}
              </span>
              <span className="text-[10px] text-[#94A3B8] sm:hidden font-medium">
                Desliza horizontalmente →
              </span>
            </div>

            <div className="relative group">
              {/* Desktop Scroll Arrows */}
              <button
                type="button"
                onClick={() => scrollHorizontally(collectionScrollRef, -200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Anterior colección"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally(collectionScrollRef, 200)}
                className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CBD5E1] text-[#0F172A] items-center justify-center z-20 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Siguiente colección"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Gradient Fade Cue on the Right */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent z-10"></div>

              <div
                ref={collectionScrollRef}
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth p-1 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {collectionTabs.map((col) => {
                  const isActive = selectedCollectionFilter === col.id;
                  return (
                    <button
                      key={col.id}
                      data-active={isActive ? 'true' : 'false'}
                      onClick={() => setSelectedCollectionFilter(col.id)}
                      className={`snap-start shrink-0 min-w-fit px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#FF8407] text-[#000000] shadow-xs font-black ring-1 ring-[#FF8407]'
                          : 'text-[#475569] bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#000000]'
                      }`}
                    >
                      <span>{col.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-black/15 text-black' : 'bg-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        {col.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Filter Indicators / Reset */}
          {(selectedSpaceFilter !== 'all' || selectedCollectionFilter !== 'all' || searchQuery.trim()) && (
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-bold">
                {lang === 'es' ? 'Mostrando ' : 'Showing '}
                <strong className="text-[#0F172A]">{filteredItems.length}</strong>
                {lang === 'es' ? ' de ' : ' of '}
                {GALLERY_ITEMS.length} {lang === 'es' ? 'trabajos' : 'installs'}
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FF8407] hover:text-[#0F172A] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'es' ? 'Limpiar filtros' : 'Reset filters'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Photo Grid: 2 columns on Mobile, 3 on Tablet, 3-4 on Desktop */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E2E8F0] p-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FFF7ED] text-[#FF8407] flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
              {lang === 'es' ? 'No se encontraron trabajos con estos filtros' : 'No installation photos matched these filters'}
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
              {lang === 'es'
                ? 'Prueba seleccionando "Todos los Espacios" o limpiando el término de búsqueda.'
                : 'Try selecting "All Spaces" or clearing your search term.'}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="py-2.5 px-5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
            >
              {lang === 'es' ? 'Ver Todos los Trabajos' : 'View All Installations'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#FFFFFF] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-lg hover:border-[#FF8407] transition-all flex flex-col justify-between"
              >
                {/* Photo Area with Overlay Actions */}
                <div
                  className="relative h-44 sm:h-64 overflow-hidden bg-[#E2E8F0] cursor-pointer"
                  onClick={() => setActiveItemModal(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={lang === 'es' ? item.title : item.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badge: Tag */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#FF8407] border border-white/10 uppercase tracking-wider">
                      {lang === 'es' ? item.tag : item.tagEn}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                    <span className="text-[10px] font-black text-[#FF8407] block truncate">
                      #{item.productCode} • {item.productName}
                    </span>
                    <p className="text-[11px] font-bold text-white/90 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF8407] shrink-0" />
                      {item.community}
                    </p>
                  </div>
                </div>

                {/* Card Footer Content */}
                <div className="p-3 sm:p-4.5 bg-[#FFFFFF] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-[#0F172A] line-clamp-2 leading-snug">
                      {lang === 'es' ? item.title : item.titleEn}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                      {lang === 'es' ? item.description : item.descriptionEn}
                    </p>
                  </div>

                  {/* Craft Features Checklist */}
                  <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] space-y-1">
                    {(lang === 'es' ? item.craftHighlights.slice(0, 2) : item.craftHighlightsEn.slice(0, 2)).map(
                      (highlight, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] text-[#334155]">
                          <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0 mt-0.5" />
                          <span className="truncate">{highlight}</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Card Direct CTA */}
                  <button
                    type="button"
                    onClick={() => handleQuoteClick(item)}
                    className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-[#FF8407] hover:text-black text-white text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <span>{lang === 'es' ? 'Cotizar este Acabado' : 'Quote this Finish'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Conversion Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-[#334155] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8407]/20 border border-[#FF8407]/40 text-[#FF8407] text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Garantía Escrita de 25 Años' : '25-Year Written Warranty'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'es' ? '¿Listo para renovar tu segundo piso?' : 'Ready to upgrade your second floor?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
              {lang === 'es'
                ? 'Obtén tu presupuesto exacto en 4 pasos para tu modelo de casa específico, incluyendo material, 15 peldaños y retiro de alfombra.'
                : 'Calculate your exact quote in 4 easy steps customized to your home model, including material, 15 steps, and carpet disposal.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => (onGoToEstimator ? onGoToEstimator() : undefined)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF8407] hover:bg-[#ff952a] text-black font-black text-sm shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{lang === 'es' ? 'Iniciar Cotización de 4 Pasos' : 'Start 4-Step Estimator'}</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItemModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setActiveItemModal(null)}
        >
          <div
            className="bg-[#FFFFFF] text-[#0F172A] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveItemModal(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors shadow-md"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative h-64 sm:h-96 bg-[#0F172A] overflow-hidden">
              <img
                src={activeItemModal.imageUrl}
                alt={lang === 'es' ? activeItemModal.title : activeItemModal.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                <span className="text-[10px] font-black text-[#FF8407] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF8407]/20 border border-[#FF8407]/40 inline-block mb-1">
                  {activeItemModal.collection} SPC • #{activeItemModal.productCode} {activeItemModal.productName}
                </span>
                <h3 className="text-base sm:text-xl font-black text-white">
                  {lang === 'es' ? activeItemModal.title : activeItemModal.titleEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0] text-xs">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <MapPin className="w-4 h-4 text-[#FF8407]" />
                  <span className="font-bold text-[#0F172A]">{activeItemModal.community}</span> ({activeItemModal.location})
                </div>
                <span className="text-[11px] font-bold text-[#FF8407] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FF8407]/30">
                  {activeItemModal.spaceLabel}
                </span>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed">
                {lang === 'es' ? activeItemModal.description : activeItemModal.descriptionEn}
              </p>

              {/* Craft Checklist */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-2.5">
                  {lang === 'es' ? 'Puntos Clave de la Instalación:' : 'Installation Highlights:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === 'es' ? activeItemModal.craftHighlights : activeItemModal.craftHighlightsEn).map(
                    (item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-xs text-[#334155]">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span className="font-semibold">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Modal CTA Footer */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-[#64748B]">
                  {lang === 'es' ? 'Archivo verificado:' : 'Verified file:'}{' '}
                  <code className="text-[10px] font-mono text-[#0F172A] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                    {activeItemModal.fileName}
                  </code>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const item = activeItemModal;
                    setActiveItemModal(null);
                    handleQuoteClick(item);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF8407] hover:bg-[#ff952a] text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{lang === 'es' ? 'Cotizar con este Acabado' : 'Quote with this Finish'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

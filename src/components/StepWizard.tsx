import React, { useState, useEffect, useRef } from 'react';
import {
  FloorPlanModel,
  FlooringProduct,
  PricingPackage,
  BookingSubmission,
  FloorScope,
  ProductType,
} from '../types';
import { COMMUNITIES, SIENA_RESERVE_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from '../data/products';
import { calculateQuotePrice, formatCurrency } from '../utils/pricingCalculator';
import { useLanguage } from '../context/LanguageContext';
import { SienaReserveHero } from './SienaReserveHero';
import { InteractiveFloorPlan2D } from './InteractiveFloorPlan2D';
import { Photorealistic3DRender } from './Photorealistic3DRender';
import { FloorPlanSVG } from './FloorPlanSVG';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Eye,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  Printer,
  Sparkles,
  Layers,
  Box,
  Flame,
  Clock,
  Camera,
  ShieldCheck,
  Building,
  Check,
  Info,
  Calendar,
  User,
  MapPin,
  Search,
  ZoomIn,
} from 'lucide-react';

export const StepWizard: React.FC = () => {
  const { lang } = useLanguage();

  // Primary lists
  const communitiesList = COMMUNITIES;
  const modelsList = SIENA_RESERVE_MODELS;
  const productsList = FLOORING_PRODUCTS;
  const packagesList = PRICING_PACKAGES;

  // Active step in the workflow (1: Model & Scope, 2: Product & Color, 3: Package, 4: Summary)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Community and Model selection
  const [selectedCommunity, setSelectedCommunity] = useState(communitiesList[0] || COMMUNITIES[0]);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(
    modelsList.find((m) => m.slug === 'bandol') || modelsList[0] || SIENA_RESERVE_MODELS[0]
  );

  // Floor Scope (1st floor only, 2nd floor only, or both)
  const [floorScope, setFloorScope] = useState<FloorScope>('both');

  // Product Selection & Filters
  const [selectedProductType, setSelectedProductType] = useState<ProductType>('vinyl');
  const [thicknessFilter, setThicknessFilter] = useState<string>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');

  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(
    productsList[0] || FLOORING_PRODUCTS[0]
  );
  const [viewMode3D, setViewMode3D] = useState<'room' | 'plank' | 'stairs'>('room');

  // Package Selection
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(
    packagesList.find((p) => p.isTurnkey && p.isBestValue) || packagesList[2] || PRICING_PACKAGES[2]
  );
  const [packageType, setPackageType] = useState<'all' | 'turnkey' | 'material'>('all');

  // Interactive View Toggles
  const [showFloorPlanDetail, setShowFloorPlanDetail] = useState<boolean>(false);

  // Lead Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    unitNumber: '',
    preferredDate: '',
    notes: '',
  });

  // Dynamic Quote Calculation
  const quoteCalc = calculateQuotePrice(selectedModel, selectedProduct, selectedPackage, floorScope);

  // Scroll references
  const thicknessScrollRef = useRef<HTMLDivElement>(null);
  const toneScrollRef = useRef<HTMLDivElement>(null);

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Sync selected model if community changes or when fresh models load
  useEffect(() => {
    const matchingModel = modelsList.find(
      (m) => m.id === selectedModel.id || m.slug === selectedModel.slug
    );
    if (matchingModel && matchingModel !== selectedModel) {
      setSelectedModel(matchingModel);
    }
  }, [modelsList]);

  // Sync selected product when live products load
  useEffect(() => {
    const freshProduct = productsList.find((p) => p.id === selectedProduct.id);
    if (freshProduct && freshProduct !== selectedProduct) {
      setSelectedProduct(freshProduct);
    }
  }, [productsList]);

  // Filtered products based on ProductType, Thickness, Tone
  const filteredProducts = productsList.filter((p) => {
    const pType = p.productType || 'vinyl';
    if (pType !== selectedProductType) return false;
    if (selectedProductType === 'vinyl') {
      if (thicknessFilter !== 'all' && p.category !== thicknessFilter) return false;
    }
    if (toneFilter !== 'all' && p.tone !== toneFilter) return false;
    return true;
  });

  // Auto-select first matching product when filter changes if active product is excluded
  useEffect(() => {
    if (filteredProducts.length > 0 && !filteredProducts.some((p) => p.id === selectedProduct.id)) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [selectedProductType, thicknessFilter, toneFilter]);

  const filteredPackages = packagesList.filter((pkg) => {
    if (packageType === 'turnkey') return pkg.isTurnkey;
    if (packageType === 'material') return !pkg.isTurnkey;
    return true;
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  const stepMeta = [
    {
      title: lang === 'es' ? 'Siena Reserve & Modelo Bandol' : 'Siena Reserve & Bandol Model',
      subtitle: lang === 'es' ? 'Plano 2D Arquitectónico y Selección de Pisos' : '2D Architectural Plan & Scope',
    },
    {
      title: lang === 'es' ? 'Tipo de Producto y Color' : 'Product Type & Color Selection',
      subtitle: lang === 'es' ? 'Vinilo SPC, Laminado o Madera de Ingeniería' : 'SPC Vinyl, Laminate or Hardwood',
    },
    {
      title: lang === 'es' ? 'Paquetes de Instalación y Estimado' : 'Installation Packages & Estimate',
      subtitle: lang === 'es' ? 'Precios cerrados llave en mano con escalones' : 'Turnkey transparent pricing with stairs',
    },
    {
      title: lang === 'es' ? 'Resumen Oficial y Cotización' : 'Official Summary & Estimate',
      subtitle: lang === 'es' ? 'Envío directo por WhatsApp a QuickSurfaces' : 'Direct dispatch to WhatsApp',
    },
  ];

  // Stock status badge component
  const renderStockBadge = (product: FlooringProduct) => {
    if (product.stockStatus === 'low_stock' || product.isLowStock) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
          <Flame className="w-2.5 h-2.5 text-amber-600" />
          <span>{lang === 'es' ? 'Stock Bajo' : 'Low Stock'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>{lang === 'es' ? 'En Stock' : 'In Stock'}</span>
      </span>
    );
  };

  // WhatsApp formatted lead message
  const generateWhatsAppUrl = () => {
    const phone = '17866583677';
    const scopeLabel =
      floorScope === 'floor1'
        ? 'Solo 1er Piso (~510 SF)'
        : floorScope === 'floor2'
        ? 'Solo 2do Piso (~465 SF + 15 Escalones)'
        : 'Casa Completa (~975 SF + 15 Escalones)';

    const text =
      lang === 'es'
        ? `*COTIZACIÓN QUICKSURFACES - SIENA RESERVE*
----------------------------------------
📍 *Comunidad:* Siena Reserve (Adora Collection, Homestead FL 33032)
🏡 *Modelo:* ${selectedModel.name}
📐 *Alcance Seleccionado:* ${scopeLabel}
📦 *Material Recomendado (+10%):* ${quoteCalc.sqftMaterialRecommended} SF (${quoteCalc.boxesCount} cajas)
🪜 *Escaleras:* ${quoteCalc.stepsCount} Pasos (Flush Stair Nose al ras)

🎨 *Producto Elegido:*
• Tipo: ${selectedProduct.productType === 'hardwood' ? 'Madera de Ingeniería' : selectedProduct.productType === 'laminate' ? 'Laminado AC4' : 'Piso Vinílico SPC'}
• Modelo: #${selectedProduct.code} ${selectedProduct.name}
• Colección: ${selectedProduct.collectionName}
• Especificación: ${selectedProduct.thickness} · Wear Layer ${selectedProduct.wearLayer}

💼 *Paquete Seleccionado:* ${selectedPackage.title}
💰 *TOTAL ESTIMADO:* ${formatCurrency(quoteCalc.totalPrice)} ${selectedPackage.isTurnkey ? '(Llave en mano con instalación)' : '(Solo Material)'}

👤 *Cliente:* ${formData.fullName || 'No especificado'}
📱 *Teléfono:* ${formData.phone || 'No especificado'}
🏠 *Unidad/Lote:* ${formData.unitNumber || 'No especificado'}

_Hola QuickSurfaces! Deseo confirmar la visita técnica para ver las muestras físicas en mi casa y verificar medidas._`
        : `*QUICKSURFACES ESTIMATE - SIENA RESERVE*
----------------------------------------
📍 *Community:* Siena Reserve (Adora Collection, Homestead FL 33032)
🏡 *Model:* ${selectedModel.name}
📐 *Selected Scope:* ${scopeLabel}
📦 *Recommended Material (+10%):* ${quoteCalc.sqftMaterialRecommended} SF (${quoteCalc.boxesCount} boxes)
🪜 *Stairs:* ${quoteCalc.stepsCount} Steps (Flush Stair Nose)

🎨 *Selected Flooring:*
• Type: ${selectedProduct.productType === 'hardwood' ? 'Engineered Hardwood' : selectedProduct.productType === 'laminate' ? 'AC4 Laminate' : 'SPC Luxury Vinyl'}
• Product: #${selectedProduct.code} ${selectedProduct.name}
• Collection: ${selectedProduct.collectionName}
• Specs: ${selectedProduct.thickness} · Wear Layer ${selectedProduct.wearLayer}

💼 *Package:* ${selectedPackage.title}
💰 *TOTAL ESTIMATE:* ${formatCurrency(quoteCalc.totalPrice)} ${selectedPackage.isTurnkey ? '(Turnkey with install)' : '(Material Only)'}

👤 *Client:* ${formData.fullName || 'Not specified'}
📱 *Phone:* ${formData.phone || 'Not specified'}
🏠 *Unit/Lot:* ${formData.unitNumber || 'Not specified'}

_Hi QuickSurfaces! I would like to schedule an in-home sample review and measure verification._`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(
      `Cotización QuickSurfaces: Siena Reserve - Modelo ${selectedModel.name}`
    );
    const body = encodeURIComponent(
      `Hola equipo QuickSurfaces,\n\nAdjunto los detalles de mi cotización para Siena Reserve:\n- Modelo: ${selectedModel.name}\n- Alcance: ${floorScope}\n- Piso: #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.collectionName})\n- Paquete: ${selectedPackage.title}\n- Total Estimado: ${formatCurrency(quoteCalc.totalPrice)}\n\nContacto:\n- Nombre: ${formData.fullName}\n- Teléfono: ${formData.phone}\n- Unidad: ${formData.unitNumber}\n\nPor favor contáctenme para agendar la visita.`
    );
    return `mailto:sales@quicksurfaces.com?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="step-wizard-container"
      className="w-full max-w-5xl mx-auto bg-[#FFFFFF] text-[#0F172A] rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden font-sans flex flex-col min-h-[660px]"
    >
      {/* ================= NATIVE APP TOP BAR ================= */}
      <div className="bg-[#FFFFFF] border-b border-[#F1F5F9] px-4 py-3 sm:px-6 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer shrink-0"
                aria-label={lang === 'es' ? 'Volver al paso anterior' : 'Back to previous step'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#FF8407]/10 flex items-center justify-center text-[#FF8407] font-black text-xs shrink-0">
                QS
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8407] block leading-tight">
                {lang === 'es' ? `Paso ${currentStep} de 4` : `Step ${currentStep} of 4`}
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#0F172A] truncate leading-tight">
                {stepMeta[currentStep - 1].title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Display price in header ONLY when on step 3 or 4 */}
            {currentStep >= 3 ? (
              <div className="text-right bg-[#FFF7ED] px-3 py-1 rounded-xl border border-[#FF8407]/30">
                <span className="text-[9px] text-[#64748B] block font-bold uppercase">
                  {lang === 'es' ? 'Total Estimado' : 'Estimated Total'}
                </span>
                <span className="text-xs sm:text-sm font-black text-[#FF8407]">
                  {formatCurrency(quoteCalc.totalPrice)}
                </span>
              </div>
            ) : (
              <div className="text-right px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">
                  {lang === 'es' ? 'Siena Reserve' : 'Siena Reserve'}
                </span>
                <span className="text-xs font-black text-slate-800">
                  Homestead, FL
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar line */}
        <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FF8407] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* ================= SCREEN CONTENT (STEP BY STEP) ================= */}
      <div className="p-4 sm:p-7 flex-grow bg-[#FAFAFA]">
        {/* ========================================================
            SCREEN 1: SIENA RESERVE & MODEL BANDOL 2D PLAN
        ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Facade Hero Banner with 1st/2nd/Both Floor Scope Selector */}
            <SienaReserveHero
              floorScope={floorScope}
              onChangeFloorScope={setFloorScope}
              model={selectedModel}
            />

            {/* Model Selection Tabs (Bandol, Casis, Monte Carlo, Reserve, Vence) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="min-w-0">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0F172A] block truncate">
                    {lang === 'es'
                      ? `Modelos Townhome en Siena Reserve (${SIENA_RESERVE_MODELS.length})`
                      : `Townhome Models in Siena Reserve (${SIENA_RESERVE_MODELS.length})`}
                  </span>
                  <span className="text-[11px] text-[#64748B] block font-medium truncate">
                    {lang === 'es' ? 'Seleccionado actualmente:' : 'Currently selected:'}{' '}
                    <strong className="text-[#0F172A] font-black">{selectedModel.name} (Adora Collection)</strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SIENA_RESERVE_MODELS.map((m) => {
                  const isSelected = selectedModel.id === m.id || selectedModel.slug === m.slug;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF8407] bg-[#FFFBF7] shadow-md ring-2 ring-[#FF8407]'
                          : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#CBD5E1] shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-black text-sm text-[#0F172A] truncate">{m.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-[#64748B] block">
                          {m.bedrooms} Hab • {m.baths} Baños
                        </span>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">Recomendado:</span>
                        <span className="font-bold text-[#FF8407]">
                          {floorScope === 'floor1'
                            ? `${m.sqftFirstFloorRec || 560} SF`
                            : floorScope === 'floor2'
                            ? `${m.sqftSecondFloorRec || 520} SF`
                            : `${m.sqftMaterialRecommended || 1080} SF`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2D ARCHITECTURAL FLOOR PLAN (Bandol 1st & 2nd floor with big dims & grayscale CAD style) */}
            <div className="mt-6 animate-fadeIn space-y-5">
              <InteractiveFloorPlan2D
                model={selectedModel}
                selectedProduct={selectedProduct}
                floorScope={floorScope}
                onChangeFloorScope={setFloorScope}
              />

              {/* Photorealistic 3D Dollhouse Render */}
              <Photorealistic3DRender
                model={selectedModel}
                floorScope={floorScope}
                onChangeFloorScope={setFloorScope}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: PRODUCT TYPE, THICKNESS & SWATCHES
        ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            {/* ROOMVO 3D VISUALIZER CALLOUT */}
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-3.5 sm:p-4 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF8407]/20 border border-[#FF8407]/40 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-[#FF8407]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-white">
                      {lang === 'es' ? 'Simulador 3D Roomvo en tu Espacio' : '3D Simulator in Your Real Space'}
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#FF8407] text-black uppercase">
                      Roomvo
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    {lang === 'es'
                      ? 'Toma una foto de tu sala o recámara en Siena Reserve y pruébate los colores en tiempo real.'
                      : 'Take a photo of your room in Siena Reserve and test flooring shades in real-time.'}
                  </p>
                </div>
              </div>

              <a
                href="https://www.roomvo.com/my/flooringwaterproof/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#ff952a] text-black flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Camera className="w-4 h-4 text-black shrink-0" />
                <span className="truncate">
                  {lang === 'es' ? 'Visualizar en tu espacio' : 'Visualize in your room'}
                </span>
                <ChevronRight className="w-4 h-4 text-black shrink-0" />
              </a>
            </div>

            {/* Interactive Viewport Frame (Room / Plank / Stairs) */}
            <div className="bg-[#FFFFFF] rounded-2xl p-3 sm:p-4 border border-[#E2E8F0] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] overflow-x-auto [scrollbar-width:none]">
                  <button
                    type="button"
                    onClick={() => setViewMode3D('room')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      viewMode3D === 'room'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Render Habitación' : 'Room View'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode3D('plank')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      viewMode3D === 'plank'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#FF8407]" />
                    <span>{lang === 'es' ? 'Foto Tablón' : 'Plank Closeup'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode3D('stairs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      viewMode3D === 'stairs'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Escaleras' : 'Staircase'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {renderStockBadge(selectedProduct)}
                  <span className="text-xs font-black text-[#0F172A] px-2.5 py-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] truncate max-w-[220px]">
                    #{selectedProduct.code} {selectedProduct.name}
                  </span>
                </div>
              </div>

              {/* Main Image Viewer */}
              <div className="relative h-56 sm:h-72 w-full rounded-xl overflow-hidden bg-[#E2E8F0] border border-[#CBD5E1]">
                <img
                  src={
                    viewMode3D === 'room'
                      ? selectedProduct.roomPreviewUrl || selectedProduct.imageUrl
                      : viewMode3D === 'plank'
                      ? selectedProduct.plankImageUrl || selectedProduct.imageUrl
                      : selectedProduct.staircasePreviewUrl || selectedProduct.imageUrl
                  }
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between p-2.5 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/10 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border border-white shrink-0 shadow-sm"
                      style={{ backgroundColor: selectedProduct.colorHex }}
                    ></span>
                    <span className="font-black truncate">{selectedProduct.name}</span>
                    <span className="text-white/70 text-[11px] hidden sm:inline truncate">
                      ({selectedProduct.collectionName})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                    <span className="font-bold text-[#FF8407]">{selectedProduct.thickness}</span>
                    <span>•</span>
                    <span>{selectedProduct.wearLayer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Box Calculator */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FF8407] flex items-center justify-center shrink-0 border border-[#FF8407]/30">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                    {lang === 'es'
                      ? `Cálculo de Cajas: Modelo ${selectedModel.name}`
                      : `Box Calculation: Model ${selectedModel.name}`}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {selectedProduct.collectionName} • {selectedProduct.sqftPerBox} sq ft por caja
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] text-[#64748B] block font-bold uppercase">
                    {lang === 'es' ? 'Material (+10% margen)' : 'Required Material'}
                  </span>
                  <span className="text-xs font-black text-[#0F172A]">
                    {quoteCalc.sqftMaterialRecommended} SF
                  </span>
                </div>
                <div className="h-6 w-px bg-[#CBD5E1]"></div>
                <div className="text-right">
                  <span className="text-[9px] text-[#FF8407] block font-bold uppercase">
                    {lang === 'es' ? 'Cajas Requeridas' : 'Boxes to Deliver'}
                  </span>
                  <span className="text-sm font-black text-[#FF8407]">
                    {quoteCalc.boxesCount} Cajas ({quoteCalc.totalBoxesSqft} SF)
                  </span>
                </div>
              </div>
            </div>

            {/* DEDICATED FILTERS: 1. PRODUCT TYPE | 2. THICKNESS / COLLECTION | 3. TONE */}
            <div className="space-y-4 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              {/* Filter 1: Product Type (Vinyl / Laminate / Hardwood) */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A] block mb-2">
                  {lang === 'es' ? '1. Tipo de Material / Producto:' : '1. Product Type / Material:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductType('vinyl');
                      setThicknessFilter('all');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      selectedProductType === 'vinyl'
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black block">Pisos Vinílicos SPC</span>
                      <span className="text-[10px] opacity-75">100% Impermeables • 5.5mm a 8.0mm</span>
                    </div>
                    {selectedProductType === 'vinyl' && <Check className="w-4 h-4 text-[#FF8407]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductType('laminate');
                      setThicknessFilter('all');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      selectedProductType === 'laminate'
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black block">Piso Laminado AC4</span>
                      <span className="text-[10px] opacity-75">12.0mm • Scratch Guard Ultra</span>
                    </div>
                    {selectedProductType === 'laminate' && <Check className="w-4 h-4 text-[#FF8407]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductType('hardwood');
                      setThicknessFilter('all');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      selectedProductType === 'hardwood'
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black block">Madera de Ingeniería</span>
                      <span className="text-[10px] opacity-75">1/2&quot; Roble Europeo Genuino</span>
                    </div>
                    {selectedProductType === 'hardwood' && <Check className="w-4 h-4 text-[#FF8407]" />}
                  </button>
                </div>
              </div>

              {/* Filter 2: Specific Collections for Vinyl (5.5mm Pulse Select / 6.0mm Pulse Shield XL / 8.0mm XL Pulse) */}
              {selectedProductType === 'vinyl' && (
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A] block mb-1.5">
                    {lang === 'es' ? '2. Colección & Espesor SPC:' : '2. SPC Collection & Thickness:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setThicknessFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        thicknessFilter === 'all'
                          ? 'bg-[#FF8407] text-black shadow-xs'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-black'
                      }`}
                    >
                      Todos los Espesores
                    </button>
                    <button
                      type="button"
                      onClick={() => setThicknessFilter('5.5mm')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        thicknessFilter === '5.5mm'
                          ? 'bg-[#FF8407] text-black shadow-xs'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-black'
                      }`}
                    >
                      5.5 mm — Pulse Select
                    </button>
                    <button
                      type="button"
                      onClick={() => setThicknessFilter('6mm')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        thicknessFilter === '6mm'
                          ? 'bg-[#FF8407] text-black shadow-xs'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-black'
                      }`}
                    >
                      6.0 mm — Pulse Shield XL
                    </button>
                    <button
                      type="button"
                      onClick={() => setThicknessFilter('8mm')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        thicknessFilter === '8mm'
                          ? 'bg-[#FF8407] text-black shadow-xs'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-black'
                      }`}
                    >
                      8.0 mm — XL Pulse (Flagship)
                    </button>
                  </div>
                </div>
              )}

              {/* Filter 3: Color Tone */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A] block mb-1.5">
                  {lang === 'es' ? '3. Tono de Color:' : '3. Color Tone:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Todos los Tonos' },
                    { id: 'warm', label: 'Cálido (Warm)' },
                    { id: 'cool', label: 'Frío / Gris (Cool)' },
                    { id: 'natural', label: 'Natural' },
                    { id: 'light', label: 'Claro (Light)' },
                    { id: 'dark', label: 'Oscuro (Dark)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setToneFilter(t.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        toneFilter === t.id
                          ? 'bg-[#0F172A] text-white shadow-xs'
                          : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-black'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Swatches Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  Colores Disponibles ({filteredProducts.length})
                </span>
                <span className="text-xs text-[#64748B]">Toca para seleccionar y previsualizar</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((p) => {
                  const isSelected = selectedProduct.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF8407] bg-[#FFFBF7] shadow-lg ring-2 ring-[#FF8407]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2 bg-[#E2E8F0]">
                          <img
                            src={p.plankImageUrl || p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div
                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: p.colorHex }}
                          ></div>
                        </div>

                        <span className="font-black text-xs text-[#0F172A] block truncate">{p.name}</span>
                        <span className="text-[10px] text-[#64748B] block truncate">{p.collectionName}</span>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#FF8407]">{p.thickness}</span>
                        {isSelected ? (
                          <span className="font-black text-[#FF8407] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Elegido
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Seleccionar</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: PACKAGES & ESTIMATION (Price revealed here)
        ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                {lang === 'es' ? 'Selecciona tu Paquete de Instalación' : 'Select Installation Package'}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {lang === 'es'
                  ? `Calculado para ${selectedModel.name} en Siena Reserve (${quoteCalc.sqftMaterialRecommended} SF recomendados).`
                  : `Calculated for ${selectedModel.name} in Siena Reserve (${quoteCalc.sqftMaterialRecommended} SF recommended).`}
              </p>
            </div>

            {/* Turnkey vs Material Tabs */}
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#CBD5E1] w-full sm:w-auto self-start">
              <button
                type="button"
                onClick={() => setPackageType('all')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  packageType === 'all' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {lang === 'es' ? 'Todos los Paquetes' : 'All Packages'}
              </button>
              <button
                type="button"
                onClick={() => setPackageType('turnkey')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  packageType === 'turnkey' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {lang === 'es' ? 'Llave en Mano Completo' : 'Turnkey Complete'}
              </button>
              <button
                type="button"
                onClick={() => setPackageType('material')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  packageType === 'material' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {lang === 'es' ? 'Solo Material' : 'Material Only'}
              </button>
            </div>

            {/* Package Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                const calc = calculateQuotePrice(selectedModel, selectedProduct, pkg, floorScope);

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#FF8407] bg-[#FFFBF7] shadow-xl ring-2 ring-[#FF8407]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] shadow-xs'
                    }`}
                  >
                    <div>
                      {pkg.badge && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF8407] text-black text-[10px] font-black uppercase tracking-wider mb-2">
                          {pkg.badge}
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-black text-base text-[#0F172A]">{pkg.title}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5">{pkg.tagline}</p>
                        </div>
                      </div>

                      {/* Price Tag Highlight */}
                      <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Estimado</span>
                          <span className="text-2xl font-black text-[#FF8407]">{formatCurrency(calc.totalPrice)}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {pkg.isTurnkey ? 'Llave en mano' : 'Solo Material'}
                        </span>
                      </div>

                      {/* Features Checklist */}
                      <ul className="space-y-1.5 my-3">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#334155]">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {quoteCalc.sqftMaterialRecommended} SF ({calc.boxesCount} cajas)
                      </span>
                      {isSelected ? (
                        <span className="text-xs font-black text-[#FF8407] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Seleccionado
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Seleccionar Paquete</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: SUMMARY & FORMAL ORDER DISPATCH
        ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Formal Quote Summary Card */}
            <div className="bg-[#FFFFFF] p-5 sm:p-7 rounded-3xl border border-[#CBD5E1] shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-[#0F172A] text-[#FF8407] text-[10px] font-black tracking-wider uppercase">
                    Resumen de Cotización
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A] mt-1.5">
                    Siena Reserve — Modelo {selectedModel.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Alcance: {floorScope === 'floor1' ? 'Solo 1er Piso' : floorScope === 'floor2' ? 'Solo 2do Piso' : 'Casa Completa (Ambos Pisos)'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Garantizado</span>
                  <span className="text-3xl font-black text-[#FF8407]">{formatCurrency(quoteCalc.totalPrice)}</span>
                </div>
              </div>

              {/* Grid Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-5">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">Piso Seleccionado</span>
                  <strong className="text-slate-900 block mt-0.5">{selectedProduct.name}</strong>
                  <span className="text-[11px] text-[#FF8407]">{selectedProduct.collectionName} ({selectedProduct.thickness})</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">Metraje de Material</span>
                  <strong className="text-slate-900 block mt-0.5">{quoteCalc.sqftMaterialRecommended} SF</strong>
                  <span className="text-[11px] text-slate-500">{quoteCalc.boxesCount} Cajas ({quoteCalc.totalBoxesSqft} SF)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">Escaleras</span>
                  <strong className="text-slate-900 block mt-0.5">{quoteCalc.stepsCount} Pasos</strong>
                  <span className="text-[11px] text-slate-500">Flush Stair Nose al ras</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">Paquete</span>
                  <strong className="text-slate-900 block mt-0.5">{selectedPackage.title}</strong>
                  <span className="text-[11px] text-emerald-600 font-bold">{selectedPackage.isTurnkey ? 'Llave en Mano' : 'Material'}</span>
                </div>
              </div>

              {/* Contact Lead Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 mb-1">Datos para Confirmación de Medidas</h4>
                <p className="text-xs text-slate-500 mb-3">Llevamos las muestras físicas a tu hogar en Siena Reserve sin compromiso.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Mendoza"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF8407]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="(786) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF8407]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Unidad / Lote en Siena Reserve</label>
                    <input
                      type="text"
                      placeholder="Ej. Unidad 104"
                      value={formData.unitNumber}
                      onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF8407]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Cotización por WhatsApp</span>
                </a>

                <a
                  href={generateMailtoUrl()}
                  className="py-3.5 px-5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar por Email</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-sm flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#FF8407]" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= STICKY BOTTOM APP NAVIGATION ================= */}
      <div className="bg-[#FFFFFF] border-t border-[#E2E8F0] p-3 sm:p-4 px-4 sm:px-6 flex items-center justify-between gap-3 sticky bottom-0 z-30 shadow-xs">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            currentStep === 1
              ? 'opacity-20 cursor-not-allowed text-[#94A3B8]'
              : 'text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'es' ? 'Anterior' : 'Back'}</span>
        </button>

        {/* Center Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] truncate max-w-[280px]">
          <span className="truncate">{selectedModel.name}</span>
          <span>•</span>
          <span className="truncate">{selectedProduct.name}</span>
          {currentStep >= 3 && (
            <>
              <span>•</span>
              <span className="text-[#FF8407] font-black">{formatCurrency(quoteCalc.totalPrice)}</span>
            </>
          )}
        </div>

        {/* Next / Confirm CTA Button */}
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-black shadow-md shadow-[#FF8407]/20 transition-all cursor-pointer"
          >
            <span>
              {currentStep === 1
                ? lang === 'es'
                  ? 'Siguiente: Escoger Piso'
                  : 'Next: Choose Floor'
                : currentStep === 2
                ? lang === 'es'
                  ? 'Siguiente: Ver Paquetes'
                  : 'Next: View Packages'
                : lang === 'es'
                ? 'Siguiente: Ver Resumen'
                : 'Next: View Summary'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md cursor-pointer"
          >
            <span>{lang === 'es' ? 'Enviar WhatsApp' : 'Send WhatsApp'}</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

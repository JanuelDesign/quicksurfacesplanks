import React, { useState, useEffect, useRef } from 'react';
import {
  FloorPlanModel,
  FlooringProduct,
  PricingPackage,
  FloorScope,
  ProductType,
  Community,
} from '../types';
import { COMMUNITIES, SIENA_RESERVE_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from '../data/products';
import { calculateQuotePrice, formatCurrency, getStairMaterialCost } from '../utils/pricingCalculator';
import { useLanguage } from '../context/LanguageContext';
import { SienaReserveHero } from './SienaReserveHero';
import { InteractiveFloorPlan2D } from './InteractiveFloorPlan2D';
import { Photorealistic3DRender } from './Photorealistic3DRender';
import { StaircaseStepSection } from './StaircaseStepSection';
import { StairTechnicalImage, StairVerticalCard, StairProjectItem } from '../data/stairsGallery';
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
  Camera,
  ShieldCheck,
  Check,
  Info,
  ZoomIn,
  Truck,
  Wrench,
  Palette,
  AlertCircle,
} from 'lucide-react';

interface StepWizardProps {
  initialCommunity?: Community;
  initialModel?: FloorPlanModel;
  initialProduct?: FlooringProduct;
  initialPackage?: PricingPackage;
  modelsList?: FloorPlanModel[];
  productsList?: FlooringProduct[];
  packagesList?: PricingPackage[];
  stairTechnicalImages?: StairTechnicalImage[];
  stairVerticalCards?: StairVerticalCard[];
  stairCarouselItems?: StairProjectItem[];
  isLiveSynced?: boolean;
  onClose?: () => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  initialCommunity,
  initialModel,
  initialProduct,
  initialPackage,
  modelsList: propModelsList,
  productsList: propProductsList,
  packagesList: propPackagesList,
  stairTechnicalImages,
  stairVerticalCards,
  stairCarouselItems,
  isLiveSynced,
  onClose,
}) => {
  const { lang } = useLanguage();

  // Primary lists
  const modelsList = propModelsList && propModelsList.length > 0 ? propModelsList : SIENA_RESERVE_MODELS;
  const productsList = propProductsList && propProductsList.length > 0 ? propProductsList : FLOORING_PRODUCTS;
  const packagesList = propPackagesList && propPackagesList.length > 0 ? propPackagesList : PRICING_PACKAGES;

  // Active step in the workflow (1: Model & Scope, 2: Product & Color, 3: Package, 4: Summary)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Model selection (defaults to initialModel or B Model)
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(() => {
    if (initialModel) {
      const found = modelsList.find((m) => m.id === initialModel.id || m.slug === initialModel.slug);
      if (found) return found;
    }
    return modelsList.find((m) => m.slug === 'b-model' || m.slug === 'bandol') || modelsList[0] || SIENA_RESERVE_MODELS[0];
  });

  // Floor Scope (4 options: floor1, floor1_stairs, floor2, floor2_stairs)
  const [floorScope, setFloorScope] = useState<FloorScope>('floor1_stairs');

  // Thickness filter (5.5mm, 6mm, 8mm, or all)
  const [thicknessFilter, setThicknessFilter] = useState<string>('all');

  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(() => {
    if (initialProduct) {
      const found = productsList.find((p) => p.id === initialProduct.id || p.code === initialProduct.code);
      if (found) return found;
    }
    return productsList[0] || FLOORING_PRODUCTS[0];
  });
  const [viewMode3D, setViewMode3D] = useState<'room' | 'plank'>('room');
  const roomSceneRef = useRef<HTMLDivElement>(null);
  const colorCarouselRef = useRef<HTMLDivElement>(null);

  const scrollColorCarousel = (direction: 'left' | 'right') => {
    if (colorCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      colorCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: FlooringProduct) => {
    setSelectedProduct(product);
  };

  // Package Selection
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(() => {
    if (initialPackage) {
      const found = packagesList.find((p) => p.id === initialPackage.id);
      if (found) return found;
    }
    return packagesList.find((p) => p.isTurnkey) || packagesList[0] || PRICING_PACKAGES[0];
  });
  const [packageType, setPackageType] = useState<'all' | 'turnkey' | 'material'>('all');

  // Lead Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    unitNumber: '',
    preferredDate: '',
    notes: '',
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    phone?: string;
    unitNumber?: string;
  }>({});
  const [formTouched, setFormTouched] = useState<boolean>(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);

  // Dynamic Quote Calculation
  const quoteCalc = calculateQuotePrice(selectedModel, selectedProduct, selectedPackage, floorScope);

  // Sync selected model if fresh models load
  useEffect(() => {
    if (modelsList && modelsList.length > 0) {
      const matchingModel = modelsList.find(
        (m) => m.id === selectedModel.id || m.slug === selectedModel.slug || m.name.toLowerCase() === selectedModel.name.toLowerCase()
      );
      if (matchingModel) {
        setSelectedModel(matchingModel);
      } else {
        setSelectedModel(modelsList[0]);
      }
    }
  }, [modelsList]);

  // Sync selected product when live products load
  useEffect(() => {
    if (productsList && productsList.length > 0) {
      const freshProduct = productsList.find((p) => p.id === selectedProduct.id || p.code === selectedProduct.code);
      if (freshProduct) {
        setSelectedProduct(freshProduct);
      } else {
        setSelectedProduct(productsList[0]);
      }
    }
  }, [productsList]);

  // Filtered products based on Thickness (only SPC vinyl is in the catalog)
  const filteredProducts = productsList.filter((p) => {
    if (thicknessFilter !== 'all' && p.category !== thicknessFilter) return false;
    return true;
  });

  // Auto-select first matching product when filter changes if active product is excluded
  useEffect(() => {
    if (filteredProducts.length > 0 && !filteredProducts.some((p) => p.id === selectedProduct.id)) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [thicknessFilter]);

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
      title: lang === 'es' ? 'Siena Reserve Townhomes' : 'Siena Reserve Townhomes',
      subtitle: lang === 'es' ? 'Plano 2D Arquitectónico y Área a Remodelar' : '2D Architectural Plan & Scope',
    },
    {
      title: lang === 'es' ? 'Catálogo SPC y Selección de Color' : 'SPC Catalog & Color Selection',
      subtitle: lang === 'es' ? 'Pisos Vinílicos SPC 100% Impermeables con 17 Escalones Square Step Nose' : '100% Waterproof SPC Vinyl with 17 Square Step Noses',
    },
    {
      title: lang === 'es' ? 'Paquetes de Instalación y Estimado' : 'Installation Packages & Estimate',
      subtitle: lang === 'es' ? 'Precios transparentes desglosados con mano de obra y flete' : 'Itemized transparent pricing with labor and delivery',
    },
    {
      title: lang === 'es' ? 'Resumen Oficial y Cotización' : 'Official Summary & Estimate',
      subtitle: lang === 'es' ? 'Envío directo por WhatsApp o Email' : 'Direct dispatch via WhatsApp or Email',
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

  // Scope descriptive label
  const getScopeLabel = () => {
    switch (floorScope) {
      case 'floor1':
        return lang === 'es' ? 'Solo 1er Piso (~510 SF)' : '1st Floor Only (~510 SF)';
      case 'floor1_stairs':
        return lang === 'es' ? '1er Piso + 17 Escalones Square Step Nose (~510 SF + 17 Esc.)' : '1st Floor + 17 Square Step Noses (~510 SF + 17 Steps)';
      case 'floor2':
        return lang === 'es' ? 'Solo 2do Piso (~465 SF)' : '2nd Floor Only (~465 SF)';
      case 'floor2_stairs':
        return lang === 'es' ? '2do Piso + 17 Escalones Square Step Nose (~465 SF + 17 Esc.)' : '2nd Floor + 17 Square Step Noses (~465 SF + 17 Steps)';
    }
  };

  // Dynamic bilingual package features bound to current selected product without factory warranty
  const getPackageDynamicFeatures = (pkg: PricingPackage) => {
    const isTurnkey = pkg.isTurnkey;
    const plankFormat =
      selectedProduct.plankDimensions ||
      selectedProduct.plankSize ||
      (selectedProduct.category === '5.5mm' ? '7" x 48"' : '9" x 60"');

    if (lang === 'es') {
      return [
        `Piso SPC ${selectedProduct.thickness} espesor total (${selectedProduct.wearLayer || '20 mil'})`,
        `Formato tablón: ${plankFormat}`,
        quoteCalc.hasStairs
          ? '17 Escalones Square Step Nose a medida incluidos'
          : 'Cálculo para área sin escaleras',
        isTurnkey
          ? 'Mano de obra especializada y remoción de rodapiés'
          : 'Entrega directa a pie de obra en Homestead ($60.00)',
      ];
    } else {
      return [
        `SPC Flooring ${selectedProduct.thickness} total thickness (${selectedProduct.wearLayer || '20 mil'})`,
        `Plank Format: ${plankFormat}`,
        quoteCalc.hasStairs
          ? '17 Custom Square Step Noses included'
          : 'Calculated for area without stairs',
        isTurnkey
          ? 'Certified contractor labor & precision baseboard reinstall'
          : 'Direct jobsite delivery in Homestead ($60.00)',
      ];
    }
  };

  // Lead Form Validation
  const validateLeadForm = (): boolean => {
    const errors: { fullName?: string; phone?: string; unitNumber?: string } = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName =
        lang === 'es'
          ? 'Por favor ingresa tu nombre completo.'
          : 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      errors.phone =
        lang === 'es'
          ? 'Por favor ingresa un número de teléfono válido (mínimo 7 dígitos).'
          : 'Please enter a valid phone number (minimum 7 digits).';
    }

    if (!formData.unitNumber.trim()) {
      errors.unitNumber =
        lang === 'es'
          ? 'Por favor indica tu número de unidad o lote en Siena Reserve.'
          : 'Please enter your unit or lot number in Siena Reserve.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // WhatsApp formatted lead message with validation
  const generateWhatsAppUrl = () => {
    const phone = '17866583677';
    const scopeLabel = getScopeLabel();

    const text =
      lang === 'es'
        ? `*COTIZACIÓN QUICKSURFACES - SIENA RESERVE*
----------------------------------------
📍 *Comunidad:* Siena Reserve (Homestead FL 33032)
🏡 *Modelo:* ${selectedModel.name}
📐 *Área Seleccionada:* ${scopeLabel}
📦 *Material Recomendado (+7%):* ${quoteCalc.sqftMaterialRecommended} SF (${quoteCalc.boxesCount} cajas)
🪜 *Escaleras:* ${quoteCalc.hasStairs ? '17 Escalones Square Step Nose a juego' : 'No incluidas'}

🎨 *Piso SPC Elegido:*
• Producto: #${selectedProduct.code} ${selectedProduct.name}
• Colección: ${selectedProduct.collectionName} (${selectedProduct.thickness})
• Capa de uso: ${selectedProduct.wearLayer}

💼 *Paquete:* ${selectedPackage.title}
💰 *DESGLOSE DE PRECIOS:*
• Material Piso: ${formatCurrency(quoteCalc.materialFloorCost)}
• Material Escaleras: ${quoteCalc.hasStairs ? formatCurrency(quoteCalc.materialStairsCost) : '$0.00'}
• Mano de Obra Piso: ${selectedPackage.includesLabor ? formatCurrency(quoteCalc.laborFloorCost) : 'Por cuenta del cliente'}
• Mano de Obra Escaleras: ${selectedPackage.includesLabor && quoteCalc.hasStairs ? formatCurrency(quoteCalc.laborStairsCost) : '$0.00'}
• Flete Local: ${formatCurrency(quoteCalc.deliveryFee)}
----------------------------------------
🔥 *TOTAL ESTIMADO:* ${formatCurrency(quoteCalc.totalPrice)}

👤 *Cliente:* ${formData.fullName.trim() || 'No especificado'}
📱 *Teléfono:* ${formData.phone.trim() || 'No especificado'}
🏠 *Unidad/Lote:* ${formData.unitNumber.trim() || 'No especificado'}

_Hola QuickSurfaces! Deseo confirmar la visita técnica para ver las muestras físicas en mi casa y verificar medidas._`
        : `*QUICKSURFACES ESTIMATE - SIENA RESERVE*
----------------------------------------
📍 *Community:* Siena Reserve (Homestead FL 33032)
🏡 *Model:* ${selectedModel.name}
📐 *Selected Scope:* ${scopeLabel}
📦 *Recommended Material (+7%):* ${quoteCalc.sqftMaterialRecommended} SF (${quoteCalc.boxesCount} boxes)
🪜 *Stairs:* ${quoteCalc.hasStairs ? '17 Custom Square Step Noses' : 'Not included'}

🎨 *Selected SPC Flooring:*
• Product: #${selectedProduct.code} ${selectedProduct.name}
• Collection: ${selectedProduct.collectionName} (${selectedProduct.thickness})
• Wear Layer: ${selectedProduct.wearLayer}

💼 *Package:* ${selectedPackage.title}
💰 *PRICE BREAKDOWN:*
• Floor Material: ${formatCurrency(quoteCalc.materialFloorCost)}
• Stairs Material: ${quoteCalc.hasStairs ? formatCurrency(quoteCalc.materialStairsCost) : '$0.00'}
• Floor Labor: ${selectedPackage.includesLabor ? formatCurrency(quoteCalc.laborFloorCost) : 'Customer self-installed'}
• Stairs Labor: ${selectedPackage.includesLabor && quoteCalc.hasStairs ? formatCurrency(quoteCalc.laborStairsCost) : '$0.00'}
• Local Delivery: ${formatCurrency(quoteCalc.deliveryFee)}
----------------------------------------
🔥 *ESTIMATED TOTAL:* ${formatCurrency(quoteCalc.totalPrice)}

👤 *Customer:* ${formData.fullName.trim() || 'Not specified'}
📱 *Phone:* ${formData.phone.trim() || 'Not specified'}
🏠 *Unit/Lot:* ${formData.unitNumber.trim() || 'Not specified'}

_Hi QuickSurfaces! I would like to schedule an in-home sample review and measure verification._`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(
      lang === 'es'
        ? `Cotización QuickSurfaces: Siena Reserve - ${selectedModel.name}`
        : `QuickSurfaces Quote: Siena Reserve - ${selectedModel.name}`
    );
    const body = encodeURIComponent(
      lang === 'es'
        ? `Hola equipo QuickSurfaces,\n\nAdjunto los detalles de mi cotización para Siena Reserve:\n- Modelo: ${selectedModel.name}\n- Alcance: ${getScopeLabel()}\n- Piso SPC: #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.collectionName} ${selectedProduct.thickness})\n- Paquete: ${selectedPackage.title}\n- Total Estimado: ${formatCurrency(quoteCalc.totalPrice)}\n\nContacto:\n- Nombre: ${formData.fullName}\n- Teléfono: ${formData.phone}\n- Unidad: ${formData.unitNumber}\n\nPor favor contáctenme para agendar la visita.`
        : `Hello QuickSurfaces team,\n\nHere are the details of my quote for Siena Reserve:\n- Model: ${selectedModel.name}\n- Scope: ${getScopeLabel()}\n- SPC Flooring: #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.collectionName} ${selectedProduct.thickness})\n- Package: ${selectedPackage.title}\n- Total Estimate: ${formatCurrency(quoteCalc.totalPrice)}\n\nContact Info:\n- Name: ${formData.fullName}\n- Phone: ${formData.phone}\n- Unit: ${formData.unitNumber}\n\nPlease contact me to schedule a visit.`
    );
    return `mailto:sales@quicksurfaces.com?subject=${subject}&body=${body}`;
  };

  const handleSendWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormTouched(true);
    if (!validateLeadForm()) {
      return;
    }
    setIsSubmitSuccess(true);
    const url = generateWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormTouched(true);
    if (!validateLeadForm()) {
      return;
    }
    setIsSubmitSuccess(true);
    const url = generateMailtoUrl();
    window.location.href = url;
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
                  Siena Reserve
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
            SCREEN 1: SIENA RESERVE & 4 AREA SELECTIONS
        ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Facade Hero Banner */}
            <SienaReserveHero model={selectedModel} />

            {/* Scope Selection Section (Distinctive Dark Background) */}
            <div
              translate="no"
              className="notranslate bg-[#0B1120] text-white p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8407]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#FF8407] flex items-center justify-center text-black font-black shadow-md">
                    <Layers className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase block">
                      {lang === 'es' ? '¿Qué área deseas remodelar?' : 'Which area do you want to remodel?'}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] font-medium block">
                      {lang === 'es'
                        ? 'Selecciona una de las 4 opciones para actualizar planos y presupuesto:'
                        : 'Select one of 4 scopes to update plans & estimate:'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#FF8407] bg-[#FF8407]/15 px-2.5 py-1 rounded-full border border-[#FF8407]/30 self-start sm:self-auto">
                  {lang === 'es' ? 'Cálculo a Medida' : 'Precision Scope'}
                </span>
              </div>

              <div translate="no" className="notranslate grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
                <button
                  type="button"
                  translate="no"
                  onClick={() => setFloorScope('floor1')}
                  className={`notranslate p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    floorScope === 'floor1'
                      ? 'border-[#FF8407] bg-[#1E293B] ring-2 ring-[#FF8407] shadow-lg shadow-[#FF8407]/20 text-white'
                      : 'border-slate-800 bg-[#0F172A]/90 hover:bg-[#1E293B] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white leading-tight">
                      {lang === 'es' ? 'Solo 1er Piso' : '1st Floor Only'}
                    </span>
                    {floorScope === 'floor1' && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#FF8407] font-bold mt-2 block">
                    ~{selectedModel.sqftFirstFloorRec || 546} SF
                  </span>
                </button>

                <button
                  type="button"
                  translate="no"
                  onClick={() => setFloorScope('floor1_stairs')}
                  className={`notranslate p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    floorScope === 'floor1_stairs'
                      ? 'border-[#FF8407] bg-[#1E293B] ring-2 ring-[#FF8407] shadow-lg shadow-[#FF8407]/20 text-white'
                      : 'border-slate-800 bg-[#0F172A]/90 hover:bg-[#1E293B] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white leading-tight">
                      {lang === 'es' ? '1er Piso + Escaleras' : '1st Floor + Stairs'}
                    </span>
                    {floorScope === 'floor1_stairs' && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#FF8407] font-bold mt-2 block">
                    ~{selectedModel.sqftFirstFloorRec || 546} SF + 17 Esc.
                  </span>
                </button>

                <button
                  type="button"
                  translate="no"
                  onClick={() => setFloorScope('floor2')}
                  className={`notranslate p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    floorScope === 'floor2'
                      ? 'border-[#FF8407] bg-[#1E293B] ring-2 ring-[#FF8407] shadow-lg shadow-[#FF8407]/20 text-white'
                      : 'border-slate-800 bg-[#0F172A]/90 hover:bg-[#1E293B] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white leading-tight">
                      {lang === 'es' ? 'Solo 2do Piso' : '2nd Floor Only'}
                    </span>
                    {floorScope === 'floor2' && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#FF8407] font-bold mt-2 block">
                    ~{selectedModel.sqftSecondFloorRec || 498} SF
                  </span>
                </button>

                <button
                  type="button"
                  translate="no"
                  onClick={() => setFloorScope('floor2_stairs')}
                  className={`notranslate p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    floorScope === 'floor2_stairs'
                      ? 'border-[#FF8407] bg-[#1E293B] ring-2 ring-[#FF8407] shadow-lg shadow-[#FF8407]/20 text-white'
                      : 'border-slate-800 bg-[#0F172A]/90 hover:bg-[#1E293B] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white leading-tight">
                      {lang === 'es' ? '2do Piso + Escaleras' : '2nd Floor + Stairs'}
                    </span>
                    {floorScope === 'floor2_stairs' && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#FF8407] font-bold mt-2 block">
                    ~{selectedModel.sqftSecondFloorRec || 498} SF + 17 Esc.
                  </span>
                </button>
              </div>
            </div>

            {/* Model Selection Tabs (B Model, C Model, MC Model, R Model, V Model) */}
            <div translate="no" className="notranslate">
              <div className="flex items-center justify-between mb-2.5">
                <div className="min-w-0">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0F172A] block truncate">
                    {lang === 'es'
                      ? `Modelos Townhome en Siena Reserve (${modelsList.length})`
                      : `Townhome Models in Siena Reserve (${modelsList.length})`}
                  </span>
                  <span className="text-[11px] text-[#64748B] block font-medium truncate">
                    {lang === 'es' ? 'Seleccionado actualmente:' : 'Currently selected:'}{' '}
                    <strong className="text-[#0F172A] font-black">{selectedModel.name}</strong>
                  </span>
                </div>
              </div>

              <div translate="no" className="notranslate grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {modelsList.map((m) => {
                  const isSelected = selectedModel.id === m.id || selectedModel.slug === m.slug;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      translate="no"
                      onClick={() => setSelectedModel(m)}
                      className={`notranslate p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
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
                          {m.bedrooms} {lang === 'es' ? 'Hab' : 'Beds'} • {m.baths} {lang === 'es' ? 'Baños' : 'Baths'}
                        </span>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">{lang === 'es' ? 'Área:' : 'Area:'}</span>
                        <span className="font-bold text-[#FF8407]">
                          {floorScope === 'floor1' || floorScope === 'floor1_stairs'
                            ? `${m.sqftFirstFloorRec || 546} SF`
                            : `${m.sqftSecondFloorRec || 498} SF`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2D ARCHITECTURAL FLOOR PLAN (Shows only the selected floor) */}
            <div className="mt-6 animate-fadeIn space-y-5">
              <InteractiveFloorPlan2D
                model={selectedModel}
                selectedProduct={selectedProduct}
                floorScope={floorScope}
                onChangeFloorScope={setFloorScope}
              />

              {/* Photorealistic 3D Dollhouse Render (Always shows 2nd floor with stairs) */}
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
            {/* 1. ROOMVO 3D VISUALIZER CALLOUT */}
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
                      ? 'Toma una foto de tu espacio en Siena Reserve y pruébate los colores en tiempo real.'
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

            {/* 2. SPC COLLECTION & THICKNESS FILTER - MOVED FIRST (DIRECTLY UNDER ROOMVO) */}
            <div className="space-y-3 bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF8407]" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F172A]">
                    {lang === 'es' ? 'Colección y Espesor Total de Piso SPC:' : 'SPC Collection & Total Thickness:'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'es' ? 'Pisos Vinílicos 100% Impermeables' : '100% Waterproof SPC Vinyl'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setThicknessFilter('5.5mm')}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    thicknessFilter === '5.5mm'
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg ring-2 ring-[#FF8407]'
                      : 'bg-[#F8FAFC] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-base font-black">5.5 mm</span>
                      {thicknessFilter === '5.5mm' && <Check className="w-4 h-4 text-[#FF8407]" />}
                    </div>
                    <span className="text-xs font-bold block opacity-90">Pulse Select</span>
                    <span className="text-[11px] opacity-75 block mt-0.5">20 Mil Commercial Wear Layer</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FF8407]">$1.69 / SF</span>
                    <span className="text-[10px] opacity-70">7" x 48"</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setThicknessFilter('6mm')}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    thicknessFilter === '6mm'
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg ring-2 ring-[#FF8407]'
                      : 'bg-[#F8FAFC] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-base font-black">6.0 mm</span>
                      {thicknessFilter === '6mm' && <Check className="w-4 h-4 text-[#FF8407]" />}
                    </div>
                    <span className="text-xs font-bold block opacity-90">Pulse Shield XL</span>
                    <span className="text-[11px] opacity-75 block mt-0.5">20 Mil • Formato Extra Largo</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FF8407]">$1.89 / SF</span>
                    <span className="text-[10px] opacity-70">9" x 60" XL</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setThicknessFilter('8mm')}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    thicknessFilter === '8mm'
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg ring-2 ring-[#FF8407]'
                      : 'bg-[#F8FAFC] text-[#1E293B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-base font-black">8.0 mm</span>
                      {thicknessFilter === '8mm' && <Check className="w-4 h-4 text-[#FF8407]" />}
                    </div>
                    <span className="text-xs font-bold block opacity-90">XL Pulse</span>
                    <span className="text-[11px] opacity-75 block mt-0.5">22 Mil Heavy Commercial • Pad IXPE</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FF8407]">$2.39 / SF</span>
                    <span className="text-[10px] opacity-70">9" x 60" XL</span>
                  </div>
                </button>
              </div>

              {thicknessFilter !== 'all' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setThicknessFilter('all')}
                    className="text-xs text-[#FF8407] hover:underline font-bold cursor-pointer"
                  >
                    {lang === 'es' ? 'Mostrar todos los espesores' : 'Show all thicknesses'}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Interactive Viewport Frame (Room View / Plank Closeup) */}
            <div ref={roomSceneRef} className="bg-[#FFFFFF] rounded-2xl p-3 sm:p-4 border border-[#E2E8F0] shadow-xs space-y-3 scroll-mt-20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
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
                </div>

                <div className="flex items-center gap-2">
                  {renderStockBadge(selectedProduct)}
                  <span className="text-xs font-black text-[#0F172A] px-2.5 py-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] truncate max-w-[200px]">
                    #{selectedProduct.code} {selectedProduct.name}
                  </span>
                </div>
              </div>

              {/* Main Image Viewer */}
              <div className="relative h-60 sm:h-80 w-full rounded-xl overflow-hidden bg-[#E2E8F0] border border-[#CBD5E1]">
                <img
                  src={
                    viewMode3D === 'room'
                      ? selectedProduct.roomPreviewUrl || selectedProduct.imageUrl
                      : selectedProduct.plankImageUrl || selectedProduct.imageUrl
                  }
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Action Bar Underneath Photo Card */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                <div className="text-xs text-[#64748B] flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-[#0F172A]">#{selectedProduct.code} {selectedProduct.name}</span>
                  <span>•</span>
                  <span className="font-bold text-[#FF8407]">
                    {selectedProduct.thickness} {lang === 'es' ? 'espesor total' : 'total thickness'}
                  </span>
                  <span>•</span>
                  <span>{selectedProduct.wearLayer}</span>
                  <span>•</span>
                  <span>
                    {selectedProduct.plankDimensions ||
                      selectedProduct.plankSize ||
                      (selectedProduct.category === '5.5mm' ? '7" x 48"' : '9" x 60"')}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Available Colors Horizontal Carousel / Slider (Swipe on mobile & click to preview) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0F172A]">
                    {lang === 'es'
                      ? `Colores Disponibles (${filteredProducts.length})`
                      : `Available Colors (${filteredProducts.length})`}
                  </span>
                  <span className="text-[11px] text-[#64748B] hidden sm:inline">
                    • {lang === 'es' ? 'Desliza para explorar en tiempo real' : 'Swipe to explore in real time'}
                  </span>
                </div>

                {/* Carousel Arrow Navigation */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollColorCarousel('left')}
                    className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#CBD5E1] flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer shadow-2xs"
                    aria-label={lang === 'es' ? 'Anterior color' : 'Previous color'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollColorCarousel('right')}
                    className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#CBD5E1] flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer shadow-2xs"
                    aria-label={lang === 'es' ? 'Siguiente color' : 'Next color'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Slider Container */}
              <div
                ref={colorCarouselRef}
                className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent -mx-1 px-1"
                style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
              >
                {filteredProducts.map((p, idx) => {
                  const isSelected = selectedProduct.id === p.id;
                  return (
                    <button
                      key={`${p.id}-${idx}`}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      className={`w-40 sm:w-48 shrink-0 snap-start p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? 'border-[#FF8407] bg-[#FFFBF7] shadow-lg ring-2 ring-[#FF8407]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] shadow-xs hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div>
                        <div className="relative h-24 sm:h-28 w-full rounded-xl overflow-hidden mb-2 bg-[#E2E8F0]">
                          <img
                            src={p.plankImageUrl || p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-[#FF8407] text-white p-1 rounded-full shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-xs text-[#0F172A] block truncate">{p.name}</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] block truncate mt-0.5">{p.collectionName}</span>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#FF8407]">{p.thickness}</span>
                        {isSelected ? (
                          <span className="font-black text-[#FF8407] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            {lang === 'es' ? 'Elegido' : 'Selected'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            {lang === 'es' ? 'Ver' : 'Preview'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Smart Box Calculator (Located Below Available Colors) */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FF8407] flex items-center justify-center shrink-0 border border-[#FF8407]/30">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                    {lang === 'es'
                      ? `Cálculo de Cajas: ${selectedModel.name}`
                      : `Box Calculation: ${selectedModel.name}`}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {selectedProduct.collectionName} • {selectedProduct.sqftPerBox} sq ft {lang === 'es' ? 'por caja' : 'per box'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] text-[#64748B] block font-bold uppercase">
                    {lang === 'es' ? 'Material (+7% desperdicio)' : 'Material (+7% waste)'}
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
                    {quoteCalc.boxesCount} {lang === 'es' ? 'Cajas' : 'Boxes'} ({quoteCalc.totalBoxesSqft} SF)
                  </span>
                </div>
              </div>
            </div>

            {/* 6. DEDICATED STAIR DETAIL SECTION (Appears when stairs are in scope) */}
            {(floorScope === 'floor1_stairs' || floorScope === 'floor2_stairs') && (
              <StaircaseStepSection
                selectedProduct={selectedProduct}
                stairTechnicalImages={stairTechnicalImages}
                stairVerticalCards={stairVerticalCards}
                stairCarouselItems={stairCarouselItems}
              />
            )}
          </div>
        )}

        {/* ========================================================
            SCREEN 3: PACKAGES & ESTIMATION (Price revealed here)
        ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                {lang === 'es' ? 'Selecciona tu Paquete' : 'Select Package'}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {lang === 'es'
                  ? `Calculado para ${selectedModel.name} en Siena Reserve (${quoteCalc.sqftMaterialRecommended} SF con +7% de desperdicio).`
                  : `Calculated for ${selectedModel.name} in Siena Reserve (${quoteCalc.sqftMaterialRecommended} SF with +7% waste factor).`}
              </p>
            </div>

            {/* Package Cards Grid - Direct side by side display without filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packagesList.map((pkg) => {
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
                          <h4 className="font-black text-base text-[#0F172A]">
                            {lang === 'es' ? pkg.title : (pkg.titleEn || pkg.title)}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {lang === 'es' ? pkg.tagline : (pkg.taglineEn || pkg.tagline)}
                          </p>
                        </div>
                      </div>

                      {/* Price Tag Highlight */}
                      <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            {lang === 'es' ? 'Total Estimado' : 'Estimated Total'}
                          </span>
                          <span className="text-2xl font-black text-[#FF8407]">{formatCurrency(calc.totalPrice)}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {pkg.isTurnkey
                            ? lang === 'es'
                              ? 'Material + Instalación'
                              : 'Material + Install'
                            : lang === 'es'
                            ? 'Solo Material'
                            : 'Material Only'}
                        </span>
                      </div>

                      {/* Cost Breakdown Pills inside card */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-slate-700 mb-3">
                        <div className="flex items-center justify-between">
                          <span>{lang === 'es' ? 'Material Piso:' : 'Floor Material:'}</span>
                          <strong className="text-slate-900">{formatCurrency(calc.materialFloorCost)}</strong>
                        </div>
                        {calc.hasStairs && (
                          <div className="flex items-center justify-between">
                            <span>{lang === 'es' ? 'Material 17 Escalones:' : '17 Stair Steps Material:'}</span>
                            <strong className="text-slate-900">{formatCurrency(calc.materialStairsCost)}</strong>
                          </div>
                        )}
                        {pkg.includesLabor && (
                          <>
                            <div className="flex items-center justify-between">
                              <span>{lang === 'es' ? 'Mano de Obra Piso ($2/SF):' : 'Floor Labor ($2/SF):'}</span>
                              <strong className="text-slate-900">{formatCurrency(calc.laborFloorCost)}</strong>
                            </div>
                            {calc.hasStairs && (
                              <div className="flex items-center justify-between">
                                <span>{lang === 'es' ? 'Mano de Obra Escaleras:' : 'Stairs Labor:'}</span>
                                <strong className="text-slate-900">{formatCurrency(calc.laborStairsCost)}</strong>
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                          <span>{lang === 'es' ? 'Flete y Entrega Local:' : 'Local Delivery:'}</span>
                          <strong className="text-slate-900">{formatCurrency(calc.deliveryFee)}</strong>
                        </div>
                      </div>

                      {/* Features Checklist */}
                      <ul className="space-y-1.5 my-3">
                        {getPackageDynamicFeatures(pkg).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#334155]">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {quoteCalc.sqftMaterialRecommended} SF ({calc.boxesCount} {lang === 'es' ? 'cajas' : 'boxes'})
                      </span>
                      {isSelected ? (
                        <span className="text-xs font-black text-[#FF8407] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {lang === 'es' ? 'Seleccionado' : 'Selected'}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {lang === 'es' ? 'Seleccionar Paquete' : 'Select Package'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer note */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <strong className="font-black block">
                  {lang === 'es' ? 'Información sobre Precios e Instalación por Terceros' : 'Pricing & Third-Party Installation Notes'}
                </strong>
                <p className="mt-0.5 leading-relaxed text-amber-800 text-[11px]">
                  {lang === 'es'
                    ? 'Los servicios de instalación, remodelación y remoción de alfombras y pisos viejos son ejecutados por contratistas terceros independientes. QuickSurfaces no se hace responsable por el servicio de instalación ni por el retiro de alfombras o pisos viejos, ya que dicho servicio es prestado y va por cuenta de terceros.'
                    : 'Installation, remodeling, and old carpet/floor removal services are executed by independent third-party contractors. QuickSurfaces is not responsible for installation or removal services, as these are provided directly by third parties.'}
                </p>
              </div>
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
                    {lang === 'es' ? 'Resumen de Cotización' : 'Quote Summary'}
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A] mt-1.5">
                    Siena Reserve — {selectedModel.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {lang === 'es' ? 'Alcance:' : 'Scope:'} {getScopeLabel()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {lang === 'es' ? 'Total Garantizado' : 'Guaranteed Total'}
                  </span>
                  <span className="text-3xl font-black text-[#FF8407]">{formatCurrency(quoteCalc.totalPrice)}</span>
                </div>
              </div>

              {/* Grid Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-5">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">
                    {lang === 'es' ? 'Piso Seleccionado' : 'Selected Flooring'}
                  </span>
                  <strong className="text-slate-900 block mt-0.5">{selectedProduct.name}</strong>
                  <span className="text-[11px] text-[#FF8407]">{selectedProduct.collectionName} ({selectedProduct.thickness})</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">
                    {lang === 'es' ? 'Metraje de Material (+7%)' : 'Material Coverage (+7%)'}
                  </span>
                  <strong className="text-slate-900 block mt-0.5">{quoteCalc.sqftMaterialRecommended} SF</strong>
                  <span className="text-[11px] text-slate-500">
                    {quoteCalc.boxesCount} {lang === 'es' ? 'Cajas' : 'Boxes'} ({quoteCalc.totalBoxesSqft} SF)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">
                    {lang === 'es' ? 'Escaleras' : 'Stairs'}
                  </span>
                  <strong className="text-slate-900 block mt-0.5">
                    {quoteCalc.hasStairs ? (lang === 'es' ? '17 Escalones' : '17 Steps') : (lang === 'es' ? 'No incluidas' : 'None')}
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    {quoteCalc.hasStairs ? (lang === 'es' ? 'Square Step Nose al ras' : 'Square Step Nose') : '-'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium block">
                    {lang === 'es' ? 'Paquete' : 'Package'}
                  </span>
                  <strong className="text-slate-900 block mt-0.5">
                    {lang === 'es' ? selectedPackage.title : (selectedPackage.titleEn || selectedPackage.title)}
                  </strong>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    {selectedPackage.isTurnkey
                      ? lang === 'es'
                        ? 'Material + Instalación'
                        : 'Material + Install'
                      : lang === 'es'
                      ? 'Solo Material'
                      : 'Material Only'}
                  </span>
                </div>
              </div>

              {/* Detailed Itemized Table */}
              <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <h4 className="font-black text-slate-900 mb-2">
                  {lang === 'es' ? 'Desglose Detallado de Costos' : 'Itemized Cost Breakdown'}
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>{lang === 'es' ? 'Material Piso SPC' : 'SPC Floor Material'} ({quoteCalc.sqftMaterialRecommended} SF @ ${quoteCalc.pricePerSqftMaterial.toFixed(2)}/SF):</span>
                    <strong className="text-slate-900">{formatCurrency(quoteCalc.materialFloorCost)}</strong>
                  </div>
                  {quoteCalc.hasStairs && (
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{lang === 'es' ? 'Material 17 Escalones Square Step Nose' : '17 Square Step Nose Pieces Material'}:</span>
                      <strong className="text-slate-900">{formatCurrency(quoteCalc.materialStairsCost)}</strong>
                    </div>
                  )}
                  {selectedPackage.includesLabor && (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span>{lang === 'es' ? 'Mano de Obra Instalación Piso' : 'Floor Installation Labor'} ({quoteCalc.sqftNet} SF @ $2.00/SF):</span>
                        <strong className="text-slate-900">{formatCurrency(quoteCalc.laborFloorCost)}</strong>
                      </div>
                      {quoteCalc.hasStairs && (
                        <div className="flex justify-between py-1 border-b border-slate-200">
                          <span>{lang === 'es' ? 'Mano de Obra 17 Escalones' : '17 Stairs Installation Labor'}:</span>
                          <strong className="text-slate-900">{formatCurrency(quoteCalc.laborStairsCost)}</strong>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>{lang === 'es' ? 'Flete y Entrega a Obra' : 'Local Jobsite Delivery'}:</span>
                    <strong className="text-slate-900">{formatCurrency(quoteCalc.deliveryFee)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-black text-slate-900">
                    <span className="text-[#FF8407]">{lang === 'es' ? 'TOTAL FINAL ESTIMADO' : 'ESTIMATED FINAL TOTAL'}:</span>
                    <span className="text-[#FF8407] text-base">{formatCurrency(quoteCalc.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Lead Form with Validation */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-black text-slate-900">
                    {lang === 'es' ? 'Datos para Confirmación de Medidas' : 'Information for Measurement Verification'}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {lang === 'es' ? '* Campos Requeridos' : '* Required Fields'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {lang === 'es'
                    ? 'Llevamos las muestras físicas a tu hogar en Siena Reserve sin compromiso.'
                    : 'We bring physical samples right to your home in Siena Reserve with no obligation.'}
                </p>

                {/* Validation Error Banner */}
                {formTouched && Object.keys(formErrors).length > 0 && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      {lang === 'es'
                        ? 'Por favor completa los campos requeridos marcados en rojo antes de enviar.'
                        : 'Please fill in the required fields marked in red before sending.'}
                    </span>
                  </div>
                )}

                {/* Success Banner */}
                {isSubmitSuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'es'
                        ? '¡Datos validados correctamente! Tu cotización se está enviando a QuickSurfaces.'
                        : 'Information validated successfully! Your estimate is being dispatched to QuickSurfaces.'}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {lang === 'es' ? 'Nombre Completo *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'es' ? 'Ej. Carlos Mendoza' : 'e.g. John Smith'}
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (formErrors.fullName) {
                          setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                        }
                      }}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all ${
                        formErrors.fullName
                          ? 'border-red-500 bg-red-50/40 focus:ring-2 focus:ring-red-400'
                          : 'border-slate-300 focus:border-[#FF8407] focus:ring-2 focus:ring-[#FF8407]/20'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {lang === 'es' ? 'Teléfono (EE.UU.) *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      placeholder="(786) 000-0000"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) {
                          setFormErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all ${
                        formErrors.phone
                          ? 'border-red-500 bg-red-50/40 focus:ring-2 focus:ring-red-400'
                          : 'border-slate-300 focus:border-[#FF8407] focus:ring-2 focus:ring-[#FF8407]/20'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Unit / Lot */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {lang === 'es' ? 'Unidad / Lote en Siena Reserve *' : 'Unit / Lot in Siena Reserve *'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'es' ? 'Ej. Unidad 104' : 'e.g. Unit 104'}
                      value={formData.unitNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, unitNumber: e.target.value });
                        if (formErrors.unitNumber) {
                          setFormErrors((prev) => ({ ...prev, unitNumber: undefined }));
                        }
                      }}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all ${
                        formErrors.unitNumber
                          ? 'border-red-500 bg-red-50/40 focus:ring-2 focus:ring-red-400'
                          : 'border-slate-300 focus:border-[#FF8407] focus:ring-2 focus:ring-[#FF8407]/20'
                      }`}
                    />
                    {formErrors.unitNumber && (
                      <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {formErrors.unitNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons with Validation Trigger */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Enviar Cotización por WhatsApp' : 'Send Quote via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="py-3.5 px-5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Mail className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Enviar por Email' : 'Send via Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-sm flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#FF8407]" />
                  <span>{lang === 'es' ? 'Imprimir / PDF' : 'Print / PDF'}</span>
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

import React, { useState, useEffect } from 'react';
import {
  FloorPlanModel,
  FlooringProduct,
  PricingPackage,
  ResidentialCommunity,
  BookingSubmission,
} from '../types';
import { COMMUNITIES, FLOOR_PLAN_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from '../data/products';
import { calculateQuotePrice, formatCurrency } from '../utils/pricingCalculator';
import { FloorPlanSVG } from './FloorPlanSVG';
import { HorizontalRender3D } from './HorizontalRender3D';
import {
  Check,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Eye,
  ShieldCheck,
  Layers,
  Sparkles,
  CheckCircle,
  CheckCircle2,
  Phone,
  ZoomIn,
  Search,
  Printer,
  Mail,
  Box,
  AlertCircle,
  Info,
  Clock,
  Flame,
} from 'lucide-react';

interface StepWizardProps {
  initialCommunity?: ResidentialCommunity;
  initialModel?: FloorPlanModel;
  initialProduct?: FlooringProduct;
  initialPackage?: PricingPackage;
  modelsList?: FloorPlanModel[];
  productsList?: FlooringProduct[];
  packagesList?: PricingPackage[];
  isLiveSynced?: boolean;
  onClose?: () => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  initialCommunity = COMMUNITIES[0],
  initialModel,
  initialProduct,
  initialPackage,
  modelsList = FLOOR_PLAN_MODELS,
  productsList = FLOORING_PRODUCTS,
  packagesList = PRICING_PACKAGES,
  isLiveSynced = false,
  onClose,
}) => {
  // Wizard active step state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(initialCommunity);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(
    initialModel || modelsList.find((m) => m.communityId === initialCommunity.id) || modelsList[0]
  );
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(
    initialProduct || productsList[2] || productsList[0]
  );
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(
    initialPackage || packagesList[2] || packagesList[0]
  );

  // Search & Filter state for Step 1
  const [communitySearch, setCommunitySearch] = useState<string>('');

  // Filter state for Step 2
  const [thicknessFilter, setThicknessFilter] = useState<'all' | '5.5mm' | '6mm' | '8mm'>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');
  const [viewMode3D, setViewMode3D] = useState<'room' | 'plank' | 'stairs'>('room');

  // Filter state for Step 3
  const [packageType, setPackageType] = useState<'all' | 'turnkey' | 'material'>('all');

  // Interactive View Toggles
  const [showFloorPlanDetail, setShowFloorPlanDetail] = useState<boolean>(false);

  // Step 4 lead form data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    unitNumber: '',
    preferredDate: '',
    notes: '',
  });
  const [quoteSavedNotice, setQuoteSavedNotice] = useState<boolean>(false);

  // Dynamic Quote Calculation
  const quoteCalc = calculateQuotePrice(selectedModel, selectedProduct, selectedPackage);

  // Sync selected model if community changes and current model doesn't belong to it
  useEffect(() => {
    const matchingModel = modelsList.find((m) => m.communityId === selectedCommunity.id);
    if (matchingModel && selectedModel.communityId !== selectedCommunity.id) {
      setSelectedModel(matchingModel);
    }
  }, [selectedCommunity, modelsList]);

  // Auto-save in-progress quote to localStorage for abandoned quote recovery
  useEffect(() => {
    const draft: BookingSubmission = {
      communityId: selectedCommunity.id,
      collectionSlug: selectedModel.collectionSlug,
      modelId: selectedModel.id,
      packageId: selectedPackage.id,
      selectedColorId: selectedProduct.id,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: `${selectedCommunity.name} - ${selectedModel.name}, ${formData.unitNumber}`,
      unitNumber: formData.unitNumber,
      calculatedPrice: quoteCalc.totalPrice,
      sqftMaterial: quoteCalc.sqftMaterialRecommended,
      createdAt: new Date().toISOString(),
      status: currentStep === 4 && formData.fullName ? 'pending' : 'abandoned',
    };
    try {
      localStorage.setItem('qs_active_quote_draft', JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [currentStep, selectedCommunity, selectedModel, selectedProduct, selectedPackage, formData, quoteCalc]);

  // Filtered lists
  const filteredCommunities = COMMUNITIES.filter((c) => {
    const q = communitySearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.zip.includes(q) ||
      c.collections.some((col) => col.toLowerCase().includes(q))
    );
  });

  const availableModels = modelsList.filter((m) => m.communityId === selectedCommunity.id);

  const filteredProducts = productsList.filter((p) => {
    if (thicknessFilter !== 'all' && p.category !== thicknessFilter) return false;
    if (toneFilter !== 'all' && p.tone !== toneFilter) return false;
    return true;
  });

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
    { title: 'Comunidad y Modelo', subtitle: 'Selecciona tu plano y metraje' },
    { title: 'Color SPC y Acabado', subtitle: 'Elige tu tono de piso vinílico' },
    { title: 'Paquete e Instalación', subtitle: 'Calcula tu presupuesto dinámico' },
    { title: 'Resumen y Cotización', subtitle: 'Orden de trabajo lista para WhatsApp' },
  ];

  // Stock status pill component
  const renderStockBadge = (product: FlooringProduct) => {
    if (product.stockStatus === 'low_stock' || product.isLowStock) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
          <Flame className="w-2.5 h-2.5 text-amber-600" />
          <span>Stock Bajo</span>
        </span>
      );
    }
    if (product.stockStatus === 'coming_soon' || product.isComingSoon) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Clock className="w-2.5 h-2.5 text-indigo-600" />
          <span>Próximamente</span>
        </span>
      );
    }
    if (product.stockStatus === 'out_of_stock' || !product.inStock) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <span>Agotado</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>En Stock</span>
      </span>
    );
  };

  // WhatsApp formatted lead message
  const generateWhatsAppUrl = () => {
    const phone = '17866583677';
    const text = `*COTIZACIÓN QUICKSURFACES - HOMESTEAD*
----------------------------------------
📍 *Comunidad:* ${selectedCommunity.name} (${selectedCommunity.city}, FL ${selectedCommunity.zip})
🏢 *Colección:* ${selectedModel.collection}
🏡 *Modelo:* ${selectedModel.name} (2do Piso)
📐 *Área Neta:* ~${selectedModel.sqftNet} SF
📦 *Material Recomendado (+10%):* ${quoteCalc.sqftMaterialRecommended} SF (${quoteCalc.boxesCount} cajas)
🪜 *Escaleras:* ${selectedModel.stepsCount} Pasos (Flush Stair Nose)

🎨 *Piso SPC Elegido:*
• Modelo: #${selectedProduct.code} ${selectedProduct.name}
• Colección: ${selectedProduct.collectionName}
• Especificación: ${selectedProduct.thickness} · Wear Layer ${selectedProduct.wearLayer}
• Estado: ${selectedProduct.stockStatus === 'low_stock' ? 'Stock Bajo' : 'En Stock'}

💼 *Paquete:* ${selectedPackage.title}
💰 *TOTAL ESTIMADO:* ${formatCurrency(quoteCalc.totalPrice)} ${selectedPackage.isTurnkey ? '(Llave en mano con instalación y escaleras)' : '(Solo Material)'}

👤 *Cliente:* ${formData.fullName || 'No especificado'}
📱 *Teléfono:* ${formData.phone || 'No especificado'}
🏠 *Unidad/Dirección:* ${formData.unitNumber || 'No especificado'}

_Hola QuickSurfaces! Me gustaría agendar la visita para llevar las muestras físicas a mi casa y confirmar medidas._`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Email format
  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`Cotización QuickSurfaces: Modelo ${selectedModel.name} en ${selectedCommunity.name}`);
    const body = encodeURIComponent(`Hola equipo QuickSurfaces,

Adjunto los detalles de mi cotización:
- Comunidad: ${selectedCommunity.name} (${selectedModel.collection})
- Modelo: ${selectedModel.name}
- Material Recomendado: ${quoteCalc.sqftMaterialRecommended} SF (${quoteCalc.boxesCount} cajas)
- Piso: #${selectedProduct.code} ${selectedProduct.name} (${selectedProduct.thickness}, ${selectedProduct.wearLayer})
- Paquete: ${selectedPackage.title}
- Total Estimado: ${formatCurrency(quoteCalc.totalPrice)}

Mis datos de contacto:
- Nombre: ${formData.fullName}
- Teléfono: ${formData.phone}
- Dirección / Unidad: ${formData.unitNumber}

Por favor contáctenme para coordinar la inspección gratuita en casa.`);

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
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer shrink-0"
                aria-label="Volver al paso anterior"
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
                Paso {currentStep} de 4
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#0F172A] truncate leading-tight">
                {stepMeta[currentStep - 1].title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isLiveSynced && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Google Sheets Live
              </span>
            )}
            <div className="text-right bg-[#FFF7ED] px-3 py-1 rounded-xl border border-[#FF8407]/30">
              <span className="text-[9px] text-[#64748B] block font-bold uppercase">Total Estimado</span>
              <span className="text-xs sm:text-sm font-black text-[#FF8407]">
                {formatCurrency(quoteCalc.totalPrice)}
              </span>
            </div>
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
            SCREEN 1: COMMUNITY & MODEL (APP VIEW)
        ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Location Bar */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0F172A]">
                  Selecciona tu Comunidad y Modelo
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Precios exactos y desgloses arquitectónicos calibrados para cada piso.
                </p>
              </div>

              {/* City / Zip Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ciudad o zip (ej. 33032)..."
                  value={communitySearch}
                  onChange={(e) => setCommunitySearch(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#FF8407] focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* 1. Community Horizontal Selector Chips */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                1. Condominios en Homestead & Miami ({filteredCommunities.length})
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {filteredCommunities.map((c) => {
                  const isSelected = selectedCommunity.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCommunity(c);
                        const first = modelsList.find((m) => m.communityId === c.id);
                        if (first) setSelectedModel(first);
                      }}
                      className={`px-4 py-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[170px] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                          : 'bg-[#FFFFFF] text-[#475569] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black leading-tight">{c.name}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#FF8407]' : 'text-[#64748B]'}`}>
                          {c.collections[0] || 'Colección'}
                        </div>
                      </div>
                      <div className={`text-[10px] mt-2 pt-2 border-t ${isSelected ? 'border-white/10 text-[#CBD5E1]' : 'border-[#F1F5F9] text-[#64748B]'}`}>
                        {c.city}, FL {c.zip}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Model Cards Screen Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                    Modelos de 2do Piso en {selectedCommunity.name} ({availableModels.length})
                  </span>
                  <span className="text-[11px] text-[#64748B] block font-medium">
                    Sub-fase: <strong className="text-[#0F172A]">{selectedModel.collection}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setShowFloorPlanDetail(!showFloorPlanDetail)}
                  className="text-xs font-bold text-[#FF8407] hover:underline flex items-center gap-1 cursor-pointer bg-[#FFF7ED] px-3 py-1.5 rounded-xl border border-[#FF8407]/30"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showFloorPlanDetail ? 'Ocultar Plano 2D' : 'Ver Plano 2D CAD'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.map((m) => {
                  const isSelected = selectedModel.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all bg-[#FFFFFF] flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-[#FF8407] shadow-lg ring-2 ring-[#FF8407] bg-[#FFFBF7]'
                          : 'border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="font-black text-sm text-[#0F172A] block">{m.name}</span>
                            <span className="text-[10px] text-[#64748B] font-semibold">
                              {m.communityName} · {m.collection}
                            </span>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/30 shrink-0">
                            {m.sqftMaterialRecommended} SF
                          </span>
                        </div>

                        {/* Sqft & Specs Grid */}
                        <div className="grid grid-cols-3 gap-1 text-center my-2.5 py-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <div>
                            <span className="text-[9px] text-[#64748B] block font-semibold">Material (+10%)</span>
                            <span className="text-xs font-black text-[#FF8407]">{m.sqftMaterialRecommended} SF</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#64748B] block font-semibold">Área Neta</span>
                            <span className="text-xs font-black text-[#0F172A]">{m.sqftNet} SF</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#64748B] block font-semibold">Escaleras</span>
                            <span className="text-xs font-black text-[#0F172A]">{m.stepsCount} Pasos</span>
                          </div>
                        </div>

                        {/* Room Dimensions Preview */}
                        {m.ownerSuiteDims && (
                          <div className="text-[10px] text-[#64748B] mb-2 bg-[#FFFFFF] p-2 rounded-lg border border-[#F1F5F9] space-y-0.5">
                            <div className="flex justify-between">
                              <span className="font-bold text-[#0F172A]">Owner's Suite:</span>
                              <span className="font-mono">{m.ownerSuiteDims}</span>
                            </div>
                            {m.bedroom2Dims && (
                              <div className="flex justify-between">
                                <span>Bedroom 2:</span>
                                <span className="font-mono">{m.bedroom2Dims}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                          <span className="truncate">{m.bedrooms} Hab · {m.baths} Baños</span>
                          {isSelected ? (
                            <span className="text-[10px] font-black text-[#FF8407] flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
                              <span>Elegido</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#94A3B8] font-bold">Seleccionar</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MINI LANDING / HORIZONTAL 3D PLAN */}
            <div className="mt-6 animate-fadeIn">
              <HorizontalRender3D 
                model={selectedModel} 
                selectedProduct={selectedProduct} 
              />
            </div>

            {/* 3. Expandable / Collapsible 2D Floorplan CAD Viewer */}
            {showFloorPlanDetail && (
              <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-md animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-white text-[10px] font-black">
                      PLANO ARQUITECTÓNICO 2D
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                      Modelo {selectedModel.name} · {selectedModel.collection}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-[#FF8407]">
                    {selectedModel.sqftMaterialRecommended} SF Recomendado • {selectedModel.stepsCount} Escalones
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-[#CBD5E1]">
                  <FloorPlanSVG model={selectedModel} selectedProduct={selectedProduct} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            SCREEN 2: SPC COLOR & 3D VISUALIZER (APP VIEW)
        ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Top Interactive App Viewport */}
            <div className="bg-[#FFFFFF] rounded-2xl p-3 sm:p-4 border border-[#E2E8F0] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                {/* View switcher tabs */}
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
                  <button
                    onClick={() => setViewMode3D('room')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode3D === 'room'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Render 3D Habitación</span>
                  </button>
                  <button
                    onClick={() => setViewMode3D('plank')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode3D === 'plank'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#FF8407]" />
                    <span>Foto Tablón</span>
                  </button>
                  <button
                    onClick={() => setViewMode3D('stairs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode3D === 'stairs'
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Escaleras</span>
                  </button>
                </div>

                {/* Stock Status for Active Color */}
                <div className="flex items-center gap-2">
                  {renderStockBadge(selectedProduct)}
                  <span className="text-xs font-black text-[#0F172A] px-2.5 py-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    #{selectedProduct.code} {selectedProduct.name}
                  </span>
                </div>
              </div>

              {/* Viewport Frame */}
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

                {/* Spec Tag Overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between p-2.5 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white shrink-0 shadow-sm"
                      style={{ backgroundColor: selectedProduct.colorHex }}
                    ></span>
                    <span className="font-black truncate">{selectedProduct.name}</span>
                    <span className="text-white/70 text-[11px] hidden sm:inline">({selectedProduct.collectionName})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-bold text-[#FF8407]">{selectedProduct.thickness}</span>
                    <span>•</span>
                    <span>{selectedProduct.wearLayer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Box Calculator Widget for Selected Color */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FF8407] flex items-center justify-center shrink-0 border border-[#FF8407]/30">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                    Cálculo Automático de Cajas ({selectedModel.name})
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {selectedProduct.collectionName} • {selectedProduct.sqftPerBox} sq ft por caja
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] text-[#64748B] block font-bold uppercase">Material Requerido</span>
                  <span className="text-xs font-black text-[#0F172A]">{quoteCalc.sqftMaterialRecommended} SF</span>
                </div>
                <div className="h-6 w-px bg-[#CBD5E1]"></div>
                <div className="text-right">
                  <span className="text-[9px] text-[#FF8407] block font-bold uppercase">Cajas a Entregar</span>
                  <span className="text-sm font-black text-[#FF8407]">{quoteCalc.boxesCount} Cajas ({quoteCalc.totalBoxesSqft} SF)</span>
                </div>
              </div>
            </div>

            {/* Thickness & Tone Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                {[
                  { id: 'all', label: 'Todos (26)' },
                  { id: '5.5mm', label: '5.5mm Select (9)' },
                  { id: '6mm', label: '6.0mm XL (5)' },
                  { id: '8mm', label: '8.0mm Flagship (12)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setThicknessFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      thicknessFilter === tab.id
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'natural', label: 'Natural' },
                  { id: 'warm', label: 'Cálido' },
                  { id: 'cool', label: 'Gris' },
                  { id: 'dark', label: 'Oscuro' },
                  { id: 'light', label: 'Claro' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setToneFilter(t.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      toneFilter === t.id
                        ? 'bg-[#FF8407] text-black font-bold'
                        : 'bg-[#FFFFFF] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all bg-[#FFFFFF] flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF8407] shadow-lg ring-2 ring-[#FF8407] bg-[#FFF7ED]'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2 bg-[#E2E8F0] border border-[#CBD5E1]">
                      <img
                        src={p.plankImageUrl || p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1.5"
                        style={{ backgroundColor: p.colorHex }}
                      ></div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FF8407] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black text-[#0F172A] truncate">{p.name}</span>
                        <span className="text-[10px] text-[#64748B] font-bold shrink-0">#{p.code}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1.5">
                        <span>{p.thickness}</span>
                        <span>{p.wearLayer}</span>
                      </div>
                      <div className="pt-1.5 border-t border-[#F1F5F9] flex items-center justify-between">
                        {renderStockBadge(p)}
                        <span className="text-[9px] text-[#64748B] font-medium">{p.sqftPerBox} SF/bx</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: STAIRCASE & DYNAMIC PACKAGES (APP VIEW)
        ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Staircase Banner */}
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#FF8407] text-white text-[10px] font-black uppercase">
                    15 ESCALONES INCLUIDOS
                  </span>
                  <span className="text-xs font-bold text-[#0F172A]">Acabado Flush Stair Nose</span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Nariz de escalón al ras sin bordes sobrepuestos, con corte a inglete en taller y amortiguación acústica.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0] shrink-0 text-xs font-bold text-[#0F172A]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantía 25 Años</span>
              </div>
            </div>

            {/* Segmented Filter (Turnkey vs Material) */}
            <div className="flex bg-[#FFFFFF] p-1 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <button
                onClick={() => setPackageType('all')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  packageType === 'all'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Todos los Paquetes ({packagesList.length})
              </button>
              <button
                onClick={() => setPackageType('turnkey')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  packageType === 'turnkey'
                    ? 'bg-[#FF8407] text-black shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                ✨ Llave en Mano (Instalado)
              </button>
              <button
                onClick={() => setPackageType('material')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  packageType === 'material'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                📦 Solo Material
              </button>
            </div>

            {/* Package Cards with Dynamic Pricing Calculation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                const dynamicQuote = calculateQuotePrice(selectedModel, selectedProduct, pkg);

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all bg-[#FFFFFF] flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#FF8407] shadow-xl ring-2 ring-[#FF8407] bg-[#FFF7ED]'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#0F172A] text-[#FF8407] shadow-xs">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block mb-1">
                        {pkg.isTurnkey ? 'Llave en Mano (Instalado)' : 'Solo Material (Entrega en Homestead)'}
                      </span>
                      <h4 className="text-base font-black text-[#0F172A]">{pkg.title}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5 mb-3">{pkg.tagline}</p>

                      {/* Dynamic Price Display */}
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] mb-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl sm:text-3xl font-black text-[#FF8407]">
                            {formatCurrency(dynamicQuote.totalPrice)}
                          </span>
                          <span className="text-[11px] font-bold text-[#64748B]">
                            Calculado para {dynamicQuote.sqftMaterialRecommended} SF
                          </span>
                        </div>
                        <div className="text-[10px] text-[#64748B] mt-1 pt-1 border-t border-[#E2E8F0] flex justify-between">
                          <span>Material: {formatCurrency(dynamicQuote.materialCost)}</span>
                          {pkg.isTurnkey && (
                            <span>15 Pasos & M.O.: {formatCurrency(dynamicQuote.stairCost)}</span>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-1.5 text-xs text-[#475569] mb-4">
                        {pkg.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF8407] text-black shadow-md'
                          : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : null}
                      <span>{isSelected ? 'Paquete Seleccionado' : 'Seleccionar Este Paquete'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: SUMMARY & EXPORT / WHATSAPP / EMAIL
        ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Digital Order Slip / Invoice Ticket */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-5 sm:p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#FF8407] font-black uppercase tracking-wider block">
                      {selectedCommunity.name} · {selectedModel.collection}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-[#0F172A]">
                    Modelo {selectedModel.name} (2do Piso)
                  </h4>
                  <span className="text-xs text-[#64748B]">
                    {selectedCommunity.city}, FL {selectedCommunity.zip} • ~{selectedModel.sqftNet} SF Neta • {selectedModel.stepsCount} Pasos de Escalera
                  </span>
                </div>
                <div className="text-left sm:text-right bg-[#FFF7ED] p-3 rounded-xl border border-[#FF8407]/30">
                  <span className="text-[10px] text-[#64748B] block font-bold uppercase">Precio Total Cerrado</span>
                  <span className="text-2xl font-black text-[#FF8407]">
                    {formatCurrency(quoteCalc.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Specs Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-4">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Piso Elegido</span>
                  <span className="font-black text-[#0F172A]">#{selectedProduct.code} {selectedProduct.name}</span>
                  <div className="mt-1">{renderStockBadge(selectedProduct)}</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Cajas Calculadas</span>
                  <span className="font-bold text-[#0F172A]">{quoteCalc.boxesCount} Cajas</span>
                  <span className="text-[10px] text-[#64748B] block">{quoteCalc.totalBoxesSqft} SF Totales</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Escaleras</span>
                  <span className="font-bold text-[#0F172A]">15 Pasos Completos</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">Flush Stair Nose</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Paquete</span>
                  <span className="font-black text-[#0F172A] truncate block">{selectedPackage.title}</span>
                  <span className="text-[10px] text-[#64748B] block">{selectedPackage.isTurnkey ? 'Llave en Mano' : 'Material'}</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#0F172A] block mb-2">Servicios y Garantías Incluidas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#475569]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Desmonte y retiro de alfombra vieja existente ($0 fee)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Nivelación y preparación de subsuelo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instalación de molduras de cuarto de bocel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Garantía de 25 años en piso SPC de fábrica</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
              <h4 className="text-sm font-black text-[#0F172A] mb-3">
                Datos de Contacto para Inspección y Muestra Gratuita en Casa
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Martínez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#FF8407] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="(786) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#FF8407] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Unidad / Dirección en Homestead</label>
                  <input
                    type="text"
                    placeholder="Ej. Apt 204 / Calle..."
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#FF8407] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CTAs & Export Actions */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Cotización por WhatsApp</span>
                </a>
                <a
                  href={generateMailtoUrl()}
                  className="py-3.5 px-5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar por Email</span>
                </a>
                <button
                  onClick={handlePrint}
                  className="py-3.5 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] font-black text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#CBD5E1] transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#FF8407]" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                <span>Atención inmediata en Homestead: <strong>(786) 658-3677</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cotización guardada automáticamente
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= STICKY BOTTOM APP NAVIGATION ================= */}
      <div className="bg-[#FFFFFF] border-t border-[#E2E8F0] p-3 sm:p-4 px-4 sm:px-6 flex items-center justify-between gap-3 sticky bottom-0 z-30 shadow-xs">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            currentStep === 1
              ? 'opacity-20 cursor-not-allowed text-[#94A3B8]'
              : 'text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Center Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] truncate max-w-[280px]">
          <span className="truncate">{selectedModel.name}</span>
          <span>•</span>
          <span className="truncate">{selectedProduct.name}</span>
        </div>

        {/* Next / WhatsApp CTA */}
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-black shadow-md shadow-[#FF8407]/20 transition-all cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md cursor-pointer"
          >
            <span>Confirmar</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

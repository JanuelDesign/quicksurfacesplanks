import React, { useState } from 'react';
import { HorizontalRender3D } from './HorizontalRender3D';
import {
  FloorPlanModel,
  FlooringProduct,
  PricingPackage,
  ResidentialCommunity,
} from '../types';
import { COMMUNITIES, FLOOR_PLAN_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { FloorPlanSVG } from './FloorPlanSVG';
import {
  Building2,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
  Phone,
  MessageCircle,
  Check,
  ChevronRight,
  ShieldCheck,
  Eye,
  ZoomIn,
  Ruler,
  Clock,
  Home,
  CheckCircle,
  HelpCircle,
  FileText,
  BadgePercent,
  SlidersHorizontal,
  ChevronDown,
  Info,
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
  initialModel = FLOOR_PLAN_MODELS[0],
  initialProduct = FLOORING_PRODUCTS[2],
  initialPackage = PRICING_PACKAGES[2],
  modelsList = FLOOR_PLAN_MODELS,
  productsList = FLOORING_PRODUCTS,
  packagesList = PRICING_PACKAGES,
  isLiveSynced = false,
  onClose,
}) => {
  const { lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(initialCommunity);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(initialModel);
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(initialProduct);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(initialPackage);

  // Step 1: 2D Modal / Drawer
  const [showFloorPlanDetail, setShowFloorPlanDetail] = useState<boolean>(false);

  // Step 2: View mode & Filters
  const [viewMode3D, setViewMode3D] = useState<'room' | 'plank' | 'stairs'>('room');
  const [thicknessFilter, setThicknessFilter] = useState<'all' | '5.5mm' | '6mm' | '8mm'>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');

  // Step 3: Package type filter
  const [packageType, setPackageType] = useState<'all' | 'turnkey' | 'material'>('all');

  // Step 4: Booking Form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    unitNumber: '',
    notes: '',
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

  const stepMeta = [
    { num: 1, title: 'Comunidad & Modelo', subtitle: 'Selecciona tu casa', icon: Home },
    { num: 2, title: 'Color & Textura SPC', subtitle: 'Prueba en render 3D', icon: Layers },
    { num: 3, title: 'Paquete de Instalación', subtitle: 'Llave en mano o material', icon: DollarSign },
    { num: 4, title: 'Resumen & WhatsApp', subtitle: 'Agenda muestra gratis', icon: Sparkles },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      const appEl = document.getElementById('step-wizard-container');
      if (appEl) appEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      const appEl = document.getElementById('step-wizard-container');
      if (appEl) appEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderStockBadge = (prod: FlooringProduct) => {
    const status = prod.stockStatus || (prod.inStock ? 'in_stock' : 'out_of_stock');
    switch (status) {
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{lang === 'es' ? 'Poco Stock' : 'Low Stock'}</span>
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>{lang === 'es' ? 'Agotado' : 'Out of Stock'}</span>
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            <Clock className="w-2.5 h-2.5" />
            <span>{lang === 'es' ? 'Pronto' : 'Coming Soon'}</span>
          </span>
        );
      case 'in_stock':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{lang === 'es' ? 'En Stock' : 'In Stock'}</span>
          </span>
        );
    }
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola Quick Surfaces! 👋 Quiero agendar la inspección gratuita de mi piso:\n\n` +
      `🏢 *Conjunto:* ${selectedCommunity.name}\n` +
      `🏠 *Modelo:* ${selectedModel.name} (${selectedModel.sqft} sq ft, ${selectedModel.stepsCount} escalones)\n` +
      `🎨 *Piso SPC:* ${selectedProduct.name} (#${selectedProduct.code}) - ${selectedProduct.thickness} (${selectedProduct.wearLayer})\n` +
      `📦 *Paquete:* ${selectedPackage.title} - $${(selectedPackage.pricePerSqft ? Math.round(selectedModel.sqft * selectedPackage.pricePerSqft) : selectedPackage.price).toLocaleString()}\n` +
      `👤 *Cliente:* ${formData.fullName || 'Por definir'}\n` +
      `📍 *Unidad:* ${formData.unitNumber || 'Homestead, FL'}\n` +
      `📞 *Teléfono:* ${formData.phone || 'N/A'}\n` +
      `📝 *Notas:* ${formData.notes || 'Ninguna'}`
    );
    return `https://wa.me/17866583677?text=${text}`;
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div
      id="step-wizard-container"
      className="w-full max-w-4xl mx-auto bg-[#FFFFFF] text-[#0F172A] rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden font-sans flex flex-col min-h-[640px]"
    >
      {/* ================= NATIVE APP TOP BAR ================= */}
      <div className="bg-[#FFFFFF] border-b border-[#F1F5F9] px-4 py-3 sm:px-6 sticky top-0 z-30">
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

          <div className="flex items-center gap-2 shrink-0">
            {isLiveSynced && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Google Sheets
              </span>
            )}
            <div className="text-right">
              <span className="text-[10px] text-[#64748B] block font-bold">Total Estimado</span>
              <span className="text-xs sm:text-sm font-black text-[#FF8407]">
                ${(selectedPackage.pricePerSqft ? Math.round(selectedModel.sqft * selectedPackage.pricePerSqft) : selectedPackage.price).toLocaleString()}
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
            {/* Screen Banner */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">
                  Elige tu Conjunto Residencial en Homestead
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Precios y cortes arquitectónicos calibrados para cada modelo.
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-[#FFF7ED] text-[#FF8407] rounded-xl border border-[#FF8407]/30 shrink-0">
                5 Condominios
              </span>
            </div>

            {/* 1. Community Horizontal Selector Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {COMMUNITIES.map((c) => {
                const isSelected = selectedCommunity.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCommunity(c);
                      const first = modelsList.find((m) => m.communityId === c.id);
                      if (first) setSelectedModel(first);
                    }}
                    className={`px-4 py-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[140px] flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#FF8407]'
                        : 'bg-[#FFFFFF] text-[#475569] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="text-xs font-black leading-tight">{c.name}</div>
                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                      {c.city}, {c.state}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. Model Cards Screen Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Modelos de 2do Piso en {selectedCommunity.name} ({availableModels.length})
                </span>
                <button
                  onClick={() => setShowFloorPlanDetail(!showFloorPlanDetail)}
                  className="text-xs font-bold text-[#FF8407] hover:underline flex items-center gap-1 cursor-pointer"
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
                      className={`p-4 rounded-2xl border cursor-pointer transition-all bg-[#FFFFFF] flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF8407] shadow-lg ring-2 ring-[#FF8407]'
                          : 'border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-sm text-[#0F172A]">{m.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/30">
                            {m.collection}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-center my-2.5 py-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <div>
                            <span className="text-[9px] text-[#64748B] block font-semibold">Superficie</span>
                            <span className="text-xs font-black text-[#0F172A]">{m.sqft} sq ft</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#64748B] block font-semibold">Escaleras</span>
                            <span className="text-xs font-black text-[#0F172A]">{m.stepsCount} Pasos</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#64748B] block font-semibold">Dormitorios</span>
                            <span className="text-xs font-black text-[#0F172A]">{m.bedrooms} Hab</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#64748B] flex items-center justify-between">
                          <span className="truncate">{m.address}</span>
                          {isSelected && (
                            <span className="text-[10px] font-black text-[#FF8407] flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
                              <span>Elegido</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            
            {/* MINI LANDING / HORIZONTAL 3D PLAN */}
            <div className="mt-8 animate-fadeIn">
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
                      Modelo {selectedModel.name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-[#FF8407]">
                    {selectedModel.sqft} sq ft • {selectedModel.stepsCount} Escalones
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

            {/* Thickness & Tone Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                {[
                  { id: 'all', label: 'Todos (13)' },
                  { id: '5.5mm', label: '5.5mm Select (8)' },
                  { id: '6mm', label: '6.0mm XL (1)' },
                  { id: '8mm', label: '8.0mm Flagship (4)' },
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
                    <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 bg-[#E2E8F0] border border-[#CBD5E1]">
                      <img
                        src={p.plankImageUrl || p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: STAIRCASE & PACKAGES (APP VIEW)
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
                  Nariz de escalón al ras sin bordes sobrepuestos, con corte a inglete en taller y amortiguación EVA.
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
                Todos los Paquetes (4)
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

            {/* Package Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
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
                        {pkg.isTurnkey ? 'Llave en Mano (Instalado)' : 'Solo Material (Entrega a Puerta)'}
                      </span>
                      <h4 className="text-base font-black text-[#0F172A]">{pkg.title}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5 mb-3">{pkg.tagline}</p>

                      <div className="text-2xl sm:text-3xl font-black text-[#FF8407] mb-3">
                        ${(pkg.pricePerSqft ? Math.round(selectedModel.sqft * pkg.pricePerSqft) : pkg.price).toLocaleString()}
                        <span className="text-xs font-normal text-[#64748B] ml-1.5">
                          {pkg.isTurnkey ? 'Total con Mano de Obra' : 'Total Materiales'}
                        </span>
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
            SCREEN 4: SUMMARY & WHATSAPP (APP VIEW)
        ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Digital Order Slip / Invoice Ticket */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-5 sm:p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4 mb-4">
                <div>
                  <span className="text-xs text-[#FF8407] font-black uppercase tracking-wider block">
                    {selectedCommunity.name}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#0F172A]">
                    Modelo {selectedModel.name} (2do Piso)
                  </h4>
                  <span className="text-xs text-[#64748B]">
                    {selectedModel.address} • {selectedModel.sqft} sq ft • {selectedModel.stepsCount} Pasos de Escalera
                  </span>
                </div>
                <div className="text-left sm:text-right bg-[#FFF7ED] p-3 rounded-xl border border-[#FF8407]/30">
                  <span className="text-[10px] text-[#64748B] block font-bold uppercase">Precio Total Cerrado</span>
                  <span className="text-2xl font-black text-[#FF8407]">
                    ${(selectedPackage.pricePerSqft ? Math.round(selectedModel.sqft * selectedPackage.pricePerSqft) : selectedPackage.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-4">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Piso Elegido</span>
                  <span className="font-black text-[#0F172A]">{selectedProduct.name}</span>
                  <div className="mt-1">{renderStockBadge(selectedProduct)}</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Especificación</span>
                  <span className="font-bold text-[#0F172A]">{selectedProduct.thickness}</span>
                  <span className="text-[10px] text-[#64748B] block">{selectedProduct.wearLayer} Wear Layer</span>
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
                    <span>Desmonte y retiro de alfombra existente</span>
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

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
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
                href="tel:7866583677"
                className="py-3.5 px-6 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] font-black text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#CBD5E1] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF8407]" />
                <span>(786) 658-3677</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ================= STICKY BOTTOM APP NAVIGATION ================= */}
      <div className="bg-[#FFFFFF] border-t border-[#E2E8F0] p-3 sm:p-4 px-4 sm:px-6 flex items-center justify-between gap-3 sticky bottom-0 z-30">
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

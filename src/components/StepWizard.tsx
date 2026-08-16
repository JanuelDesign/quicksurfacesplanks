import React, { useState } from 'react';
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
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Phone,
  MessageCircle,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Maximize2,
  Eye,
  ZoomIn,
  Ruler,
  HelpCircle,
  Home,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
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
  const { lang, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections State
  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(initialCommunity);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(initialModel);
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(initialProduct);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(initialPackage);

  // Visualizer Mode in Step 2: 'room' | 'plank' | 'stairs'
  const [step2ViewMode, setStep2ViewMode] = useState<'room' | 'plank' | 'stairs'>('room');
  const [categoryFilter, setCategoryFilter] = useState<'all' | '5.5mm' | '6mm' | '8mm'>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');

  // Step 1: 2D plan view toggle ('diagram' | 'cad')
  const [showFullPlan, setShowFullPlan] = useState<boolean>(false);

  // Fast Form State for final step
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    unitNumber: '',
    preferredDate: '',
  });

  // Filter models based on community
  const availableModels = modelsList.filter((m) => m.communityId === selectedCommunity.id);

  // Filter products for Step 2
  const filteredProducts = productsList.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (toneFilter !== 'all' && p.tone !== toneFilter) return false;
    return true;
  });

  // Step metadata
  const steps = [
    { num: 1, label: lang === 'es' ? 'Comunidad & Modelo' : 'Community & Model', short: 'Modelo', icon: Building2 },
    { num: 2, label: lang === 'es' ? 'Color & Render 3D' : 'Color & 3D Render', short: 'Piso 3D', icon: Layers },
    { num: 3, label: lang === 'es' ? 'Escaleras & Paquete' : 'Stairs & Package', short: 'Paquete', icon: DollarSign },
    { num: 4, label: lang === 'es' ? 'Resumen & WhatsApp' : 'Summary & Booking', short: 'Resumen', icon: Sparkles },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Helper for stock status badge
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
            <span>{lang === 'es' ? 'Próximamente' : 'Coming Soon'}</span>
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

  // WhatsApp link generation
  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola Quick Surfaces! 👋 Quiero confirmar la cotización de mi piso:\n\n` +
      `🏢 *Conjunto:* ${selectedCommunity.name}\n` +
      `🏠 *Modelo:* ${selectedModel.name} (${selectedModel.sqft} sq ft, ${selectedModel.stepsCount} escalones)\n` +
      `🎨 *Piso SPC:* ${selectedProduct.name} (#${selectedProduct.code}) - ${selectedProduct.thickness} (${selectedProduct.wearLayer})\n` +
      `📦 *Paquete Elegido:* ${selectedPackage.title} - $${selectedPackage.price.toLocaleString()}\n` +
      `👤 *Cliente:* ${formData.fullName || 'Por definir'}\n` +
      `📍 *Unidad/Dirección:* ${formData.unitNumber || 'Homestead, FL'}\n` +
      `📞 *Teléfono:* ${formData.phone || 'N/A'}\n` +
      `📅 *Fecha Deseada:* ${formData.preferredDate || 'Lo antes posible'}`
    );
    return `https://wa.me/17866583677?text=${text}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#FFFFFF] text-[#111827] rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden font-sans">
      {/* ================= 1. Top App Header & Segmented Stepper ================= */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-3 sm:px-6 sm:py-4">
        {/* Title Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407] shrink-0"></span>
            <h2 className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-wider truncate">
              {lang === 'es' ? 'Cotizador Paso a Paso' : 'Interactive Estimator'}
            </h2>
            {isLiveSynced && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Google Sheets Live
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold px-2.5 py-1 bg-[#FFFFFF] text-[#FF8407] rounded-full border border-[#CBD5E1] shadow-xs">
              {lang === 'es' ? `Paso ${currentStep} de 4` : `Step ${currentStep} of 4`}
            </span>
          </div>
        </div>

        {/* Segmented Stepper Buttons (Responsive, No Overflow, Touch Targets) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-2 px-1.5 sm:px-3 rounded-xl border transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#FFFFFF] border-[#FF8407] text-[#FF8407] shadow-sm ring-1 ring-[#FF8407]'
                    : isDone
                    ? 'bg-[#F0FDF4] border-emerald-200 text-emerald-800'
                    : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isActive
                      ? 'bg-[#FF8407] text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                </div>
                <span className="hidden sm:inline text-xs font-bold truncate text-[#111827]">
                  {s.label}
                </span>
                <span className="inline sm:hidden text-[10px] font-bold truncate text-[#111827]">
                  {s.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. Screen-by-Screen Step Body ================= */}
      <div className="p-4 sm:p-7 min-h-[480px] bg-[#FFFFFF]">
        {/* ================= STEP 1: Comunidad y Modelo con Plano 2D CAD ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Step intro */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8407] block mb-1">
                Paso 01 / 04
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-[#111827] tracking-tight">
                {lang === 'es' ? 'Selecciona tu Condominio y Modelo de Casa' : 'Select Your Community & Floor Plan'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {lang === 'es'
                  ? 'Calculado exactamente para los 530 sq ft del segundo piso y los 15 escalones a medida.'
                  : 'Pre-calibrated for the 530 sq ft 2nd floor area and 15 custom staircase steps.'}
              </p>
            </div>

            {/* Sub-step 1A: Choose Community */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#475569] block mb-2">
                1. {lang === 'es' ? 'Tu Conjunto Residencial' : 'Residential Community'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFF7ED] border-[#FF8407] shadow-sm ring-1 ring-[#FF8407]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-[#111827] leading-snug">{c.name}</div>
                        <div className="text-[10px] text-[#64748B] mt-0.5">{c.city}, {c.state}</div>
                      </div>
                      {isSelected && (
                        <div className="mt-2 self-end text-[10px] font-bold text-[#FF8407] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Seleccionado</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-step 1B: Choose Model Card */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#475569] block mb-2">
                2. {lang === 'es' ? 'Modelo de Casa (2do Piso)' : 'House Model (2nd Floor)'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.map((m) => {
                  const isSelected = selectedModel.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFF7ED] border-[#FF8407] shadow-md ring-1 ring-[#FF8407]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-[#111827]">{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#FF8407] border border-[#FF8407]/40 font-bold">
                          {m.collection}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center my-2 py-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                        <div>
                          <span className="text-[9px] text-[#64748B] block">Superficie</span>
                          <span className="text-xs font-black text-[#111827]">{m.sqft} sq ft</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#64748B] block">Escalones</span>
                          <span className="text-xs font-black text-[#111827]">{m.stepsCount} Pasos</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#64748B] block">Dormitorios</span>
                          <span className="text-xs font-black text-[#111827]">{m.bedrooms} Hab</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#64748B] mt-1 flex items-center justify-between">
                        <span className="truncate">{m.address}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF8407] shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sub-step 1C: Integrated 2D CAD Blueprint & Room Breakdown */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#111827] text-white text-[10px] font-black">
                    PLANO 2D CAD
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-[#111827]">
                    Distribución Arquitectónica: Modelo {selectedModel.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF8407]">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{selectedModel.sqft} sq ft Net Area • {selectedModel.stepsCount} Escalones</span>
                </div>
              </div>

              {/* Blueprint rendering component */}
              <div className="rounded-xl overflow-hidden border border-[#CBD5E1]">
                <FloorPlanSVG model={selectedModel} selectedProduct={selectedProduct} />
              </div>

              {/* Room list badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                {selectedModel.rooms.slice(0, 4).map((r, idx) => (
                  <div key={idx} className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <span className="font-bold text-[#111827] truncate">{r.name}</span>
                    <span className="text-[10px] text-[#64748B] font-mono shrink-0 ml-1">{r.dimensions}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Color de Piso SPC & Render 3D en Vivo ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8407] block mb-1">
                Paso 02 / 04
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-[#111827] tracking-tight">
                {lang === 'es' ? 'Color de Piso SPC & Visualizador 3D' : 'SPC Flooring Color & 3D Visualizer'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {lang === 'es'
                  ? 'Haz clic en cualquier muestra para ver el render de la habitación terminado y consultar disponibilidad en tiempo real.'
                  : 'Click any swatch to test the room render in real-time and check live stock.'}
              </p>
            </div>

            {/* Main Interactive 3D / Plank View Box */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                {/* View switcher buttons */}
                <div className="flex bg-[#FFFFFF] p-1 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <button
                    onClick={() => setStep2ViewMode('room')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      step2ViewMode === 'room'
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Render 3D Habitación' : 'Room Render'}</span>
                  </button>
                  <button
                    onClick={() => setStep2ViewMode('plank')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      step2ViewMode === 'plank'
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#FF8407]" />
                    <span>{lang === 'es' ? 'Foto de Tablón' : 'Plank Closeup'}</span>
                  </button>
                  <button
                    onClick={() => setStep2ViewMode('stairs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      step2ViewMode === 'stairs'
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Escaleras' : 'Stairs'}</span>
                  </button>
                </div>

                {/* Stock Status Pill for currently selected */}
                <div className="flex items-center gap-2">
                  {renderStockBadge(selectedProduct)}
                  <span className="text-xs font-black text-[#111827] px-2.5 py-1 bg-[#FFFFFF] rounded-xl border border-[#CBD5E1]">
                    #{selectedProduct.code} {selectedProduct.name}
                  </span>
                </div>
              </div>

              {/* Viewport Image */}
              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-[#E2E8F0] border border-[#CBD5E1]">
                <img
                  src={
                    step2ViewMode === 'room'
                      ? selectedProduct.roomPreviewUrl || selectedProduct.imageUrl
                      : step2ViewMode === 'plank'
                      ? selectedProduct.plankImageUrl || selectedProduct.imageUrl
                      : selectedProduct.staircasePreviewUrl || selectedProduct.imageUrl
                  }
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Floating Spec Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-black/75 backdrop-blur-md text-white border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white shrink-0 shadow-sm"
                      style={{ backgroundColor: selectedProduct.colorHex }}
                    ></span>
                    <span className="font-black truncate">{selectedProduct.name}</span>
                    <span className="text-white/70">({selectedProduct.collectionName})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-[#FF8407]">{selectedProduct.thickness}</span>
                    <span>•</span>
                    <span>{selectedProduct.wearLayer} Wear Layer</span>
                    <span>•</span>
                    <span>{selectedProduct.padding}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Category Thickness Filter */}
                <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                  {[
                    { id: 'all', label: 'Todos (13)' },
                    { id: '5.5mm', label: '5.5mm Select (8)' },
                    { id: '6mm', label: '6.0mm XL (1)' },
                    { id: '8mm', label: '8.0mm Luxury (4)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCategoryFilter(tab.id as any)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        categoryFilter === tab.id
                          ? 'bg-[#FFFFFF] text-[#111827] shadow-xs'
                          : 'text-[#64748B] hover:text-[#111827]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tone Filter */}
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'natural', label: 'Natural Oak' },
                    { id: 'warm', label: 'Cálido' },
                    { id: 'cool', label: 'Gris / Frío' },
                    { id: 'dark', label: 'Oscuro' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setToneFilter(t.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        toneFilter === t.id
                          ? 'bg-[#111827] text-white'
                          : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Swatch Grid (2-col mobile, 4-col desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {filteredProducts.map((p) => {
                  const isSelected = selectedProduct.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFF7ED] border-[#FF8407] shadow-md ring-1 ring-[#FF8407]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {/* Photo preview */}
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
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-[#111827] truncate">{p.name}</span>
                          <span className="text-[10px] text-[#64748B] font-bold shrink-0">#{p.code}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1.5">
                          <span>{p.thickness}</span>
                          <span>{p.wearLayer}</span>
                        </div>

                        {/* Stock Badge */}
                        <div className="pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between">
                          {renderStockBadge(p)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Escaleras & Paquetes de Instalación ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8407] block mb-1">
                Paso 03 / 04
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-[#111827] tracking-tight">
                {lang === 'es' ? 'Escaleras & Paquete de Instalación' : 'Stairs & Installation Packages'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {lang === 'es'
                  ? 'Paquetes completos Llave en Mano con mano de obra certificada o kits de Solo Material entregados a tu puerta.'
                  : 'Turnkey all-inclusive packages with certified installation or Material-Only kits.'}
              </p>
            </div>

            {/* Staircase Feature Spotlight Card */}
            <div className="bg-[#FFF7ED] rounded-2xl p-4 sm:p-5 border border-[#FF8407]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#FF8407] text-white text-[10px] font-black uppercase">
                    INCLUIDO EN TODOS LOS MODELOS
                  </span>
                  <span className="text-xs font-bold text-[#111827]">15 Escalones a Medida</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-[#111827]">
                  Sistema de Gradas con Nariz Flush Stair Nose Integrada
                </h4>
                <p className="text-xs text-[#64748B] max-w-xl">
                  Eliminamos los bordes plásticos sobrepuestos. Nuestras narices de escalón quedan al ras, con corte a inglete en taller y pad acústico de alta densidad.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 bg-white px-3 py-2 rounded-xl border border-[#FF8407]/30 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <span className="text-[10px] text-[#64748B] block font-bold">Garantía Residencial</span>
                  <span className="text-xs font-black text-[#111827]">25 Años de Fábrica</span>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packagesList.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-[#FF8407] shadow-lg ring-2 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#111827] text-[#FF8407] shadow-xs">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block mb-1">
                        {pkg.isTurnkey ? (lang === 'es' ? 'Llave en Mano (Instalado)' : 'Turnkey Installed') : (lang === 'es' ? 'Solo Material' : 'Material Only')}
                      </span>
                      <h4 className="text-base font-black text-[#111827]">{pkg.title}</h4>
                      <p className="text-xs text-[#64748B] mt-1 mb-3">{pkg.tagline}</p>

                      <div className="text-2xl sm:text-3xl font-black text-[#FF8407] mb-3">
                        ${pkg.price.toLocaleString()}
                        <span className="text-xs font-normal text-[#64748B] ml-1.5">
                          {pkg.isTurnkey ? (lang === 'es' ? 'Total Instalado' : 'Total Installed') : (lang === 'es' ? 'Total Material' : 'Total Material')}
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
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#FF8407] text-white shadow-md'
                          : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#111827] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : null}
                      <span>{isSelected ? (lang === 'es' ? 'Paquete Seleccionado' : 'Selected Package') : (lang === 'es' ? 'Elegir Este Paquete' : 'Select Package')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: Resumen Ejecutivo & WhatsApp Instantáneo ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8407] block mb-1">
                Paso 04 / 04
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-[#111827] tracking-tight">
                {lang === 'es' ? 'Resumen Ejecutivo & Agendar Inspección' : 'Executive Summary & In-Home Booking'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {lang === 'es'
                  ? 'Revisa los detalles de tu proyecto y envía tu solicitud directamente a nuestro equipo técnico por WhatsApp.'
                  : 'Review project details and instantly dispatch your estimate via WhatsApp.'}
              </p>
            </div>

            {/* Executive Receipt Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 sm:p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4 mb-4">
                <div>
                  <span className="text-xs text-[#FF8407] font-black uppercase tracking-wider block">
                    {selectedCommunity.name}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#111827]">
                    Modelo {selectedModel.name} (2do Piso)
                  </h4>
                  <span className="text-xs text-[#64748B]">
                    {selectedModel.address} • {selectedModel.sqft} sq ft • {selectedModel.stepsCount} Pasos de Escalera
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#64748B] block">Precio Total Cerrado</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FF8407]">
                    ${selectedPackage.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Specs Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Piso Seleccionado</span>
                  <span className="font-black text-[#111827]">{selectedProduct.name}</span>
                  <div className="mt-1">{renderStockBadge(selectedProduct)}</div>
                </div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Especificaciones SPC</span>
                  <span className="font-bold text-[#111827]">{selectedProduct.thickness}</span>
                  <span className="text-[10px] text-[#64748B] block">{selectedProduct.wearLayer} Wear Layer</span>
                </div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Escaleras</span>
                  <span className="font-bold text-[#111827]">15 Pasos Completos</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">Flush Stair Nose</span>
                </div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Tipo de Paquete</span>
                  <span className="font-black text-[#111827]">{selectedPackage.title}</span>
                  <span className="text-[10px] text-[#64748B] block">{selectedPackage.isTurnkey ? 'Llave en Mano' : 'Material'}</span>
                </div>
              </div>

              {/* Inclusions Checklist */}
              <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#111827] block mb-2">Servicios y Garantías Incluidas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#475569]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Desmonte y retiro de alfombra existente</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nivelación y preparación de subsuelo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instalación de molduras de cuarto de bocel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Garantía de 25 años de fábrica en el SPC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 sm:p-6 rounded-2xl">
              <h4 className="text-sm font-black text-[#111827] mb-3">
                {lang === 'es' ? 'Datos para Agendar Muestra en Casa e Inspección' : 'Schedule In-Home Sample Review'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Martínez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:border-[#FF8407] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="(786) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:border-[#FF8407] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Unidad / Dirección en Homestead</label>
                  <input
                    type="text"
                    placeholder="Ej. Apt 204 / Calle..."
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:border-[#FF8407] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'es' ? 'Enviar Cotización por WhatsApp' : 'Send Estimate via WhatsApp'}</span>
              </a>
              <a
                href="tel:7866583677"
                className="py-3.5 px-6 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#111827] font-black text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#CBD5E1] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF8407]" />
                <span>(786) 658-3677</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. Bottom Sticky Action Navigation Controls ================= */}
      <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-4 px-5 sm:px-7 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-[#94A3B8]'
              : 'text-[#475569] hover:text-[#111827] bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Anterior' : 'Back'}</span>
        </button>

        {/* Center Progress summary */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#64748B] truncate max-w-[300px]">
          <span className="truncate">{selectedModel.name}</span>
          <span>•</span>
          <span className="truncate">{selectedProduct.name}</span>
        </div>

        {/* Next / Submit Button */}
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-black shadow-md shadow-[#FF8407]/20 transition-all cursor-pointer"
          >
            <span>{lang === 'es' ? 'Siguiente Paso' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md cursor-pointer"
          >
            <span>{lang === 'es' ? 'Confirmar por WhatsApp' : 'Confirm via WhatsApp'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

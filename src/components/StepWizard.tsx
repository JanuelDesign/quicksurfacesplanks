import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FloorPlanModel, FlooringProduct, PricingPackage, ResidentialCommunity } from '../types';
import { COMMUNITIES, FLOOR_PLAN_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from '../data/products';
import {
  Check,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Home,
  Layers,
  Palette,
  ShieldCheck,
  Phone,
  MessageCircle,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface StepWizardProps {
  initialCommunity?: ResidentialCommunity;
  initialModel?: FloorPlanModel;
  initialProduct?: FlooringProduct;
  initialPackage?: PricingPackage;
  onClose?: () => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  initialCommunity = COMMUNITIES[0],
  initialModel = FLOOR_PLAN_MODELS[0],
  initialProduct = FLOORING_PRODUCTS[2],
  initialPackage = PRICING_PACKAGES[2],
  onClose,
}) => {
  const { lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(initialCommunity);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(initialModel);
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(initialProduct);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(initialPackage);
  const [includeStairs, setIncludeStairs] = useState<boolean>(true);
  const [includeBaseboards, setIncludeBaseboards] = useState<boolean>(true);

  // Customer contact form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    unitNumber: '',
    preferredDate: '',
    notes: '',
  });

  // Filter models based on community
  const availableModels = FLOOR_PLAN_MODELS.filter((m) => m.communityId === selectedCommunity.id);

  // Step names
  const steps = [
    { num: 1, label: lang === 'es' ? 'Condominio & Modelo' : 'Community & Model', icon: Home },
    { num: 2, label: lang === 'es' ? 'Color & Textura SPC' : 'SPC Color & Finish', icon: Palette },
    { num: 3, label: lang === 'es' ? 'Paquete & Escaleras' : 'Package & Stairs', icon: Layers },
    { num: 4, label: lang === 'es' ? 'Presupuesto Final' : 'Final Quote', icon: ShieldCheck },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // WhatsApp Message Generator
  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola QuickSurfaces! Quiero agendar la medición para mi segundo piso:\n\n` +
      `🏢 *Conjunto:* ${selectedCommunity.name}\n` +
      `🏠 *Modelo:* ${selectedModel.name} (${selectedModel.sqft} sq ft, ${selectedModel.stepsCount} escalones)\n` +
      `🎨 *Piso SPC:* ${selectedProduct.name} (${selectedProduct.thickness}, ${selectedProduct.wearLayer})\n` +
      `📦 *Paquete:* ${selectedPackage.title} ($${selectedPackage.price.toLocaleString()})\n` +
      `👤 *Cliente:* ${formData.fullName || 'Por definir'}\n` +
      `📍 *Unidad:* ${formData.unitNumber || 'Homestead'}\n` +
      `📞 *Teléfono:* ${formData.phone || 'N/A'}\n` +
      `📅 *Fecha Deseada:* ${formData.preferredDate || 'Lo antes posible'}`
    );
    return `https://wa.me/17866583677?text=${text}`;
  };

  return (
    <div className="bg-[#0A0D14] text-white min-h-[650px] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Top Header & Progress Bar */}
      <div className="bg-[#111827] border-b border-[#1F2937] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407] animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-heading">
              {lang === 'es' ? 'Cotizador Rápido Paso a Paso' : 'Step-by-Step Flooring Estimator'}
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#1E293B] text-[#FF8407] rounded-full border border-[#334155]">
            {lang === 'es' ? `Paso ${currentStep} de 4` : `Step ${currentStep} of 4`}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col items-center sm:items-start p-2 sm:p-2.5 rounded-xl border transition-all text-left ${
                  isActive
                    ? 'bg-[#FF8407]/10 border-[#FF8407] text-[#FF8407]'
                    : isDone
                    ? 'bg-[#1E293B]/60 border-[#334155] text-emerald-400'
                    : 'bg-[#1E293B]/20 border-transparent text-[#64748B]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-[11px] font-bold">
                    0{s.num}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold truncate w-full text-center sm:text-left text-white">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="p-4 sm:p-8 flex-grow overflow-y-auto">
        {/* ================= STEP 1: Community & Model ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                1. {lang === 'es' ? 'Selecciona tu Condominio' : 'Select Your Community'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {COMMUNITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCommunity(c);
                      const first = FLOOR_PLAN_MODELS.find((m) => m.communityId === c.id);
                      if (first) setSelectedModel(first);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedCommunity.id === c.id
                        ? 'bg-[#FF8407]/10 border-[#FF8407] text-white shadow-lg shadow-[#FF8407]/10'
                        : 'bg-[#111827] border-[#1F2937] text-[#94A3B8] hover:border-[#334155]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-[#64748B]">{c.city}, {c.state}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                2. {lang === 'es' ? 'Selecciona tu Modelo de 2do Piso' : 'Select Your 2nd Floor Model'}
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
                          ? 'bg-[#1E293B] border-[#FF8407] ring-1 ring-[#FF8407]'
                          : 'bg-[#111827] border-[#1F2937] hover:border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#000000] text-[#FF8407] border border-[#FF8407]/30 font-bold">
                          {m.collection}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center my-2 py-2 bg-[#000000]/40 rounded-xl">
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Superficie</span>
                          <span className="text-xs font-bold text-white">{m.sqft} sq ft</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Escalones</span>
                          <span className="text-xs font-bold text-white">{m.stepsCount} Pasos</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Habitaciones</span>
                          <span className="text-xs font-bold text-white">{m.bedrooms} Hab</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-1 flex items-center justify-between">
                        <span>{m.address}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#FF8407]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Flooring Color & Texture ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {lang === 'es' ? 'Elige el Color del Piso SPC' : 'Select Your SPC Vinyl Color'}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {lang === 'es'
                    ? '100% resistente al agua, capa de desgaste comercial de 20 a 22 Mils con pad acústico EVA integrado.'
                    : '100% waterproof rigid core with 20-22 Mils commercial wear layer and integrated acoustic pad.'}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155]">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProduct.colorHex }}></span>
                <span className="text-xs font-bold text-white">{selectedProduct.name}</span>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FLOORING_PRODUCTS.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-all flex flex-col ${
                      isSelected
                        ? 'bg-[#1E293B] border-[#FF8407] ring-2 ring-[#FF8407]'
                        : 'bg-[#111827] border-[#1F2937] hover:border-[#334155]'
                    }`}
                  >
                    <div className="relative h-24 sm:h-28 bg-[#000000] overflow-hidden">
                      <img
                        src={p.plankImageUrl || p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-[#FF8407]">
                        {p.category}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FF8407] text-black flex items-center justify-center font-bold">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                            style={{ backgroundColor: p.colorHex }}
                          ></span>
                          <span className="text-xs font-bold text-white truncate">{p.name}</span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] block">{p.collectionName}</span>
                      </div>
                      <div className="text-[9px] text-[#64748B] mt-2 pt-1 border-t border-white/5 flex justify-between">
                        <span>{p.thickness}</span>
                        <span>{p.wearLayer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: Packages & Staircase Options ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                {lang === 'es' ? 'Selecciona tu Paquete de Servicio' : 'Choose Your Service Package'}
              </h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                {lang === 'es'
                  ? 'Todos los precios incluyen materiales, corte de escaleras e impuestos de Florida.'
                  : 'All flat rates include flooring materials, precision stair fabrication, and Florida taxes.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRICING_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1E293B] border-[#FF8407] ring-2 ring-[#FF8407]'
                        : 'bg-[#111827] border-[#1F2937] hover:border-[#334155]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF8407]/10 text-[#FF8407] font-bold border border-[#FF8407]/30">
                          {pkg.badge}
                        </span>
                        {isSelected && <Check className="w-5 h-5 text-[#FF8407]" />}
                      </div>
                      <h4 className="text-base font-bold text-white">{pkg.title}</h4>
                      <p className="text-xs text-[#94A3B8] mb-3">{pkg.tagline}</p>
                      <div className="text-2xl font-black text-[#FF8407] mb-3">
                        ${pkg.price.toLocaleString()}
                        <span className="text-xs text-[#94A3B8] font-normal ml-1">
                          {pkg.isTurnkey ? '(Llave en mano / Todo Incluido)' : '(Solo Material)'}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                        {pkg.features.slice(0, 4).map((f, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: Final Quote Summary & Fast Booking ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
                <div>
                  <span className="text-xs text-[#FF8407] font-bold uppercase tracking-wider block">
                    {lang === 'es' ? 'Resumen de tu Cotización' : 'Estimate Summary'}
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {selectedCommunity.name} - Modelo {selectedModel.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#94A3B8] block">Total Estimado</span>
                  <span className="text-2xl font-black text-[#FF8407]">
                    ${selectedPackage.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-white/5">
                  <span className="text-[#64748B] block text-[10px]">Superficie Piso</span>
                  <span className="font-bold text-white">{selectedModel.sqft} sq ft</span>
                </div>
                <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-white/5">
                  <span className="text-[#64748B] block text-[10px]">Escaleras</span>
                  <span className="font-bold text-white">{selectedModel.stepsCount} Pasos Incluidos</span>
                </div>
                <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-white/5">
                  <span className="text-[#64748B] block text-[10px]">Color Elegido</span>
                  <span className="font-bold text-white">{selectedProduct.name}</span>
                </div>
                <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-white/5">
                  <span className="text-[#64748B] block text-[10px]">Paquete</span>
                  <span className="font-bold text-white truncate block">{selectedPackage.title}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-3">
                {lang === 'es' ? 'Datos para Agendar Inspección y Muestra Gratuita' : 'Book Free In-Home Measurement'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Martínez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#000000] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] focus:border-[#FF8407] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="(786) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#000000] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] focus:border-[#FF8407] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Unidad / Dirección</label>
                  <input
                    type="text"
                    placeholder="Ej. Apt 204 o Dirección"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full bg-[#000000] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] focus:border-[#FF8407] outline-none"
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
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'es' ? 'Enviar Cotización por WhatsApp' : 'Send Quote via WhatsApp'}</span>
              </a>
              <a
                href="tel:7866583677"
                className="py-3 px-5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#334155] transition-all"
              >
                <Phone className="w-4 h-4 text-[#FF8407]" />
                <span>(786) 658-3677</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="bg-[#111827] border-t border-[#1F2937] p-4 px-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-[#64748B]'
              : 'text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#334155]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Anterior' : 'Back'}</span>
        </button>

        <div className="text-xs text-[#64748B]">
          {selectedModel.name} • {selectedProduct.name}
        </div>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-[#FF8407] hover:bg-[#e67400] text-black shadow-md shadow-[#FF8407]/20 transition-all cursor-pointer"
          >
            <span>{lang === 'es' ? 'Siguiente Paso' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
          >
            <span>{lang === 'es' ? 'Agendar Ahora' : 'Book Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

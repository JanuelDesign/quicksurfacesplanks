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

  // Selections State
  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(initialCommunity);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(initialModel);
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(initialProduct);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(initialPackage);

  // Fast Form State for final step
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    unitNumber: '',
    preferredDate: '',
  });

  // Filter models based on community
  const availableModels = modelsList.filter((m) => m.communityId === selectedCommunity.id);

  // Step names
  const steps = [
    { num: 1, label: lang === 'es' ? 'Condominio & Modelo' : 'Community & Model', icon: Building2 },
    { num: 2, label: lang === 'es' ? 'Color de Piso SPC' : 'SPC Flooring Color', icon: Layers },
    { num: 3, label: lang === 'es' ? 'Paquete & Instalación' : 'Package & Labor', icon: DollarSign },
    { num: 4, label: lang === 'es' ? 'Resumen & WhatsApp' : 'Summary & Booking', icon: Sparkles },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // WhatsApp link generation
  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola Quick Surfaces! 👋 Quiero agendar la inspección gratuita de mi piso:\n\n` +
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
    <div className="bg-[#FFFFFF] text-[#111827] min-h-[620px] rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col font-sans">
      {/* Top Header & Progress Bar */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407]"></span>
            <h2 className="text-sm sm:text-base font-bold text-[#111827] tracking-wide uppercase font-heading">
              {lang === 'es' ? 'Cotizador Paso a Paso' : 'Step-by-Step Flooring Estimator'}
            </h2>
            {isLiveSynced && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Live Google Sheets
              </span>
            )}
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#FFFFFF] text-[#FF8407] rounded-full border border-[#CBD5E1] shadow-sm">
            {lang === 'es' ? `Paso ${currentStep} de 4` : `Step ${currentStep} of 4`}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col items-center sm:items-start p-2.5 rounded-2xl border transition-all text-left ${
                  isActive
                    ? 'bg-[#FFFFFF] border-[#FF8407] text-[#FF8407] shadow-sm ring-1 ring-[#FF8407]'
                    : isDone
                    ? 'bg-[#F0FDF4] border-emerald-200 text-emerald-700'
                    : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-[11px] font-bold">
                    0{s.num}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold truncate w-full text-center sm:text-left text-[#111827]">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="p-4 sm:p-8 flex-grow overflow-y-auto bg-[#FFFFFF]">
        {/* ================= STEP 1: Community & Model ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                1. {lang === 'es' ? 'Selecciona tu Condominio' : 'Select Your Community'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {COMMUNITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCommunity(c);
                      const first = modelsList.find((m) => m.communityId === c.id);
                      if (first) setSelectedModel(first);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedCommunity.id === c.id
                        ? 'bg-[#FFF7ED] border-[#FF8407] text-[#111827] shadow-sm ring-1 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#111827]">{c.name}</div>
                    <div className="text-[10px] text-[#64748B]">{c.city}, {c.state}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
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
                          ? 'bg-[#FFF7ED] border-[#FF8407] shadow-sm ring-1 ring-[#FF8407]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#111827]">{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#FF8407] border border-[#FF8407]/40 font-bold">
                          {m.collection}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center my-2 py-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Superficie</span>
                          <span className="text-xs font-bold text-[#111827]">{m.sqft} sq ft</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Escalones</span>
                          <span className="text-xs font-bold text-[#111827]">{m.stepsCount} Pasos</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Habitaciones</span>
                          <span className="text-xs font-bold text-[#111827]">{m.bedrooms} Hab</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-1 flex items-center justify-between">
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
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                  {lang === 'es' ? 'Elige el Color del Piso SPC' : 'Select Your SPC Vinyl Color'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {lang === 'es'
                    ? '100% resistente al agua, capa de desgaste comercial de 20 a 22 Mils con pad acústico EVA integrado.'
                    : '100% waterproof rigid core with 20-22 Mils commercial wear layer and integrated acoustic pad.'}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
                <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: selectedProduct.colorHex }}></span>
                <span className="text-xs font-bold text-[#111827]">{selectedProduct.name}</span>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {productsList.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`rounded-2xl border p-3 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-[#FF8407] shadow-sm ring-1 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {/* Plank Image / Texture Preview */}
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-2 bg-[#E2E8F0] relative border border-[#CBD5E1]">
                      <img
                        src={p.plankImageUrl || p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: p.colorHex }}
                        ></span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#FF8407] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111827]">{p.name}</span>
                        <span className="text-[10px] text-[#64748B] font-semibold">{p.category}</span>
                      </div>
                      <div className="text-[10px] text-[#64748B] mt-0.5 line-clamp-1">
                        {p.grainStyle || p.finish}
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#475569]">
                        <span>Capa: {p.wearLayer}</span>
                        <span className="font-semibold">{p.thickness}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: Pricing Packages ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                {lang === 'es' ? 'Selecciona el Paquete' : 'Select Your Package'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {lang === 'es'
                  ? 'Paquetes de Solo Material o Llave en Mano con Mano de Obra e Instalación Profesional Garantizada.'
                  : 'Material-only or Turnkey packages including certified professional labor.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packagesList.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-[#FF8407] shadow-md ring-1 ring-[#FF8407]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#FF8407] border border-[#FF8407]/30">
                        {pkg.badge}
                      </span>
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                        {pkg.isTurnkey ? (lang === 'es' ? 'Llave en Mano' : 'Turnkey Package') : (lang === 'es' ? 'Solo Material' : 'Material Only')}
                      </span>
                      <h4 className="text-base font-bold text-[#111827]">{pkg.title}</h4>
                      <p className="text-xs text-[#64748B] mt-1 mb-3">{pkg.tagline}</p>
                      
                      <div className="text-2xl font-black text-[#FF8407] mb-3">
                        ${pkg.price.toLocaleString()}
                        <span className="text-xs font-normal text-[#64748B] ml-1">
                          {pkg.isTurnkey ? (lang === 'es' ? 'Total Instalado' : 'Total Installed') : (lang === 'es' ? 'Material Total' : 'Total Material')}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-[#475569]">
                        {pkg.features.slice(0, 4).map((f, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
                <div>
                  <span className="text-xs text-[#FF8407] font-bold uppercase tracking-wider block">
                    {lang === 'es' ? 'Resumen de tu Cotización' : 'Estimate Summary'}
                  </span>
                  <h4 className="text-lg font-bold text-[#111827]">
                    {selectedCommunity.name} - Modelo {selectedModel.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#64748B] block">Total Estimado</span>
                  <span className="text-2xl font-black text-[#FF8407]">
                    ${selectedPackage.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Superficie Piso</span>
                  <span className="font-bold text-[#111827]">{selectedModel.sqft} sq ft</span>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Escaleras</span>
                  <span className="font-bold text-[#111827]">{selectedModel.stepsCount} Pasos Incluidos</span>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Color Elegido</span>
                  <span className="font-bold text-[#111827]">{selectedProduct.name}</span>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Paquete</span>
                  <span className="font-bold text-[#111827] truncate block">{selectedPackage.title}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-[#111827] mb-3">
                {lang === 'es' ? 'Datos para Agendar Inspección y Muestra Gratuita' : 'Book Free In-Home Measurement'}
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
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="(786) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:border-[#FF8407] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Unidad / Dirección</label>
                  <input
                    type="text"
                    placeholder="Ej. Apt 204 o Dirección"
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
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'es' ? 'Enviar Cotización por WhatsApp' : 'Send Quote via WhatsApp'}</span>
              </a>
              <a
                href="tel:7866583677"
                className="py-3 px-5 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#111827] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#CBD5E1] transition-all"
              >
                <Phone className="w-4 h-4 text-[#FF8407]" />
                <span>(786) 658-3677</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-4 px-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-[#94A3B8]'
              : 'text-[#475569] hover:text-[#111827] bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Anterior' : 'Back'}</span>
        </button>

        <div className="text-xs font-semibold text-[#64748B]">
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
            className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
          >
            <span>{lang === 'es' ? 'Agendar Ahora' : 'Book Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

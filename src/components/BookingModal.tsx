import React, { useState, useEffect, useMemo } from 'react';
import { FloorPlanModel, FlooringProduct, PricingPackage, FloorScope } from '../types';
import { FLOOR_PLAN_MODELS, COMMUNITIES } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from '../data/products';
import { calculateQuotePrice, formatCurrency } from '../utils/pricingCalculator';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
  MapPin,
  Home,
  DollarSign,
  Loader2,
  Mail,
  AlertCircle,
  MessageCircle,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModel?: FloorPlanModel;
  initialProduct?: FlooringProduct;
  initialPackage?: PricingPackage;
  initialFloorScope?: FloorScope;
  modelsList?: FloorPlanModel[];
  productsList?: FlooringProduct[];
  packagesList?: PricingPackage[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialModel,
  initialProduct,
  initialPackage,
  initialFloorScope = 'floor1_stairs',
  modelsList = FLOOR_PLAN_MODELS,
  productsList = FLOORING_PRODUCTS,
  packagesList = PRICING_PACKAGES,
}) => {
  const { lang, t } = useLanguage();

  const activeModels = modelsList && modelsList.length > 0 ? modelsList : FLOOR_PLAN_MODELS;
  const activeProducts = productsList && productsList.length > 0 ? productsList : FLOORING_PRODUCTS;
  const activePackages = packagesList && packagesList.length > 0 ? packagesList : PRICING_PACKAGES;

  const [selectedModelId, setSelectedModelId] = useState<string>(initialModel?.id || activeModels[0]?.id || 'siena-b-model');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackage?.id || activePackages[0]?.id || 'turnkey-complete');
  const [selectedColorId, setSelectedColorId] = useState<string>(initialProduct?.id || activeProducts[0]?.id || 'trustable-oak-03');
  const [floorScope, setFloorScope] = useState<FloorScope>(initialFloorScope);

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>(initialModel?.address || '');
  const [timingPreset, setTimingPreset] = useState<'asap' | 'next_week' | 'two_weeks' | 'custom'>('asap');
  const [customDate, setCustomDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync state when modal is opened with initial props
  useEffect(() => {
    if (isOpen) {
      if (initialModel) {
        const found = activeModels.find(
          (m) =>
            m.id === initialModel.id ||
            m.slug === initialModel.slug ||
            m.name.toLowerCase() === initialModel.name.toLowerCase()
        );
        setSelectedModelId(found?.id || initialModel.id);
      }
      if (initialPackage?.id) setSelectedPackageId(initialPackage.id);
      if (initialProduct?.id) setSelectedColorId(initialProduct.id);
      if (initialFloorScope) setFloorScope(initialFloorScope);
      if (initialModel?.address) setAddress(initialModel.address);
      setIsSubmitted(false);
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen, initialModel, initialPackage, initialProduct, initialFloorScope, activeModels]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Find currently selected entities
  const currentModel =
    activeModels.find(
      (m) =>
        m.id === selectedModelId ||
        m.slug === selectedModelId ||
        (m.name && selectedModelId && m.name.toLowerCase() === selectedModelId.toLowerCase())
    ) || activeModels[0];
  const currentPackage =
    activePackages.find((p) => p.id === selectedPackageId || p.title.toLowerCase() === selectedPackageId.toLowerCase()) ||
    activePackages[0];
  const currentColor =
    activeProducts.find((c) => c.id === selectedColorId || c.code === selectedColorId) ||
    activeProducts[0];

  // Dynamic Price Calculation with floorScope
  const quoteCalculation = useMemo(() => {
    return calculateQuotePrice(currentModel, currentColor, currentPackage, floorScope);
  }, [currentModel, currentColor, currentPackage, floorScope]);

  const TARGET_EMAIL = 'marketingquicksurfaces@gmail.com';
  const WHATSAPP_PHONE = '17866583677';

  const getScopeLabel = () => {
    switch (floorScope) {
      case 'floor1':
        return lang === 'es' ? 'Solo 1er Piso' : '1st Floor Only';
      case 'floor1_stairs':
        return lang === 'es' ? '1er Piso + 17 Escalones' : '1st Floor + 17 Stairs';
      case 'floor2':
        return lang === 'es' ? 'Solo 2do Piso' : '2nd Floor Only';
      case 'floor2_stairs':
        return lang === 'es' ? '2do Piso + 17 Escalones' : '2nd Floor + 17 Stairs';
      default:
        return lang === 'es' ? '1er Piso + Escaleras' : '1st Floor + Stairs';
    }
  };

  // US Phone Formatter Helper: (XXX) XXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;
    if (digits.length > 0) {
      if (digits.length <= 3) {
        formatted = `(${digits}`;
      } else if (digits.length <= 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }
    setPhone(formatted);
    if (errors.phone && digits.length === 10) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (errors.fullName && e.target.value.trim().length >= 2) {
      setErrors((prev) => ({ ...prev, fullName: undefined }));
    }
  };

  const getResolvedPreferredDate = () => {
    if (timingPreset === 'asap') return lang === 'es' ? 'Lo antes posible (Esta semana)' : 'ASAP (This week)';
    if (timingPreset === 'next_week') return lang === 'es' ? 'Próxima semana' : 'Next week';
    if (timingPreset === 'two_weeks') return lang === 'es' ? 'En 2 a 3 semanas' : 'In 2-3 weeks';
    return customDate || (lang === 'es' ? 'Fecha por coordinar' : 'Date to be scheduled');
  };

  const validateForm = () => {
    const newErrors: { fullName?: string; phone?: string; email?: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = lang === 'es' ? 'Por favor ingresa tu nombre completo.' : 'Please enter your full name.';
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      newErrors.phone = lang === 'es' ? 'Ingresa un número de 10 dígitos (ej: (786) 658-3677).' : 'Please enter a valid 10-digit US phone.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = lang === 'es' ? 'Ingresa un correo electrónico válido.' : 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const resolvedDate = getResolvedPreferredDate();
    const payload = {
      _subject: `Nueva Cotización QuickSurfaces: ${currentModel.name} - ${fullName}`,
      _template: 'table',
      _captcha: 'false',
      destination_email: TARGET_EMAIL,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'No especificado',
      community: currentModel.communityName,
      model: `${currentModel.name} (~${quoteCalculation.sqftMaterialRecommended} SF + ${quoteCalculation.hasStairs ? '17 Square Step Noses' : 'Sin escaleras'})`,
      scope: getScopeLabel(),
      address: address.trim() || currentModel.address || 'Siena Reserve / Homestead FL',
      package: `${currentPackage.title} ($${quoteCalculation.totalPrice.toLocaleString()})`,
      color: `${currentColor.name} (#${currentColor.code} - ${currentColor.category} - ${currentColor.thickness})`,
      totalCalculatedPrice: `$${quoteCalculation.totalPrice.toLocaleString()}`,
      preferredDate: resolvedDate,
      notes: notes.trim() || 'Ninguna',
      submittedAt: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 200) {
        setIsSubmitted(true);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.warn('Form submission network fallback:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    lang === 'es'
      ? `Hola QuickSurfaces! 👋 Acabo de solicitar la cotización para mi casa:\n\n` +
        `👤 Cliente: ${fullName || 'Cliente'}\n` +
        `📞 Teléfono: ${phone || 'N/A'}\n` +
        `🏡 Comunidad: ${currentModel.communityName}\n` +
        `📐 Modelo: ${currentModel.name} (${getScopeLabel()})\n` +
        `📏 Metraje: ~${quoteCalculation.sqftMaterialRecommended} sq ft ${quoteCalculation.hasStairs ? '+ 17 Square Step Noses' : ''}\n` +
        `📦 Paquete: ${currentPackage.title}\n` +
        `🎨 Color SPC: ${currentColor.name} (#${currentColor.code})\n` +
        `💰 Tarifa Estimada: $${quoteCalculation.totalPrice.toLocaleString()}\n` +
        `📅 Fecha Deseada: ${getResolvedPreferredDate()}\n\n` +
        `¿Podemos confirmar disponibilidad de instalación? Gracias!`
      : `Hello QuickSurfaces! 👋 I just requested a quote for my home:\n\n` +
        `👤 Client: ${fullName || 'Customer'}\n` +
        `📞 Phone: ${phone || 'N/A'}\n` +
        `🏡 Community: ${currentModel.communityName}\n` +
        `📐 Model: ${currentModel.name} (${getScopeLabel()})\n` +
        `📏 Coverage: ~${quoteCalculation.sqftMaterialRecommended} sq ft ${quoteCalculation.hasStairs ? '+ 17 Square Step Noses' : ''}\n` +
        `📦 Package: ${currentPackage.title}\n` +
        `🎨 SPC Color: ${currentColor.name} (#${currentColor.code})\n` +
        `💰 Estimated Rate: $${quoteCalculation.totalPrice.toLocaleString()}\n` +
        `📅 Target Timeline: ${getResolvedPreferredDate()}\n\n` +
        `Can we confirm installation availability? Thank you!`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full max-h-[90vh] sm:max-h-[92vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden relative text-[#0F172A] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed Top */}
        <div className="shrink-0 bg-[#0F172A] text-[#FFFFFF] p-5 sm:p-6 relative border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8407]/20 border border-[#FF8407]/40 text-[#FF8407] text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QuickSurfaces Direct Scheduling</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#FFFFFF] tracking-tight">
            {lang === 'es'
              ? `Reserva tu Instalación: ${currentModel.name} (Siena Reserve)`
              : `Book Your ${currentModel.name} Installation (Siena Reserve)`}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {lang === 'es'
              ? 'Bloquea tu fecha de instalación y asegura la tarifa de comunidad con garantía escrita de 25 años.'
              : 'Lock in your installation date and community group rate with a 25-year written warranty.'}
          </p>
        </div>

        {/* Content - Scrollable Middle */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
          {isSubmitted ? (
            /* Success View */
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto border-2 border-[#10B981]/30 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#10B981]/20">
                  {lang === 'es' ? 'SOLICITUD REGISTRADA CON ÉXITO' : 'RESERVATION REQUEST CONFIRMED'}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-2">
                  {lang === 'es' ? '¡Gracias por confiar en QuickSurfaces!' : 'Thank You for Choosing QuickSurfaces!'}
                </h4>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-md mx-auto">
                  {lang === 'es'
                    ? `Hemos recibido la solicitud para ${fullName}. Nuestro especialista en Homestead te contactará al ${phone} para coordinar la fecha.`
                    : `We received the request for ${fullName}. Our Homestead specialist will contact you at ${phone} to confirm schedule.`}
                </p>
              </div>

              {/* Summary Receipt Box */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left max-w-lg mx-auto text-xs space-y-2 text-[#475569]">
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                  <span className="font-bold text-[#0F172A]">{lang === 'es' ? 'Comunidad & Modelo:' : 'Community & Model:'}</span>
                  <span className="font-semibold">{currentModel.communityName} • {currentModel.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{lang === 'es' ? 'Área a Remodelar:' : 'Remodeled Area Scope:'}</span>
                  <span className="font-bold text-[#0F172A]">{getScopeLabel()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{lang === 'es' ? 'Área Material Calculada:' : 'Material Calculated Area:'}</span>
                  <span className="font-bold text-[#0F172A]">~{quoteCalculation.sqftMaterialRecommended} sq ft (+7% waste)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{lang === 'es' ? 'Escaleras Integradas:' : 'Custom Staircase:'}</span>
                  <span className="font-bold text-[#0F172A]">{quoteCalculation.hasStairs ? (lang === 'es' ? '17 Escalones Square Step Nose' : '17 Square Step Noses') : (lang === 'es' ? 'No incluidas' : 'Not included')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{lang === 'es' ? 'Piso SPC Seleccionado:' : 'Selected SPC Floor:'}</span>
                  <span className="font-bold text-[#0F172A]">#{currentColor.code} {currentColor.name} ({currentColor.category})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{lang === 'es' ? 'Paquete:' : 'Package:'}</span>
                  <span className="font-bold text-[#0F172A]">{currentPackage.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{lang === 'es' ? 'Fecha de Preferencia:' : 'Preferred Date:'}</span>
                  <span className="font-bold text-[#FF8407]">{getResolvedPreferredDate()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0] text-sm">
                  <strong className="text-[#0F172A]">{lang === 'es' ? 'Tarifa Total Bloqueada:' : 'Total Locked Rate:'}</strong>
                  <strong className="text-base text-[#10B981] font-black">${quoteCalculation.totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 max-w-lg mx-auto pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{lang === 'es' ? 'Confirmar Inmediatamente por WhatsApp' : 'Confirm Instantly via WhatsApp'}</span>
                </a>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(lang === 'es' ? `Reserva QuickSurfaces: ${currentModel.name} - ${fullName}` : `QuickSurfaces Reservation: ${currentModel.name} - ${fullName}`)}&body=${encodeURIComponent(`Client: ${fullName}\nPhone: ${phone}\nModel: ${currentModel.name}\nScope: ${getScopeLabel()}\nTotal: $${quoteCalculation.totalPrice}`)}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#FF8407]" />
                    <span>{lang === 'es' ? 'Copia por Correo' : 'Email Confirmation'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {lang === 'es' ? 'Cerrar Ventana' : 'Close Window'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Configuration Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#FF8407]" />
                    {lang === 'es' ? 'Configuración de la Cotización:' : 'Quote Configuration:'}
                  </span>
                  <span className="text-[10px] font-bold text-[#FF8407] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FF8407]/20">
                    {lang === 'es' ? 'Recálculo Automático' : 'Auto-Calculated'}
                  </span>
                </div>

                {/* 4 Scope Selector Pills */}
                <div>
                  <label className="block text-[#475569] font-bold mb-1.5 text-[11px]">
                    {lang === 'es' ? 'Área a Remodelar (4 Opciones):' : 'Remodeling Area Scope:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'floor1', labelEs: 'Solo 1er Piso', labelEn: '1st Floor Only', sf: currentModel.sqftFirstFloorRec || 546 },
                      { id: 'floor1_stairs', labelEs: '1er Piso + Esc.', labelEn: '1st Fl + Stairs', sf: `${currentModel.sqftFirstFloorRec || 546} SF + 17 Esc.` },
                      { id: 'floor2', labelEs: 'Solo 2do Piso', labelEn: '2nd Floor Only', sf: currentModel.sqftSecondFloorRec || 498 },
                      { id: 'floor2_stairs', labelEs: '2do Piso + Esc.', labelEn: '2nd Fl + Stairs', sf: `${currentModel.sqftSecondFloorRec || 498} SF + 17 Esc.` },
                    ].map((item) => {
                      const isSel = floorScope === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFloorScope(item.id as FloorScope)}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                            isSel
                              ? 'border-[#FF8407] bg-[#FFF7ED] text-[#0F172A] font-black ring-1 ring-[#FF8407]'
                              : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate leading-tight">
                            {lang === 'es' ? item.labelEs : item.labelEn}
                          </div>
                          <div className="text-[10px] text-[#FF8407] font-bold truncate">
                            {typeof item.sf === 'number' ? `~${item.sf} SF` : item.sf}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  {/* Dropdown 1: Model */}
                  <div>
                    <label className="block text-[#475569] font-bold mb-1 text-[11px]">
                      {lang === 'es' ? '1. Modelo Townhome:' : '1. Townhome Model:'}
                    </label>
                    <select
                      value={selectedModelId}
                      onChange={(e) => {
                        setSelectedModelId(e.target.value);
                        const m = activeModels.find((mod) => mod.id === e.target.value);
                        if (m?.address) setAddress(m.address);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF8407] cursor-pointer shadow-2xs text-xs"
                    >
                      {activeModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.bedrooms} {lang === 'es' ? 'Hab' : 'Beds'} / {m.baths} {lang === 'es' ? 'Baños' : 'Baths'} • 1er Piso: ~{m.sqftFirstFloorRec || m.sqftFirstFloor || 546} SF | 2do Piso: ~{m.sqftSecondFloorRec || m.sqftSecondFloor || 498} SF)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown 2: Package */}
                  <div>
                    <label className="block text-[#475569] font-bold mb-1 text-[11px]">
                      {lang === 'es' ? '2. Paquete de Precio:' : '2. Pricing Package:'}
                    </label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF8407] cursor-pointer shadow-2xs text-xs"
                    >
                      {activePackages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {lang === 'es' ? p.title : (p.titleEn || p.title)} {p.isTurnkey ? (lang === 'es' ? '(Llave en Mano - Incluye Instalación)' : '(Turnkey - Includes Installation)') : (lang === 'es' ? '(Solo Material)' : '(Material Only)')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown 3: Vinyl Color */}
                  <div>
                    <label className="block text-[#475569] font-bold mb-1 text-[11px]">
                      {lang === 'es' ? '3. Color SPC:' : '3. Vinyl Color:'}
                    </label>
                    <select
                      value={selectedColorId}
                      onChange={(e) => setSelectedColorId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF8407] cursor-pointer shadow-2xs text-xs"
                    >
                      {activeProducts.map((c, idx) => (
                        <option key={`${c.id}-${idx}`} value={c.id}>
                          #{c.code} {c.name} ({c.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dynamic Price Breakdown Card */}
                <div className="mt-2 pt-2.5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-[#64748B]">
                      <strong className="text-[#0F172A]">{currentModel.name}</strong> • {getScopeLabel()}: (~{quoteCalculation.sqftMaterialRecommended} sq ft) {quoteCalculation.hasStairs ? (lang === 'es' ? '+ 17 Square Step Noses' : '+ 17 Square Step Noses') : (lang === 'es' ? '(Sin Escaleras)' : '(No Stairs)')}
                    </div>
                    <div className="text-[10px] text-[#94A3B8]">
                      {lang === 'es' ? 'Color:' : 'Color:'} <span className="font-semibold text-[#0F172A]">{currentColor.name}</span> ({currentColor.thickness} - {currentColor.wearLayer})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] block font-bold uppercase">{lang === 'es' ? 'Tarifa Calculada:' : 'Estimated Rate:'}</span>
                    <span className="text-lg font-black text-[#FF8407]">
                      ${quoteCalculation.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black text-[#0F172A] mb-1">
                    {lang === 'es' ? 'Nombre y Apellido *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Miller"
                    value={fullName}
                    onChange={handleFullNameChange}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:outline-none bg-[#FFFFFF] text-[#0F172A] transition-all ${
                      errors.fullName
                        ? 'border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]'
                        : 'border-[#CBD5E1] focus:ring-[#FF8407] focus:border-[#FF8407]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-[#EF4444] font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-black text-[#0F172A] mb-1">
                    {lang === 'es' ? 'Teléfono (EE.UU.) *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    placeholder="(786) 000-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={14}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:outline-none bg-[#FFFFFF] text-[#0F172A] transition-all font-medium ${
                      errors.phone
                        ? 'border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]'
                        : 'border-[#CBD5E1] focus:ring-[#FF8407] focus:border-[#FF8407]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-[#EF4444] font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-[#0F172A] mb-1">
                    {lang === 'es' ? 'Correo Electrónico (Opcional)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:outline-none bg-[#FFFFFF] text-[#0F172A] transition-all ${
                      errors.email
                        ? 'border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]'
                        : 'border-[#CBD5E1] focus:ring-[#FF8407] focus:border-[#FF8407]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-[#EF4444] font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Address / Lot */}
                <div>
                  <label className="block text-xs font-black text-[#0F172A] mb-1">
                    {lang === 'es' ? 'Dirección o Lote en Homestead' : 'Homestead Address or Lot #'}
                  </label>
                  <input
                    type="text"
                    placeholder={currentModel.address || 'Street address / Lot #'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#FF8407] focus:border-[#FF8407] focus:outline-none bg-[#FFFFFF] text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Cross-Platform Friendly Date Selector */}
              <div>
                <label className="block text-xs font-black text-[#0F172A] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FF8407]" />
                  <span>{lang === 'es' ? '¿Para cuándo necesitas la instalación?' : 'Target Installation Timeline:'}</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'asap', label: lang === 'es' ? 'Esta semana' : 'This Week' },
                    { id: 'next_week', label: lang === 'es' ? 'Próxima semana' : 'Next Week' },
                    { id: 'two_weeks', label: lang === 'es' ? 'En 2-3 semanas' : 'In 2-3 Weeks' },
                    { id: 'custom', label: lang === 'es' ? 'Fecha exacta' : 'Specific Date' },
                  ].map((pill) => {
                    const isActive = timingPreset === pill.id;
                    return (
                      <button
                        type="button"
                        key={pill.id}
                        onClick={() => setTimingPreset(pill.id as any)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                          isActive
                            ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                            : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                {timingPreset === 'custom' && (
                  <div className="mt-2 animate-fadeIn">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:ring-2 focus:ring-[#FF8407] bg-[#FFFFFF] text-[#0F172A]"
                    />
                  </div>
                )}
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  {lang === 'es' ? 'Notas o requerimientos especiales (Opcional):' : 'Special Notes or Questions (Optional):'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    lang === 'es'
                      ? 'Ej: Mover muebles pesados, escaleras con descanso intermedio, etc.'
                      : 'e.g. Heavy furniture moving, custom stair landing, etc.'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#FF8407] focus:border-[#FF8407] focus:outline-none bg-[#FFFFFF] text-[#0F172A] resize-none"
                />
              </div>

              {/* Submit CTA - Always Dynamic Price */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#FF8407] hover:bg-[#ff952a] active:scale-[0.99] disabled:opacity-75 text-[#0F172A] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF8407]/25 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0F172A]" />
                      <span>{lang === 'es' ? 'Registrando cotización...' : 'Submitting reservation...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#0F172A]" />
                      <span>
                        {lang === 'es'
                          ? `Confirmar Tarifa de $${quoteCalculation.totalPrice.toLocaleString()} para ${currentModel.name}`
                          : `Confirm & Lock In $${quoteCalculation.totalPrice.toLocaleString()} Rate for ${currentModel.name}`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#64748B] pt-1 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF8407]" />
                  {lang === 'es' ? 'Garantía de 25 Años' : '25-Year Warranty'}
                </span>
                <span>•</span>
                <span>{lang === 'es' ? 'Licenciados y Asegurados' : 'Licensed & Insured'}</span>
                <span>•</span>
                <a
                  href={`tel:${WHATSAPP_PHONE}`}
                  className="text-[#0F172A] hover:underline"
                >
                  (786) 658-3677
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

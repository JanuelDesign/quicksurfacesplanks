import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { TESTIMONIALS, TestimonialItem } from '../data/testimonials';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState<number>(0);
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ src: string; title: string } | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = TESTIMONIALS;

  // Auto-cycle carousel every 5s if not paused
  useEffect(() => {
    if (!isOpen || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isOpen, isPaused, testimonials.length]);

  const handleNext = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!isOpen) return null;

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-[#0F172A] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[92vh] font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF8407] text-white flex items-center justify-center font-black text-xs shadow-sm">
              QS
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                {lang === 'es' ? 'Sobre Quick Surfaces' : 'About Quick Surfaces'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {lang === 'es'
                  ? 'Especialistas en pisos SPC para condominios en Homestead & Miami, FL'
                  : 'SPC Luxury Vinyl Specialists for Townhomes in Homestead & Miami, FL'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-[#FF8407] block">+350</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#64748B]">
                {lang === 'es' ? 'Casas Instaladas' : 'Homes Installed'}
              </span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-[#FF8407] block">25 {lang === 'es' ? 'Años' : 'Years'}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#64748B]">
                {lang === 'es' ? 'Garantía de Fábrica' : 'Factory Warranty'}
              </span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-[#FF8407] block">5.0 ★</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#64748B]">
                {lang === 'es' ? 'Calificación Google' : 'Google Rating'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs sm:text-sm text-[#475569] leading-relaxed">
            <p>
              {lang === 'es' ? (
                <>
                  En <strong>Quick Surfaces</strong> nos especializamos en la renovación y modernización de pisos para los segundos pisos y escaleras de condominios residenciales en <strong>Homestead, Kendall y Miami-Dade</strong> (incluyendo comunidades como Siena Reserve, Altamira, Terra Sol, Luminara y más).
                </>
              ) : (
                <>
                  At <strong>Quick Surfaces</strong>, we specialize in high-precision luxury vinyl flooring (SPC) renovations for second stories and custom staircases across residential communities in <strong>Homestead, Kendall, and Miami-Dade</strong>.
                </>
              )}
            </p>
            <p>
              {lang === 'es' ? (
                <>
                  Contamos con los planos arquitectónicos calibrados y cálculos exactos de metraje para cada modelo de vivienda, lo que nos permite ofrecerte un <strong>precio cerrado garantizado</strong> sin desperdicios innecesarios ni costos ocultos.
                </>
              ) : (
                <>
                  We maintain calibrated architectural floor plan dimensions and exact square footage takeoffs for each home model, delivering a <strong>guaranteed turnkey price</strong> with zero hidden fees or unexpected extras.
                </>
              )}
            </p>
          </div>

          {/* ========================================================
              TESTIMONIALS CAROUSEL SECTION
          ======================================================== */}
          <div
            className="bg-[#F8FAFC] p-4 sm:p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Header & Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/30">
                  <Star className="w-4 h-4 fill-[#FF8407]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase tracking-wider">
                    {lang === 'es' ? 'Testimonios & Clientes Reales' : 'Real Client Testimonials'}
                  </h4>
                  <span className="text-[10px] text-[#64748B]">
                    {lang === 'es'
                      ? `Opinión ${currentTestimonialIndex + 1} de ${testimonials.length}`
                      : `Review ${currentTestimonialIndex + 1} of ${testimonials.length}`}
                  </span>
                </div>
              </div>

              {/* Carousel Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer shadow-2xs"
                  aria-label="Anterior testimonio"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer shadow-2xs"
                  aria-label="Siguiente testimonio"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Testimonial Active Slide Display */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              {/* Image Column with Zoom Feature */}
              <div className="sm:col-span-5 relative group rounded-xl overflow-hidden bg-[#0F172A] border border-[#CBD5E1] h-48 sm:h-52 flex items-center justify-center">
                <img
                  src={currentTestimonial.localUrl}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== currentTestimonial.githubUrl && currentTestimonial.githubUrl) {
                      target.src = currentTestimonial.githubUrl;
                    } else {
                      // If remote also fails, show an architectural fallback
                      target.src = 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                  alt={currentTestimonial.clientName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

                {/* Badge Overlay */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#FF8407] text-black text-[9px] font-black uppercase shadow-xs">
                  {lang === 'es' ? currentTestimonial.tag : currentTestimonial.tagEn}
                </span>

                {/* Expand Image Button */}
                <button
                  onClick={() =>
                    setActiveLightboxImg({
                      src: currentTestimonial.localUrl || currentTestimonial.githubUrl,
                      title: currentTestimonial.clientName,
                    })
                  }
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/80 text-white hover:bg-black transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                  title="Ver en pantalla completa"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                  <span>{lang === 'es' ? 'Ver' : 'Zoom'}</span>
                </button>
              </div>

              {/* Text / Quote Column */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-black text-[#0F172A] ml-1">5.0 / 5.0</span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm italic text-[#1E293B] leading-relaxed">
                    "{lang === 'es' ? currentTestimonial.quote : currentTestimonial.quoteEn}"
                  </p>
                </div>

                {/* Client Info Bar */}
                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-[#0F172A]">
                      {currentTestimonial.clientName}
                    </h5>
                    <span className="text-[11px] text-[#64748B]">
                      {lang === 'es' ? currentTestimonial.role : currentTestimonial.roleEn} •{' '}
                      {currentTestimonial.community}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Thumbnail dots selector */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {testimonials.map((t, idx) => {
                const isActive = idx === currentTestimonialIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      isActive ? 'w-6 h-2 bg-[#FF8407]' : 'w-2 h-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                    }`}
                    aria-label={`Ver testimonio ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Key Advantages */}
          <div className="space-y-2 bg-[#FFF7ED] p-4 rounded-2xl border border-[#FF8407]/30">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF8407] mb-2">
              {lang === 'es' ? '¿Por qué elegir Quick Surfaces?' : 'Why Choose Quick Surfaces?'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0F172A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'es' ? 'Instalación rápida garantizada (2 días)' : 'Guaranteed rapid turnkey install (2 days)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'es' ? 'Mano de obra certificada y materiales premium' : 'Certified skilled labor & premium materials'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'es' ? 'Escaleras perfectas al ras (Flush Stair Nose)' : 'Seamless flush stair nosings with zero lips'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'es' ? 'Muestras físicas directas a tu casa' : 'Physical plank samples delivered to your door'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#0F172A]">
              <MapPin className="w-4 h-4 text-[#FF8407] shrink-0" />
              <span>Homestead, Kendall & Miami-Dade County, Florida</span>
            </div>
            <div className="flex items-center gap-2 text-[#0F172A]">
              <Phone className="w-4 h-4 text-[#FF8407] shrink-0" />
              <span>(786) 658-3677</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-3">
          <a
            href={`https://wa.me/17866583677?text=${encodeURIComponent(
              lang === 'es'
                ? 'Hola Quick Surfaces! Quiero más información sobre la renovación de pisos SPC'
                : 'Hello Quick Surfaces! I would like more information about SPC luxury vinyl floor renovation'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'es' ? 'Hablar por WhatsApp' : 'Chat on WhatsApp'}</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold hover:bg-[#F1F5F9] transition-all cursor-pointer"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>

      {/* Lightbox for Testimonial Zoom */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0F172A] rounded-3xl p-4 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <h4 className="text-white font-black text-sm sm:text-base">
                {activeLightboxImg.title}
              </h4>
              <button
                onClick={() => setActiveLightboxImg(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={activeLightboxImg.src}
              alt={activeLightboxImg.title}
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

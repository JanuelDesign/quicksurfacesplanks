import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle2, Phone, MessageCircle, MapPin } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-[#0F172A] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF8407] text-white flex items-center justify-center font-black text-xs">
              QS
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F172A]">Sobre Quick Surfaces</h3>
              <p className="text-xs text-[#64748B]">Especialistas en pisos SPC para condominios en Homestead, FL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xl font-black text-[#FF8407] block">+350</span>
              <span className="text-[10px] font-bold text-[#64748B]">Casas Instaladas</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xl font-black text-[#FF8407] block">25 Años</span>
              <span className="text-[10px] font-bold text-[#64748B]">Garantía Fábrica</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-xl font-black text-[#FF8407] block">5.0 ★</span>
              <span className="text-[10px] font-bold text-[#64748B]">Calificación Google</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs sm:text-sm text-[#475569] leading-relaxed">
            <p>
              En <strong>Quick Surfaces</strong> nos especializamos en la renovación de pisos para los segundos pisos de la comunidad <strong>Siena Reserve (Adora Collection)</strong>.
            </p>
            <p>
              Tenemos los planos y cálculos exactos de material para los modelos <strong>Bandol, Casis, Monte Carlo, Reserve y Vence</strong>, lo que nos permite ofrecerte un precio final garantizado sin desperdicios innecesarios ni sobrecostos ocultos.
            </p>
          </div>

          {/* Key Advantages */}
          <div className="space-y-2 bg-[#FFF7ED] p-4 rounded-2xl border border-[#FF8407]/30">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF8407] mb-2">
              ¿Por qué elegir Quick Surfaces?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0F172A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instalación rápida garantizada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mano de obra certificada y materiales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Escaleras perfectas (Flush Stair Nose)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Muestra física a la puerta de tu casa</span>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#0F172A]">
              <MapPin className="w-4 h-4 text-[#FF8407] shrink-0" />
              <span>Siena Reserve, Homestead, Florida</span>
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
            href="https://wa.me/17866583677?text=Hola%20Quick%20Surfaces!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20oferta%20para%20Siena%20Reserve"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hablar por WhatsApp</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold hover:bg-[#F1F5F9] transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

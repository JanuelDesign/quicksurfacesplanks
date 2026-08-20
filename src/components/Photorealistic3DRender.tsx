import React, { useState } from 'react';
import { FloorPlanModel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Maximize2, X, Box, CheckCircle2 } from 'lucide-react';
import sample3dRender from '../assets/images/dollhouse_3d_render_1787189566024.jpg';

interface Photorealistic3DRenderProps {
  model: FloorPlanModel;
}

export const Photorealistic3DRender: React.FC<Photorealistic3DRenderProps> = ({ model }) => {
  const { lang } = useLanguage();
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const hasCustomRender = Boolean(model.render3DImage && model.render3DImage.trim().length > 0);
  const renderSrc = hasCustomRender ? model.render3DImage! : sample3dRender;

  return (
    <div className="bg-[#FFFFFF] text-[#111827] rounded-3xl p-4 sm:p-7 border border-[#E2E8F0] shadow-xl relative overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#FF8407] text-[#000000] text-xs font-black tracking-wider uppercase">
              {lang === 'es' ? 'Render 3D Fotorrealista' : 'Photorealistic 3D Render'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#64748B]">
              {lang === 'es' ? 'Vista Dollhouse Comercial' : 'Commercial Dollhouse View'}
            </span>
          </div>
          <h3 className="text-xl font-black text-[#000000] tracking-tight mt-1.5">
            {lang === 'es' ? `Render 3D: Modelo ${model.name}` : `3D Dollhouse Render: Model ${model.name}`}
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {model.communityName} · {model.collection} • {lang === 'es' ? 'Corte tipo dollhouse con mobiliario, recámaras y piso continuo de vinil SPC' : 'Dollhouse cutaway with bedroom furniture, natural depth and continuous SPC vinyl'}
          </p>
        </div>

        {hasCustomRender && (
          <button
            onClick={() => setIsZoomed(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#000000] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
            <span>{lang === 'es' ? 'Ampliar Render' : 'Expand View'}</span>
          </button>
        )}
      </div>

      {/* Main Visual Display */}
      {hasCustomRender ? (
        <>
          <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] group shadow-inner">
            <img
              src={renderSrc}
              alt={`Render 3D Fotorrealista - ${model.name}`}
              className="w-full h-auto max-h-[520px] object-cover sm:object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Badge Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8407]" />
                <span>{lang === 'es' ? 'Render Oficial de Marketing' : 'Official Marketing 3D Render'}</span>
              </div>
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-[#CBD5E1] text-[10px] font-medium">
                {model.name} · {model.floorLevel || '2nd Floor'}
              </span>
            </div>
          </div>

          {/* Specs / Info Bar below render */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
              <span>{lang === 'es' ? 'Piso continuo de vinil SPC sin molduras T intermedias' : 'Continuous SPC vinyl without intermediate T-moldings'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
              <span>{lang === 'es' ? 'Escaleras integradas con nosing a tono' : 'Integrated matching stair nosings'}</span>
            </div>
          </div>
        </>
      ) : (
        /* Polished Placeholder when 3D render is pending from design team */
        <div className="relative rounded-2xl p-8 sm:p-12 text-center bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] border border-[#FF8407]/30 text-[#FF8407] flex items-center justify-center mb-4 shadow-sm">
            <Box className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2E8F0] text-[#475569] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8407]" />
            <span>{lang === 'es' ? 'Render 3D Próximamente' : '3D Render Coming Soon'}</span>
          </div>

          <h4 className="text-lg font-black text-[#0F172A] mb-1">
            {lang === 'es'
              ? `El render fotorrealista 3D para el modelo ${model.name} está en preparación`
              : `The 3D photorealistic render for model ${model.name} is currently in production`}
          </h4>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-lg leading-relaxed mb-5">
            {lang === 'es'
              ? 'Nuestro equipo de diseño está finalizando el corte fotorrealista tipo dollhouse con mobiliario y sombras reales. Mientras tanto, puedes usar el Plano 2D Interactivo superior para ver dimensiones exactas y probar acabados en tiempo real.'
              : 'Our design studio is finalizing the dollhouse cutaway view with realistic furniture, depth, and lighting. In the meantime, use the Interactive 2D Floor Plan above to inspect exact measurements and live swatches.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
              <span>{model.sqftNet} SF {lang === 'es' ? 'Área Neta' : 'Net Area'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
              <span>{model.stepsCount} {lang === 'es' ? 'Escalones a Medida' : 'Custom Stairs'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0F172A] rounded-3xl p-4 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <div>
                <h4 className="text-white font-black text-base">
                  {lang === 'es' ? `Render 3D Fotorrealista: ${model.name}` : `3D Dollhouse Render: ${model.name}`}
                </h4>
                <p className="text-xs text-[#94A3B8]">
                  {model.communityName} · {model.collection}
                </p>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={renderSrc}
              alt={`Render 3D Fotorrealista - ${model.name}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

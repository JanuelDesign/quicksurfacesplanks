import React, { useState } from 'react';
import { FloorPlanModel, FloorScope } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Maximize2,
  X,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from 'lucide-react';

import bModelRender from '../assets/images/floor2_dollhouse_3d_1787536546939.jpg';
import cModelRender from '../assets/images/c_model_render3d_1787747958255.jpg';
import mModelRender from '../assets/images/m_model_render3d_1787747972884.jpg';
import rModelRender from '../assets/images/r_model_render3d_1787747986438.jpg';
import vModelRender from '../assets/images/v_model_render3d_1787747999892.jpg';

interface Photorealistic3DRenderProps {
  model: FloorPlanModel;
  floorScope?: FloorScope;
  onChangeFloorScope?: (scope: FloorScope) => void;
}

const MODEL_RENDER_MAP: Record<string, string> = {
  'b-model': bModelRender,
  'siena-reserve_b-model': bModelRender,
  'c-model': cModelRender,
  'siena-reserve_c-model': cModelRender,
  'm-model': mModelRender,
  'siena-reserve_m-model': mModelRender,
  'r-model': rModelRender,
  'siena-reserve_r-model': rModelRender,
  'v-model': vModelRender,
  'siena-reserve_v-model': vModelRender,
};

export const Photorealistic3DRender: React.FC<Photorealistic3DRenderProps> = ({
  model,
}) => {
  const { lang } = useLanguage();
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  // Dynamically select the 2nd floor 3D dollhouse render for the active model
  const renderSrc = MODEL_RENDER_MAP[model.slug] || MODEL_RENDER_MAP[model.id] || bModelRender;

  const floor2Rooms = model.secondFloorRooms || [
    { name: "Owner's Suite", dimensions: "12' 0\" x 10' 10\"", sqft: 130 },
    { name: 'Walk-In Closet', dimensions: 'Standard', sqft: 36 },
    { name: 'Bedroom 2', dimensions: "12' 0\" x 10' 0\"", sqft: 120 },
    { name: '15 Flush Stair Noses & Hall', dimensions: '15 Treads', sqft: 101 },
  ];

  return (
    <div id="render-3d-section" className="bg-[#FFFFFF] text-[#111827] rounded-3xl p-4 sm:p-7 border border-[#CBD5E1] shadow-xl relative overflow-hidden font-sans">
      {/* Top Bar with Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E2E8F0] relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#000000] text-[#FF8407] text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF8407]" />
              {lang === 'es' ? 'Render 3D Fotorrealista' : 'Photorealistic 3D Render'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#64748B]">
              {lang === 'es' ? '2do Piso con 15 Escalones' : '2nd Floor with 15 Stairs'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#000000] tracking-tight mt-1.5">
            {lang === 'es' ? `Render 3D: Modelo ${model.name}` : `3D Render: Model ${model.name}`}
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
            {model.communityName} · {model.collection} • {lang === 'es' ? 'Corte Dollhouse con recámaras, pasillo continuo y 15 escalones Flush Stair Nose' : 'Dollhouse cutaway showcasing bedrooms, seamless hallway, and 15 Flush Stair Nose steps'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setZoomedImage({
            src: renderSrc,
            title: `${model.name} — Render 3D 2do Piso & 15 Escalones`,
            subtitle: `Siena Reserve Townhomes • Owner's Suite, Bedroom 2, Pasillo y 15 Escalones Flush Stair Nose`,
          })}
          className="px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md self-start sm:self-center shrink-0"
        >
          <Maximize2 className="w-4 h-4 text-[#FF8407]" />
          <span>{lang === 'es' ? 'Ver en Pantalla Completa' : 'Full Screen Zoom'}</span>
        </button>
      </div>

      {/* Render 3D Main Image Frame - Clean and Unobstructed */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#1E293B] bg-[#0A0A0B] shadow-2xl group">
        <img
          key={model.id}
          src={renderSrc}
          alt={`Render 3D 2do Piso y Escaleras - ${model.name}`}
          className="w-full h-[320px] sm:h-[420px] md:h-[480px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Top Floating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-black border border-white/20 flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF8407] animate-pulse"></span>
            <span>{model.name} · {lang === 'es' ? '2do Piso + 15 Escalones' : '2nd Floor + 15 Stairs'}</span>
          </span>
        </div>
      </div>

      {/* External Seamless Continuous Flow & Room Breakdown Bar (Outside Image) */}
      <div className="mt-4 p-4 rounded-2xl bg-[#0F172A] text-white border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-[#FF8407] uppercase tracking-wider mr-1">
            {lang === 'es' ? 'Ambientes 2do Piso:' : '2nd Floor Rooms:'}
          </span>
          {floor2Rooms.map((r, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-medium border border-white/10">
              {r.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black self-start md:self-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'es' ? 'Piso Continuo Sin Transiciones' : 'Seamless Continuous Flow'}</span>
        </div>
      </div>

      {/* Certified Partner Disclaimer Box */}
      <div className="mt-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-start gap-3 text-xs text-[#334155]">
        <ShieldCheck className="w-5 h-5 text-[#FF8407] mt-0.5 shrink-0" />
        <div>
          <strong className="text-[#0F172A] block font-black">
            {lang === 'es'
              ? 'Nota de Instalación y Servicios Aliados'
              : 'Installation & Expert Partner Services Note'}
          </strong>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            {lang === 'es'
              ? 'Instalaciones, remodelaciones y remoción de alfombra / rodapiés son realizadas por nuestros aliados expertos certificados. Los precios de mano de obra y material son transparentes y garantizados tras visita técnica de confirmación.'
              : 'Installations, remodeling, and carpet / baseboard removal are performed by our qualified certified expert partners. Material and labor pricing is transparent and guaranteed following in-home measurement verification.'}
          </p>
        </div>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="bg-[#0F172A] rounded-3xl p-4 sm:p-6 max-w-5xl w-full border border-slate-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700 text-white">
              <div>
                <h4 className="font-black text-lg text-white">{zoomedImage.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{zoomedImage.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black max-h-[75vh] flex items-center justify-center">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

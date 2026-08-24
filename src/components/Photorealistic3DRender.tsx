import React, { useState, useEffect } from 'react';
import { FloorPlanModel, FloorScope } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Maximize2,
  X,
  Layers,
  CheckCircle2,
  Columns,
  Eye,
  Home,
} from 'lucide-react';

import defaultBothRenders from '../assets/images/dollhouse_3d_render_1787189566024.jpg';
import defaultFloor1Render from '../assets/images/floor1_dollhouse_3d_1787536531871.jpg';
import defaultFloor2Render from '../assets/images/floor2_dollhouse_3d_1787536546939.jpg';

interface Photorealistic3DRenderProps {
  model: FloorPlanModel;
  floorScope?: FloorScope;
  onChangeFloorScope?: (scope: FloorScope) => void;
}

type RenderViewMode = 'both' | 'floor1' | 'floor2' | 'dual';

export const Photorealistic3DRender: React.FC<Photorealistic3DRenderProps> = ({
  model,
  floorScope,
  onChangeFloorScope,
}) => {
  const { lang } = useLanguage();

  // Internal tab state, synchronized with floorScope when prop changes
  const [activeTab, setActiveTab] = useState<RenderViewMode>(() => {
    if (floorScope === 'floor1') return 'floor1';
    if (floorScope === 'floor2') return 'floor2';
    return 'both';
  });

  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  useEffect(() => {
    if (floorScope) {
      if (floorScope === 'floor1') setActiveTab('floor1');
      else if (floorScope === 'floor2') setActiveTab('floor2');
      else if (floorScope === 'both' && activeTab !== 'dual') setActiveTab('both');
    }
  }, [floorScope]);

  const handleTabChange = (tab: RenderViewMode) => {
    setActiveTab(tab);
    if (onChangeFloorScope) {
      if (tab === 'floor1') onChangeFloorScope('floor1');
      else if (tab === 'floor2') onChangeFloorScope('floor2');
      else if (tab === 'both') onChangeFloorScope('both');
    }
  };

// Robust image source resolution: prioritizes imported assets for local/fallback resilience
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (key: string) => {
    setImgErrors(prev => ({ ...prev, [key]: true }));
  };

  const floor1Src = !imgErrors['floor1'] && model.render3DImageFloor1 ? model.render3DImageFloor1 : defaultFloor1Render;
  const floor2Src = !imgErrors['floor2'] && model.render3DImageFloor2 ? model.render3DImageFloor2 : defaultFloor2Render;
  const bothSrc = !imgErrors['both'] && (model.render3DImageBoth || model.render3DImage) ? (model.render3DImageBoth || model.render3DImage) : defaultBothRenders;

  // Active rooms for current view
  const floor1Rooms = model.firstFloorRooms || [
    { name: 'Covered Entry & Foyer', dimensions: "6' 0\" x 14' 0\"", sqft: 84 },
    { name: 'Family Room & Dining', dimensions: "14' 2\" x 22' 0\"", sqft: 260 },
    { name: 'Chef Kitchen Island', dimensions: "7' 10\" x 11' 4\"", sqft: 89 },
    { name: 'Bedroom 3 / Flex Room', dimensions: "10' 0\" x 11' 10\"", sqft: 118 },
  ];

  const floor2Rooms = model.secondFloorRooms || [
    { name: "Owner's Suite", dimensions: "12' 0\" x 10' 10\"", sqft: 130 },
    { name: 'Walk-In Closet', dimensions: 'Standard', sqft: 36 },
    { name: 'Bedroom 2', dimensions: "12' 0\" x 10' 0\"", sqft: 120 },
    { name: '15 Flush Stairs & Hall', dimensions: '15 Treads', sqft: 101 },
  ];

  return (
    <div id="render-3d-section" className="bg-[#FFFFFF] text-[#111827] rounded-3xl p-4 sm:p-7 border border-[#E2E8F0] shadow-xl relative overflow-hidden font-sans">
      {/* Top Bar with Badge, Title, and Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-5 border-b border-[#E2E8F0] relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF8407] text-[#000000] text-xs font-black tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              {lang === 'es' ? 'Render 3D Fotorrealista' : 'Photorealistic 3D Render'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#64748B]">
              {lang === 'es' ? 'Corte Dollhouse Arquitectónico' : 'Architectural Dollhouse Cutaway'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#000000] tracking-tight mt-1.5">
            {lang === 'es' ? `Render 3D Interactivo: Modelo ${model.name}` : `Interactive 3D Render: Model ${model.name}`}
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
            {model.communityName} · {model.collection} • {lang === 'es' ? 'Visualización fotorrealista con piso continuo de vinil SPC, mobiliario y profundidad real' : 'Photorealistic visualization with continuous SPC vinyl flooring, furniture, and realistic lighting'}
          </p>
        </div>

        {/* Floor Selection Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] self-start lg:self-center">
          <button
            type="button"
            onClick={() => handleTabChange('both')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'both'
                ? 'bg-[#000000] text-[#FF8407] shadow-sm'
                : 'text-[#475569] hover:text-[#000000] hover:bg-white/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Casa Completa' : 'Full Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('floor1')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'floor1'
                ? 'bg-[#000000] text-[#FF8407] shadow-sm'
                : 'text-[#475569] hover:text-[#000000] hover:bg-white/60'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#FF8407] text-black flex items-center justify-center text-[10px] font-black">1</span>
            <span>{lang === 'es' ? '1er Piso (Planta Baja)' : '1st Floor'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('floor2')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'floor2'
                ? 'bg-[#000000] text-[#FF8407] shadow-sm'
                : 'text-[#475569] hover:text-[#000000] hover:bg-white/60'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#FF8407] text-black flex items-center justify-center text-[10px] font-black">2</span>
            <span>{lang === 'es' ? '2do Piso (Planta Alta)' : '2nd Floor'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('dual')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dual'
                ? 'bg-[#FF8407] text-[#000000] shadow-sm'
                : 'text-[#475569] hover:text-[#000000] hover:bg-white/60'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Ver Ambos (Dual)' : 'Dual View'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          RENDER DISPLAY SECTION
      ======================================================== */}

      {/* 1. DUAL VIEW (Both floors side by side) */}
      {activeTab === 'dual' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Floor 1 Box */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] group shadow-inner flex flex-col justify-between">
              <div className="relative">
                <img
                  src={floor1Src}
                  alt={`Render 3D 1er Piso - ${model.name}`}
                  className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => handleImgError('floor1')}
                />
                <button
                  type="button"
                  onClick={() => setZoomedImage({
                    src: floor1Src,
                    title: `${model.name} — 1er Piso (Planta Baja)`,
                    subtitle: `Área Recomendada: ${model.sqftFirstFloorRec || 560} SF · Gran Sala, Cocina abierta, Comedor y Foyer`,
                  })}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                  <span>{lang === 'es' ? 'Ampliar' : 'Zoom'}</span>
                </button>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
                  <span>1er Piso · ~{model.sqftFirstFloorRec || 560} SF</span>
                </div>
              </div>

              {/* Room tags */}
              <div className="p-3 bg-[#1E293B] border-t border-white/10 flex flex-wrap gap-1.5">
                {floor1Rooms.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-[#E2E8F0] text-[11px] font-medium">
                    {r.name} ({r.dimensions})
                  </span>
                ))}
              </div>
            </div>

            {/* Floor 2 Box */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] group shadow-inner flex flex-col justify-between">
              <div className="relative">
                <img
                  src={floor2Src}
                  alt={`Render 3D 2do Piso - ${model.name}`}
                  className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => handleImgError('floor2')}
                />
                <button
                  type="button"
                  onClick={() => setZoomedImage({
                    src: floor2Src,
                    title: `${model.name} — 2do Piso (Planta Alta)`,
                    subtitle: `Área Recomendada: ${model.sqftSecondFloorRec || 520} SF + 15 Escalones Flush Stair Nose`,
                  })}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                  <span>{lang === 'es' ? 'Ampliar' : 'Zoom'}</span>
                </button>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  <span>2do Piso · ~{model.sqftSecondFloorRec || 520} SF + 15 Escalones</span>
                </div>
              </div>

              {/* Room tags */}
              <div className="p-3 bg-[#1E293B] border-t border-white/10 flex flex-wrap gap-1.5">
                {floor2Rooms.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-[#E2E8F0] text-[11px] font-medium">
                    {r.name} ({r.dimensions})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOOR 1 INDIVIDUAL VIEW */}
      {activeTab === 'floor1' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] group shadow-inner">
            <img
              src={floor1Src}
              alt={`Render 3D 1er Piso - ${model.name}`}
              className="w-full h-auto max-h-[500px] object-cover sm:object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => handleImgError('floor1')}
            />

            {/* Top controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomedImage({
                  src: floor1Src,
                  title: `${model.name} — Render 3D 1er Piso (Planta Baja)`,
                  subtitle: `Área Recomendada: ${model.sqftFirstFloorRec || 560} SF · Gran Sala, Cocina, Comedor y Foyer`,
                })}
                className="px-3.5 py-1.5 rounded-xl bg-[#000000]/80 hover:bg-[#000000] border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                <span>{lang === 'es' ? 'Pantalla Completa' : 'Fullscreen'}</span>
              </button>
            </div>

            {/* Badge Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407]"></span>
                <span>{lang === 'es' ? '1er Piso · Planta Baja Completa' : '1st Floor · Ground Level'}</span>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-[#CBD5E1] text-[11px] font-medium">
                {model.sqftFirstFloorRec || 560} SF Recomendados
              </span>
            </div>
          </div>

          {/* Quick room pill highlights */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#000000]">{lang === 'es' ? 'Ambientes 1er Piso:' : '1st Floor Rooms:'}</span>
              {floor1Rooms.map((r, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#334155] font-semibold">
                  {r.name} · {r.dimensions}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. FLOOR 2 INDIVIDUAL VIEW */}
      {activeTab === 'floor2' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] group shadow-inner">
            <img
              src={floor2Src}
              alt={`Render 3D 2do Piso - ${model.name}`}
              className="w-full h-auto max-h-[500px] object-cover sm:object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => handleImgError('floor2')}
            />

            {/* Top controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomedImage({
                  src: floor2Src,
                  title: `${model.name} — Render 3D 2do Piso (Planta Alta)`,
                  subtitle: `Área Recomendada: ${model.sqftSecondFloorRec || 520} SF + 15 Escalones con Nosing al Ras`,
                })}
                className="px-3.5 py-1.5 rounded-xl bg-[#000000]/80 hover:bg-[#000000] border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                <span>{lang === 'es' ? 'Pantalla Completa' : 'Fullscreen'}</span>
              </button>
            </div>

            {/* Badge Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
                <span>{lang === 'es' ? '2do Piso · Planta Alta con Habitaciones' : '2nd Floor · Upper Bedrooms Level'}</span>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-[#CBD5E1] text-[11px] font-medium">
                {model.sqftSecondFloorRec || 520} SF + 15 Escalones
              </span>
            </div>
          </div>

          {/* Quick room pill highlights */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#000000]">{lang === 'es' ? 'Ambientes 2do Piso:' : '2nd Floor Rooms:'}</span>
              {floor2Rooms.map((r, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#334155] font-semibold">
                  {r.name} · {r.dimensions}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTH FLOORS (Full Dollhouse Perspective) */}
      {activeTab === 'both' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] group shadow-inner">
            <img
              src={bothSrc}
              alt={`Render 3D Dollhouse Completo - ${model.name}`}
              className="w-full h-auto max-h-[520px] object-cover sm:object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => handleImgError('both')}
            />

            {/* Top controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomedImage({
                  src: bothSrc,
                  title: `${model.name} — Render 3D Dollhouse Casa Completa`,
                  subtitle: `Área Total Recomendada: ${model.sqftMaterialRecommended || 1080} SF (1er y 2do Piso con 15 Escalones)`,
                })}
                className="px-3.5 py-1.5 rounded-xl bg-[#000000]/80 hover:bg-[#000000] border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FF8407]" />
                <span>{lang === 'es' ? 'Pantalla Completa' : 'Fullscreen'}</span>
              </button>
            </div>

            {/* Badge Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8407]" />
                <span>{lang === 'es' ? 'Render Oficial de Marketing — Casa Completa' : 'Official Marketing 3D Render — Full Home'}</span>
              </div>
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/10 text-[#CBD5E1] text-[10px] font-medium">
                {model.name} · {model.sqftMaterialRecommended || 1080} SF Material Total
              </span>
            </div>
          </div>

          {/* Quick Dual Switch prompt */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FF8407]/30 text-xs text-[#000000]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8407] shrink-0" />
              <span className="font-semibold">
                {lang === 'es'
                  ? '¿Quieres ver los detalles de cada planta por separado? Usa los botones superiores "1er Piso", "2do Piso" o "Ver Ambos (Dual)".'
                  : 'Want to view each floor individually? Click the "1st Floor", "2nd Floor", or "Dual View" buttons above.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleTabChange('dual')}
              className="px-3 py-1 rounded-xl bg-[#000000] text-[#FF8407] font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {lang === 'es' ? 'Ver Pisos en Paralelo' : 'View Side-by-Side'}
            </button>
          </div>
        </div>
      )}

      {/* Specs / Quality Warranty footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] pt-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
          <span>{lang === 'es' ? 'Instalación continua de piso vinílico SPC sin transiciones incómodas' : 'Continuous SPC vinyl without intermediate T-moldings'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
          <span>{lang === 'es' ? '15 escalones a medida con Flush Stair Nose a juego' : '15 custom steps with matching flush stair nosings'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
          <span>{lang === 'es' ? 'Remoción y reinstalación cuidadosa de rodapiés (baseboards)' : 'Baseboard removal & precision reinstallation'}</span>
        </div>
      </div>

      {/* ========================================================
          FULLSCREEN LIGHTBOX MODAL
      ======================================================== */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0F172A] rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h4 className="text-white font-black text-lg">
                  {zoomedImage.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                  {zoomedImage.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.title}
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

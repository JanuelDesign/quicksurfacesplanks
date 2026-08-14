import React, { useState } from 'react';
import { FloorPlanModel, FlooringProduct } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { HorizontalRender3D } from './HorizontalRender3D';
import { FloorPlanSVG } from './FloorPlanSVG';
import {
  Sparkles,
  CheckCircle2,
  Phone,
  Ruler,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Box,
  Truck,
  Eye,
} from 'lucide-react';

interface ModelHeaderAndRenderProps {
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  onOpenBooking: () => void;
  onSelectProduct: (product: FlooringProduct) => void;
}

export const ModelHeaderAndRender: React.FC<ModelHeaderAndRenderProps> = ({
  model,
  selectedProduct,
  onOpenBooking,
  onSelectProduct,
}) => {
  const { lang, t } = useLanguage();
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  return (
    <div className="bg-[#FFFFFF] text-[#111827] pt-8 pb-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Model Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#64748B]">{lang === 'es' ? 'Comunidad:' : 'Community:'}</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-black text-[#000000]">
              {model.communityName}
            </span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="font-bold text-[#64748B]">{lang === 'es' ? 'Modelo:' : 'Model:'}</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#000000] text-[#FF8407] font-black">
              {model.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:7866583677"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#000000] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF8407]" />
              <span>(786) 658-3677</span>
            </a>
          </div>
        </div>

        {/* Hero Title & Turnkey Price Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('residentialProject')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#000000] tracking-tight leading-tight">
              {model.name}{' '}
              <span className="text-[#FF8407]">
                {lang === 'es' ? 'Segundo Piso' : '2nd Floor Plan'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
              {t('residentialModelDesc')}
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#000000]">
                📐 530 sq ft Net Area
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#000000]">
                🪜 15 Custom Step Staircase
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#FF8407]">
                🛡️ 20-22 Mils Wear Layer
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#000000]">
                💧 100% Waterproof SPC
              </span>
            </div>
          </div>

          {/* Turnkey Quick Quote Card */}
          <div className="lg:col-span-4 bg-[#000000] text-[#FFFFFF] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden border border-[#1E293B]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8407]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8407]">
                {lang === 'es' ? 'PRESUPUESTO LLAVE EN MANO' : 'TURNKEY FIXED ESTIMATE'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1E293B] text-[#FFFFFF]">
                FL Taxes Incl.
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-[#94A3B8] font-medium block">
                {lang === 'es' ? 'Paquete Completo desde:' : 'All-Inclusive Package from:'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight">
                  $4,500
                </span>
                <span className="text-xs text-[#94A3B8] font-bold">
                  / 530 sqft + 15 stairs
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0" />
                <span>Materials 100% Waterproof SPC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0" />
                <span>Complete carpet removal & 15 glued stairs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0" />
                <span>Baseboard removal & careful reinstallation</span>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#FF8407] hover:bg-[#e67400] text-[#000000] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'es' ? 'Agendar Evaluación Gratuita' : 'Book Free In-Home Evaluation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher Controls (3D Horizontal Render vs 2D CAD Blueprint) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-[#000000] text-[#FFFFFF] shadow-md'
                  : 'text-[#64748B] hover:text-[#000000]'
              }`}
            >
              <Eye className="w-4 h-4 text-[#FF8407]" />
              <span>{t('view3DRender')}</span>
            </button>

            <button
              onClick={() => setViewMode('2d')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-[#000000] text-[#FFFFFF] shadow-md'
                  : 'text-[#64748B] hover:text-[#000000]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#FF8407]" />
              <span>{t('view2DBlueprint')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#64748B]">{t('activeTone')}:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <span
                className="w-4 h-4 rounded-full border border-black/20"
                style={{ backgroundColor: selectedProduct.colorHex }}
              ></span>
              <span className="text-xs font-black text-[#000000]">{selectedProduct.name}</span>
            </div>
          </div>
        </div>

        {/* Primary View: 3D Horizontal Render or 2D CAD Blueprint */}
        <div className="mb-12">
          {viewMode === '3d' ? (
            <HorizontalRender3D
              model={model}
              selectedProduct={selectedProduct}
            />
          ) : (
            <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-[#000000]">
                    {lang === 'es' ? 'Plano CAD 2D Interactivo' : 'Interactive 2D CAD Blueprint'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {model.name} • 530 sq ft Net Floor Plan
                  </p>
                </div>
              </div>
              <FloorPlanSVG
                model={model}
                selectedProduct={selectedProduct}
              />
            </div>
          )}
        </div>

        {/* Exact PPT Breakdown: ONLY MATERIAL vs LABOR (INSTALLATION) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Slide 3 Left: ONLY MATERIAL */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#FF8407] flex items-center justify-center font-black">
                    <Box className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-black text-[#000000] tracking-tight">
                    {t('onlyMaterialTitle')}
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B]">
                  {t('onlyMaterialSub')}
                </span>
              </div>

              {/* Material Sub-Options matching Slide 3 */}
              <div className="space-y-4">
                {/* 5.5mm Option */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#FF8407] transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-[#FF8407] uppercase tracking-wider block">
                        5.5mm SPC Vinyl Floor
                      </span>
                      <h4 className="text-base font-bold text-[#000000] mt-0.5">
                        Classic Rigid Core (20 Mil Wear Layer)
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#000000]">$1,550</span>
                      <span className="text-[10px] text-[#64748B] block">Total Material</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] mt-2">
                    Includes 530 sq ft material, calculated waste factor, and 15 matching stair nosing pieces delivered directly to your doorstep.
                  </p>
                </div>

                {/* 8.0mm Flagship Option */}
                <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FF8407]/50 relative">
                  <span className="absolute -top-2.5 right-4 text-[9px] font-black uppercase bg-[#FF8407] text-[#000000] px-2 py-0.5 rounded-full shadow-xs">
                    Ultra Premium
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-[#FF8407] uppercase tracking-wider block">
                        8.0mm SPC Vinyl Floor
                      </span>
                      <h4 className="text-base font-bold text-[#000000] mt-0.5">
                        Flagship Heavy Commercial (22 Mil Wear Layer)
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#000000]">$2,050</span>
                      <span className="text-[10px] text-[#64748B] block">Total Material</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] mt-2">
                    Includes 8.0mm luxury planks, 2.0mm attached acoustic backing, and 15 premium heavy-duty stair nosings.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 font-bold">
                <Truck className="w-4 h-4 text-[#FF8407]" />
                Direct Miami-Dade / Homestead Delivery
              </span>
              <span className="font-bold text-[#000000]">Zero Hidden Surcharges</span>
            </div>
          </div>

          {/* Slide 3 Right: LABOR (INSTALLATION) */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#000000] text-[#FF8407] flex items-center justify-center font-black">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-black text-[#000000] tracking-tight">
                    {t('laborTitle')}
                  </h3>
                </div>
                <span className="text-base font-black text-[#000000] px-3 py-1 rounded-full bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/40">
                  {t('laborTotal')}
                </span>
              </div>

              {/* Exact 5 bullet scope from Slide 3 */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0 mt-0.5" />
                  <span className="text-[#334155] font-medium">{t('labor1')}</span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0 mt-0.5" />
                  <span className="text-[#334155] font-medium">{t('labor2')}</span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0 mt-0.5" />
                  <span className="text-[#334155] font-medium">{t('labor3')}</span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0 mt-0.5" />
                  <span className="text-[#334155] font-medium">{t('labor4')}</span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8407] flex-shrink-0 mt-0.5" />
                  <span className="text-[#334155] font-medium">{t('labor5')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#FF8407]" />
                Licensed & Insured Installation
              </span>
              <span className="font-bold text-[#FF8407]">Garantía QuickSurfaces</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

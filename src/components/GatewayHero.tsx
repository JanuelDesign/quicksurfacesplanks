import React from 'react';
import { FloorPlanModel, ResidentialCommunity } from '../types';
import { COMMUNITIES, FLOOR_PLAN_MODELS } from '../data/communitiesAndModels';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Phone,
  Ruler,
  Layers,
} from 'lucide-react';

interface GatewayHeroProps {
  selectedCommunity: ResidentialCommunity;
  selectedModel: FloorPlanModel;
  onSelectCommunity: (community: ResidentialCommunity) => void;
  onSelectModel: (model: FloorPlanModel) => void;
  onOpenBooking: () => void;
}

export const GatewayHero: React.FC<GatewayHeroProps> = ({
  selectedCommunity,
  selectedModel,
  onSelectCommunity,
  onSelectModel,
  onOpenBooking,
}) => {
  const { lang, t } = useLanguage();

  const communityModels = FLOOR_PLAN_MODELS.filter(
    (m) => m.communityId === selectedCommunity.id
  );

  return (
    <section id="hero" className="bg-[#FFFFFF] text-[#111827] pt-8 pb-16 border-b border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('heroResidentialTagline')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#000000] tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#FF8407] block">{selectedModel.sqft}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#64748B] uppercase tracking-wider">
                {t('heroSqft')}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#000000] block">15</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#64748B] uppercase tracking-wider">
                {t('heroStairs')}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#000000] block">4</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#64748B] uppercase tracking-wider">
                {t('heroPackages')}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Community Selector Tabs / Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-black uppercase text-[#FF8407] tracking-widest block">
                {lang === 'es' ? 'PASO 1' : 'STEP 1'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#000000] tracking-tight">
                {t('selectCommunityTitle')}
              </h2>
            </div>
            <span className="text-xs text-[#64748B] hidden sm:block">
              {COMMUNITIES.length} {lang === 'es' ? 'conjuntos residenciales' : 'residential communities'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMMUNITIES.map((comm) => {
              const isSelected = comm.id === selectedCommunity.id;
              return (
                <button
                  key={comm.id}
                  onClick={() => {
                    onSelectCommunity(comm);
                    const firstModel = FLOOR_PLAN_MODELS.find((m) => m.communityId === comm.id);
                    if (firstModel) onSelectModel(firstModel);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] shadow-lg ring-2 ring-[#FF8407]'
                      : 'bg-[#FFFFFF] text-[#111827] border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-[#FF8407] text-[#000000]' : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF8407] text-[#000000]">
                          Activo
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm tracking-tight line-clamp-2 break-words">{comm.name}</h3>
                    <p
                      className={`text-[11px] mt-0.5 truncate whitespace-nowrap overflow-hidden block ${
                        isSelected ? 'text-[#94A3B8]' : 'text-[#64748B]'
                      }`}
                    >
                      {comm.city}, {comm.state}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-bold">
                    <span>{comm.modelIds.length} Models</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Floor Plan Models in Selected Community */}
        <div id="models" className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-[11px] font-black uppercase text-[#FF8407] tracking-widest block">
                {lang === 'es' ? 'PASO 2' : 'STEP 2'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#000000] tracking-tight">
                {t('availableModelsIn')} {selectedCommunity.name.toUpperCase()}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {t('modelSelectSubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {communityModels.map((model) => {
              const isSelected = model.id === selectedModel.id;
              return (
                <div
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#FF8407] ring-2 ring-[#FF8407]/30 shadow-lg'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#94A3B8] shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-[#FF8407] uppercase tracking-wider">
                        {model.communityName}
                      </span>
                      {isSelected ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#000000] text-[#FF8407] text-[10px] font-black">
                          Visualizando
                        </span>
                      ) : (
                        <span className="text-xs text-[#64748B] font-medium">{model.sqft} sq ft</span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-[#000000] tracking-tight mb-1">
                      {model.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-4">
                      {model.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 text-xs text-[#334155]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
                        <span>3 Bedrooms + Hallway + Closets</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
                        <span>15 Custom Matching Stair Steps</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8407]" />
                        <span>Turnkey Options: $4,500 - $5,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B]">
                      {lang === 'es' ? 'Material + Labor' : 'Material + Labor'}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-colors ${
                        isSelected
                          ? 'bg-[#FF8407] text-[#000000]'
                          : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#1E293B]'
                      }`}
                    >
                      <span>{isSelected ? 'Cargado' : t('viewPlanBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

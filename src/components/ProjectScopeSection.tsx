import React from 'react';
import { FloorPlanModel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  Layers,
  Wrench,
  Ruler,
  TrendingUp,
  Award,
  Palette,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ProjectScopeSectionProps {
  model: FloorPlanModel;
}

export const ProjectScopeSection: React.FC<ProjectScopeSectionProps> = ({ model }) => {
  const { lang, t } = useLanguage();

  // Slide 2: Exact 6 Features
  const features = [
    {
      title: lang === 'es' ? 'Medición Precisa' : 'Precision Measurement',
      desc:
        lang === 'es'
          ? `\${model.sqft} sq ft de área neta más factor de desperdicio calculado para optimizar la compra de materiales y minimizar costos.`
          : `\${model.sqft} sq ft net area plus calculated waste factor to optimize material purchases and minimize project costs.`,
    },
    {
      title: lang === 'es' ? 'Escaleras Integradas' : 'Integrated Master Stairs',
      desc:
        lang === 'es'
          ? 'Instalación profesional en 15 escalones utilizando el mismo material del piso para mantener continuidad visual perfecta.'
          : 'Professional installation across 15 steps using the exact same flooring material for seamless visual continuity.',
    },
    {
      title: lang === 'es' ? 'Preparación Completa' : 'Complete Prep & Subfloor',
      desc:
        lang === 'es'
          ? 'Desinstalación de alfombra, preparación de superficie, parches menores y reinstalación de zócalos incluidos.'
          : 'Carpet removal & disposal, subfloor prep, minor smoothing patches, and careful baseboard reinstallation included.',
    },
    {
      title: lang === 'es' ? 'Alta Resistencia' : 'High Commercial Durability',
      desc:
        lang === 'es'
          ? 'Vinil de lujo con capa de desgaste de 20-22 Mils, resistente al agua, manchas y desgaste diario.'
          : 'Luxury rigid core SPC vinyl with 20-22 Mils wear layer, 100% waterproof, scratch-resistant, and stain-proof.',
    },
    {
      title: lang === 'es' ? 'Múltiples Acabados' : '9 Designer Color Finishes',
      desc:
        lang === 'es'
          ? '9 opciones de color disponibles: desde roble claro y madera natural hasta gris moderno y nogal oscuro.'
          : '9 curated color options: from Japandi beige and natural Liv oak to modern silver ash and rich chic dark.',
    },
    {
      title: lang === 'es' ? 'Garantía Incluida' : 'Full Warranty & Backing',
      desc:
        lang === 'es'
          ? 'Material de primera calidad con garantía de fabricante y respaldo de instalación profesional.'
          : 'Premium commercial-grade materials with comprehensive manufacturer warranty and licensed installation backing.',
    },
  ];

  // Slide 6: Exact 4 Process Steps
  const processSteps = [
    {
      step: '01',
      title: lang === 'es' ? 'Preparación' : 'Preparation',
      desc:
        lang === 'es'
          ? 'Desinstalación de alfombra existente y evaluación de la superficie para preparación óptima.'
          : 'Complete removal and haul-away of existing carpet, subfloor inspection, and minor surface patching.',
    },
    {
      step: '02',
      title: lang === 'es' ? 'Instalación' : 'Installation',
      desc:
        lang === 'es'
          ? 'Colocación profesional del piso con técnicas avanzadas y adhesivos de alta calidad.'
          : `Precision laser-guided installation across \${model.sqft} sq ft with expansion margins and click-lock integrity.`,
    },
    {
      step: '03',
      title: lang === 'es' ? 'Escaleras' : 'Stairs',
      desc:
        lang === 'es'
          ? 'Instalación especializada en 15 escalones manteniendo continuidad visual perfecta.'
          : 'Specialized 15-step custom fabrication and structural adhesive bonding with matching planks.',
    },
    {
      step: '04',
      title: lang === 'es' ? 'Acabado' : 'Finishing',
      desc:
        lang === 'es'
          ? 'Reinstalación de zócalos, limpieza final y revisión de calidad completa.'
          : 'Baseboard reinstall, silicone edge caulking, deep cleanup, and comprehensive quality walkthrough.',
    },
  ];

  return (
    <div id="scope" className="space-y-0 font-sans">
      {/* Slide 2: CARACTERÍSTICAS Section */}
      <section className="py-16 bg-[#FFFFFF] text-[#111827] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Pill */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'CARACTERÍSTICAS' : 'FEATURES & BENEFITS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
              {t('featuresTitle')}
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {t('featuresSubtitle')}
            </p>
          </div>

          {/* Exact 6 Feature Cards Grid matching Slide 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-3xl p-7 border border-[#E2E8F0] shadow-sm hover:border-[#FF8407] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FF8407] border border-[#FF8407]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 fill-[#FF8407] text-[#FF8407]" />
                  </div>

                  <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#FF8407] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slide 6: PROCESO / ¿Cómo trabajamos? Section */}
      <section className="py-16 bg-[#F8FAFC] text-[#111827] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Pill */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#000000] text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'PROCESO' : 'PROCESS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
              {t('processTitle')}
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {t('processSubtitle')}
            </p>
          </div>

          {/* 4 Connected Linear Process Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="bg-[#FFFFFF] rounded-3xl p-7 border border-[#E2E8F0] shadow-sm hover:border-[#FF8407] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#000000] text-[#FF8407] font-black text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {step.step}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#000000] bg-[#F1F5F9] px-2.5 py-1 rounded-full">
                      {lang === 'es' ? `Paso ${step.step}` : `Step ${step.step}`}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#FF8407] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1.5 text-xs text-[#FF8407] font-bold">
                  <span>Garantía QuickSurfaces</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

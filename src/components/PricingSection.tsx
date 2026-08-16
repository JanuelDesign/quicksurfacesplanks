import React from 'react';
import { FloorPlanModel, FlooringProduct, PricingPackage } from '../types';
import { PRICING_PACKAGES } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Award,
  DollarSign,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Truck,
} from 'lucide-react';

interface PricingSectionProps {
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  packagesList?: PricingPackage[];
  onOpenBookingWithPackage: (pkg: PricingPackage) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  model,
  selectedProduct,
  packagesList = PRICING_PACKAGES,
  onOpenBookingWithPackage,
}) => {
  const { lang, t } = useLanguage();

  return (
    <section id="pricing" className="py-16 bg-[#FFFFFF] text-[#111827] border-b border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'PRECIOS TRANSPARENTES' : 'TRANSPARENT FIXED PRICING'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
            {t('pricingSectionTitle')}
          </h2>
          <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
            {t('pricingSectionSubtitle')}
          </p>
        </div>

        {/* 4 Package Cards Grid matching Slide 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 items-stretch">
          {packagesList.map((pkg) => {
            const isHighlighted = pkg.isBestValue || pkg.isPremium;

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.isBestValue
                    ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] shadow-2xl ring-2 ring-[#FF8407]'
                    : pkg.isPremium
                    ? 'bg-[#FFF7ED] text-[#111827] border-[#FF8407] shadow-xl'
                    : 'bg-[#FFFFFF] text-[#111827] border-[#E2E8F0] shadow-sm hover:border-[#94A3B8]'
                }`}
              >
                {/* Popular / Premium Floating Badges */}
                {pkg.isBestValue && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF8407] text-[#000000] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                    {t('popularBadge')}
                  </div>
                )}
                {pkg.isPremium && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#000000] text-[#FF8407] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                    {t('premiumBadge')}
                  </div>
                )}

                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        pkg.isBestValue
                          ? 'bg-[#1E293B] text-[#FF8407]'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {!pkg.isTurnkey
                        ? lang === 'es'
                          ? 'Solo Material'
                          : 'Material Only'
                        : lang === 'es'
                        ? 'Llave en Mano'
                        : 'All-Inclusive Turnkey'}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        pkg.isBestValue ? 'text-[#94A3B8]' : 'text-[#64748B]'
                      }`}
                    >
                      {pkg.thickness}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-black tracking-tight mb-2 ${
                      pkg.isBestValue ? 'text-[#FFFFFF]' : 'text-[#000000]'
                    }`}
                  >
                    {pkg.title}
                  </h3>

                  <p
                    className={`text-xs mb-6 leading-relaxed ${
                      pkg.isBestValue ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}
                  >
                    {pkg.tagline}
                  </p>

                  {/* Price Tag */}
                  <div className="mb-6 pb-6 border-b border-current/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight">
                        ${pkg.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          pkg.isBestValue ? 'text-[#FF8407]' : 'text-[#64748B]'
                        }`}
                      >
                        FL Taxes Incl.
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        pkg.isBestValue ? 'text-[#CBD5E1]' : 'text-[#64748B]'
                      }`}
                    >
                      530 sq ft Net Area + 15 Custom Stairs
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-2.5 text-xs">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            pkg.isBestValue ? 'text-[#FF8407]' : 'text-[#FF8407]'
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            pkg.isBestValue ? 'text-[#CBD5E1]' : 'text-[#334155]'
                          }`}
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4 border-t border-current/10">
                  <button
                    onClick={() => onOpenBookingWithPackage(pkg)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      pkg.isBestValue
                        ? 'bg-[#FF8407] hover:bg-[#e67400] text-[#000000] shadow-lg hover:scale-[1.02]'
                        : 'bg-[#000000] hover:bg-[#1E293B] text-[#FFFFFF] shadow-md hover:scale-[1.02]'
                    }`}
                  >
                    <span>{t('choosePackage')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide 5: Comprehensive Summary Table */}
        <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-[11px] font-black uppercase text-[#FF8407] tracking-widest block">
                TABLA COMPARATIVA
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#000000] tracking-tight">
                {t('summaryTableTitle')}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
              <ShieldCheck className="w-4 h-4 text-[#FF8407]" />
              <span>Garantía QuickSurfaces Certificada</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Opción / Paquete</th>
                  <th className="py-3.5 px-4">Material SPC</th>
                  <th className="py-3.5 px-4">Capa Desgaste</th>
                  <th className="py-3.5 px-4">Instalación & 15 Peldaños</th>
                  <th className="py-3.5 px-4">Desinstalación Alfombra</th>
                  <th className="py-3.5 px-4 text-right">Precio Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#111827]">
                <tr className="hover:bg-[#FFFFFF] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#000000]">1. Solo Material 5.5mm</td>
                  <td className="py-4 px-4">5.5mm Classic SPC</td>
                  <td className="py-4 px-4 font-mono">20 Mil</td>
                  <td className="py-4 px-4 text-[#64748B]">No Incluido</td>
                  <td className="py-4 px-4 text-[#64748B]">No Incluido</td>
                  <td className="py-4 px-4 text-right font-black text-base text-[#000000]">$1,550</td>
                </tr>
                <tr className="hover:bg-[#FFFFFF] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#000000]">2. Solo Material 8.0mm</td>
                  <td className="py-4 px-4">8.0mm Flagship SPC</td>
                  <td className="py-4 px-4 font-mono text-[#FF8407] font-bold">22 Mil Ultra</td>
                  <td className="py-4 px-4 text-[#64748B]">No Incluido</td>
                  <td className="py-4 px-4 text-[#64748B]">No Incluido</td>
                  <td className="py-4 px-4 text-right font-black text-base text-[#000000]">$2,050</td>
                </tr>
                <tr className="bg-[#FFF7ED]/60 font-medium">
                  <td className="py-4 px-4 font-black text-[#000000] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF8407]"></span>
                    3. Paquete Completo 5.5mm
                  </td>
                  <td className="py-4 px-4">5.5mm Classic SPC</td>
                  <td className="py-4 px-4 font-mono">20 Mil</td>
                  <td className="py-4 px-4 font-bold text-[#000000]">Incluida (15 escalones)</td>
                  <td className="py-4 px-4 font-bold text-[#000000]">Incluida & Zócalos</td>
                  <td className="py-4 px-4 text-right font-black text-lg text-[#000000]">$4,500</td>
                </tr>
                <tr className="hover:bg-[#FFFFFF] transition-colors">
                  <td className="py-4 px-4 font-black text-[#000000] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#000000]"></span>
                    4. Paquete Completo 8.0mm
                  </td>
                  <td className="py-4 px-4">8.0mm Flagship SPC</td>
                  <td className="py-4 px-4 font-mono text-[#FF8407] font-bold">22 Mil Ultra</td>
                  <td className="py-4 px-4 font-bold text-[#000000]">Incluida (15 escalones)</td>
                  <td className="py-4 px-4 font-bold text-[#000000]">Incluida & Zócalos</td>
                  <td className="py-4 px-4 text-right font-black text-lg text-[#FF8407]">$5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

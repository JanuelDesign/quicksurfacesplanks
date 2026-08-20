import React from 'react';
import { Home, Layers, Info, MessageCircle, Sparkles, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type AppTab = 'order' | 'gallery' | 'catalog' | 'about' | 'contact';

interface AppBottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  orderTotal?: number;
  currentStep?: number;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentStep = 1,
}) => {
  const { lang } = useLanguage();

  const tabs = [
    {
      id: 'order' as AppTab,
      label: lang === 'es' ? 'Cotizar' : 'Estimator',
      icon: Sparkles,
      badge: lang === 'es' ? `Paso ${currentStep}/4` : `Step ${currentStep}/4`,
    },
    {
      id: 'gallery' as AppTab,
      label: lang === 'es' ? 'Trabajos' : 'Gallery',
      icon: Camera,
    },
    {
      id: 'catalog' as AppTab,
      label: lang === 'es' ? 'Catálogo' : 'Catalog',
      icon: Layers,
    },
    {
      id: 'about' as AppTab,
      label: lang === 'es' ? 'Nosotros' : 'About Us',
      icon: Info,
    },
    {
      id: 'contact' as AppTab,
      label: lang === 'es' ? 'WhatsApp' : 'Contact',
      icon: MessageCircle,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
                isActive ? 'text-[#FF8407]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#FFF7ED]' : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF8407] stroke-[2.5]' : 'stroke-[1.75]'}`} />
                </div>
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 text-[9px] font-black px-1.5 py-0.2 bg-[#FF8407] text-white rounded-full shadow-xs">
                    {currentStep}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-[#FF8407]' : 'text-[#64748B]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

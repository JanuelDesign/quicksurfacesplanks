import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Camera, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { lang, t } = useLanguage();

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      title: lang === 'es' ? 'Escaleras Integradas 15 Peldaños' : '15 Custom Step Staircase',
      location: 'Altamira, Homestead FL',
      tag: 'Glued Master Stairs',
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: lang === 'es' ? "Owner's Suite & Closets" : 'Master Suite & Walk-In Closet',
      location: 'Terra Sol, Homestead FL',
      tag: '8mm SPC Liv Oak',
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      title: lang === 'es' ? 'Pasillo Continuo Sin Desniveles' : 'Hallway & Landing Flow',
      location: 'Luminara, Homestead FL',
      tag: 'Seamless Transition',
    },
    {
      url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
      title: lang === 'es' ? 'Dormitorios Secundarios' : 'Guest Suites & Baseboards',
      location: 'Paradis, Homestead FL',
      tag: 'Reinstalled Baseboards',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] text-[#111827] border-b border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>{t('galleryTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
            {lang === 'es' ? 'Trabajos Realizados en la Comunidad' : 'Real South Florida 2nd Floor Transformations'}
          </h2>
          <p className="mt-3 text-[#4B5563] text-sm sm:text-base">
            {t('gallerySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:border-[#FF8407] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-56 overflow-hidden bg-[#E2E8F0]">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-[#FFFFFF]">
                <span className="text-[10px] font-black text-[#FF8407] uppercase tracking-wider bg-[#FFF7ED] border border-[#FF8407]/30 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {item.tag}
                </span>
                <h4 className="text-sm font-bold text-[#000000]">{item.title}</h4>
                <p className="text-xs text-[#64748B] mt-0.5">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

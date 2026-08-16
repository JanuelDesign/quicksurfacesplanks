import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { GatewayHero } from './components/GatewayHero';
import { ModelHeaderAndRender } from './components/ModelHeaderAndRender';
import { RoomVisualizer } from './components/RoomVisualizer';
import { ProjectScopeSection } from './components/ProjectScopeSection';
import { PricingSection } from './components/PricingSection';
import { ProductCatalog } from './components/ProductCatalog';
import { GallerySection } from './components/GallerySection';
import { ConversionFooter } from './components/ConversionFooter';
import { BookingModal } from './components/BookingModal';
import { StepWizard } from './components/StepWizard';
import { FLOOR_PLAN_MODELS, COMMUNITIES } from './data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from './data/products';
import { FloorPlanModel, FlooringProduct, PricingPackage, ResidentialCommunity } from './types';
import { fetchLiveDatabase } from './services/googleSheetSync';
import { Sparkles, LayoutList, CheckCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'interactive' | 'wizard'>('wizard');
  const [liveModels, setLiveModels] = useState<FloorPlanModel[]>(FLOOR_PLAN_MODELS);
  const [liveProducts, setLiveProducts] = useState<FlooringProduct[]>(FLOORING_PRODUCTS);
  const [livePackages, setLivePackages] = useState<PricingPackage[]>(PRICING_PACKAGES);
  const [isSyncedWithSheet, setIsSyncedWithSheet] = useState<boolean>(false);

  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(COMMUNITIES[0]);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(FLOOR_PLAN_MODELS[0]);
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(FLOORING_PRODUCTS[2]); // Trustable Oak default
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(PRICING_PACKAGES[2]); // Standard Turnkey
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  // Sync with live Google Sheets on mount
  useEffect(() => {
    fetchLiveDatabase().then((data) => {
      if (data.isLive) {
        setLiveModels(data.models);
        setLiveProducts(data.products);
        setLivePackages(data.packages);
        setIsSyncedWithSheet(true);
      }
    });
  }, []);

  // Sync hash routing if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        const parts = hash.split('/');
        if (parts.length >= 2) {
          const [commSlug, modelSlug] = parts;
          const foundModel = FLOOR_PLAN_MODELS.find(
            (m) => (m.communityId === commSlug || m.slug === modelSlug) && m.slug === modelSlug
          );
          if (foundModel) {
            setSelectedModel(foundModel);
            const foundComm = COMMUNITIES.find((c) => c.id === foundModel.communityId);
            if (foundComm) setSelectedCommunity(foundComm);
          }
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectModel = (model: FloorPlanModel) => {
    setSelectedModel(model);
    const foundComm = COMMUNITIES.find((c) => c.id === model.communityId);
    if (foundComm) setSelectedCommunity(foundComm);
    window.location.hash = `/${model.communityId}/${model.slug}`;
    
    // Smooth scroll down to the model visualizer section
    const modelSection = document.getElementById('model-section');
    if (modelSection) {
      modelSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCommunity = (comm: ResidentialCommunity) => {
    setSelectedCommunity(comm);
    const firstModel = FLOOR_PLAN_MODELS.find((m) => m.communityId === comm.id);
    if (firstModel) {
      setSelectedModel(firstModel);
      window.location.hash = `/${comm.id}/${firstModel.slug}`;
    }
  };

  const handleSelectPackageAndBook = (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#FFFFFF] text-[#111827] flex flex-col font-sans selection:bg-[#FF8407] selection:text-white">
        {/* Top Navbar */}
        <Navbar
          currentModel={selectedModel}
          onOpenBooking={() => setIsBookingOpen(true)}
          onSelectCommunity={() => {
            const heroEl = document.getElementById('hero');
            if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Section 1: Hero & Interactive Community / Floor Plan Picker */}
          <GatewayHero
            selectedCommunity={selectedCommunity}
            selectedModel={selectedModel}
            onSelectCommunity={handleSelectCommunity}
            onSelectModel={handleSelectModel}
            onOpenBooking={() => setIsBookingOpen(true)}
          />

          {/* Mode Switcher Banner: Wizard (Step by Step) vs Full Exploration */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 mb-8">
            <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 px-3">
                <span className="w-2 h-2 rounded-full bg-[#FF8407] animate-pulse"></span>
                <span className="text-xs font-bold text-white">
                  ¿Cómo prefieres cotizar tu proyecto?
                </span>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto bg-[#000000] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('wizard')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    viewMode === 'wizard'
                      ? 'bg-[#FF8407] text-black shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cotizador Paso a Paso (Recomendado)</span>
                </button>
                <button
                  onClick={() => setViewMode('interactive')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    viewMode === 'interactive'
                      ? 'bg-[#FF8407] text-black shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Explorar Todo en 1 Página</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Content based on ViewMode */}
          {viewMode === 'wizard' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <StepWizard
                initialCommunity={selectedCommunity}
                initialModel={selectedModel}
                initialProduct={selectedProduct}
                initialPackage={selectedPackage}
                modelsList={liveModels}
                productsList={liveProducts}
                packagesList={livePackages}
                isLiveSynced={isSyncedWithSheet}
                onClose={() => setViewMode('interactive')}
              />
            </div>
          ) : (
            <>
              {/* Section 2: Architectural 3D Horizontal Cutaway & 2D CAD Blueprint */}
              <div id="model-section">
                <ModelHeaderAndRender
                  model={selectedModel}
                  selectedProduct={selectedProduct}
                  onOpenBooking={() => setIsBookingOpen(true)}
                  onSelectProduct={setSelectedProduct}
                />
              </div>

              {/* Section 3: Room Color Visualizer Studio (Focused on Colors + External Tool Button) */}
              <RoomVisualizer
                model={selectedModel}
                selectedProduct={selectedProduct}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onOpenBooking={() => setIsBookingOpen(true)}
              />

              {/* Section 4: 4 Pricing Packages & Breakdown Table */}
              <PricingSection
                model={selectedModel}
                selectedProduct={selectedProduct}
                onOpenBookingWithPackage={handleSelectPackageAndBook}
              />
            </>
          )}

          {/* Section 5: Project Scope & 4-Step Process */}
          <ProjectScopeSection model={selectedModel} />

          {/* Section 6: Comprehensive Product Catalog & Technical Specs */}
          <ProductCatalog
            selectedProduct={selectedProduct}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              const visEl = document.getElementById('visualizer');
              if (visEl) visEl.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenBookingWithProduct={(prod) => {
              setSelectedProduct(prod);
              setIsBookingOpen(true);
            }}
          />

          {/* Section 7: Gallery of Real Completed Installations */}
          <GallerySection />
        </main>

        {/* Conversion Footer & Trust Badges */}
        <ConversionFooter
          model={selectedModel}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* Direct In-Home Evaluation Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialModel={selectedModel}
          initialProduct={selectedProduct}
          initialPackage={selectedPackage}
        />
      </div>
    </LanguageProvider>
  );
}

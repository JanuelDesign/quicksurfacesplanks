const fs = require('fs');
const content = `import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FLOOR_PLAN_MODELS, COMMUNITIES } from './data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from './data/products';
import { FloorPlanModel, FlooringProduct, PricingPackage, ResidentialCommunity } from './types';
import { fetchLiveDatabase } from './services/googleSheetSync';

import { Navbar } from './components/Navbar';
import { StepWizard } from './components/StepWizard';
import { HorizontalRender3D } from './components/HorizontalRender3D';
import { RoomVisualizer } from './components/RoomVisualizer';
import { ProductCatalog } from './components/ProductCatalog';
import { BookingModal } from './components/BookingModal';
import { AppBottomNav, AppTab } from './components/AppBottomNav';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [liveModels, setLiveModels] = useState<FloorPlanModel[]>(FLOOR_PLAN_MODELS);
  const [liveProducts, setLiveProducts] = useState<FlooringProduct[]>(FLOORING_PRODUCTS);
  const [livePackages, setLivePackages] = useState<PricingPackage[]>(PRICING_PACKAGES);
  const [isSyncedWithSheet, setIsSyncedWithSheet] = useState<boolean>(false);

  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(COMMUNITIES[0]);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(FLOOR_PLAN_MODELS[3] || FLOOR_PLAN_MODELS[0]); // Default to Reserve
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(FLOORING_PRODUCTS[2]);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(PRICING_PACKAGES[2]);
  
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  // App Tab Navigation State (Rappi / Yummy Style)
  const [activeTab, setActiveTab] = useState<AppTab>('order');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

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

  const handleSelectTab = (tab: AppTab) => {
    if (tab === 'about') {
      setIsAboutModalOpen(true);
    } else if (tab === 'contact') {
      window.open('https://wa.me/17866583677?text=Hola%20Quick%20Surfaces!%20Quiero%20consultar%20sobre%20pisos%20SPC%20para%20la%20comunidad%20Siena%20Reserve', '_blank');
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentTotal = selectedPackage.pricePerSqft 
    ? Math.round(selectedModel.sqft * selectedPackage.pricePerSqft) 
    : selectedPackage.price;

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#FF8407] selection:text-white pb-24">
        {/* Top Navbar */}
        <Navbar
          currentModel={selectedModel}
          onOpenBooking={() => setIsBookingOpen(true)}
          onSelectCommunity={() => setActiveTab('catalog')}
        />

        {/* Main Single-Focus View Container (Rappi / Yummy Style) */}
        <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
          {activeTab === 'order' && (
            <div className="animate-fadeIn space-y-6">
              {/* Step Wizard is the Main App Flow */}
              <StepWizard
                initialCommunity={selectedCommunity}
                initialModel={selectedModel}
                initialProduct={selectedProduct}
                initialPackage={selectedPackage}
                modelsList={liveModels}
                productsList={liveProducts}
                packagesList={livePackages}
                isLiveSynced={isSyncedWithSheet}
                onClose={() => setActiveTab('catalog')}
              />
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="animate-fadeIn space-y-8 bg-white p-4 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-[#0F172A]">Catálogo 3D</h2>
                <p className="text-sm text-[#64748B]">Explora los acabados para el modelo {selectedModel.name}</p>
              </div>

              {/* 3D Visualizer Room Swapper */}
              <RoomVisualizer
                model={selectedModel}
                selectedProduct={selectedProduct}
                productsList={liveProducts}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onOpenBooking={() => setActiveTab('order')}
              />

              {/* Full Product Catalog */}
              <ProductCatalog
                selectedProduct={selectedProduct}
                productsList={liveProducts}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  setActiveTab('order');
                }}
                onOpenBookingWithProduct={(prod) => {
                  setSelectedProduct(prod);
                  setActiveTab('order');
                }}
              />
            </div>
          )}
        </main>

        {/* Mobile Sticky App Bottom Navigation Bar */}
        <AppBottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          orderTotal={currentTotal}
          currentStep={1}
        />

        {/* About Us & Warranty Modal */}
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        />

        {/* Booking Drawer Modal */}
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
`;
fs.writeFileSync('src/App.tsx', content);

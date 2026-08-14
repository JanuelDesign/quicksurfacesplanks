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
import { FLOOR_PLAN_MODELS, COMMUNITIES } from './data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from './data/products';
import { FloorPlanModel, FlooringProduct, PricingPackage, ResidentialCommunity } from './types';

export default function App() {
  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(COMMUNITIES[0]);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(FLOOR_PLAN_MODELS[0]);
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(FLOORING_PRODUCTS[2]); // Trustable Oak default
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(PRICING_PACKAGES[2]); // Standard Turnkey
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

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

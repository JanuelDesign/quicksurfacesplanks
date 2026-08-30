import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FLOOR_PLAN_MODELS, COMMUNITIES } from './data/communitiesAndModels';
import { FLOORING_PRODUCTS, PRICING_PACKAGES } from './data/products';
import { FloorPlanModel, FlooringProduct, PricingPackage, ResidentialCommunity } from './types';
import { calculateQuotePrice } from './utils/pricingCalculator';
import { GalleryItem, GALLERY_ITEMS } from './components/GallerySection';
import { TestimonialItem, TESTIMONIALS } from './data/testimonials';
import {
  StairTechnicalImage,
  StairVerticalCard,
  StairProjectItem,
  STAIR_TECHNICAL_IMAGES,
  STAIR_VERTICAL_CARDS,
  INSTALLED_STAIRS_CAROUSEL,
} from './data/stairsGallery';
import { fetchLiveDatabase } from './services/googleSheetSync';

import { Navbar } from './components/Navbar';
import { StepWizard } from './components/StepWizard';
import { HorizontalRender3D } from './components/HorizontalRender3D';
import { RoomVisualizer } from './components/RoomVisualizer';
import { ProductCatalog } from './components/ProductCatalog';
import { GallerySection } from './components/GallerySection';
import { BookingModal } from './components/BookingModal';
import { AppBottomNav, AppTab } from './components/AppBottomNav';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [liveModels, setLiveModels] = useState<FloorPlanModel[]>(FLOOR_PLAN_MODELS);
  const [liveProducts, setLiveProducts] = useState<FlooringProduct[]>(FLOORING_PRODUCTS);
  const [livePackages, setLivePackages] = useState<PricingPackage[]>(PRICING_PACKAGES);
  const [liveGallery, setLiveGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [liveTestimonials, setLiveTestimonials] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [liveStairTechnical, setLiveStairTechnical] = useState<StairTechnicalImage[]>(STAIR_TECHNICAL_IMAGES);
  const [liveStairVertical, setLiveStairVertical] = useState<StairVerticalCard[]>(STAIR_VERTICAL_CARDS);
  const [liveStairCarousel, setLiveStairCarousel] = useState<StairProjectItem[]>(INSTALLED_STAIRS_CAROUSEL);
  const [isSyncedWithSheet, setIsSyncedWithSheet] = useState<boolean>(false);

  const [selectedCommunity, setSelectedCommunity] = useState<ResidentialCommunity>(COMMUNITIES[0]);
  const [selectedModel, setSelectedModel] = useState<FloorPlanModel>(FLOOR_PLAN_MODELS[3] || FLOOR_PLAN_MODELS[0]); // Default to Reserve
  const [selectedProduct, setSelectedProduct] = useState<FlooringProduct>(FLOORING_PRODUCTS[2] || FLOORING_PRODUCTS[0]);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(PRICING_PACKAGES[0]);
  
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  // App Tab Navigation State (Rappi / Yummy Style)
  const [activeTab, setActiveTab] = useState<AppTab>('order');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const refreshLiveSheet = () => {
    fetchLiveDatabase().then((data) => {
      if (data.isLive) {
        setLiveModels(data.models);
        setLiveProducts(data.products);
        setLivePackages(data.packages);
        if (data.galleryItems && data.galleryItems.length > 0) {
          setLiveGallery(data.galleryItems);
        }
        if (data.testimonials && data.testimonials.length > 0) {
          setLiveTestimonials(data.testimonials);
        }
        if (data.stairTechnicalImages && data.stairTechnicalImages.length > 0) {
          setLiveStairTechnical(data.stairTechnicalImages);
        }
        if (data.stairVerticalCards && data.stairVerticalCards.length > 0) {
          setLiveStairVertical(data.stairVerticalCards);
        }
        if (data.stairCarouselItems && data.stairCarouselItems.length > 0) {
          setLiveStairCarousel(data.stairCarouselItems);
        }
        setIsSyncedWithSheet(true);

        if (data.models && data.models.length > 0) {
          setSelectedModel((prev) => {
            const found = data.models.find(
              (m) =>
                m.id === prev.id ||
                m.slug === prev.slug ||
                m.name.toLowerCase() === prev.name.toLowerCase()
            );
            return found || data.models[0];
          });
        }
        if (data.products && data.products.length > 0) {
          setSelectedProduct((prev) => {
            const found = data.products.find(
              (p) => p.id === prev.id || p.code === prev.code
            );
            return found || data.products[0];
          });
        }
        if (data.packages && data.packages.length > 0) {
          setSelectedPackage((prev) => {
            const found = data.packages.find(
              (pkg) => pkg.id === prev.id || pkg.title.toLowerCase() === prev.title.toLowerCase()
            );
            return found || data.packages[0];
          });
        }
      }
    });
  };

  useEffect(() => {
    refreshLiveSheet();
  }, []);

  const handleSelectTab = (tab: AppTab) => {
    if (tab === 'about') {
      setIsAboutModalOpen(true);
    } else if (tab === 'contact') {
      const link = document.createElement('a');
      link.href = 'https://wa.me/17866583677?text=Hola%20Quick%20Surfaces!%20Quiero%20consultar%20sobre%20pisos%20SPC%20para%20la%20comunidad%20Siena%20Reserve';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const quoteCalc = calculateQuotePrice(selectedModel, selectedProduct, selectedPackage, 'floor1_stairs');
  const currentTotal = quoteCalc.totalPrice;

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#FF8407] selection:text-white pb-24">
        {/* Top Navbar */}
        <Navbar
          currentModel={selectedModel}
          onOpenBooking={() => setIsBookingOpen(true)}
          onSelectCommunity={() => setActiveTab('catalog')}
          onSelectTab={handleSelectTab}
        />

        {/* Main Single-Focus View Container (Rappi / Yummy Style) */}
        <main className="w-full max-w-full mx-auto px-0 sm:px-4 pt-0 sm:pt-4">
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
                stairTechnicalImages={liveStairTechnical}
                stairVerticalCards={liveStairVertical}
                stairCarouselItems={liveStairCarousel}
                isLiveSynced={isSyncedWithSheet}
                onClose={() => setActiveTab('catalog')}
              />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="animate-fadeIn space-y-6">
              <GallerySection
                items={liveGallery}
                onGoToEstimator={() => {
                  setActiveTab('order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectFinishToQuote={(productName, collection) => {
                  // Find matching product if possible
                  const matched = liveProducts.find(
                    (p) =>
                      p.name.toLowerCase().includes(productName.toLowerCase()) ||
                      p.category === collection
                  );
                  if (matched) {
                    setSelectedProduct(matched);
                  }
                  setActiveTab('order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="animate-fadeIn w-full">
              {/* Full Product Catalog with Roomvo 3D Visualizer button at top */}
              <ProductCatalog
                selectedProduct={selectedProduct}
                productsList={liveProducts}
                stairTechnicalImages={liveStairTechnical}
                stairVerticalCards={liveStairVertical}
                stairCarouselItems={liveStairCarousel}
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
          testimonialsList={liveTestimonials}
        />

        {/* Booking Drawer Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialModel={selectedModel}
          initialProduct={selectedProduct}
          initialPackage={selectedPackage}
          initialFloorScope="floor1_stairs"
          modelsList={liveModels}
          productsList={liveProducts}
          packagesList={livePackages}
        />
      </div>
    </LanguageProvider>
  );
}

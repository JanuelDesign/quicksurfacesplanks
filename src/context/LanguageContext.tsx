import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    // Header & Announcement
    specialistTag: "Miami-Dade & Kendall 2nd Floor Specialists",
    stairBadge: "Calculated Net Area + 15 Custom Stairs",
    callUs: "Call (786) 658-3677",
    getFreeQuote: "Get Free Quote",
    chooseCommunity: "Choose your community: Altamira • Terra Sol • Luminara • Paradis",
    changeCommunity: "Change Community",
    viewCommunities: "Explore Communities",
    
    // Gateway Hero
    heroTitle: "Transform Your Space with Luxury Vinyl Flooring",
    heroSubtitle: "Top-tier installation services and premium flooring products engineered specifically for homeowners in Miami-Dade, Kendall, and Homestead communities.",
    heroSqft: "SQ FT NET AREA",
    heroStairs: "CUSTOM STAIRS",
    heroPackages: "TURNKEY OPTIONS",
    heroResidentialBadge: "Residential Flooring Project",
    heroResidentialTagline: "Professional Installation in Homestead & Miami-Dade",
    heroSpecsBrief: "100% Waterproof SPC Rigid Core • 20-22 Mils Wear Layer • 15 Continuous Stairs",
    
    // Community Selector
    selectCommunityTitle: "Select Your Residential Community",
    selectCommunitySubtitle: "Choose your community to instantly load architectural blueprints, custom 3D floor plan renders, and turnkey pricing.",
    availableModelsIn: "AVAILABLE FLOOR PLANS IN",
    floorPlansAndModels: "Architectural Models & Pricing",
    modelSelectSubtitle: "Select your floor plan to view the interactive room visualizer, 3D architectural render, and turnkey estimates.",
    viewPlanBtn: "View Floor Plan & Pricing",
    
    // Model Page Header
    residentialProject: "Residential Flooring Project",
    residentialModelDesc: "Complete home luxury renovation featuring precision net installation plus 15 integrated custom stairs. 100% waterproof rigid core SPC, continuous flow, and guaranteed durability.",
    onlyMaterialTitle: "ONLY MATERIAL",
    onlyMaterialSub: "Doorstep Delivery + FL Taxes Included",
    laborTitle: "LABOR (INSTALLATION)",
    laborTotal: "$2,950 FLAT LABOR",
    labor1: "Uninstall and discard existing carpet & padding",
    labor2: "Subfloor smoothing & patch repairs if necessary",
    labor3: "Precision floor installation across entire area",
    labor4: "Careful baseboard removal & reinstallation",
    labor5: "Custom stair installation glued with matching planks (15 steps)",
    
    // Render & Blueprints
    view3DRender: "Render 3D Fotorrealista",
    view2DBlueprint: "Plano 2D Interactivo",
    renderTitle: "Interactive 2D Floor Plan",
    renderSubtitle: "Exact second-story layout generated from architectural parameters with Owner's Suite, Bedrooms 2 & 3, dual baths, closets, and custom stairs.",
    activeTone: "Active Vinyl Finish",
    render3dSectionTitle: "Official 3D Photorealistic Render",
    render3dSectionSubtitle: "High-resolution commercial marketing render showcasing furniture, lighting, and natural depth.",
    plan2dSectionTitle: "Interactive 2D Floor Plan & Live Swatches",
    plan2dSectionSubtitle: "Code-generated architectural layout with dynamic room dimensions and real-time flooring color overlays.",
    
    // Room Visualizer / Color Showcase
    visualizerTitle: "Color & Finish Visualizer",
    visualizerSubtitle: "Explore how our premium 100% waterproof SPC luxury vinyl tones look across your floor plan.",
    selectColorLabel: "Select Vinyl Color Tone",
    compareFinishes: "Compare Vinyl Collections",
    launchVisualizerBtn: "Open Full 3D Room Visualizer Tool",
    launchVisualizerSubtitle: "Launch our dedicated interactive visualizer room studio tool at quicksurfaces.com",
    roomvoVisualizerBtn: "Visualize flooring in your room",
    roomvoVisualizerDesc: "Upload or snap a photo of your space to test flooring with Roomvo 3D",
    swatchHelper: "Click any color swatch below to update the floor render and see specifications:",
    viewAllSwatches: "Explore All 9 Colors",
    
    // Project Scope
    featuresTitle: "Why Choose QuickSurfaces?",
    featuresSubtitle: "We offer an all-inclusive solution for your second floor renovation, from subfloor prep to flawless final walk-through.",
    processTitle: "How We Work",
    processSubtitle: "Guaranteed 4-step professional methodology from carpet tear-out to final white-glove delivery.",
    
    // Pricing
    pricingSectionTitle: "4 Package Options",
    pricingSectionSubtitle: "Transparent, fixed, all-inclusive pricing with zero hidden add-on fees. Delivery and FL taxes included.",
    choosePackage: "Select Package",
    popularBadge: "Most Popular",
    premiumBadge: "Ultra Luxury (8mm)",
    summaryTableTitle: "Package Comparison & Summary",
    
    // Catalog & Swatches
    catalogHeaderTitle: "Waterproof Rigid Core SPC Vinyl Floor",
    catalogHeaderSubtitle: "8.0mm Flagship with 22 Mils wear layer & 5.5mm Classic with 20 Mils. 100% waterproof with stairs crafted from matching planks.",
    specSheet: "QUICKSURFACES TECHNICAL SPECIFICATIONS",
    
    // Gallery
    galleryTitle: "Recent South Florida Transformations",
    gallerySubtitle: "Real installation craftsmanship on 15-step staircases, primary bedrooms, and seamless hallway transitions in your neighborhood.",
    
    // Sticky & Footer
    footerReadyPrompt: "Ready to upgrade your home with luxury vinyl?",
    footerStartingFrom: "Net Area + 15 Custom Stairs from $1,550 flat package",
    bookNowBtn: "Book Installation",
    warranty25: "25-Year Warranty",
    warranty25Desc: "Heavy residential wear & tear",
    waterproof100: "100% Waterproof SPC",
    waterproof100Desc: "Zero swelling or water damage",
    customSteps15: "Custom 15 Stairs",
    customSteps15Desc: "Glued matching stair planks",
    turnkey2Days: "Fast Turnkey Delivery",
    turnkey2DaysDesc: "Clean, dust-free execution",
    
    // Modal
    modalTitle: "Schedule Your Free In-Home Evaluation",
    modalSubtitle: "Free in-home measurement verification and locked-in guaranteed pricing.",
    fullName: "Full Name *",
    phone: "Phone Number (Miami-Dade / FL) *",
    email: "Email Address",
    preferredDate: "Preferred Start Date",
    address: "Property Address / Lot # in Homestead or Kendall",
    confirmBooking: "Confirm & Lock In Rate",
  },
  es: {
    // Header & Announcement
    specialistTag: "Especialistas en Pisos en Miami-Dade y Kendall",
    stairBadge: "Área Neta Calculada + 15 Escalones a Medida",
    callUs: "Llamar (786) 658-3677",
    getFreeQuote: "Cotización Gratuita",
    chooseCommunity: "Escoge tu conjunto: Altamira • Terra Sol • Luminara • Paradis",
    changeCommunity: "Cambiar Conjunto",
    viewCommunities: "Ver Conjuntos",
    
    // Gateway Hero
    heroTitle: "Transforma tu Espacio con Pisos de Vinil de Lujo",
    heroSubtitle: "Servicios de instalación de primera categoría y productos de alta gama diseñados para propietarios de viviendas en Miami-Dade, Kendall y Homestead.",
    heroSqft: "SQ FT ÁREA NETA",
    heroStairs: "ESCALONES A MEDIDA",
    heroPackages: "OPCIONES PAQUETE",
    heroResidentialBadge: "Proyecto Residencial",
    heroResidentialTagline: "Instalación Profesional en Homestead & Miami-Dade",
    heroSpecsBrief: "Vinil SPC 100% Resistente al Agua • Capa 20-22 Mils • 15 Escalones Continuos",
    
    // Community Selector
    selectCommunityTitle: "Selecciona tu Conjunto Residencial",
    selectCommunitySubtitle: "Haz clic en tu conjunto para cargar instantáneamente los planos arquitectónicos de tu modelo, render 3D y cotización exacta.",
    availableModelsIn: "MODELOS DISPONIBLES EN",
    floorPlansAndModels: "Planos y Modelos Arquitectónicos",
    modelSelectSubtitle: "Selecciona tu modelo específico para abrir la cotización, render arquitectónico 3D y visualizador interactivo.",
    viewPlanBtn: "Ver Plano y Cotización",
    
    // Model Page Header
    residentialProject: "Proyecto Residencial de Pisos",
    residentialModelDesc: "Renovación completa con instalación profesional en área neta calculada más 15 escalones a medida. Vinil SPC 100% impermeable, diseño continuo y durabilidad garantizada.",
    onlyMaterialTitle: "SOLO MATERIAL",
    onlyMaterialSub: "Entrega Directa en Sitio + Impuestos Incluidos",
    laborTitle: "MANO DE OBRA (LABOR)",
    laborTotal: "$2,950 TOTAL MANO DE OBRA",
    labor1: "Desinstalación y desecho de la alfombra existente",
    labor2: "Parches y nivelación menor de superficies si es necesario",
    labor3: "Instalación profesional del piso en toda el área",
    labor4: "Desinstalación y reinstalación cuidadosa de zócalos",
    labor5: "Instalación de 15 escalones pegados con mismos tablones",
    
    // Render & Blueprints
    view3DRender: "Render 3D Fotorrealista",
    view2DBlueprint: "Plano 2D Interactivo",
    renderTitle: "Plano 2D Interactivo",
    renderSubtitle: "Distribución exacta generada por código a partir de medidas arquitectónicas con Suite Principal, Recámaras 2 y 3, baños, armarios y escalones en el tono seleccionado.",
    activeTone: "Tono de Vinil Activo",
    render3dSectionTitle: "Render 3D Fotorrealista Oficial",
    render3dSectionSubtitle: "Vista comercial tipo dollhouse con mobiliario, sombras e iluminación natural subida por el equipo de diseño.",
    plan2dSectionTitle: "Plano 2D Interactivo y Muestrario en Vivo",
    plan2dSectionSubtitle: "Plano arquitectónico generado automáticamente por código con medidas de habitaciones y color de vinil en tiempo real.",
    
    // Room Visualizer / Color Showcase
    visualizerTitle: "Muestrario de Colores y Acabados",
    visualizerSubtitle: "Explora la gama completa de tonos de vinil de lujo SPC 100% impermeable en tu distribución.",
    selectColorLabel: "Seleccionar Tono de Vinil",
    compareFinishes: "Comparar Colecciones de Vinil",
    launchVisualizerBtn: "Abrir Herramienta de Visualizador 3D Completa",
    launchVisualizerSubtitle: "Utiliza la herramienta interactiva de visualización en quicksurfaces.com",
    roomvoVisualizerBtn: "Visualiza el piso en tu espacio",
    roomvoVisualizerDesc: "Sube o toma una foto de tu habitación con el simulador 3D de Roomvo",
    swatchHelper: "Haz clic en cualquier muestra para actualizar el plano y ver las especificaciones:",
    viewAllSwatches: "Ver los 9 Colores Disponibles",
    
    // Project Scope
    featuresTitle: "¿Por qué elegir nuestro servicio?",
    featuresSubtitle: "Ofrecemos una solución integral para la renovación de tu segundo piso, desde la preparación hasta el acabado final.",
    processTitle: "¿Cómo trabajamos?",
    processSubtitle: "Metodología profesional garantizada en 4 pasos claros desde la preparación hasta la entrega.",
    
    // Pricing
    pricingSectionTitle: "4 Opciones de Paquete",
    pricingSectionSubtitle: "Precios transparentes y todo incluido para la renovación de tu segundo piso. Sin costos ocultos.",
    choosePackage: "Seleccionar Opción",
    popularBadge: "Más Popular",
    premiumBadge: "Máxima Calidad (8mm)",
    summaryTableTitle: "Resumen de Opciones y Precios",
    
    // Catalog & Swatches
    catalogHeaderTitle: "Waterproof Rigid Core SPC Vinyl Floor",
    catalogHeaderSubtitle: "Espesor de 8.0mm con capa de desgaste de 22 Mils y 5.5mm con 20 Mils. 100% impermeable con escalones fabricados con los mismos tablones.",
    specSheet: "FICHA TÉCNICA QUICK SURFACES",
    
    // Gallery
    galleryTitle: "Trabajos Realizados en la Comunidad",
    gallerySubtitle: "Resultados de instalaciones profesionales en escaleras de 15 peldaños, dormitorios y pasillos en Homestead y Miami-Dade.",
    
    // Sticky & Footer
    footerReadyPrompt: "¿Listo para renovar los pisos de tu casa?",
    footerStartingFrom: "Área Neta + 15 Escalones desde $1,550 Paquete Completo",
    bookNowBtn: "Reservar Instalación",
    warranty25: "Garantía 25 Años",
    warranty25Desc: "Uso residencial intensivo",
    waterproof100: "100% Impermeable SPC",
    waterproof100Desc: "Cero absorción de humedad",
    customSteps15: "15 Escalones a Medida",
    customSteps15Desc: "Pegados con el mismo tablón",
    turnkey2Days: "Entrega Rápida",
    turnkey2DaysDesc: "Sin polvo, rápido y limpio",
    
    // Modal
    modalTitle: "Reserva tu Evaluación Gratuita en Sitio",
    modalSubtitle: "Verificación de medidas en tu hogar y presupuesto cerrado garantizado.",
    fullName: "Nombre Completo *",
    phone: "Teléfono (Miami-Dade / FL) *",
    email: "Correo Electrónico",
    preferredDate: "Fecha Estimada para Iniciar",
    address: "Dirección o Número de Lote en Homestead o Kendall",
    confirmBooking: "Confirmar Cotización y Bloquear Tarifa",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English as requested
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string): string => {
    return DICTIONARY[lang][key] || DICTIONARY['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

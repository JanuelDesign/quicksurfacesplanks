const fs = require('fs');
let content = fs.readFileSync('src/data/communitiesAndModels.ts', 'utf8');

const newCommunity = `
  , {
    id: "custom-layouts",
    name: "Modelos Estándar (Generales)",
    city: "Miami",
    state: "FL",
    zip: "33101",
    collections: ["Standard Collection"],
    modelIds: ["generic-500", "generic-700", "generic-900"],
    description: "Planos genéricos para cotizar proyectos fuera de Siena Reserve.",
    heroImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    badge: "General"
  }
`;

content = content.replace("  }", "  }" + newCommunity);

const newModels = `
  , {
    id: "generic-500",
    slug: "generic-500",
    name: "Standard Small",
    communityId: "custom-layouts",
    communityName: "Modelos Estándar",
    collection: "Standard Collection",
    address: "Cualquier Ubicación",
    city: "Miami",
    state: "FL",
    zip: "33101",
    sqft: 500,
    stepsCount: 15,
    bedrooms: 2,
    baths: 2,
    floorLevel: "2nd Floor Layout",
    description: "2 bd · 2 ba - Layout estándar para un 2do piso pequeño.",
    highlights: [
      "Recommended Material: 500 SF"
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 150, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  },
  {
    id: "generic-700",
    slug: "generic-700",
    name: "Standard Medium",
    communityId: "custom-layouts",
    communityName: "Modelos Estándar",
    collection: "Standard Collection",
    address: "Cualquier Ubicación",
    city: "Miami",
    state: "FL",
    zip: "33101",
    sqft: 700,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2,
    floorLevel: "2nd Floor Layout",
    description: "3 bd · 2 ba - Layout estándar para un 2do piso mediano.",
    highlights: [
      "Recommended Material: 700 SF"
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 180, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Bedroom 3", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  },
  {
    id: "generic-900",
    slug: "generic-900",
    name: "Standard Large",
    communityId: "custom-layouts",
    communityName: "Modelos Estándar",
    collection: "Standard Collection",
    address: "Cualquier Ubicación",
    city: "Miami",
    state: "FL",
    zip: "33101",
    sqft: 900,
    stepsCount: 15,
    bedrooms: 4,
    baths: 2,
    floorLevel: "2nd Floor Layout",
    description: "4 bd · 2 ba - Layout estándar para un 2do piso grande.",
    highlights: [
      "Recommended Material: 900 SF"
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 200, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Bedroom 3", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Bedroom 4", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  }
`;

content = content.replace("  }\n];", "  }" + newModels + "\n];");

fs.writeFileSync('src/data/communitiesAndModels.ts', content);


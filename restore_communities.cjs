const fs = require('fs');

let content = fs.readFileSync('src/data/communitiesAndModels.ts', 'utf8');

const additionalCommunities = `
  , {
    id: "altamira",
    name: "Altamira",
    city: "Homestead",
    state: "FL",
    zip: "33035",
    collections: ["Modern Collection"],
    modelIds: ["ibiza", "mallorca"],
    description: "Altamira is a beautiful community offering modern designs and spacious layouts.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    badge: "Modern Collection"
  },
  {
    id: "pine-lakes",
    name: "Pine Lakes",
    city: "Miami",
    state: "FL",
    zip: "33186",
    collections: ["Estate Collection"],
    modelIds: ["redwood", "cedar"],
    description: "Pine Lakes features beautiful estate homes nestled around pristine lakes.",
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    badge: "Estate Collection"
  }
`;

content = content.replace("  }", "  }" + additionalCommunities);

const additionalModels = `
  , {
    id: "ibiza",
    slug: "ibiza",
    name: "Ibiza",
    communityId: "altamira",
    communityName: "Altamira",
    collection: "Modern Collection",
    address: "Homestead, FL",
    city: "Homestead",
    state: "FL",
    zip: "33035",
    sqft: 650,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2.5,
    floorLevel: "2nd Floor Layout",
    description: "3 bd · 2.5 ba - El modelo Ibiza ofrece una distribución moderna con 650 sq ft de espacio para pisos en el segundo nivel, ideal para familias que buscan amplitud y confort.",
    highlights: ["Recommended Material: 650 SF"],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 180, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Bedroom 3", dimensions: "Standard", sqft: 110, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  },
  {
    id: "mallorca",
    slug: "mallorca",
    name: "Mallorca",
    communityId: "altamira",
    communityName: "Altamira",
    collection: "Modern Collection",
    address: "Homestead, FL",
    city: "Homestead",
    state: "FL",
    zip: "33035",
    sqft: 750,
    stepsCount: 15,
    bedrooms: 4,
    baths: 2.5,
    floorLevel: "2nd Floor Layout",
    description: "4 bd · 2.5 ba - El modelo Mallorca es espacioso y versátil, contando con 750 sq ft en la segunda planta para acabados premium y máximo confort.",
    highlights: ["Recommended Material: 750 SF"],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 200, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Bedroom 3", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Bedroom 4", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  },
  {
    id: "redwood",
    slug: "redwood",
    name: "Redwood",
    communityId: "pine-lakes",
    communityName: "Pine Lakes",
    collection: "Estate Collection",
    address: "Miami, FL",
    city: "Miami",
    state: "FL",
    zip: "33186",
    sqft: 800,
    stepsCount: 15,
    bedrooms: 4,
    baths: 3,
    floorLevel: "2nd Floor Layout",
    description: "4 bd · 3 ba - El modelo Redwood destaca por su lujo y gran tamaño, con 800 sq ft en el segundo piso, garantizando una estética imponente y duradera.",
    highlights: ["Recommended Material: 800 SF"],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 220, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 130, highlight: true, type: "bedroom" },
      { name: "Bedroom 3", dimensions: "Standard", sqft: 130, highlight: true, type: "bedroom" },
      { name: "Bedroom 4", dimensions: "Standard", sqft: 120, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  },
  {
    id: "cedar",
    slug: "cedar",
    name: "Cedar",
    communityId: "pine-lakes",
    communityName: "Pine Lakes",
    collection: "Estate Collection",
    address: "Miami, FL",
    city: "Miami",
    state: "FL",
    zip: "33186",
    sqft: 720,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2.5,
    floorLevel: "2nd Floor Layout",
    description: "3 bd · 2.5 ba - El diseño Cedar equilibra funcionalidad y estilo, ofreciendo 720 sq ft ideales para renovar los espacios de toda la familia.",
    highlights: ["Recommended Material: 720 SF"],
    rooms: [
      { name: "Owner's Suite", dimensions: "Standard", sqft: 190, highlight: true, type: "master" },
      { name: "Bedroom 2", dimensions: "Standard", sqft: 125, highlight: true, type: "bedroom" },
      { name: "Bedroom 3", dimensions: "Standard", sqft: 125, highlight: true, type: "bedroom" },
      { name: "Stairs (15 Steps)", dimensions: "15 Treads", sqft: 45, highlight: true, type: "stairs" }
    ],
    svgDimensions: { width: 440, height: 740 }
  }
`;

content = content.replace("  }\n];", "  }" + additionalModels + "\n];");

// Now let's update descriptions for Siena Reserve and generic models
content = content.replace(
  '"description": "3 bd · 3 ba · 1,334 ft² - The Bandol model features ~565 sq ft of second-floor flooring area."',
  '"description": "3 bd · 3 ba · 1,334 ft² - El modelo Bandol es eficiente e ideal para familias modernas, con ~565 sq ft de superficie neta para pisos de lujo en el segundo nivel."'
);
content = content.replace(
  '"description": "3 bd · 2.5 ba · 1,414 ft² - The Casis model features ~600 sq ft of second-floor flooring area."',
  '"description": "3 bd · 2.5 ba · 1,414 ft² - El diseño Casis ofrece un balance perfecto entre espacio y estilo, requiriendo ~600 sq ft de material para renovar todo el segundo piso."'
);
content = content.replace(
  '"description": "3 bd · 2.5 ba · 1,489 ft² - The Monte Carlo model features ~635 sq ft of second-floor flooring area."',
  '"description": "3 bd · 2.5 ba · 1,489 ft² - Monte Carlo destaca por sus habitaciones más amplias, cubriendo ~635 sq ft de superficie continua sin interrupciones para una vista elegante."'
);
content = content.replace(
  '"description": "3 bd · 2.5 ba · 1,545 ft² - The Reserve model features ~660 sq ft of second-floor flooring area."',
  '"description": "3 bd · 2.5 ba · 1,545 ft² - El modelo insignia Reserve maximiza la luz y el confort, ocupando ~660 sq ft de pisos que realzan cada uno de sus tres dormitorios."'
);
content = content.replace(
  '"description": "3 bd · 2.5 ba · 1,668 ft² - The Vence model features ~720 sq ft of second-floor flooring area."',
  '"description": "3 bd · 2.5 ba · 1,668 ft² - Vence es el modelo más espacioso de Siena Reserve, con ~720 sq ft ideales para acabados de formato ancho (XL) que denotan puro lujo."'
);

// Generics
content = content.replace(
  'description: "2 bd · 2 ba - Layout estándar para un 2do piso pequeño."',
  'description: "2 bd · 2 ba - Un diseño estándar y versátil, perfecto para renovaciones rápidas en apartamentos o townhomes de tamaño reducido, cubriendo aproximadamente 500 sq ft."'
);
content = content.replace(
  'description: "3 bd · 2 ba - Layout estándar para un 2do piso mediano."',
  'description: "3 bd · 2 ba - Nuestra opción de layout más solicitada. Adapta perfectamente pisos SPC a espacios medianos de hasta 700 sq ft con resultados impresionantes."'
);
content = content.replace(
  'description: "4 bd · 2 ba - Layout estándar para un 2do piso grande."',
  'description: "4 bd · 2 ba - Diseñado para propiedades grandes, este layout garantiza que la instalación de pisos fluya impecablemente a través de múltiples habitaciones en 900 sq ft."'
);


fs.writeFileSync('src/data/communitiesAndModels.ts', content);


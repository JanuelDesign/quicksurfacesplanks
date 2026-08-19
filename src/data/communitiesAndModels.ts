import { Community, FloorPlanModel } from '../types';

export const COMMUNITIES: Community[] = [
  {
    "id": "siena-reserve",
    "slug": "siena-reserve",
    "name": "Siena Reserve",
    "city": "Homestead",
    "state": "FL",
    "zip": "33032",
    "collections": [
      "Adora Collection"
    ],
    "modelIds": [
      "bandol",
      "casis",
      "monte-carlo",
      "reserve",
      "vence"
    ],
    "description": "A beautiful community in Homestead offering modern two-story townhomes with spacious second-floor living areas.",
    "heroImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "badge": "Adora Collection"
  }
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

];

export const FLOOR_PLAN_MODELS: FloorPlanModel[] = [
  {
    "id": "bandol",
    "slug": "bandol",
    "name": "Bandol",
    "communityId": "siena-reserve",
    "communityName": "Siena Reserve",
    "collection": "Adora Collection",
    "address": "12705 SW 232nd St",
    "city": "Homestead",
    "state": "FL",
    "zip": "33032",
    "sqft": 625,
    "stepsCount": 15,
    "bedrooms": 3,
    "baths": 3,
    "floorLevel": "2nd Floor Layout",
    "description": "3 bd · 3 ba · 1,334 ft² - El modelo Bandol es eficiente e ideal para familias modernas, con ~565 sq ft de superficie neta para pisos de lujo en el segundo nivel.",
    "highlights": [
      "Total House: 1,334 SF",
      "2nd Floor Approx: ~665 SF",
      "Area to Cover (Minus Baths/AC): ~565 SF",
      "Recommended Material (~10% Waste): ~625 SF"
    ],
    "rooms": [
      {
        "name": "Owner's Suite",
        "dimensions": "12' x 10' 10\"",
        "sqft": 130,
        "highlight": true,
        "type": "master"
      },
      {
        "name": "Walk-In Closet",
        "dimensions": "Standard",
        "sqft": 30,
        "highlight": true,
        "type": "closet"
      },
      {
        "name": "Bedroom 2",
        "dimensions": "12' x 10'",
        "sqft": 120,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Bedroom 3 / Flex",
        "dimensions": "Standard",
        "sqft": 110,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Stairs (15 Steps)",
        "dimensions": "15 Treads",
        "sqft": 45,
        "highlight": true,
        "type": "stairs"
      }
    ],
    "svgDimensions": {
      "width": 440,
      "height": 740
    }
  },
  {
    "id": "casis",
    "slug": "casis",
    "name": "Casis",
    "communityId": "siena-reserve",
    "communityName": "Siena Reserve",
    "collection": "Adora Collection",
    "address": "12705 SW 232nd St",
    "city": "Homestead",
    "state": "FL",
    "zip": "33032",
    "sqft": 660,
    "stepsCount": 15,
    "bedrooms": 3,
    "baths": 2.5,
    "floorLevel": "2nd Floor Layout",
    "description": "3 bd · 2.5 ba · 1,414 ft² - El diseño Casis ofrece un balance perfecto entre espacio y estilo, requiriendo ~600 sq ft de material para renovar todo el segundo piso.",
    "highlights": [
      "Total House: 1,414 SF",
      "2nd Floor Approx: ~705 SF",
      "Area to Cover (Minus Baths/AC): ~600 SF",
      "Recommended Material (~10% Waste): ~660 SF"
    ],
    "rooms": [
      {
        "name": "Owner's Suite",
        "dimensions": "15' x 12'",
        "sqft": 180,
        "highlight": true,
        "type": "master"
      },
      {
        "name": "Walk-In Closet",
        "dimensions": "Standard",
        "sqft": 40,
        "highlight": true,
        "type": "closet"
      },
      {
        "name": "Bedroom 2",
        "dimensions": "10' x 11'",
        "sqft": 110,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Bedroom 3",
        "dimensions": "10' x 10' 6\"",
        "sqft": 105,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Stairs (15 Steps)",
        "dimensions": "15 Treads",
        "sqft": 45,
        "highlight": true,
        "type": "stairs"
      }
    ],
    "svgDimensions": {
      "width": 440,
      "height": 740
    }
  },
  {
    "id": "monte-carlo",
    "slug": "monte-carlo",
    "name": "Monte Carlo",
    "communityId": "siena-reserve",
    "communityName": "Siena Reserve",
    "collection": "Adora Collection",
    "address": "12705 SW 232nd St",
    "city": "Homestead",
    "state": "FL",
    "zip": "33032",
    "sqft": 700,
    "stepsCount": 15,
    "bedrooms": 3,
    "baths": 2.5,
    "floorLevel": "2nd Floor Layout",
    "description": "3 bd · 2.5 ba · 1,489 ft² - Monte Carlo destaca por sus habitaciones más amplias, cubriendo ~635 sq ft de superficie continua sin interrupciones para una vista elegante.",
    "highlights": [
      "Total House: 1,489 SF",
      "2nd Floor Approx: ~745 SF",
      "Area to Cover (Minus Baths/AC): ~635 SF",
      "Recommended Material (~10% Waste): ~700 SF"
    ],
    "rooms": [
      {
        "name": "Owner's Suite",
        "dimensions": "12' x 12' 10\"",
        "sqft": 154,
        "highlight": true,
        "type": "master"
      },
      {
        "name": "Walk-In Closet",
        "dimensions": "Standard",
        "sqft": 40,
        "highlight": true,
        "type": "closet"
      },
      {
        "name": "Bedroom 2",
        "dimensions": "10' 4\" x 10' 2\"",
        "sqft": 105,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Bedroom 3",
        "dimensions": "10' x 10' 6\"",
        "sqft": 105,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Stairs (15 Steps)",
        "dimensions": "15 Treads",
        "sqft": 45,
        "highlight": true,
        "type": "stairs"
      }
    ],
    "svgDimensions": {
      "width": 440,
      "height": 740
    }
  },
  {
    "id": "reserve",
    "slug": "reserve",
    "name": "Reserve",
    "communityId": "siena-reserve",
    "communityName": "Siena Reserve",
    "collection": "Adora Collection",
    "address": "12705 SW 232nd St",
    "city": "Homestead",
    "state": "FL",
    "zip": "33032",
    "sqft": 730,
    "stepsCount": 15,
    "bedrooms": 3,
    "baths": 2.5,
    "floorLevel": "2nd Floor Layout",
    "description": "3 bd · 2.5 ba · 1,545 ft² - El modelo insignia Reserve maximiza la luz y el confort, ocupando ~660 sq ft de pisos que realzan cada uno de sus tres dormitorios.",
    "highlights": [
      "Total House: 1,545 SF",
      "2nd Floor Approx: ~770 SF",
      "Area to Cover (Minus Baths/AC): ~660 SF",
      "Recommended Material (~10% Waste): ~730 SF"
    ],
    "rooms": [
      {
        "name": "Owner's Suite",
        "dimensions": "12' x 15' 10\"",
        "sqft": 190,
        "highlight": true,
        "type": "master"
      },
      {
        "name": "Walk-In Closet",
        "dimensions": "Standard",
        "sqft": 45,
        "highlight": true,
        "type": "closet"
      },
      {
        "name": "Bedroom 2",
        "dimensions": "10' 11\" x 10'",
        "sqft": 110,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Bedroom 3",
        "dimensions": "10' 2\" x 11'",
        "sqft": 112,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Stairs (15 Steps)",
        "dimensions": "15 Treads",
        "sqft": 45,
        "highlight": true,
        "type": "stairs"
      }
    ],
    "svgDimensions": {
      "width": 440,
      "height": 740
    }
  },
  {
    "id": "vence",
    "slug": "vence",
    "name": "Vence",
    "communityId": "siena-reserve",
    "communityName": "Siena Reserve",
    "collection": "Adora Collection",
    "address": "12705 SW 232nd St",
    "city": "Homestead",
    "state": "FL",
    "zip": "33032",
    "sqft": 800,
    "stepsCount": 15,
    "bedrooms": 3,
    "baths": 2.5,
    "floorLevel": "2nd Floor Layout",
    "description": "3 bd · 2.5 ba · 1,668 ft² - Vence es el modelo más espacioso de Siena Reserve, con ~720 sq ft ideales para acabados de formato ancho (XL) que denotan puro lujo.",
    "highlights": [
      "Total House: 1,668 SF",
      "2nd Floor Approx: ~835 SF",
      "Area to Cover (Minus Baths/AC): ~720 SF",
      "Recommended Material (~10% Waste): ~800 SF"
    ],
    "rooms": [
      {
        "name": "Owner's Suite",
        "dimensions": "12' x 15'",
        "sqft": 180,
        "highlight": true,
        "type": "master"
      },
      {
        "name": "Walk-In Closet",
        "dimensions": "Standard",
        "sqft": 45,
        "highlight": true,
        "type": "closet"
      },
      {
        "name": "Bedroom 2",
        "dimensions": "10' x 11'",
        "sqft": 110,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Bedroom 3",
        "dimensions": "10' 2\" x 11'",
        "sqft": 112,
        "highlight": true,
        "type": "bedroom"
      },
      {
        "name": "Stairs (15 Steps)",
        "dimensions": "15 Treads",
        "sqft": 45,
        "highlight": true,
        "type": "stairs"
      }
    ],
    "svgDimensions": {
      "width": 440,
      "height": 740
    }
  }
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
    description: "2 bd · 2 ba - Un diseño estándar y versátil, perfecto para renovaciones rápidas en apartamentos o townhomes de tamaño reducido, cubriendo aproximadamente 500 sq ft.",
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
    description: "3 bd · 2 ba - Nuestra opción de layout más solicitada. Adapta perfectamente pisos SPC a espacios medianos de hasta 700 sq ft con resultados impresionantes.",
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
    description: "4 bd · 2 ba - Diseñado para propiedades grandes, este layout garantiza que la instalación de pisos fluya impecablemente a través de múltiples habitaciones en 900 sq ft.",
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

];

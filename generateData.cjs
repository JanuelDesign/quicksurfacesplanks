const fs = require('fs');

const communities = [
  {
    id: 'siena-reserve',
    slug: 'siena-reserve',
    name: 'Siena Reserve',
    city: 'Homestead',
    state: 'FL',
    zip: '33032',
    collections: ['Adora Collection'],
    modelIds: ['bandol', 'casis', 'monte-carlo', 'reserve', 'vence'],
    description: 'A beautiful community in Homestead offering modern two-story townhomes with spacious second-floor living areas.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Adora Collection',
  }
];

const models = [
  {
    id: 'bandol',
    slug: 'bandol',
    name: 'Bandol',
    communityId: 'siena-reserve',
    communityName: 'Siena Reserve',
    collection: 'Adora Collection',
    address: '12705 SW 232nd St',
    city: 'Homestead',
    state: 'FL',
    zip: '33032',
    sqft: 625, // Using "Material con ~10% waste" here since this is what we use to calculate the price. Or maybe net area? The screenshot says "Area Aprox A Cubrir: ~565" and "Material con ~10% waste: ~625". The original had "530" which was 530 sqft flat price. Let's use the material with waste, since they buy by box.
    stepsCount: 15,
    bedrooms: 3,
    baths: 3,
    floorLevel: '2nd Floor Layout',
    description: '3 bd · 3 ba · 1,334 ft² - The Bandol model features ~565 sq ft of second-floor flooring area.',
    highlights: [
      'Total House: 1,334 SF',
      '2nd Floor Approx: ~665 SF',
      'Area to Cover (Minus Baths/AC): ~565 SF',
      'Recommended Material (~10% Waste): ~625 SF'
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "12' x 10' 10\"", sqft: 130, highlight: true, type: 'master' },
      { name: 'Walk-In Closet', dimensions: "Standard", sqft: 30, highlight: true, type: 'closet' },
      { name: 'Bedroom 2', dimensions: "12' x 10'", sqft: 120, highlight: true, type: 'bedroom' },
      { name: 'Bedroom 3 / Flex', dimensions: "Standard", sqft: 110, highlight: true, type: 'bedroom' },
      { name: 'Stairs (15 Steps)', dimensions: '15 Treads', sqft: 45, highlight: true, type: 'stairs' },
    ],
    svgDimensions: { width: 440, height: 740 },
  },
  {
    id: 'casis',
    slug: 'casis',
    name: 'Casis',
    communityId: 'siena-reserve',
    communityName: 'Siena Reserve',
    collection: 'Adora Collection',
    address: '12705 SW 232nd St',
    city: 'Homestead',
    state: 'FL',
    zip: '33032',
    sqft: 660,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2.5,
    floorLevel: '2nd Floor Layout',
    description: '3 bd · 2.5 ba · 1,414 ft² - The Casis model features ~600 sq ft of second-floor flooring area.',
    highlights: [
      'Total House: 1,414 SF',
      '2nd Floor Approx: ~705 SF',
      'Area to Cover (Minus Baths/AC): ~600 SF',
      'Recommended Material (~10% Waste): ~660 SF'
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "15' x 12'", sqft: 180, highlight: true, type: 'master' },
      { name: 'Walk-In Closet', dimensions: "Standard", sqft: 40, highlight: true, type: 'closet' },
      { name: 'Bedroom 2', dimensions: "10' x 11'", sqft: 110, highlight: true, type: 'bedroom' },
      { name: 'Bedroom 3', dimensions: "10' x 10' 6\"", sqft: 105, highlight: true, type: 'bedroom' },
      { name: 'Stairs (15 Steps)', dimensions: '15 Treads', sqft: 45, highlight: true, type: 'stairs' },
    ],
    svgDimensions: { width: 440, height: 740 },
  },
  {
    id: 'monte-carlo',
    slug: 'monte-carlo',
    name: 'Monte Carlo',
    communityId: 'siena-reserve',
    communityName: 'Siena Reserve',
    collection: 'Adora Collection',
    address: '12705 SW 232nd St',
    city: 'Homestead',
    state: 'FL',
    zip: '33032',
    sqft: 700,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2.5,
    floorLevel: '2nd Floor Layout',
    description: '3 bd · 2.5 ba · 1,489 ft² - The Monte Carlo model features ~635 sq ft of second-floor flooring area.',
    highlights: [
      'Total House: 1,489 SF',
      '2nd Floor Approx: ~745 SF',
      'Area to Cover (Minus Baths/AC): ~635 SF',
      'Recommended Material (~10% Waste): ~700 SF'
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "12' x 12' 10\"", sqft: 154, highlight: true, type: 'master' },
      { name: 'Walk-In Closet', dimensions: "Standard", sqft: 40, highlight: true, type: 'closet' },
      { name: 'Bedroom 2', dimensions: "10' 4\" x 10' 2\"", sqft: 105, highlight: true, type: 'bedroom' },
      { name: 'Bedroom 3', dimensions: "10' x 10' 6\"", sqft: 105, highlight: true, type: 'bedroom' },
      { name: 'Stairs (15 Steps)', dimensions: '15 Treads', sqft: 45, highlight: true, type: 'stairs' },
    ],
    svgDimensions: { width: 440, height: 740 },
  },
  {
    id: 'reserve',
    slug: 'reserve',
    name: 'Reserve',
    communityId: 'siena-reserve',
    communityName: 'Siena Reserve',
    collection: 'Adora Collection',
    address: '12705 SW 232nd St',
    city: 'Homestead',
    state: 'FL',
    zip: '33032',
    sqft: 730,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2.5,
    floorLevel: '2nd Floor Layout',
    description: '3 bd · 2.5 ba · 1,545 ft² - The Reserve model features ~660 sq ft of second-floor flooring area.',
    highlights: [
      'Total House: 1,545 SF',
      '2nd Floor Approx: ~770 SF',
      'Area to Cover (Minus Baths/AC): ~660 SF',
      'Recommended Material (~10% Waste): ~730 SF'
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "12' x 15' 10\"", sqft: 190, highlight: true, type: 'master' },
      { name: 'Walk-In Closet', dimensions: "Standard", sqft: 45, highlight: true, type: 'closet' },
      { name: 'Bedroom 2', dimensions: "10' 11\" x 10'", sqft: 110, highlight: true, type: 'bedroom' },
      { name: 'Bedroom 3', dimensions: "10' 2\" x 11'", sqft: 112, highlight: true, type: 'bedroom' },
      { name: 'Stairs (15 Steps)', dimensions: '15 Treads', sqft: 45, highlight: true, type: 'stairs' },
    ],
    svgDimensions: { width: 440, height: 740 },
  },
  {
    id: 'vence',
    slug: 'vence',
    name: 'Vence',
    communityId: 'siena-reserve',
    communityName: 'Siena Reserve',
    collection: 'Adora Collection',
    address: '12705 SW 232nd St',
    city: 'Homestead',
    state: 'FL',
    zip: '33032',
    sqft: 800,
    stepsCount: 15,
    bedrooms: 3,
    baths: 2.5,
    floorLevel: '2nd Floor Layout',
    description: '3 bd · 2.5 ba · 1,668 ft² - The Vence model features ~720 sq ft of second-floor flooring area.',
    highlights: [
      'Total House: 1,668 SF',
      '2nd Floor Approx: ~835 SF',
      'Area to Cover (Minus Baths/AC): ~720 SF',
      'Recommended Material (~10% Waste): ~800 SF'
    ],
    rooms: [
      { name: "Owner's Suite", dimensions: "12' x 15'", sqft: 180, highlight: true, type: 'master' },
      { name: 'Walk-In Closet', dimensions: "Standard", sqft: 45, highlight: true, type: 'closet' },
      { name: 'Bedroom 2', dimensions: "10' x 11'", sqft: 110, highlight: true, type: 'bedroom' },
      { name: 'Bedroom 3', dimensions: "10' 2\" x 11'", sqft: 112, highlight: true, type: 'bedroom' },
      { name: 'Stairs (15 Steps)', dimensions: '15 Treads', sqft: 45, highlight: true, type: 'stairs' },
    ],
    svgDimensions: { width: 440, height: 740 },
  }
];

const content = `import { Community, FloorPlanModel } from '../types';

export const COMMUNITIES: Community[] = ${JSON.stringify(communities, null, 2)};

export const FLOOR_PLAN_MODELS: FloorPlanModel[] = ${JSON.stringify(models, null, 2)};
`;

fs.writeFileSync('src/data/communitiesAndModels.ts', content);

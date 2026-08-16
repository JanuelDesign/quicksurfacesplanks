import { FloorPlanModel, FlooringProduct, PricingPackage } from '../types';
import { COMMUNITIES as DEFAULT_COMMUNITIES, FLOOR_PLAN_MODELS as DEFAULT_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS as DEFAULT_PRODUCTS, PRICING_PACKAGES as DEFAULT_PACKAGES } from '../data/products';

const SHEET_ID = '1AMavYDq0jmyc9_8sab_5ICUGY5N860ahiCM0ignx76A';

// Helper to parse CSV rows safely handling quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      if (row.length > 0 && row.some((c) => c !== '')) {
        lines.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some((c) => c !== '')) {
      lines.push(row);
    }
  }

  return lines;
}

// Helper to normalize image URLs (especially GitHub raw URLs)
function normalizeImageUrl(url: string | undefined): string {
  if (!url) return '';
  let cleanUrl = url.trim();
  // Transform GitHub blob URLs to raw user content for direct, high-speed image rendering
  if (cleanUrl.includes('github.com') && cleanUrl.includes('/blob/')) {
    cleanUrl = cleanUrl
      .replace('https://github.com/', 'https://raw.githubusercontent.com/')
      .replace('/blob/', '/');
    // strip ?raw=true if converted to raw.githubusercontent.com
    cleanUrl = cleanUrl.replace('?raw=true', '');
  }
  return cleanUrl;
}

export async function fetchLiveDatabase() {
  try {
    const [commRes, floorRes, priceRes] = await Promise.all([
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Communities_Models`),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Flooring_Catalog`),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Pricing_Packages`),
    ]);

    let models = DEFAULT_MODELS;
    let products = DEFAULT_PRODUCTS;
    let packages = DEFAULT_PACKAGES;

    // 1. Parse Models
    if (commRes.ok) {
      const commText = await commRes.text();
      const rows = parseCSV(commText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const idIdx = header.indexOf('id');
        const slugIdx = header.indexOf('slug');
        const nameIdx = header.indexOf('name');
        const commIdIdx = header.indexOf('community_id');
        const commNameIdx = header.indexOf('community_name');
        const cityIdx = header.indexOf('city');
        const stateIdx = header.indexOf('state');
        const zipIdx = header.indexOf('zip');
        const collectionIdx = header.indexOf('collection');
        const addressIdx = header.indexOf('address');
        const sqftIdx = header.indexOf('sqft');
        const stepsIdx = header.indexOf('steps_count');
        const bedIdx = header.indexOf('bedrooms');
        const bathIdx = header.indexOf('baths');
        const descIdx = header.indexOf('description');
        const planImgIdx = header.indexOf('image_floorplan');
        const renderImgIdx = header.indexOf('image_3d_render');

        const parsedModels: FloorPlanModel[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx] || !r[idIdx]) continue;
          parsedModels.push({
            id: r[idIdx] || `model-${i}`,
            slug: r[slugIdx] || r[idIdx],
            name: r[nameIdx],
            communityId: r[commIdIdx] || 'altamira',
            communityName: r[commNameIdx] || 'Altamira',
            collection: r[collectionIdx] || 'Modern Collection',
            address: r[addressIdx] || 'Homestead, FL',
            city: r[cityIdx] || 'Homestead',
            state: r[stateIdx] || 'FL',
            zip: r[zipIdx] || '33035',
            sqft: parseInt(r[sqftIdx], 10) || 530,
            stepsCount: parseInt(r[stepsIdx], 10) || 15,
            bedrooms: parseInt(r[bedIdx], 10) || 3,
            baths: parseInt(r[bathIdx], 10) || 2,
            floorLevel: '2nd Floor Layout',
            highlights: ['Sound Insulation Pad', '100% Waterproof Rigid Core', 'Staircase Transition System'],
            description: r[descIdx] || '',
            floorPlanImage: normalizeImageUrl(r[planImgIdx]) || DEFAULT_MODELS[0].floorPlanImage,
            render3DImage: normalizeImageUrl(r[renderImgIdx]) || DEFAULT_MODELS[0].render3DImage,
            rooms: DEFAULT_MODELS[0].rooms,
            svgDimensions: { width: 800, height: 600 },
          });
        }
        if (parsedModels.length > 0) models = parsedModels;
      }
    }

    // 2. Parse Products
    if (floorRes.ok) {
      const floorText = await floorRes.text();
      const rows = parseCSV(floorText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const idIdx = header.indexOf('id');
        const codeIdx = header.indexOf('code');
        const nameIdx = header.indexOf('name');
        const catIdx = header.indexOf('category');
        const colIdx = header.indexOf('collection_name');
        const thickIdx = header.indexOf('thickness');
        const wearIdx = header.indexOf('wear_layer');
        const plankDimIdx = header.indexOf('plank_dimensions');
        const padIdx = header.indexOf('padding');
        const hexIdx = header.indexOf('color_hex');
        const descIdx = header.indexOf('description');
        const plankImgIdx = header.indexOf('plank_image_url');
        const roomImgIdx = header.indexOf('room_preview_url');
        const stairImgIdx = header.indexOf('staircase_preview_url');
        const stockIdx = header.findIndex(
          (h) => h === 'in_stock' || h === 'stock' || h === 'status' || h === 'availability' || h === 'inventory'
        );

        const parsedProducts: FlooringProduct[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx] || !r[idIdx]) continue;
          
          let collection: any = 'PulseSelect';
          if (r[colIdx]?.includes('Shield') || r[colIdx]?.includes('XL')) collection = 'PulseShield XL';
          if (r[colIdx]?.includes('Rigid') || r[colIdx]?.includes('8mm')) collection = 'Waterproof Rigid Core SPC';

          const plankImg = normalizeImageUrl(r[plankImgIdx]) || DEFAULT_PRODUCTS[0].plankImageUrl;
          const roomImg = normalizeImageUrl(r[roomImgIdx]) || DEFAULT_PRODUCTS[0].roomPreviewUrl;
          const stairImg = normalizeImageUrl(r[stairImgIdx]) || DEFAULT_PRODUCTS[0].staircasePreviewUrl;

          // Parse Stock Status
          const rawStock = (stockIdx !== -1 && r[stockIdx] ? r[stockIdx].trim().toLowerCase() : 'in_stock');
          let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon' = 'in_stock';
          let inStockBool = true;

          if (rawStock.includes('low') || rawStock.includes('pocas') || rawStock.includes('ultim')) {
            stockStatus = 'low_stock';
            inStockBool = true;
          } else if (rawStock.includes('out') || rawStock.includes('agotad') || rawStock === 'false' || rawStock === '0' || rawStock === 'no') {
            stockStatus = 'out_of_stock';
            inStockBool = false;
          } else if (rawStock.includes('soon') || rawStock.includes('proxim') || rawStock.includes('pronto')) {
            stockStatus = 'coming_soon';
            inStockBool = false;
          } else {
            stockStatus = 'in_stock';
            inStockBool = true;
          }

          parsedProducts.push({
            id: r[idIdx],
            code: r[codeIdx] || `0${i}`,
            name: r[nameIdx],
            category: (r[catIdx] as any) || '5.5mm',
            collectionName: collection,
            thickness: r[thickIdx] || '5.5 mm',
            wearLayer: r[wearIdx] || '20 Mil',
            plankDimensions: r[plankDimIdx] || '7" x 48"',
            padding: r[padIdx] || '1.5 mm HD EVA Attached',
            planksPerBox: 9,
            sqftPerBox: 24.26,
            finish: 'Satin Embossed',
            installationType: 'Click-Lock Floating Unilin Angle-Angle',
            tone: 'natural',
            colorHex: r[hexIdx] || '#c7b299',
            secondaryColorHex: '#8b7355',
            grainStyle: 'Authentic European Oak',
            description: r[descIdx] || '',
            inStock: inStockBool,
            stockStatus: stockStatus,
            isLowStock: stockStatus === 'low_stock',
            isComingSoon: stockStatus === 'coming_soon',
            plankImageUrl: plankImg,
            roomPreviewUrl: roomImg,
            staircasePreviewUrl: stairImg,
            imageUrl: plankImg,
          });
        }
        if (parsedProducts.length > 0) products = parsedProducts;
      }
    }

    // 3. Parse Pricing Packages
    if (priceRes.ok) {
      const priceText = await priceRes.text();
      const rows = parseCSV(priceText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const idIdx = header.indexOf('id');
        const titleIdx = header.indexOf('title');
        const taglineIdx = header.indexOf('tagline');
        const thickIdx = header.indexOf('thickness');
        const wearIdx = header.indexOf('wear_layer');
        const plankIdx = header.indexOf('plank_size');
        const priceIdx = header.indexOf('price');
        const turnkeyIdx = header.indexOf('is_turnkey');
        const laborIdx = header.indexOf('includes_labor');
        const badgeIdx = header.indexOf('badge');

        const parsedPackages: PricingPackage[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[titleIdx] || !r[idIdx]) continue;
          parsedPackages.push({
            id: r[idIdx],
            title: r[titleIdx],
            tagline: r[taglineIdx] || '',
            thickness: r[thickIdx] || '5.5mm',
            wearLayer: r[wearIdx] || '20 Mils',
            plankSize: r[plankIdx] || '7" x 48"',
            price: parseInt(r[priceIdx], 10) || 4500,
            isTurnkey: r[turnkeyIdx]?.toUpperCase() === 'TRUE',
            includesLabor: r[laborIdx]?.toUpperCase() === 'TRUE',
            badge: r[badgeIdx] || 'Popular',
            features: [
              `Plank Spec: ${r[thickIdx]} (${r[wearIdx]})`,
              `Plank Size: ${r[plankIdx]}`,
              `Staircase fabrication included`,
              `100% Waterproof Rigid Core`,
            ],
            specs: [
              { label: 'Thickness', value: r[thickIdx] || '5.5mm' },
              { label: 'Wear Layer', value: r[wearIdx] || '20 Mils' },
            ],
          });
        }
        if (parsedPackages.length > 0) packages = parsedPackages;
      }
    }

    return {
      models,
      products,
      packages,
      isLive: true,
    };
  } catch (error) {
    console.warn('Could not sync with Google Sheets, falling back to local database:', error);
    return {
      models: DEFAULT_MODELS,
      products: DEFAULT_PRODUCTS,
      packages: DEFAULT_PACKAGES,
      isLive: false,
    };
  }
}

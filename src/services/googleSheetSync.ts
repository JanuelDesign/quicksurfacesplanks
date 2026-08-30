import { FloorPlanModel, FlooringProduct, PricingPackage } from '../types';
import { COMMUNITIES as DEFAULT_COMMUNITIES, FLOOR_PLAN_MODELS as DEFAULT_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS as DEFAULT_PRODUCTS, PRICING_PACKAGES as DEFAULT_PACKAGES } from '../data/products';
import { GalleryItem, GALLERY_ITEMS as DEFAULT_GALLERY_ITEMS } from '../components/GallerySection';
import { TestimonialItem, TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../data/testimonials';
import {
  StairTechnicalImage,
  StairVerticalCard,
  StairProjectItem,
  STAIR_TECHNICAL_IMAGES as DEFAULT_STAIR_TECHNICAL,
  STAIR_VERTICAL_CARDS as DEFAULT_STAIR_VERTICAL,
  INSTALLED_STAIRS_CAROUSEL as DEFAULT_STAIR_CAROUSEL,
} from '../data/stairsGallery';

const SHEET_ID = '1AMavYDq0jmyc9_8sab_5ICUGY5N860ahiCM0ignx76A';

export const SIENA_RESERVE_BANNER_URL = 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/banners/siena-reserve-entrance.webp';

// Helper to parse CSV rows safely handling quotes
function parseCSV(text: string): string[][] {
  if (!text || text.startsWith('/*O_o*/') || text.includes('"status":"error"')) {
    return [];
  }

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

// Helper to normalize image URLs
export function normalizeImageUrl(url: string | undefined): string {
  if (!url) return '';
  let cleanUrl = url.trim().replace(/^["']|["']$/g, '');
  if (cleanUrl.includes('github.com')) {
    cleanUrl = cleanUrl
      .replace('https://github.com/', 'https://raw.githubusercontent.com/')
      .replace('/blob/', '/')
      .replace('/raw/', '/');
    cleanUrl = cleanUrl.replace('?raw=true', '');
  }
  // If user pasted Google Drive preview link
  if (cleanUrl.includes('drive.google.com') && cleanUrl.includes('/file/d/')) {
    const match = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      cleanUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  return cleanUrl;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface LiveDatabaseResult {
  models: FloorPlanModel[];
  products: FlooringProduct[];
  packages: PricingPackage[];
  galleryItems: GalleryItem[];
  testimonials: TestimonialItem[];
  stairTechnicalImages: StairTechnicalImage[];
  stairVerticalCards: StairVerticalCard[];
  stairCarouselItems: StairProjectItem[];
  bannerUrl: string;
  isLive: boolean;
}

export async function fetchLiveDatabase(): Promise<LiveDatabaseResult> {
  try {
    const fetchSheet = async (sheetName: string) => {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`);
        if (!res.ok) return '';
        const text = await res.text();
        if (text.startsWith('/*O_o*/') || text.includes('"status":"error"')) return '';
        return text;
      } catch (e) {
        console.warn(`Failed fetching sheet: ${sheetName}`, e);
        return '';
      }
    };

    const [commText, floorText, priceText, galleryText, aboutText, stairsText] = await Promise.all([
      fetchSheet('Communities_Models'),
      fetchSheet('Products_Colors'),
      fetchSheet('Pricing_Packages'),
      fetchSheet('Gallery_Projects'),
      fetchSheet('About_Us_Photos'),
      fetchSheet('Stairs_Gallery'),
    ]);

    let models = DEFAULT_MODELS;
    let products = DEFAULT_PRODUCTS;
    let packages = DEFAULT_PACKAGES;
    let galleryItems = DEFAULT_GALLERY_ITEMS;
    let testimonials = DEFAULT_TESTIMONIALS;
    let stairTechnicalImages = DEFAULT_STAIR_TECHNICAL;
    let stairVerticalCards = DEFAULT_STAIR_VERTICAL;
    let stairCarouselItems = DEFAULT_STAIR_CAROUSEL;

    // 1. Parse Models
    if (commText) {
      const rows = parseCSV(commText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        
        const idIdx = header.indexOf('id');
        const slugIdx = header.indexOf('slug');
        const nameIdx = header.findIndex((h) => h === 'name' || h === 'model_name');
        const commIdIdx = header.findIndex((h) => h === 'community_id' || h === 'community_slug');
        const commNameIdx = header.indexOf('community_name');
        const colIdx = header.findIndex((h) => h === 'collection' || h === 'collection_name');
        const colSlugIdx = header.indexOf('collection_slug');
        const cityIdx = header.indexOf('city');
        const stateIdx = header.indexOf('state');
        const zipIdx = header.indexOf('zip');
        const addressIdx = header.indexOf('address');
        const sqftIdx = header.findIndex((h) => h === 'sqft' || h === 'sqft_total');
        const sqft1stIdx = header.findIndex((h) => h === 'sqft_first_floor' || h === 'sqft_1st' || h === 'sqft_1st_floor');
        const sqft2ndIdx = header.findIndex((h) => h === 'sqft_second_floor' || h === 'sqft_2nd' || h === 'sqft_2nd_floor');
        const sqftNetIdx = header.indexOf('sqft_net');
        const sqftMatIdx = header.findIndex((h) => h === 'sqft_material_recommended' || h === 'sqft_recommended');
        const priceFromIdx = header.indexOf('price_from');
        const stepsIdx = header.indexOf('steps_count');
        const bedIdx = header.indexOf('bedrooms');
        const bathIdx = header.indexOf('baths');
        const descIdx = header.indexOf('description');
        const ownerDimsIdx = header.indexOf('owner_suite_dims');
        const ownerSqftIdx = header.indexOf('owner_suite_sqft');
        const closetSqftIdx = header.indexOf('walk_in_closet_sqft');
        const bed2DimsIdx = header.indexOf('bedroom_2_dims');
        const bed2SqftIdx = header.indexOf('bedroom_2_sqft');
        const bed3DimsIdx = header.indexOf('bedroom_3_dims');
        const bed3SqftIdx = header.indexOf('bedroom_3_sqft');
        const bed4DimsIdx = header.indexOf('bedroom_4_dims');
        const bed4SqftIdx = header.indexOf('bedroom_4_sqft');
        const stairsSqftIdx = header.indexOf('stairs_sqft');
        const planImgIdx = header.findIndex((h) => h === 'image_floorplan' || h === 'image_floor_plan');
        const renderImgIdx = header.indexOf('image_3d_render');
        const facadeImgIdx = header.indexOf('image_facade');

        const parsedModels: FloorPlanModel[] = [];
        const seenModelIds = new Set<string>();
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx]) continue;

          const modelName = r[nameIdx];
          const communityName = r[commNameIdx] || 'Siena Reserve';
          const communitySlug = r[commIdIdx] || slugify(communityName);
          const collectionName = r[colIdx] || 'Townhomes';
          const collectionSlug = r[colSlugIdx] || slugify(collectionName.replace('Collection', ''));
          const modelSlug = slugify(modelName);

          const rawUniqueId = r[idIdx] || `${communitySlug}_${collectionSlug}_${modelSlug}`;
          let uniqueId = rawUniqueId;
          let counter = 1;
          while (seenModelIds.has(uniqueId)) {
            uniqueId = `${rawUniqueId}_${counter}`;
            counter++;
          }
          seenModelIds.add(uniqueId);

          const totalSqft = parseInt(r[sqftIdx], 10) || 1400;
          const raw1st = sqft1stIdx !== -1 && r[sqft1stIdx] ? parseInt(r[sqft1stIdx], 10) : 0;
          const raw2nd = sqft2ndIdx !== -1 && r[sqft2ndIdx] ? parseInt(r[sqft2ndIdx], 10) : 0;

          const sqftFirstFloorRec = raw1st || Math.round(totalSqft * 0.41);
          const sqftFirstFloor = Math.round(sqftFirstFloorRec / 1.07);

          const sqftSecondFloorRec = raw2nd || Math.round(totalSqft * 0.37);
          const sqftSecondFloor = Math.round(sqftSecondFloorRec / 1.07);

          const sqftNet = sqftNetIdx !== -1 && r[sqftNetIdx] ? parseInt(r[sqftNetIdx], 10) : (sqftFirstFloor + sqftSecondFloor);
          const sqftMaterialRecommended = sqftMatIdx !== -1 && r[sqftMatIdx] ? parseInt(r[sqftMatIdx], 10) : (sqftFirstFloorRec + sqftSecondFloorRec);

          const raw3dRender = renderImgIdx !== -1 && r[renderImgIdx] ? normalizeImageUrl(r[renderImgIdx]) : undefined;
          const rawFacade = facadeImgIdx !== -1 && r[facadeImgIdx] ? normalizeImageUrl(r[facadeImgIdx]) : undefined;

          // Preserve rich default rooms if available
          const defaultMatch = DEFAULT_MODELS.find(
            (dm) => dm.slug === (r[slugIdx] || uniqueId) || dm.name.toLowerCase() === modelName.toLowerCase() || dm.id.includes(modelSlug)
          );

          parsedModels.push({
            id: uniqueId,
            slug: r[slugIdx] || uniqueId,
            name: modelName,
            displayNameSafe: modelName,
            communityId: communitySlug,
            communityName: communityName,
            collection: collectionName,
            collectionSlug: collectionSlug,
            address: r[addressIdx] || '12705 SW 232nd St',
            city: r[cityIdx] || 'Homestead',
            state: r[stateIdx] || 'FL',
            zip: r[zipIdx] || '33032',
            sqft: totalSqft,
            sqftFirstFloor,
            sqftFirstFloorRec,
            sqftSecondFloor,
            sqftSecondFloorRec,
            sqftNet,
            sqftMaterialRecommended,
            priceFrom: priceFromIdx !== -1 && r[priceFromIdx] ? parseInt(r[priceFromIdx], 10) : undefined,
            stepsCount: parseInt(r[stepsIdx], 10) || 17,
            bedrooms: parseInt(r[bedIdx], 10) || 3,
            baths: parseFloat(r[bathIdx]) || 2.5,
            floorLevel: '1er & 2do Piso',
            ownerSuiteDims: ownerDimsIdx !== -1 && r[ownerDimsIdx] ? r[ownerDimsIdx] : "12' x 12'",
            ownerSuiteSqft: ownerSqftIdx !== -1 && r[ownerSqftIdx] ? parseInt(r[ownerSqftIdx], 10) : 180,
            walkInClosetSqft: closetSqftIdx !== -1 && r[closetSqftIdx] ? parseInt(r[closetSqftIdx], 10) : 45,
            bedroom2Dims: bed2DimsIdx !== -1 && r[bed2DimsIdx] ? r[bed2DimsIdx] : "10' x 11'",
            bedroom2Sqft: bed2SqftIdx !== -1 && r[bed2SqftIdx] ? parseInt(r[bed2SqftIdx], 10) : 110,
            bedroom3Dims: bed3DimsIdx !== -1 && r[bed3DimsIdx] ? r[bed3DimsIdx] : "10' x 10'",
            bedroom3Sqft: bed3SqftIdx !== -1 && r[bed3SqftIdx] ? parseInt(r[bed3SqftIdx], 10) : 100,
            bedroom4Dims: bed4DimsIdx !== -1 && r[bed4DimsIdx] ? r[bed4DimsIdx] : undefined,
            bedroom4Sqft: bed4SqftIdx !== -1 && r[bed4SqftIdx] ? parseInt(r[bed4SqftIdx], 10) : undefined,
            stairsSqft: stairsSqftIdx !== -1 && r[stairsSqftIdx] ? parseInt(r[stairsSqftIdx], 10) : 60,
            highlights: [
              `Total Construcción: ${totalSqft} SF`,
              `1er Piso (+7% Desperdicio): ~${sqftFirstFloorRec} SF`,
              `2do Piso (+7% Desperdicio): ~${sqftSecondFloorRec} SF`,
              'Escaleras: 17 Escalones Square Step Nose',
            ],
            description: r[descIdx] || `${modelName} en ${communityName} · ${collectionName}`,
            floorPlanImage: planImgIdx !== -1 && r[planImgIdx] ? normalizeImageUrl(r[planImgIdx]) : defaultMatch?.floorPlanImage,
            render3DImage: raw3dRender || defaultMatch?.render3DImage,
            render3DImageFloor1: defaultMatch?.render3DImageFloor1,
            render3DImageFloor2: defaultMatch?.render3DImageFloor2,
            render3DImageBoth: defaultMatch?.render3DImageBoth,
            rooms: defaultMatch ? defaultMatch.rooms : DEFAULT_MODELS[0].rooms,
            firstFloorRooms: defaultMatch ? defaultMatch.firstFloorRooms : DEFAULT_MODELS[0].firstFloorRooms,
            secondFloorRooms: defaultMatch ? defaultMatch.secondFloorRooms : DEFAULT_MODELS[0].secondFloorRooms,
            svgDimensions: { width: 440, height: 740 },
          });
        }
        if (parsedModels.length > 0) models = parsedModels;
      }
    }

    // 2. Parse Products
    if (floorText) {
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
        const sqftBoxIdx = header.indexOf('sqft_per_box');
        const planksBoxIdx = header.indexOf('planks_per_box');
        const pricePerSqftIdx = header.findIndex((h) => h === 'price_per_sqft' || h === 'price');
        const stairCostIdx = header.findIndex((h) => h === 'stair_material_cost' || h === 'price_per_stair_step');
        const hexIdx = header.indexOf('color_hex');
        const descIdx = header.indexOf('description');
        const plankImgIdx = header.findIndex((h) => h === 'plank_image_url' || h === 'image_url' || h === 'image');
        const roomImgIdx = header.indexOf('room_preview_url');
        const stairImgIdx = header.indexOf('staircase_preview_url');
        const stockIdx = header.findIndex(
          (h) => h === 'stock_status' || h === 'in_stock' || h === 'stock' || h === 'status' || h === 'availability'
        );

        const parsedProducts: FlooringProduct[] = [];
        const seenProductIds = new Set<string>();
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx]) continue;
          
          let collection: any = 'Pulse Select';
          if (r[colIdx]?.includes('Shield') || r[colIdx]?.includes('6') || r[thickIdx]?.includes('6')) collection = 'Pulse Shield XL';
          if (r[colIdx]?.includes('Rigid') || r[colIdx]?.includes('8') || r[colIdx]?.includes('XL Pulse') || r[thickIdx]?.includes('8')) collection = 'XL Pulse';

          const plankImg = normalizeImageUrl(r[plankImgIdx]) || DEFAULT_PRODUCTS[0].plankImageUrl;
          const roomImg = normalizeImageUrl(r[roomImgIdx]) || DEFAULT_PRODUCTS[0].roomPreviewUrl;
          const stairImg = normalizeImageUrl(r[stairImgIdx]) || DEFAULT_PRODUCTS[0].staircasePreviewUrl;

          // Parse Stock Status
          const rawStock = (stockIdx !== -1 && r[stockIdx] ? r[stockIdx].trim().toLowerCase() : 'in_stock');
          let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon' = 'in_stock';
          let inStockBool = true;

          if (rawStock.includes('low') || rawStock.includes('pocas') || rawStock.includes('limitad')) {
            stockStatus = 'low_stock';
            inStockBool = true;
          } else if (rawStock.includes('out') || rawStock.includes('agotad') || rawStock === 'false' || rawStock === '0') {
            stockStatus = 'out_of_stock';
            inStockBool = false;
          } else if (rawStock.includes('soon') || rawStock.includes('proxim') || rawStock.includes('pronto')) {
            stockStatus = 'coming_soon';
            inStockBool = false;
          } else {
            stockStatus = 'in_stock';
            inStockBool = true;
          }

          const sqftBox = sqftBoxIdx !== -1 && r[sqftBoxIdx] ? parseFloat(r[sqftBoxIdx]) : (collection === 'XL Pulse' ? 19.29 : collection === 'Pulse Shield XL' ? 26.6 : 24.26);
          const planksBox = planksBoxIdx !== -1 && r[planksBoxIdx] ? parseInt(r[planksBoxIdx], 10) : (collection === 'XL Pulse' ? 5 : collection === 'Pulse Shield XL' ? 7 : 9);

          const productCategory = (r[catIdx] as any) || (collection === 'XL Pulse' ? '8mm' : collection === 'Pulse Shield XL' ? '6mm' : '5.5mm');
          
          // Sheet price or category fallback
          const defaultPricePerSqft = productCategory === '8mm' ? 2.39 : productCategory === '6mm' ? 1.89 : 1.69;
          const pricePerSqft = pricePerSqftIdx !== -1 && r[pricePerSqftIdx] ? parseFloat(r[pricePerSqftIdx]) : defaultPricePerSqft;

          const defaultStairCost = productCategory === '8mm' ? 747.72 : productCategory === '6mm' ? 676.37 : 589.00;
          const stairMaterialCost = stairCostIdx !== -1 && r[stairCostIdx] ? parseFloat(r[stairCostIdx]) : defaultStairCost;

          const rawProdId = (r[idIdx] || `prod-${slugify(r[nameIdx]) || i}`).trim();
          let uniqueProdId = rawProdId;
          let counter = 1;
          while (seenProductIds.has(uniqueProdId)) {
            uniqueProdId = `${rawProdId}-${counter}`;
            counter++;
          }
          seenProductIds.add(uniqueProdId);

          parsedProducts.push({
            id: uniqueProdId,
            code: r[codeIdx] || `0${i}`,
            name: r[nameIdx],
            category: productCategory,
            collectionName: collection,
            thickness: r[thickIdx] || (collection === 'XL Pulse' ? '8.0mm' : collection === 'Pulse Shield XL' ? '6.0mm' : '5.5mm'),
            wearLayer: r[wearIdx] || (collection === 'XL Pulse' ? '22 mil' : '20 mil'),
            plankDimensions: r[plankDimIdx] || (collection === 'Pulse Select' ? '7" x 48"' : '9" x 60"'),
            padding: r[padIdx] || '1.5mm High-Density EVA Pad',
            planksPerBox: planksBox,
            sqftPerBox: sqftBox,
            pricePerSqft,
            stairMaterialCost,
            finish: 'EIR Real Wood Feel',
            installationType: 'Click-Lock Floating System',
            tone: 'natural',
            colorHex: r[hexIdx] || '#C5A986',
            secondaryColorHex: '#A28766',
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
    if (priceText) {
      const rows = parseCSV(priceText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const idIdx = header.indexOf('id') !== -1 ? header.indexOf('id') : header.indexOf('package_id');
        const titleIdx = header.indexOf('title') !== -1 ? header.indexOf('title') : header.indexOf('package_name');
        const taglineIdx = header.indexOf('tagline');
        const thickIdx = header.indexOf('thickness');
        const wearIdx = header.indexOf('wear_layer');
        const plankIdx = header.indexOf('plank_size');
        const priceIdx = header.indexOf('price');
        const base530Idx = header.indexOf('base_price_at_530_sqft');
        const rateMatIdx = header.indexOf('rate_per_sqft_material');
        const rateLaborIdx = header.indexOf('rate_per_sqft_labor') !== -1 ? header.indexOf('rate_per_sqft_labor') : header.indexOf('labor_rate_floor');
        const stairFeeIdx = header.indexOf('stair_flat_fee') !== -1 ? header.indexOf('stair_flat_fee') : header.indexOf('labor_rate_stairs');
        const turnkeyIdx = header.indexOf('is_turnkey');
        const laborIdx = header.indexOf('includes_labor');
        const badgeIdx = header.indexOf('badge') !== -1 ? header.indexOf('badge') : header.indexOf('badge_text');

        const parsedPackages: PricingPackage[] = [];
        const seenPackageIds = new Set<string>();
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[titleIdx]) continue;

          const isTurnkey = r[turnkeyIdx]?.toUpperCase() === 'TRUE';
          const isPrem = r[titleIdx].toLowerCase().includes('premium') || r[thickIdx]?.includes('8');
          const basePrice = base530Idx !== -1 && r[base530Idx] ? parseInt(r[base530Idx], 10) : (parseInt(r[priceIdx], 10) || (isTurnkey ? 4500 : 1550));
          const rateMat = rateMatIdx !== -1 && r[rateMatIdx] ? parseFloat(r[rateMatIdx]) : (isPrem ? 3.8679 : 2.9245);
          const stairFee = stairFeeIdx !== -1 && r[stairFeeIdx] ? parseInt(r[stairFeeIdx], 10) : (isTurnkey ? 2950 : 0);

          const rawPkgId = (r[idIdx] || `pkg-${slugify(r[titleIdx]) || i}`).trim();
          let uniquePkgId = rawPkgId;
          let counter = 1;
          while (seenPackageIds.has(uniquePkgId)) {
            uniquePkgId = `${rawPkgId}-${counter}`;
            counter++;
          }
          seenPackageIds.add(uniquePkgId);

          parsedPackages.push({
            id: uniquePkgId,
            title: r[titleIdx],
            tagline: r[taglineIdx] || '',
            thickness: r[thickIdx] || (isPrem ? '8.0mm' : '5.5mm'),
            wearLayer: r[wearIdx] || (isPrem ? '22 mil' : '20 mil'),
            plankSize: r[plankIdx] || (isPrem ? '9" x 60"' : '7" x 48"'),
            basePriceAt530Sqft: basePrice,
            ratePerSqftMaterial: rateMat,
            ratePerSqftLabor: rateLaborIdx !== -1 && r[rateLaborIdx] ? parseFloat(r[rateLaborIdx]) : (isTurnkey ? 2.0 : 0),
            stairFlatFee: stairFee,
            price: basePrice,
            isTurnkey: isTurnkey,
            includesLabor: r[laborIdx]?.toUpperCase() === 'TRUE' || isTurnkey,
            badge: r[badgeIdx] || (isTurnkey ? 'MÁS POPULAR' : undefined),
            features: [
              `Piso SPC ${r[thickIdx] || '5.5mm'} (${r[wearIdx] || '20 mil'})`,
              `Formato: ${r[plankIdx] || '7" x 48"'}`,
              isTurnkey ? '17 Escalones Square Step Nose a medida incluidos' : 'Entrega directa en Homestead ($60.00)',
            ],
            featuresEn: [
              `SPC Flooring ${r[thickIdx] || '5.5mm'} (${r[wearIdx] || '20 mil'})`,
              `Format: ${r[plankIdx] || '7" x 48"'}`,
              isTurnkey ? '17 Custom Square Step Noses included' : 'Direct jobsite delivery in Homestead ($60.00)',
            ],
            inclusions: [
              'Cálculo de cajas con +7% de desperdicio fijo',
              'Acabado impermeable 100% rígido',
            ],
            inclusionsEn: [
              'Boxes calculated with fixed +7% waste factor',
              '100% rigid waterproof finish',
            ],
            specs: [
              { label: 'Espesor', value: r[thickIdx] || '5.5mm' },
              { label: 'Wear Layer', value: r[wearIdx] || '20 mil' },
            ],
          });
        }
        if (parsedPackages.length > 0) packages = parsedPackages;
      }
    }

    // 4. Parse Gallery Projects (Tab: Gallery_Projects)
    if (galleryText) {
      const rows = parseCSV(galleryText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const idIdx = header.indexOf('id');
        const fileIdx = header.indexOf('file_name');
        const titleEsIdx = header.findIndex((h) => h === 'title_es' || h === 'title');
        const titleEnIdx = header.findIndex((h) => h === 'title_en' || h === 'titleen');
        const spaceTypeIdx = header.indexOf('space_type');
        const spaceLabelEsIdx = header.indexOf('space_label_es');
        const spaceLabelEnIdx = header.indexOf('space_label_en');
        const colIdx = header.indexOf('collection');
        const prodCodeIdx = header.indexOf('product_code');
        const prodNameIdx = header.indexOf('product_name');
        const commIdx = header.indexOf('community');
        const locIdx = header.indexOf('location');
        const imgIdx = header.findIndex((h) => h === 'image_url' || h === 'image' || h === 'img_url');
        const tagEsIdx = header.indexOf('tag_es');
        const tagEnIdx = header.indexOf('tag_en');
        const descEsIdx = header.findIndex((h) => h === 'description_es' || h === 'description');
        const descEnIdx = header.findIndex((h) => h === 'description_en' || h === 'descriptionen');
        const craftEsIdx = header.findIndex((h) => h === 'craft_highlights_es' || h === 'craft_highlights');
        const craftEnIdx = header.findIndex((h) => h === 'craft_highlights_en' || h === 'craft_highlights_en');

        const parsedGallery: GalleryItem[] = [];
        const seenGalleryIds = new Set<string>();
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[titleEsIdx] && !r[idIdx] && !r[imgIdx]) continue;

          const rawCraftEs = craftEsIdx !== -1 && r[craftEsIdx] ? r[craftEsIdx] : '';
          const craftListEs = rawCraftEs.includes('|')
            ? rawCraftEs.split('|').map((s) => s.trim()).filter(Boolean)
            : rawCraftEs ? [rawCraftEs] : ['Square Step Nose integrado sin tropiezos', 'Pegado estructural de máxima adherencia'];

          const rawCraftEn = craftEnIdx !== -1 && r[craftEnIdx] ? r[craftEnIdx] : '';
          const craftListEn = rawCraftEn.includes('|')
            ? rawCraftEn.split('|').map((s) => s.trim()).filter(Boolean)
            : rawCraftEn ? [rawCraftEn] : ['Seamless square step nosing with zero trip hazard', 'Structural polyurethane full-spread adhesion'];

          const rawImg = imgIdx !== -1 && r[imgIdx] ? normalizeImageUrl(r[imgIdx]) : '';

          const rawGalId = (idIdx !== -1 && r[idIdx] ? r[idIdx] : `gal-${i}`).trim();
          let uniqueGalId = rawGalId;
          let counter = 1;
          while (seenGalleryIds.has(uniqueGalId)) {
            uniqueGalId = `${rawGalId}-${counter}`;
            counter++;
          }
          seenGalleryIds.add(uniqueGalId);

          const tagEs = (tagEsIdx !== -1 && r[tagEsIdx]) ? r[tagEsIdx] : 'Instalación Real Siena Reserve';
          const tagEn = (tagEnIdx !== -1 && r[tagEnIdx]) ? r[tagEnIdx] : 'Real Installation Siena Reserve';

          parsedGallery.push({
            id: uniqueGalId,
            fileName: (fileIdx !== -1 && r[fileIdx]) ? r[fileIdx] : `gallery-0${i}.webp`,
            title: (titleEsIdx !== -1 && r[titleEsIdx]) ? r[titleEsIdx] : tagEs,
            titleEn: (titleEnIdx !== -1 && r[titleEnIdx]) ? r[titleEnIdx] : tagEn,
            spaceType: (spaceTypeIdx !== -1 && r[spaceTypeIdx]) ? (r[spaceTypeIdx] as any) : 'stairs',
            spaceLabel: (spaceLabelEsIdx !== -1 && r[spaceLabelEsIdx]) ? r[spaceLabelEsIdx] : tagEs,
            spaceLabelEn: (spaceLabelEnIdx !== -1 && r[spaceLabelEnIdx]) ? r[spaceLabelEnIdx] : tagEn,
            collection: (colIdx !== -1 && r[colIdx]) ? (r[colIdx] as any) : '8mm',
            productName: (prodNameIdx !== -1 && r[prodNameIdx]) ? r[prodNameIdx] : 'Piso Vinílico SPC',
            productCode: (prodCodeIdx !== -1 && r[prodCodeIdx]) ? r[prodCodeIdx] : 'Q-01',
            community: (commIdx !== -1 && r[commIdx]) ? r[commIdx] : 'Siena Reserve',
            location: (locIdx !== -1 && r[locIdx]) ? r[locIdx] : 'Homestead, FL',
            imageUrl: rawImg || `https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/gallery/gallery-0${i}.webp`,
            tag: tagEs,
            tagEn: tagEn,
            description: (descEsIdx !== -1 && r[descEsIdx]) ? r[descEsIdx] : 'Instalación profesional con garantía de 25 años.',
            descriptionEn: (descEnIdx !== -1 && r[descEnIdx]) ? r[descEnIdx] : 'Professional installation with 25-year warranty.',
            craftHighlights: craftListEs,
            craftHighlightsEn: craftListEn,
          });
        }
        if (parsedGallery.length > 0) galleryItems = parsedGallery;
      }
    }

    // 5. Parse About Us & Testimonials (Tab: About_Us_Photos)
    if (aboutText) {
      const rows = parseCSV(aboutText);
      if (rows.length > 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const idIdx = header.indexOf('id');
        const nameIdx = header.findIndex((h) => h === 'client_name' || h === 'name');
        const roleEsIdx = header.findIndex((h) => h === 'role_es' || h === 'role');
        const roleEnIdx = header.findIndex((h) => h === 'role_en' || h === 'roleen');
        const commIdx = header.indexOf('community');
        const quoteEsIdx = header.findIndex((h) => h === 'quote_es' || h === 'quote');
        const quoteEnIdx = header.findIndex((h) => h === 'quote_en' || h === 'quoteen');
        const tagEsIdx = header.indexOf('tag_es');
        const tagEnIdx = header.indexOf('tag_en');
        const ratingIdx = header.indexOf('rating');
        const imgIdx = header.findIndex((h) => h === 'image_url' || h === 'image');

        const parsedTestimonials: TestimonialItem[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx]) continue;

          const rawImg = imgIdx !== -1 && r[imgIdx] ? normalizeImageUrl(r[imgIdx]) : '';
          const ratingVal = ratingIdx !== -1 && r[ratingIdx] ? parseFloat(r[ratingIdx]) : 5;

          parsedTestimonials.push({
            id: (idIdx !== -1 && r[idIdx] ? r[idIdx] : `testimonio-${i}`).trim(),
            clientName: r[nameIdx],
            role: (roleEsIdx !== -1 && r[roleEsIdx]) ? r[roleEsIdx] : 'Cliente Residencial',
            roleEn: (roleEnIdx !== -1 && r[roleEnIdx]) ? r[roleEnIdx] : 'Residential Client',
            community: (commIdx !== -1 && r[commIdx]) ? r[commIdx] : 'Homestead, FL',
            imageFileName: `about-0${i}.webp`,
            githubUrl: rawImg,
            localUrl: rawImg,
            rating: isNaN(ratingVal) ? 5 : ratingVal,
            quote: (quoteEsIdx !== -1 && r[quoteEsIdx]) ? r[quoteEsIdx] : 'Excelente calidad de los pisos y atención impecable.',
            quoteEn: (quoteEnIdx !== -1 && r[quoteEnIdx]) ? r[quoteEnIdx] : 'Outstanding flooring quality and flawless craftsmanship.',
            tag: (tagEsIdx !== -1 && r[tagEsIdx]) ? r[tagEsIdx] : 'Cliente Verificado',
            tagEn: (tagEnIdx !== -1 && r[tagEnIdx]) ? r[tagEnIdx] : 'Verified Client',
          });
        }
        if (parsedTestimonials.length > 0) testimonials = parsedTestimonials;
      }
    }

    // 6. Parse Stairs Gallery (Tab: Stairs_Gallery)
    if (stairsText) {
      const rows = parseCSV(stairsText);
      if (rows.length >= 1) {
        const header = rows[0].map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
        const sectionIdx = header.findIndex((h) => h.startsWith('section') || h.includes('section') || h.includes('type'));
        const idIdx = header.findIndex((h) => h.startsWith('id') || h.includes('id'));
        const titleEsIdx = header.findIndex((h) => h.startsWith('title_es') || h.includes('title_es') || h.includes('title'));
        const titleEnIdx = header.findIndex((h) => h.startsWith('title_en') || h.includes('title_en') || h.includes('titleen'));
        const subEsIdx = header.findIndex((h) => h.startsWith('subtitle_es') || h.includes('subtitle_es') || h.includes('subtitle') || h.includes('desc'));
        const subEnIdx = header.findIndex((h) => h.startsWith('subtitle_en') || h.includes('subtitle_en') || h.includes('subtitleen') || h.includes('desc'));
        const imgIdx = header.findIndex((h) => h.startsWith('image_url') || h.includes('image') || h.includes('url') || h.includes('http'));
        const tagEsIdx = header.findIndex((h) => h.startsWith('tag_es') || h.includes('tag') || h.includes('badge'));
        const tagEnIdx = header.findIndex((h) => h.startsWith('tag_en') || h.includes('tagen') || h.includes('badgeen'));
        const commIdx = header.findIndex((h) => h.startsWith('community') || h.includes('comm'));
        const colorNameIdx = header.findIndex((h) => h.startsWith('color_name') || h.includes('color_name') || h.includes('color'));
        const colorCodeIdx = header.findIndex((h) => h.startsWith('color_code') || h.includes('color_code') || h.includes('code'));
        const thickIdx = header.findIndex((h) => h.startsWith('thickness') || h.includes('thick'));
        const stepsIdx = header.findIndex((h) => h.startsWith('steps_count') || h.includes('step'));

        const parsedTech: StairTechnicalImage[] = [];
        const parsedVert: StairVerticalCard[] = [];
        const parsedCarousel: StairProjectItem[] = [];

        // Check if row 0 itself contains embedded multi-URLs in the image header
        const row0ImgCell = imgIdx !== -1 ? rows[0][imgIdx] : '';
        if (row0ImgCell && row0ImgCell.includes('http')) {
          const extractedUrls = row0ImgCell.match(/https?:\/\/[^\s"]+/g) || [];
          if (extractedUrls.length >= 1) {
            parsedTech.push({
              id: 'stair-tech-1',
              title: 'Pieza Square Step Nose (Perfil al Ras)',
              titleEn: 'Square Step Nose Profile (Flush Finish)',
              subtitle: 'Acabado monobloque sin pestaña plástica (Zero Overlap)',
              subtitleEn: 'Monoblock finish without plastic overlap lip (Zero Overlap)',
              imageUrl: normalizeImageUrl(extractedUrls[0]),
              tag: 'Perfil 100% al Ras',
              tagEn: '100% Flush Profile',
            });
          }
          if (extractedUrls.length >= 2) {
            parsedTech.push({
              id: 'stair-tech-2',
              title: 'Diagrama de Ensamble y Fijación Estructural',
              titleEn: 'Assembly & Structural Adhesion Diagram',
              subtitle: 'Fijación con polímero elástico de alta adherencia y clic continuo',
              subtitleEn: 'High-strength elastic polymer bonding and continuous click-lock',
              imageUrl: normalizeImageUrl(extractedUrls[1]),
              tag: 'Fijación Polimérica',
              tagEn: 'Polymer Bonding',
            });
          }
          if (extractedUrls.length >= 3) {
            parsedVert.push({
              id: 'stair-vert-1',
              title: 'Transición al Ras Sin Pestañas',
              titleEn: 'Flush Transition Without Overlap',
              subtitle: 'Acabado minimalista moderno de alta seguridad',
              subtitleEn: 'Modern minimalist high-safety finish',
              aspectRatio: '9:16',
              dimensions: '768x1365',
              imageUrl: normalizeImageUrl(extractedUrls[2]),
              badge: 'Formato 9:16',
              badgeEn: 'Format 9:16',
            });
          }
          if (extractedUrls.length >= 4) {
            parsedVert.push({
              id: 'stair-vert-2',
              title: 'Escalera Completa de 17 Pasos',
              titleEn: 'Complete 17-Step Staircase',
              subtitle: 'Instalación estructural en Siena Reserve',
              subtitleEn: 'Structural installation in Siena Reserve',
              aspectRatio: '9:16',
              dimensions: '768x1365',
              imageUrl: normalizeImageUrl(extractedUrls[3]),
              badge: '17 Escalones',
              badgeEn: '17 Steps',
            });
          }
        }

        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          const rawImg = imgIdx !== -1 && r[imgIdx] ? normalizeImageUrl(r[imgIdx]) : '';
          if (!rawImg && !r[titleEsIdx]) continue;

          const sectionVal = (sectionIdx !== -1 && r[sectionIdx] ? r[sectionIdx].toLowerCase() : '').trim();
          const rowId = (idIdx !== -1 && r[idIdx] ? r[idIdx] : `stair-${i}`).trim();
          const titleEs = (titleEsIdx !== -1 && r[titleEsIdx]) ? r[titleEsIdx] : 'Escalera QuickSurfaces';
          const titleEn = (titleEnIdx !== -1 && r[titleEnIdx]) ? r[titleEnIdx] : 'QuickSurfaces Staircase';
          const subEs = (subEsIdx !== -1 && r[subEsIdx]) ? r[subEsIdx] : '';
          const subEn = (subEnIdx !== -1 && r[subEnIdx]) ? r[subEnIdx] : '';
          const tagEs = (tagEsIdx !== -1 && r[tagEsIdx]) ? r[tagEsIdx] : 'Square Step Nose';
          const tagEn = (tagEnIdx !== -1 && r[tagEnIdx]) ? r[tagEnIdx] : 'Square Step Nose';

          if (sectionVal.includes('tech') || sectionVal.includes('perfil') || sectionVal.includes('diagram') || rowId.includes('tech')) {
            parsedTech.push({
              id: rowId,
              title: titleEs,
              titleEn: titleEn,
              subtitle: subEs,
              subtitleEn: subEn,
              imageUrl: rawImg,
              tag: tagEs,
              tagEn: tagEn,
            });
          } else if (sectionVal.includes('vert') || sectionVal.includes('9:16') || sectionVal.includes('format') || rowId.includes('vert')) {
            parsedVert.push({
              id: rowId,
              title: titleEs,
              titleEn: titleEn,
              subtitle: subEs,
              subtitleEn: subEn,
              aspectRatio: '9:16',
              dimensions: '768x1365',
              imageUrl: rawImg,
              badge: tagEs,
              badgeEn: tagEn,
            });
          } else {
            // Default to carousel
            const stepsCountVal = stepsIdx !== -1 && r[stepsIdx] ? parseInt(r[stepsIdx]) : 17;
            parsedCarousel.push({
              id: rowId,
              title: titleEs,
              titleEn: titleEn,
              community: (commIdx !== -1 && r[commIdx]) ? r[commIdx] : 'Siena Reserve (Homestead, FL)',
              colorName: (colorNameIdx !== -1 && r[colorNameIdx]) ? r[colorNameIdx] : 'SPC Color',
              colorCode: (colorCodeIdx !== -1 && r[colorCodeIdx]) ? r[colorCodeIdx] : '01',
              thickness: (thickIdx !== -1 && r[thickIdx]) ? r[thickIdx] : '5.5mm',
              imageUrl: rawImg,
              description: subEs,
              descriptionEn: subEn,
              stepsCount: isNaN(stepsCountVal) ? 17 : stepsCountVal,
            });
          }
        }

        if (parsedTech.length > 0) stairTechnicalImages = parsedTech;
        if (parsedVert.length > 0) stairVerticalCards = parsedVert;
        if (parsedCarousel.length > 0) stairCarouselItems = parsedCarousel;
      }
    }

    return {
      models,
      products,
      packages,
      galleryItems,
      testimonials,
      stairTechnicalImages,
      stairVerticalCards,
      stairCarouselItems,
      bannerUrl: SIENA_RESERVE_BANNER_URL,
      isLive: true,
    };
  } catch (error) {
    console.warn('Could not sync with Google Sheets, falling back to local database:', error);
    return {
      models: DEFAULT_MODELS,
      products: DEFAULT_PRODUCTS,
      packages: DEFAULT_PACKAGES,
      galleryItems: DEFAULT_GALLERY_ITEMS,
      testimonials: DEFAULT_TESTIMONIALS,
      stairTechnicalImages: DEFAULT_STAIR_TECHNICAL,
      stairVerticalCards: DEFAULT_STAIR_VERTICAL,
      stairCarouselItems: DEFAULT_STAIR_CAROUSEL,
      bannerUrl: SIENA_RESERVE_BANNER_URL,
      isLive: false,
    };
  }
}

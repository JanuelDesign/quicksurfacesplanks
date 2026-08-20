import { FloorPlanModel, FlooringProduct, PricingPackage } from '../types';
import { COMMUNITIES as DEFAULT_COMMUNITIES, FLOOR_PLAN_MODELS as DEFAULT_MODELS } from '../data/communitiesAndModels';
import { FLOORING_PRODUCTS as DEFAULT_PRODUCTS, PRICING_PACKAGES as DEFAULT_PACKAGES } from '../data/products';
import { GalleryItem, GALLERY_ITEMS as DEFAULT_GALLERY_ITEMS } from '../components/GallerySection';

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

// Helper to normalize image URLs
function normalizeImageUrl(url: string | undefined): string {
  if (!url) return '';
  let cleanUrl = url.trim();
  if (cleanUrl.includes('github.com') && cleanUrl.includes('/blob/')) {
    cleanUrl = cleanUrl
      .replace('https://github.com/', 'https://raw.githubusercontent.com/')
      .replace('/blob/', '/');
    cleanUrl = cleanUrl.replace('?raw=true', '');
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

export async function fetchLiveDatabase() {
  try {
    const [commRes, floorRes, priceRes, galleryRes] = await Promise.all([
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Communities_Models`),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Flooring_Catalog`),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Pricing_Packages`),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Gallery_Projects`),
    ]);

    let models = DEFAULT_MODELS;
    let products = DEFAULT_PRODUCTS;
    let packages = DEFAULT_PACKAGES;
    let galleryItems = DEFAULT_GALLERY_ITEMS;

    // 1. Parse Models
    if (commRes.ok) {
      const commText = await commRes.text();
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
        const sqft2ndIdx = header.indexOf('sqft_second_floor');
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
        const planImgIdx = header.indexOf('image_floorplan');
        const renderImgIdx = header.indexOf('image_3d_render');

        const parsedModels: FloorPlanModel[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx]) continue;

          const modelName = r[nameIdx];
          const communityName = r[commNameIdx] || 'Siena Reserve';
          const communitySlug = r[commIdIdx] || slugify(communityName);
          const collectionName = r[colIdx] || 'Adora Collection';
          const collectionSlug = r[colSlugIdx] || slugify(collectionName.replace('Collection', ''));
          const modelSlug = slugify(modelName);

          const uniqueId = r[idIdx] || `${communitySlug}_${collectionSlug}_${modelSlug}`;

          const totalSqft = parseInt(r[sqftIdx], 10) || 1400;
          const sqftSecondFloor = sqft2ndIdx !== -1 && r[sqft2ndIdx] ? parseInt(r[sqft2ndIdx], 10) : Math.round(totalSqft * 0.5);
          const sqftNet = sqftNetIdx !== -1 && r[sqftNetIdx] ? parseInt(r[sqftNetIdx], 10) : Math.round(sqftSecondFloor * 0.85);
          const sqftMaterialRecommended = sqftMatIdx !== -1 && r[sqftMatIdx] ? parseInt(r[sqftMatIdx], 10) : Math.round(sqftNet * 1.1);

          const raw3dRender = renderImgIdx !== -1 && r[renderImgIdx] ? normalizeImageUrl(r[renderImgIdx]) : undefined;

          parsedModels.push({
            id: uniqueId,
            slug: r[slugIdx] || uniqueId,
            name: modelName,
            communityId: communitySlug,
            communityName: communityName,
            collection: collectionName,
            collectionSlug: collectionSlug,
            address: r[addressIdx] || '12705 SW 232nd St',
            city: r[cityIdx] || 'Homestead',
            state: r[stateIdx] || 'FL',
            zip: r[zipIdx] || '33032',
            sqft: totalSqft,
            sqftSecondFloor,
            sqftNet,
            sqftMaterialRecommended,
            priceFrom: priceFromIdx !== -1 && r[priceFromIdx] ? parseInt(r[priceFromIdx], 10) : undefined,
            stepsCount: parseInt(r[stepsIdx], 10) || 15,
            bedrooms: parseInt(r[bedIdx], 10) || 3,
            baths: parseFloat(r[bathIdx]) || 2.5,
            floorLevel: '2nd Floor Layout',
            ownerSuiteDims: ownerDimsIdx !== -1 && r[ownerDimsIdx] ? r[ownerDimsIdx] : "12' x 12'",
            ownerSuiteSqft: ownerSqftIdx !== -1 && r[ownerSqftIdx] ? parseInt(r[ownerSqftIdx], 10) : 150,
            walkInClosetSqft: closetSqftIdx !== -1 && r[closetSqftIdx] ? parseInt(r[closetSqftIdx], 10) : 35,
            bedroom2Dims: bed2DimsIdx !== -1 && r[bed2DimsIdx] ? r[bed2DimsIdx] : "11' x 10'",
            bedroom2Sqft: bed2SqftIdx !== -1 && r[bed2SqftIdx] ? parseInt(r[bed2SqftIdx], 10) : 110,
            bedroom3Dims: bed3DimsIdx !== -1 && r[bed3DimsIdx] ? r[bed3DimsIdx] : "10' x 10'",
            bedroom3Sqft: bed3SqftIdx !== -1 && r[bed3SqftIdx] ? parseInt(r[bed3SqftIdx], 10) : 100,
            bedroom4Dims: bed4DimsIdx !== -1 && r[bed4DimsIdx] ? r[bed4DimsIdx] : undefined,
            bedroom4Sqft: bed4SqftIdx !== -1 && r[bed4SqftIdx] ? parseInt(r[bed4SqftIdx], 10) : undefined,
            stairsSqft: stairsSqftIdx !== -1 && r[stairsSqftIdx] ? parseInt(r[stairsSqftIdx], 10) : 45,
            highlights: [
              `Total Construcción: ${totalSqft} SF`,
              `Área Neta a Cubrir: ~${sqftNet} SF`,
              `Material Recomendado (+10% Desperdicio): ${sqftMaterialRecommended} SF`,
              'Escaleras: 15 Escalones con Nosing al Ras',
            ],
            description: r[descIdx] || `${modelName} en ${communityName} · ${collectionName}`,
            floorPlanImage: planImgIdx !== -1 && r[planImgIdx] ? normalizeImageUrl(r[planImgIdx]) : undefined,
            render3DImage: raw3dRender || undefined,
            rooms: DEFAULT_MODELS[0].rooms,
            svgDimensions: { width: 440, height: 740 },
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
        const sqftBoxIdx = header.indexOf('sqft_per_box');
        const planksBoxIdx = header.indexOf('planks_per_box');
        const hexIdx = header.indexOf('color_hex');
        const descIdx = header.indexOf('description');
        const plankImgIdx = header.indexOf('plank_image_url');
        const roomImgIdx = header.indexOf('room_preview_url');
        const stairImgIdx = header.indexOf('staircase_preview_url');
        const stockIdx = header.findIndex(
          (h) => h === 'stock_status' || h === 'in_stock' || h === 'stock' || h === 'status' || h === 'availability'
        );

        const parsedProducts: FlooringProduct[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[nameIdx]) continue;
          
          let collection: any = 'Pulse Select';
          if (r[colIdx]?.includes('Shield') || r[colIdx]?.includes('6')) collection = 'Pulse Shield XL';
          if (r[colIdx]?.includes('Rigid') || r[colIdx]?.includes('8') || r[colIdx]?.includes('XL Pulse')) collection = 'XL Pulse';

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

          parsedProducts.push({
            id: r[idIdx] || `prod-${i}`,
            code: r[codeIdx] || `0${i}`,
            name: r[nameIdx],
            category: (r[catIdx] as any) || (collection === 'XL Pulse' ? '8mm' : collection === 'Pulse Shield XL' ? '6mm' : '5.5mm'),
            collectionName: collection,
            thickness: r[thickIdx] || (collection === 'XL Pulse' ? '8.0mm' : collection === 'Pulse Shield XL' ? '6.0mm' : '5.5mm'),
            wearLayer: r[wearIdx] || (collection === 'XL Pulse' ? '22 mil' : '20 mil'),
            plankDimensions: r[plankDimIdx] || (collection === 'Pulse Select' ? '7" x 48"' : '9" x 60"'),
            padding: r[padIdx] || '1.5mm High-Density EVA Pad',
            planksPerBox: planksBox,
            sqftPerBox: sqftBox,
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
        const base530Idx = header.indexOf('base_price_at_530_sqft');
        const rateMatIdx = header.indexOf('rate_per_sqft_material');
        const rateLaborIdx = header.indexOf('rate_per_sqft_labor');
        const stairFeeIdx = header.indexOf('stair_flat_fee');
        const turnkeyIdx = header.indexOf('is_turnkey');
        const laborIdx = header.indexOf('includes_labor');
        const badgeIdx = header.indexOf('badge');

        const parsedPackages: PricingPackage[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[titleIdx]) continue;

          const isTurnkey = r[turnkeyIdx]?.toUpperCase() === 'TRUE';
          const isPrem = r[titleIdx].toLowerCase().includes('premium') || r[thickIdx]?.includes('8');
          const basePrice = base530Idx !== -1 && r[base530Idx] ? parseInt(r[base530Idx], 10) : (parseInt(r[priceIdx], 10) || (isTurnkey ? 4500 : 1550));
          const rateMat = rateMatIdx !== -1 && r[rateMatIdx] ? parseFloat(r[rateMatIdx]) : (isPrem ? 3.8679 : 2.9245);
          const stairFee = stairFeeIdx !== -1 && r[stairFeeIdx] ? parseInt(r[stairFeeIdx], 10) : (isTurnkey ? 2950 : 0);

          parsedPackages.push({
            id: r[idIdx] || `pkg-${i}`,
            title: r[titleIdx],
            tagline: r[taglineIdx] || '',
            thickness: r[thickIdx] || (isPrem ? '8.0mm' : '5.5mm'),
            wearLayer: r[wearIdx] || (isPrem ? '22 mil' : '20 mil'),
            plankSize: r[plankIdx] || (isPrem ? '9" x 60"' : '7" x 48"'),
            basePriceAt530Sqft: basePrice,
            ratePerSqftMaterial: rateMat,
            ratePerSqftLabor: rateLaborIdx !== -1 && r[rateLaborIdx] ? parseFloat(r[rateLaborIdx]) : 0,
            stairFlatFee: stairFee,
            price: basePrice,
            isTurnkey: isTurnkey,
            includesLabor: r[laborIdx]?.toUpperCase() === 'TRUE' || isTurnkey,
            badge: r[badgeIdx] || (isTurnkey ? 'MÁS POPULAR' : undefined),
            features: [
              `Piso SPC ${r[thickIdx] || '5.5mm'} (${r[wearIdx] || '20 mil'})`,
              `Formato: ${r[plankIdx] || '7" x 48"'}`,
              isTurnkey ? '15 Escalones Flush Stair Nose incluidos' : 'Entrega directa en Homestead',
              'Garantía de fábrica 25 años contra humedad',
            ],
            inclusions: [
              'Cálculo de cajas con +10% de desperdicio',
              'Acabado impermeable 100% rígido',
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

    // 4. Parse Gallery Projects (if available)
    if (galleryRes && galleryRes.ok) {
      const galleryText = await galleryRes.text();
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
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[titleEsIdx] && !r[idIdx]) continue;

          const rawCraftEs = r[craftEsIdx] || '';
          const craftListEs = rawCraftEs.includes('|')
            ? rawCraftEs.split('|').map((s) => s.trim()).filter(Boolean)
            : rawCraftEs ? [rawCraftEs] : ['Flush Nosing integrado sin tropiezos', 'Pegado estructural de máxima adherencia'];

          const rawCraftEn = r[craftEnIdx] || '';
          const craftListEn = rawCraftEn.includes('|')
            ? rawCraftEn.split('|').map((s) => s.trim()).filter(Boolean)
            : rawCraftEn ? [rawCraftEn] : ['Seamless flush nosing with zero trip hazard', 'Structural polyurethane full-spread adhesion'];

          const rawImg = normalizeImageUrl(r[imgIdx]);

          parsedGallery.push({
            id: r[idIdx] || `gal-${i}`,
            fileName: r[fileIdx] || `gallery_image_${i}.webp`,
            title: r[titleEsIdx] || 'Instalación de Pisos SPC en Homestead',
            titleEn: r[titleEnIdx] || r[titleEsIdx] || 'Homestead SPC Flooring Installation',
            spaceType: (r[spaceTypeIdx] as any) || 'stairs',
            spaceLabel: r[spaceLabelEsIdx] || 'Espacio Interior',
            spaceLabelEn: r[spaceLabelEnIdx] || r[spaceLabelEsIdx] || 'Interior Space',
            collection: (r[colIdx] as any) || '8mm',
            productName: r[prodNameIdx] || '8.0mm Liv Oak Flagship',
            productCode: r[prodCodeIdx] || '347',
            community: r[commIdx] || 'Siena Reserve',
            location: r[locIdx] || 'Homestead, FL',
            imageUrl: rawImg || DEFAULT_GALLERY_ITEMS[0]?.imageUrl || '',
            tag: r[tagEsIdx] || 'Instalación Real',
            tagEn: r[tagEnIdx] || r[tagEsIdx] || 'Real Install',
            description: r[descEsIdx] || 'Instalación profesional con garantía de 25 años.',
            descriptionEn: r[descEnIdx] || r[descEsIdx] || 'Professional installation with 25-year warranty.',
            craftHighlights: craftListEs,
            craftHighlightsEn: craftListEn,
          });
        }
        if (parsedGallery.length > 0) galleryItems = parsedGallery;
      }
    }

    return {
      models,
      products,
      packages,
      galleryItems,
      isLive: true,
    };
  } catch (error) {
    console.warn('Could not sync with Google Sheets, falling back to local database:', error);
    return {
      models: DEFAULT_MODELS,
      products: DEFAULT_PRODUCTS,
      packages: DEFAULT_PACKAGES,
      galleryItems: DEFAULT_GALLERY_ITEMS,
      isLive: false,
    };
  }
}

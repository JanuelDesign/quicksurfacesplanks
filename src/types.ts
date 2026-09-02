export type FloorScope = 'floor1' | 'floor1_stairs' | 'floor2' | 'floor2_stairs';

export type ProductType = 'vinyl';

export interface RoomDetail {
  name: string;
  dimensions: string;
  sqft?: number;
  highlight?: boolean;
  type: 'master' | 'bedroom' | 'stairs' | 'closet' | 'bath' | 'laundry' | 'hall' | 'balcony' | 'flex' | 'kitchen' | 'living' | 'dining' | 'foyer' | 'patio';
}

export interface FloorPlanModel {
  id: string; // Unique: {community_slug}_{collection_slug}_{model_slug}
  slug: string;
  name: string;
  displayNameSafe?: string; // e.g. "B Model (Bandol)"
  communityId: string;
  communityName: string;
  collection: string;
  collectionSlug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  sqft: number; // Total construction sqft
  sqftFirstFloor?: number; // 1st floor net area
  sqftFirstFloorRec?: number; // 1st floor recommended (+7%)
  sqftSecondFloor: number; // 2nd floor net area
  sqftSecondFloorRec?: number; // 2nd floor recommended (+7%)
  sqftNet: number; // Net flooring area (minus wet baths / AC)
  sqftMaterialRecommended: number; // Net + ~7% overage
  priceFrom?: number;
  stepsCount: number;
  bedrooms: number;
  baths: number;
  floorLevel: string;
  ownerSuiteDims?: string;
  ownerSuiteSqft?: number;
  walkInClosetSqft?: number;
  bedroom2Dims?: string;
  bedroom2Sqft?: number;
  bedroom3Dims?: string;
  bedroom3Sqft?: number;
  bedroom4Dims?: string;
  bedroom4Sqft?: number;
  stairsSqft?: number;
  highlights: string[];
  rooms: RoomDetail[];
  firstFloorRooms?: RoomDetail[];
  secondFloorRooms?: RoomDetail[];
  description: string;
  floorPlanImage?: string;
  render3DImage?: string;
  render3DImageFloor1?: string;
  render3DImageFloor2?: string;
  render3DImageBoth?: string;
  svgDimensions: { width: number; height: number };
}

export interface CommunityCollection {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  collections: string[];
  collectionDetails?: CommunityCollection[];
  modelIds: string[];
  description: string;
  heroImage: string;
  badge?: string;
  logoApproved?: boolean;
}

export type ResidentialCommunity = Community;

export type FlooringCategory = '5.5mm' | '6mm' | '8mm';

export type ProductStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';

export interface FlooringProduct {
  id: string;
  code: string;
  name: string;
  productType?: ProductType;
  category: FlooringCategory;
  collectionName: 'Pulse Select' | 'Pulse Shield XL' | 'XL Pulse' | string;
  thickness: string;
  wearLayer: string;
  plankDimensions: string;
  plankSize?: string;
  padding: string;
  planksPerBox: number;
  sqftPerBox: number;
  pricePerSqft: number;
  stairMaterialCost: number; // For 17 steps
  finish: string;
  installationType: string;
  tone: 'warm' | 'cool' | 'natural' | 'dark' | 'light';
  colorHex: string;
  secondaryColorHex: string;
  grainStyle: string;
  description: string;
  inStock: boolean;
  stockStatus: ProductStockStatus;
  isLowStock?: boolean;
  isComingSoon?: boolean;
  isNew?: boolean;
  imageUrl?: string;
  plankImageUrl?: string;
  roomPreviewUrl?: string;
  staircasePreviewUrl?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  coverageZone: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  specialty: string;
  badge?: string;
  note?: string;
  verified: boolean;
}

export type ProductOrServiceMode = 'materials_only' | 'turnkey_installation';

export interface InstallationQuestionnaire {
  needsRemoval: boolean;
  subfloorType?: 'concrete' | 'plywood' | 'mixed';
  hasFurniture: boolean;
  hasElevator?: boolean;
  urgencyDays?: string;
}

export interface PricingPackage {
  id: string;
  title: string;
  titleEn?: string;
  tagline: string;
  taglineEn?: string;
  thickness: string;
  wearLayer: string;
  plankSize: string;
  isTurnkey: boolean;
  isBestValue?: boolean;
  isPremium?: boolean;
  badge?: string;
  includesLabor: boolean;
  features: string[];
  featuresEn?: string[];
  inclusions?: string[];
  inclusionsEn?: string[];
  specs?: { label: string; value: string }[];
  price?: number;
  pricePerSqft?: number;
  basePriceAt530Sqft?: number;
  ratePerSqftMaterial?: number;
  ratePerSqftLabor?: number;
  stairFlatFee?: number;
}

export interface PricingQuoteCalculation {
  sqftNet: number;
  wasteSqft: number;
  sqftMaterialRecommended: number;
  stepsCount: number;
  hasStairs: boolean;
  product: FlooringProduct;
  package: PricingPackage;
  pricePerSqftMaterial: number;
  materialFloorCost: number;
  materialStairsCost: number;
  totalMaterialCost: number;
  deliveryFee: number;
  laborRatePerSqft: number;
  laborFloorCost: number;
  laborStairsCost: number;
  totalLaborCost: number;
  boxesCount: number;
  sqftPerBox: number;
  totalBoxesSqft: number;
  totalPrice: number;
}

export interface BookingSubmission {
  communityId: string;
  collectionSlug?: string;
  modelId: string;
  packageId: string;
  selectedColorId: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  unitNumber?: string;
  preferredDate?: string;
  notes?: string;
  calculatedPrice?: number;
  sqftMaterial?: number;
  createdAt?: string;
  status?: 'completed' | 'abandoned' | 'pending';
  contactConsent?: boolean;
  installationDetails?: InstallationQuestionnaire;
  mode?: ProductOrServiceMode;
}

// Global Legal Nomenclature Configuration (Bloque G.4 & K)
export const USE_SAFE_MODEL_NAMES = true;

export function getModelDisplayName(model: FloorPlanModel, useSafe = USE_SAFE_MODEL_NAMES): string {
  if (useSafe && model.displayNameSafe) {
    return model.displayNameSafe;
  }
  return model.name;
}

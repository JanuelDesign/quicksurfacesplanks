export interface RoomDetail {
  name: string;
  dimensions: string;
  sqft?: number;
  highlight?: boolean;
  type: 'master' | 'bedroom' | 'stairs' | 'closet' | 'bath' | 'laundry' | 'hall' | 'balcony' | 'flex';
}

export interface FloorPlanModel {
  id: string; // Unique: {community_slug}_{collection_slug}_{model_slug}
  slug: string;
  name: string;
  communityId: string;
  communityName: string;
  collection: string;
  collectionSlug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  sqft: number; // Total construction sqft
  sqftSecondFloor: number; // Estimated 2nd floor sqft
  sqftNet: number; // Net flooring area (minus wet baths / AC)
  sqftMaterialRecommended: number; // Net + ~10% overage - USED FOR QUOTING
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
  description: string;
  floorPlanImage?: string;
  render3DImage?: string;
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
}

export type ResidentialCommunity = Community;

export type FlooringCategory = '5.5mm' | '6mm' | '8mm';

export type ProductStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';

export interface FlooringProduct {
  id: string;
  code: string;
  name: string;
  category: FlooringCategory;
  collectionName: 'Pulse Select' | 'Pulse Shield XL' | 'XL Pulse' | 'PulseSelect' | 'PulseShield XL' | 'Waterproof Rigid Core SPC';
  thickness: string;
  wearLayer: string;
  plankDimensions: string;
  padding: string;
  planksPerBox: number;
  sqftPerBox: number;
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

export interface PricingPackage {
  id: string;
  title: string;
  tagline: string;
  thickness: string;
  wearLayer: string;
  plankSize: string;
  basePriceAt530Sqft: number;
  ratePerSqftMaterial: number;
  ratePerSqftLabor?: number;
  stairFlatFee: number;
  price: number; // default base price
  pricePerSqft?: number;
  isTurnkey: boolean;
  isBestValue?: boolean;
  isPremium?: boolean;
  badge?: string;
  includesLabor: boolean;
  features: string[];
  inclusions: string[];
  specs: { label: string; value: string }[];
}

export interface PricingQuoteCalculation {
  sqftMaterialRecommended: number;
  sqftNet: number;
  stepsCount: number;
  product: FlooringProduct;
  package: PricingPackage;
  materialRate: number;
  materialCost: number;
  laborCost: number;
  stairCost: number;
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
}

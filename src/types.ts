export interface RoomDetail {
  name: string;
  dimensions: string;
  sqft?: number;
  highlight?: boolean;
  type: 'master' | 'bedroom' | 'stairs' | 'closet' | 'bath' | 'laundry' | 'hall' | 'balcony';
}

export interface FloorPlanModel {
  id: string;
  slug: string;
  name: string;
  communityId: string;
  communityName: string;
  collection: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  sqft: number;
  stepsCount: number;
  bedrooms: number;
  baths: number;
  floorLevel: string;
  highlights: string[];
  rooms: RoomDetail[];
  description: string;
  floorPlanImage?: string;
  render3DImage?: string;
  svgDimensions: { width: number; height: number };
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  collections: string[];
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
  collectionName: 'PulseSelect' | 'PulseShield XL' | 'XLPulse' | 'Waterproof Rigid Core SPC';
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
  stockStatus?: ProductStockStatus;
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
  price: number;
  isTurnkey: boolean;
  isBestValue?: boolean;
  isPremium?: boolean;
  badge?: string;
  includesLabor: boolean;
  features: string[];
  specs: { label: string; value: string }[];
}

export interface BookingSubmission {
  communityId: string;
  modelId: string;
  packageId: string;
  selectedColorId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  preferredDate: string;
  notes?: string;
}

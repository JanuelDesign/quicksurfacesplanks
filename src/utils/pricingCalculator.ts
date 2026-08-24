import { FloorPlanModel, FlooringProduct, PricingPackage, PricingQuoteCalculation, FloorScope } from '../types';

/**
 * Standard baseline constants
 */
export const STAIRCASE_FLAT_FEE = 2950; // PPT master stair nose fabrication & labor

export function calculateQuotePrice(
  model: FloorPlanModel,
  product: FlooringProduct,
  pkg: PricingPackage,
  floorScope: FloorScope = 'both'
): PricingQuoteCalculation {
  let sqft = model.sqftMaterialRecommended || 1080;
  let sqftNet = model.sqftNet || 975;
  let stepsCount = model.stepsCount || 15;

  if (floorScope === 'floor1') {
    sqft = model.sqftFirstFloorRec || 560;
    sqftNet = model.sqftFirstFloor || 510;
    stepsCount = 0; // No stairs on floor 1 only
  } else if (floorScope === 'floor2') {
    sqft = model.sqftSecondFloorRec || 520;
    sqftNet = model.sqftSecondFloor || 465;
    stepsCount = model.stepsCount || 15;
  }

  const sqftPerBox = product.sqftPerBox || 24.26;
  const boxesCount = Math.ceil(sqft / sqftPerBox);
  const totalBoxesSqft = +(boxesCount * sqftPerBox).toFixed(2);

  const materialRate = pkg.ratePerSqftMaterial || (pkg.isPremium ? 3.868 : 2.925);
  const materialCost = Math.round(sqft * materialRate);

  let laborCost = 0;
  let stairCost = 0;
  let totalPrice = materialCost;

  if (pkg.isTurnkey) {
    stairCost = stepsCount > 0 ? (pkg.stairFlatFee || STAIRCASE_FLAT_FEE) : 0;
    const laborRate = pkg.ratePerSqftLabor || (stepsCount === 0 ? 2.5 : 0);
    laborCost = Math.round(sqft * laborRate);
    totalPrice = materialCost + stairCost + laborCost;
  }

  return {
    sqftMaterialRecommended: sqft,
    sqftNet,
    stepsCount,
    product,
    package: pkg,
    materialRate,
    materialCost,
    laborCost,
    stairCost,
    boxesCount,
    sqftPerBox,
    totalBoxesSqft,
    totalPrice,
  };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

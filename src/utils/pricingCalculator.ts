import { FloorPlanModel, FlooringProduct, PricingPackage, PricingQuoteCalculation } from '../types';

/**
 * Standard baseline constants
 */
export const STAIRCASE_FLAT_FEE = 2950; // PPT master stair nose fabrication & labor

export function calculateQuotePrice(
  model: FloorPlanModel,
  product: FlooringProduct,
  pkg: PricingPackage
): PricingQuoteCalculation {
  const sqft = model.sqftMaterialRecommended || model.sqft || 530;
  const sqftNet = model.sqftNet || Math.round(sqft / 1.1);
  const stepsCount = model.stepsCount || 15;

  const sqftPerBox = product.sqftPerBox || 24.26;
  const boxesCount = Math.ceil(sqft / sqftPerBox);
  const totalBoxesSqft = +(boxesCount * sqftPerBox).toFixed(2);

  const materialRate = pkg.ratePerSqftMaterial || (pkg.isPremium ? 3.868 : 2.925);
  const materialCost = Math.round(sqft * materialRate);

  let laborCost = 0;
  let stairCost = 0;
  let totalPrice = materialCost;

  if (pkg.isTurnkey) {
    stairCost = pkg.stairFlatFee || STAIRCASE_FLAT_FEE;
    const laborRate = pkg.ratePerSqftLabor || 0;
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

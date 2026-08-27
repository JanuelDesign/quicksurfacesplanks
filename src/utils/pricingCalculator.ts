import { FloorPlanModel, FlooringProduct, PricingPackage, PricingQuoteCalculation, FloorScope } from '../types';

export const LOCAL_DELIVERY_FEE = 60.00;
export const LABOR_RATE_PER_SQFT = 2.00;
export const STAIRS_LABOR_FEE = 1200.00;

export function getStairMaterialCost(category?: string): number {
  if (category === '5.5mm') return 589.00;
  if (category === '6mm') return 676.37;
  return 747.72; // 8mm
}

export function calculateQuotePrice(
  model?: FloorPlanModel | null,
  product?: FlooringProduct | null,
  pkg?: PricingPackage | null,
  floorScope: FloorScope = 'floor1_stairs'
): PricingQuoteCalculation {
  // 1. Determine square footage
  let netSqft = 510;
  let recSqft = 546;

  if (floorScope === 'floor1' || floorScope === 'floor1_stairs') {
    recSqft = model?.sqftFirstFloorRec || (model?.sqftFirstFloor ? Math.round(model.sqftFirstFloor * 1.07) : 546);
    netSqft = model?.sqftFirstFloor || Math.round(recSqft / 1.07);
  } else {
    recSqft = model?.sqftSecondFloorRec || (model?.sqftSecondFloor ? Math.round(model.sqftSecondFloor * 1.07) : 498);
    netSqft = model?.sqftSecondFloor || Math.round(recSqft / 1.07);
  }

  // 2. Square footage with ~7% waste factor
  const sqftMaterialRecommended = recSqft;
  const wasteSqft = Math.max(0, sqftMaterialRecommended - netSqft);

  // 3. Stairs determination
  const hasStairs = floorScope === 'floor1_stairs' || floorScope === 'floor2_stairs';
  const stepsCount = hasStairs ? 15 : 0;

  // 4. Material costs
  const category = product?.category || '5.5mm';
  const pricePerSqftMaterial = product?.pricePerSqft || (category === '5.5mm' ? 2.10 : category === '6mm' ? 2.65 : 3.10);
  const materialFloorCost = +(sqftMaterialRecommended * pricePerSqftMaterial).toFixed(2);
  const materialStairsCost = hasStairs ? (product?.stairMaterialCost || getStairMaterialCost(category)) : 0;
  const totalMaterialCost = +(materialFloorCost + materialStairsCost).toFixed(2);

  // 5. Boxes count
  const sqftPerBox = product?.sqftPerBox || 24.26;
  const boxesCount = Math.ceil(sqftMaterialRecommended / sqftPerBox);
  const totalBoxesSqft = +(boxesCount * sqftPerBox).toFixed(2);

  // 6. Labor costs
  const includesLabor = pkg?.includesLabor ?? true;
  const laborRatePerSqft = includesLabor ? LABOR_RATE_PER_SQFT : 0;
  const laborFloorCost = includesLabor ? +(netSqft * laborRatePerSqft).toFixed(2) : 0;
  const laborStairsCost = (includesLabor && hasStairs) ? STAIRS_LABOR_FEE : 0;
  const totalLaborCost = +(laborFloorCost + laborStairsCost).toFixed(2);

  // 7. Delivery
  const deliveryFee = LOCAL_DELIVERY_FEE;

  // 8. Total price
  const totalPrice = +(totalMaterialCost + totalLaborCost + deliveryFee).toFixed(2);

  return {
    sqftNet: netSqft,
    wasteSqft,
    sqftMaterialRecommended,
    stepsCount,
    hasStairs,
    product: (product || {}) as FlooringProduct,
    package: (pkg || {}) as PricingPackage,
    pricePerSqftMaterial,
    materialFloorCost,
    materialStairsCost,
    totalMaterialCost,
    deliveryFee,
    laborRatePerSqft,
    laborFloorCost,
    laborStairsCost,
    totalLaborCost,
    boxesCount,
    sqftPerBox,
    totalBoxesSqft,
    totalPrice,
  };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


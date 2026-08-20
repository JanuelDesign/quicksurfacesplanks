import React from 'react';
import { InteractiveFloorPlan2D } from './InteractiveFloorPlan2D';
import { FloorPlanModel, FlooringProduct } from '../types';

export { InteractiveFloorPlan2D };

// Backward compatibility alias for any existing references
export const HorizontalRender3D: React.FC<{
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  onSelectRoom?: (roomName: string) => void;
}> = (props) => {
  return <InteractiveFloorPlan2D {...props} />;
};

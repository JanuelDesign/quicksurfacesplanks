const fs = require('fs');

let content = fs.readFileSync('src/components/StepWizard.tsx', 'utf8');

if (!content.includes("import { HorizontalRender3D }")) {
  content = content.replace(
    "import { RoomVisualizer }",
    "import { HorizontalRender3D } from './HorizontalRender3D';\nimport { RoomVisualizer }"
  );
}

// Below the Model grid in Step 1, let's inject HorizontalRender3D as the "mini-landing"
// find `{/* 3. Expandable / Collapsible 2D Floorplan CAD Viewer */}`
// and inject before it.

const injection = `
            {/* MINI LANDING / HORIZONTAL 3D PLAN */}
            <div className="mt-8 animate-fadeIn">
              <HorizontalRender3D 
                model={selectedModel} 
                selectedProduct={selectedProduct} 
              />
            </div>

`;

content = content.replace(
  "{/* 3. Expandable / Collapsible 2D Floorplan CAD Viewer */}",
  injection + "{/* 3. Expandable / Collapsible 2D Floorplan CAD Viewer */}"
);

fs.writeFileSync('src/components/StepWizard.tsx', content);


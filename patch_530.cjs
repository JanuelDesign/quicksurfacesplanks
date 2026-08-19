const fs = require('fs');

const replaceInFile = (path, replacements) => {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  replacements.forEach(({ rx, rep }) => {
    content = content.replace(rx, rep);
  });
  fs.writeFileSync(path, content);
};

// Replace 530 in components
replaceInFile('src/components/ProjectScopeSection.tsx', [
  { rx: /530 sq ft/g, rep: '{model.sqft} sq ft' },
  { rx: /530/g, rep: '{model.sqft}' }
]);

replaceInFile('src/components/PricingSection.tsx', [
  { rx: /530 sq ft/g, rep: '{model.sqft} sq ft' }
]);

replaceInFile('src/components/FloorPlanSVG.tsx', [
  { rx: /530 sq ft/g, rep: '{model.sqft} sq ft' } // Wait, does FloorPlanSVG take a model prop? Yes, it takes `model` in most cases. Let's check FloorPlanSVG.
]);

replaceInFile('src/components/BookingModal.tsx', [
  { rx: /530 sq ft/g, rep: '${initialModel.sqft} sq ft' }
]);

replaceInFile('src/components/GatewayHero.tsx', [
  { rx: /530 sq ft/g, rep: '{model.sqft} sq ft' },
  { rx: /530/g, rep: '{selectedModel.sqft}' }
]);

replaceInFile('src/components/HorizontalRender3D.tsx', [
  { rx: /530 sq ft/g, rep: '{model.sqft} sq ft' }
]);

replaceInFile('src/components/ModelHeaderAndRender.tsx', [
  { rx: /530 sq ft/g, rep: '{model.sqft} sq ft' },
  { rx: /530 sqft/g, rep: '{model.sqft} sqft' }
]);

replaceInFile('src/data/products.ts', [
  { rx: /530 sq ft/g, rep: 'Cobertura recomendada' },
  { rx: /530/g, rep: 'Calculada' }
]);

replaceInFile('src/context/LanguageContext.tsx', [
  { rx: /530 sq ft/g, rep: 'Área calculada' },
  { rx: /530/g, rep: 'Calculada' }
]);


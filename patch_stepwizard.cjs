const fs = require('fs');
let content = fs.readFileSync('src/components/StepWizard.tsx', 'utf8');

content = content.replace(
  /\${selectedPackage\.price\.toLocaleString\(\)}/g,
  "${(selectedPackage.pricePerSqft ? Math.round(selectedModel.sqft * selectedPackage.pricePerSqft) : selectedPackage.price).toLocaleString()}"
);

content = content.replace(
  /\${pkg\.price\.toLocaleString\(\)}/g,
  "${(pkg.pricePerSqft ? Math.round(selectedModel.sqft * pkg.pricePerSqft) : pkg.price).toLocaleString()}"
);

fs.writeFileSync('src/components/StepWizard.tsx', content);

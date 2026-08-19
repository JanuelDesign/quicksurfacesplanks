const fs = require('fs');
if(fs.existsSync('src/components/PricingSection.tsx')) {
  let content = fs.readFileSync('src/components/PricingSection.tsx', 'utf8');

  content = content.replace(
    /\${pkg\.price\.toLocaleString\(\)}/g,
    "${(pkg.pricePerSqft ? Math.round(model.sqft * pkg.pricePerSqft) : pkg.price).toLocaleString()}"
  );

  fs.writeFileSync('src/components/PricingSection.tsx', content);
}

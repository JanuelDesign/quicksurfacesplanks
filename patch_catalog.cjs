const fs = require('fs');
let content = fs.readFileSync('src/components/ProductCatalog.tsx', 'utf8');

content = content.replace(
  'className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"',
  'className="max-w-full mx-auto px-4 sm:px-6 lg:px-8"'
);

fs.writeFileSync('src/components/ProductCatalog.tsx', content);


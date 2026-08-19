const fs = require('fs');
let content = fs.readFileSync('src/components/BookingModal.tsx', 'utf8');

content = content.replace(
  /\(\$\{initialModel\.sqft\} sq ft \+ 15 escalones\)/g,
  "({currentModel.sqft} sq ft + 15 escalones)"
);

content = content.replace(
  /\`\$\{currentModel\.name\} \(\$\{initialModel\.sqft\} sq ft \+ 15 escalones\)\`/g,
  "`${currentModel.name} (${currentModel.sqft} sq ft + 15 escalones)`"
);

fs.writeFileSync('src/components/BookingModal.tsx', content);

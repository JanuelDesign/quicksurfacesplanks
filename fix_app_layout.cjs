const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Change width constraints
content = content.replace(
  'className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6"',
  'className="w-full max-w-full mx-auto px-0 sm:px-4 pt-0 sm:pt-4"'
);

fs.writeFileSync('src/App.tsx', content);


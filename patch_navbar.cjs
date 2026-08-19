const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Top banner max-width
content = content.replace(
  'className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 flex items-center justify-between"',
  'className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between"'
);

// Main navbar max-width
content = content.replace(
  'className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2"',
  'className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2"'
);

fs.writeFileSync('src/components/Navbar.tsx', content);


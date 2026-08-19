const fs = require('fs');

let content = fs.readFileSync('src/components/StepWizard.tsx', 'utf8');

if (!content.includes("import { HorizontalRender3D }")) {
  content = content.replace(
    "import React,",
    "import React, { useState } from 'react';\nimport { HorizontalRender3D } from './HorizontalRender3D';\nimport"
  );
}

fs.writeFileSync('src/components/StepWizard.tsx', content);

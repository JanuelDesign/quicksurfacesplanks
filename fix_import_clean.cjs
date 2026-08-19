const fs = require('fs');

let content = fs.readFileSync('src/components/StepWizard.tsx', 'utf8');

// clean up the double import
content = content.replace("import React, { useState } from 'react';\nimport { HorizontalRender3D } from './HorizontalRender3D';\nimport { useState } from 'react';", "import React, { useState } from 'react';\nimport { HorizontalRender3D } from './HorizontalRender3D';");

fs.writeFileSync('src/components/StepWizard.tsx', content);

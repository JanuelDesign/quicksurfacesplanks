const fs = require('fs');

function replaceSingleQuotesWithBackticks(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'\{model\.sqft\}(.*?)'/g, "`\\${model.sqft}$1`");
  content = content.replace(/'(.*)\{model\.sqft\}(.*)'/g, "`$1\\${model.sqft}$2`");
  fs.writeFileSync(file, content);
}

replaceSingleQuotesWithBackticks('src/components/ProjectScopeSection.tsx');
replaceSingleQuotesWithBackticks('src/components/ModelHeaderAndRender.tsx');
replaceSingleQuotesWithBackticks('src/components/HorizontalRender3D.tsx');


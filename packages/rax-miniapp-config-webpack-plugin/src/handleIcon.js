const { dirname, join } = require('path');
const { copy, existsSync, ensureDirSync, unlinkSync } = require('fs-extra');

function isUrl(src) {
  return /^(https?:)?\/\//.test(src);
}

module.exports = function(path, outputPath) {
  if (!isUrl(path)) {
    const sourcePath = join(process.cwd(), 'src', path);
    if (existsSync(sourcePath)) {
      const distPath = join(outputPath, path);
      ensureDirSync(dirname(distPath));
      if (existsSync(distPath)) {
        unlinkSync(distPath);
      }
      copy(sourcePath, distPath);
    }
  }
  return path;
};

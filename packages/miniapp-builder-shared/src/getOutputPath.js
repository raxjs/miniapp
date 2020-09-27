const path = require('path');

module.exports = (context, target) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  if (!outputDir) {
    return path.resolve(rootDir, 'build', target);
  }
  return outputDir;
};

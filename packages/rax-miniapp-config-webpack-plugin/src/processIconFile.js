const { dirname, join } = require('path');
const { copy, existsSync, ensureDirSync, unlinkSync } = require('fs-extra');

function isUrl(src) {
  return /^(https?:)?\/\//.test(src);
}

module.exports = function processIconFile(appConfig, outputPath)  {
  const iconFiles = [];
  if (appConfig.tabBar) {
    const items = appConfig.tabBar.items;
    if (items) {
      items.forEach(itemConfig => {
        const { icon, activeIcon } = itemConfig;
        if (icon) {
          iconFiles.push(icon);
        }
        if (activeIcon) {
          iconFiles.push(activeIcon);
        }
      })
    }
  }
  iconFiles.forEach(iconFile => {
    if (!isUrl(iconFile)) {
      const sourcePath = join(process.cwd(), 'src', iconFile);
      if (existsSync(sourcePath)) {
        const distPath = join(outputPath, iconFile);
        ensureDirSync(dirname(distPath));
        if (existsSync(distPath)) {
          unlinkSync(distPath);
        }
        copy(sourcePath, distPath);
      }
    }
  });
}

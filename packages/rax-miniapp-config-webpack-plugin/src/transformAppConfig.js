const { relative } = require('path');
const adaptAppConfig = require('./adaptConfig');
const handleIcon = require('./handleIcon');

module.exports = function transformAppConfig(outputPath, originalAppConfig, target, subPackages) {
  const appConfig = {};
  for (let configKey in originalAppConfig) {
    const config = originalAppConfig[configKey];
    switch (configKey) {
      case 'routes':
      case 'applications':
        // filter routes and applications
        break;
      case 'window':
        appConfig[configKey] = adaptAppConfig(config, 'window', target);
        break;
      case 'tabBar':
        // Handle tab item
        if (config.items) {
          config.items = config.items.map(itemConfig => {
            const { icon, activeIcon, path: itemPath, pageName, ...others } = itemConfig;
            const newItemConfig = {};
            if (icon) {
              newItemConfig.icon = handleIcon(icon, outputPath);
            }
            if (activeIcon) {
              newItemConfig.activeIcon = handleIcon(activeIcon, outputPath);
            }
            if (!itemConfig.pagePath) {
              const targetRoute = originalAppConfig.routes.find(({ path }) =>
                path === itemPath || path === pageName
              );
              if (targetRoute) {
                newItemConfig.pagePath = targetRoute.source;
              }
            }
            return adaptAppConfig(Object.assign(newItemConfig, others), 'items', target);
          });
        }
        appConfig[configKey] = adaptAppConfig(config, 'tabBar', target);
        break;
      case 'subAppRoot':
        appConfig.root = config;
        break;
      case 'pages':
        if (subPackages) {
          appConfig[configKey] = config.map(page => relative(originalAppConfig.subAppRoot, page));
          break;
        }
      default:
        appConfig[configKey] = config;
        break;
    }
  }

  return appConfig;
};

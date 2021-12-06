const { relative } = require('path');
const adaptConfig = require('./adaptConfig');
const { normalizeOutputFilePath } = require('../pathHelper');

function transformAppConfig(originalAppConfig, target, options = {}) {
  const { subPackages = false, isWebview = false } = options;
  const appConfig = {};
  for (let configKey in originalAppConfig) {
    const config = originalAppConfig[configKey];
    switch (configKey) {
      case 'routes':
      case 'applications':
        // filter routes and applications
        break;
      case 'window':
        appConfig[configKey] = adaptConfig(config, 'window', target);
        break;
      case 'tabBar':
        const newConfig = Object.assign({}, config);
        // Handle tab item
        if (config.items) {
          newConfig.items = config.items.map(itemConfig => {
            const { icon, activeIcon, path: itemPath, pageName, ...others } = itemConfig;
            const newItemConfig = {
              icon,
              activeIcon
            };
            if (!itemConfig.pagePath) {
              const targetRoute = originalAppConfig.routes.find(({ path, name }) => {
                if (isWebview) {
                  return name === pageName; // For webview (MPA)
                } else {
                  return path === itemPath || path === pageName; // For miniapp
                }
              });
              if (targetRoute) {
                newItemConfig.pagePath = targetRoute.source;
              }
            }
            return adaptConfig(Object.assign(newItemConfig, others), 'items', target);
          });
        }
        appConfig[configKey] = adaptConfig(newConfig, 'tabBar', target);
        break;
      case 'subAppRoot':
        appConfig.root = config;
        break;
      case 'pages':
        if (subPackages) {
          appConfig[configKey] = config.map(page => normalizeOutputFilePath(relative(originalAppConfig.subAppRoot, page)));
          break;
        }
      default:
        appConfig[configKey] = config;
        break;
    }
  }

  return appConfig;
}

function transformPageConfig(route = {}, property, target) {
  return adaptConfig(route, property, target);
}

module.exports = {
  transformAppConfig,
  transformPageConfig
};

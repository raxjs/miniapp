const { relative } = require('path');
const adaptConfig = require('./adaptConfig');
const { normalizeOutputFilePath } = require('../pathHelper');

function transformAppConfig(originalAppConfig, target, { subPackages = false, projectType = 'spa' }) {
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
        // Handle tab item
        if (config.items) {
          config.items = config.items.map(itemConfig => {
            const { icon, activeIcon, path: itemPath, pageName, ...others } = itemConfig;
            const newItemConfig = {
              icon,
              activeIcon
            };
            if (!itemConfig.pagePath) {
              const targetRoute = originalAppConfig.routes.find(({ path, name }) => {
                if (projectType === 'spa') { // For miniapp
                  return path === itemPath || path === pageName;
                } else if (projectType === 'mpa') { // For FRM
                  return name === pageName;
                } else {
                  return false;
                }
              });
              if (targetRoute) {
                newItemConfig.pagePath = targetRoute.source;
              }
            }
            return adaptConfig(Object.assign(newItemConfig, others), 'items', target);
          });
        }
        appConfig[configKey] = adaptConfig(config, 'tabBar', target);
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

function transformPageConfig(route = {}, target) {
  return adaptConfig(route.window, 'window', target);
}

module.exports = {
  transformAppConfig,
  transformPageConfig
};

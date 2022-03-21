const { join, resolve } = require('path');
const { readJSONSync } = require('fs-extra');

function transformPluginConfig(pluginConfig) {
  const result = {
    routes: []
  };
  Object.keys(pluginConfig.pages).forEach(page => {
    const route = {
      path: page,
      source: pluginConfig.pages[page]
    };
    result.routes.push(route);
  });
  return result;
}

module.exports = (rootDir, nativeLifeCycleMap) => {
  const entryPath = join(rootDir, 'src');

  const pluginConfig = transformPluginConfig(readJSONSync(resolve(rootDir, 'src', 'plugin.json')));
  const routes = [];

  function addPage(route) {
    routes.push(route);
    if (nativeLifeCycleMap) {
      nativeLifeCycleMap[resolve(entryPath, route.source)] = {};
    }
  }

  pluginConfig.routes.map(route => {
    route.entryName = route.source;
    addPage(route);
  });

  pluginConfig.routes = routes;
  return pluginConfig;
};

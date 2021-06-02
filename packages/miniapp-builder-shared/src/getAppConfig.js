const { join, resolve } = require('path');
const { readJSONSync } = require('fs-extra');
const getRouteName = require('./utils/getRouteName');

const {
  relativeModuleResolve,
  normalizeOutputFilePath,
  getRelativePath
} = require('./pathHelper');

module.exports = (rootDir, target, nativeLifeCycleMap, subAppRoot = '') => {
  const entryPath = join(rootDir, 'src');

  const appConfig = readJSONSync(resolve(rootDir, 'src', subAppRoot, 'app.json'));
  appConfig.pages = [];
  const routes = [];

  if (!Array.isArray(appConfig.routes)) {
    throw new Error('routes in app.json must be array');
  }

  function addPage(route) {
    const page = normalizeOutputFilePath(
      relativeModuleResolve(entryPath, getRelativePath(route.source))
    );
    appConfig.pages.push(page);
    routes.push(route);
    if (nativeLifeCycleMap) {
      nativeLifeCycleMap[resolve(entryPath, route.source)] = {};
    }
  }

  appConfig.routes.map(route => {
    route.source = join(subAppRoot, route.source);
    route.name = route.source;
    route.entryName = getRouteName(route, rootDir);
    if (subAppRoot) route.subAppRoot = subAppRoot;

    if (!Array.isArray(route.targets)) {
      addPage(route);
    }
    if (Array.isArray(route.targets) && route.targets.indexOf(target) > -1) {
      addPage(route);
    }
  });

  appConfig.routes = routes;

  if (subAppRoot) appConfig.subAppRoot = subAppRoot;

  return appConfig;
};

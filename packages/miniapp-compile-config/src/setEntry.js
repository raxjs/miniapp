const { dirname, join } = require('path');
const {
  pathHelper: { absoluteModuleResolve, getDepPath },
  getAppConfig,
  filterNativePages
} = require('miniapp-builder-shared');

function clearEntry(config) {
  config.entryPoints.clear();
}

function getEntry(entryAppFilePath, routes, rootDir, subAppRoot = '') {
  const sourcePath = join(rootDir, 'src');
  const entry = {};

  if (entryAppFilePath) {
    entry.app = absoluteModuleResolve(rootDir, `./${entryAppFilePath}`) + '?role=app'; // Mark it as app file
  }

  if (Array.isArray(routes)) {
    routes.forEach(({ source: pageSource }) => {
      entry[`${subAppRoot}@page@${pageSource}`] = `${getDepPath(
        rootDir,
        pageSource,
        sourcePath
      )}?role=page`; // Mark it as page file
    });
  }
  return entry;
}

function configEntry(config, routes, options) {
  const { entryPath, rootDir, subAppRoot = '' } = options;
  const entries = getEntry(entryPath, routes, rootDir, subAppRoot);
  for (const [entryName, source] of Object.entries(entries)) {
    const entryConfig = config.entry(entryName);
    entryConfig.add(source);
  }
}

function setEntry(config, routes, options) {
  const { needCopyList, rootDir, target, outputPath } = options;
  clearEntry(config);
  const filteredRoutes = filterNativePages(routes, needCopyList, { rootDir, target, outputPath });
  configEntry(config, filteredRoutes, options);
}

function setMultiplePackageEntry(config, routes, options) {
  const { rootDir, target, outputPath, subAppConfigList, needCopyList } = options;
  clearEntry(config);
  routes.forEach(app => {
    const subAppRoot = dirname(app.source);
    const subAppConfig = getAppConfig(rootDir, target, null, subAppRoot);
    const filteredRoutes = filterNativePages(subAppConfig.routes, needCopyList, { rootDir, target, outputPath, subAppRoot });
    configEntry(config, filteredRoutes, { entryPath: app.miniappMain ? join('src', app.source) : null, rootDir, subAppRoot });
    subAppConfig.miniappMain = app.miniappMain;
    subAppConfigList.push(subAppConfig);
  });
}

module.exports = {
  setEntry,
  setMultiplePackageEntry
};

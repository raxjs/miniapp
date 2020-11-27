const { dirname, join } = require('path');
const {
  pathHelper: { absoluteModuleResolve, getDepPath },
  getAppConfig
} = require('miniapp-builder-shared');

function clearEntry(config) {
  config.entryPoints.clear();
}

function getEntry(entryAppFilePath, routes, rootDir, subAppRoot = '') {
  const sourcePath = dirname(entryAppFilePath);
  const entry = {};

  entry.app =
    absoluteModuleResolve(rootDir, `./${entryAppFilePath}`) + '?role=app'; // Mark it as app file

  if (Array.isArray(routes)) {
    routes.forEach(({ source: pageSource }) => {
      entry[`${subAppRoot}@page@${pageSource}`] = `${getDepPath(
        rootDir,
        pageSource,
        join(sourcePath, subAppRoot)
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
  clearEntry(config);
  configEntry(config, routes, options);
}

function setMultiplePackageEntry(config, applications, options) {
  const { entryPath, rootDir, target, subAppConfigList } = options;
  clearEntry(config);
  applications.forEach(app => {
    const subAppConfig = getAppConfig(rootDir, target, null, app.source);
    configEntry(config, subAppConfig.routes, { entryPath, rootDir, subAppRoot: app.source });
    subAppConfig.subAppRoot = app.source;
    subAppConfig.main = app.main;
    subAppConfigList.push(subAppConfig);
  });
}

module.exports = {
  setEntry,
  setMultiplePackageEntry
}

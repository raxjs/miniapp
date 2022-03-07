const { dirname, join, resolve } = require('path');
const { readJSONSync } = require('fs-extra');
const {
  pathHelper: { absoluteModuleResolve, getDepPath, removeExt },
  normalizeStaticConfig,
  separateNativeRoutes,
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
  const { normalRoutes, nativeRoutes } = separateNativeRoutes(routes, { rootDir, target, outputPath });
  nativeRoutes.forEach(({ source }) => {
    needCopyList.push({
      from: dirname(join('src', source)),
      to: dirname(join('src', source)),
    });
  });
  configEntry(config, normalRoutes, options);
}

function setMultiplePackageEntry(config, routes, options) {
  const { rootDir, target, outputPath, subAppConfigList, needCopyList } = options;
  clearEntry(config);
  routes.forEach(app => {
    const subAppRoot = dirname(app.source);
    // Deprecated: Read app.json as subpackages appConfig, it will get by global API
    const subStaticConfig = readJSONSync(resolve(rootDir, 'src', subAppRoot, 'app.json'));
    // Deprecated: filter routes which includes current build target
    const validStaticConfig = getValidStaticConfig(subStaticConfig, {
      target,
    });
    const normalizedSubStaticConfig = normalizeStaticConfig(validStaticConfig, {
      rootDir,
      subAppRoot,
      target
    });
    const { normalRoutes, nativeRoutes } = separateNativeRoutes(normalizedSubStaticConfig.routes, { rootDir, target, outputPath, subAppRoot });
    nativeRoutes.forEach(({ source }) => {
      needCopyList.push({
        from: dirname(join('src', source)),
        to: dirname(source),
      });
    });
    configEntry(config, normalRoutes, { entryPath: app.miniappMain ? join('src', app.source) : null, rootDir, subAppRoot });
    subAppConfigList.push({
      ...normalizedSubStaticConfig,
      miniappMain: app.miniappMain,
    });
  });
}

function getPluginEntry(entryIndexFilePath, pluginConfig) {
  const { pages, publicComponents, main } = pluginConfig;
  const rootDir = dirname(entryIndexFilePath);
  const entry = {};

  if (pages) {
    Object.keys(pages).forEach(pageName => {
      entry[`@${pageName}`] = `${getDepPath('.', pages[pageName], rootDir)}?role=page`;
    });
  }
  if (publicComponents) {
    Object.keys(publicComponents).forEach(compName => {
      entry[`@${compName}`] = `${getDepPath('.', publicComponents[compName], rootDir)}?role=component`;
    });
  }
  if (main) {
    entry.main = removeExt(getDepPath('.', main, rootDir));
  }
  return entry;
}

function setPluginEntry(config, pluginConfig, entryPath) {
  clearEntry(config);
  const entries = getPluginEntry(entryPath, pluginConfig);
  for (const [entryName, source] of Object.entries(entries)) {
    const entryConfig = config.entry(entryName);
    entryConfig.add(source);
  }
}

// Deprecated: Get valid static config
function getValidStaticConfig(staticConfig, { target }) {
  if (!staticConfig.routes) {
    throw new Error('routes in app.json must be array');
  }

  return {
    ...staticConfig,
    routes: staticConfig.routes.filter(({ targets }) => {
      if (!targets) return true;
      return targets.includes(target);
    })
  };
}

module.exports = {
  setEntry,
  setMultiplePackageEntry,
  setPluginEntry
};

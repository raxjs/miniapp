const { join } = require('path');

const {
  relativeModuleResolve,
  normalizeOutputFilePath,
  getRelativePath
} = require('./pathHelper');

module.exports = (staticConfig, { rootDir, subAppRoot = '', target }) => {
  const entryPath = join(rootDir, 'src');

  const pages = [];

  staticConfig.routes.map(route => {
    if (subAppRoot) {
      route.source = normalizeOutputFilePath(join(subAppRoot, route.source));
      route.subAppRoot = subAppRoot;
    }
    route.entryName = route.source;

    if (!target || !Array.isArray(route.targets) || route.targets.includes(target)) {
      pages.push(normalizeOutputFilePath(
        relativeModuleResolve(entryPath, getRelativePath(route.source), !route.url)
      ));
    }
  });

  const normalized = {
    ...staticConfig,
    pages,
  };

  if (subAppRoot) {
    normalized.subAppRoot = subAppRoot;
  }

  return normalized;
};

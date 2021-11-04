const { join } = require('path');

const {
  relativeModuleResolve,
  normalizeOutputFilePath,
  getRelativePath
} = require('./pathHelper');

module.exports = (staticConfig, { rootDir, subAppRoot = '' }) => {
  const entryPath = join(rootDir, 'src');

  const pages = [];

  staticConfig.routes.map(route => {
    if (subAppRoot) {
      route.source = normalizeOutputFilePath(join(subAppRoot, route.source));
      route.subAppRoot = subAppRoot;
    }
    route.entryName = route.source;
    pages.push(normalizeOutputFilePath(
      relativeModuleResolve(entryPath, getRelativePath(route.source))
    ));
  });

  return {
    ...staticConfig,
    pages,
    subAppRoot,
  };
};

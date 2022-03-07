const {
  separateNativeRoutes,
  normalizeStaticConfig,
} = require('miniapp-builder-shared');
const MiniAppConfigPlugin = require('rax-miniapp-config-webpack-plugin');
const { readFileSync } = require('fs');
const { dirname, resolve, join } = require('path');

const setBaseConfig = require('./setBaseConfig');

/**
 * Set miniapp runtime project webpack config
 * @param {object} config - webpack config chain
 * @param {object} options
 * @param {object} options.api - build scripts api
 * @param {string} options.target - miniapp platform
 * @param {string} options.normalRoutes - the routes which need be bundled by webpack
 * @param {string} options.nativeRoutes - this miniapp native routes which need copy to build dir
 * @param {string} options.outputPath - outputPath
 */
module.exports = (config, options) => {
  const { api, target, staticConfig, outputPath } = options;
  let { nativeRoutes } = options;
  const { context } = api;
  const { rootDir, userConfig: rootUserConfig } = context;
  const userConfig = rootUserConfig[target] || {};

  // Native lifecycle map
  const nativeLifeCycleMap = {};

  // Sub packages config
  const subAppConfigList = [];

  let mainPackageRoot = '';

  let completeRoutes = [];

  if (userConfig.subPackages) {
    staticConfig.routes.forEach(app => {
      const subAppRoot = dirname(app.source);
      // Deprecated: Read app.json as subpackages appConfig, it will get by global API
      const subStaticConfig = JSON.parse(readFileSync(resolve(rootDir, 'src', subAppRoot, 'app.json')));
      // Deprecated: filter routes which includes current build target
      const validStaticConfig = getValidStaticConfig(subStaticConfig, {
        target,
      });
      const normalizedSubStaticConfig = normalizeStaticConfig(validStaticConfig, {
        rootDir,
        subAppRoot,
        target
      });
      if (app.miniappMain) mainPackageRoot = subAppRoot;
      subAppConfigList.push({
        ...normalizedSubStaticConfig,
        miniappMain: app.miniappMain,
      });
      const { normalRoutes, nativeRoutes: subNativeRoutes } = separateNativeRoutes(normalizedSubStaticConfig.routes, { rootDir, target });
      completeRoutes = completeRoutes.concat(normalRoutes);
      nativeRoutes = nativeRoutes.concat(subNativeRoutes);
    });
  } else {
    completeRoutes = staticConfig.routes;
  }

  completeRoutes.forEach(({ source }) => {
    // initial native lifecycle
    nativeLifeCycleMap[resolve(rootDir, 'src', source)] = {};
  });

  setBaseConfig(config, {
    appConfig: staticConfig,
    completeRoutes,
    subAppConfigList,
    nativeLifeCycleMap,
    needCopyList: nativeRoutes.map(({ source }) => ({
      from: dirname(join('src', source)),
      to: dirname(source),
    })),
    mainPackageRoot,
    ...options
  });

  config.plugin('MiniAppConfigPlugin').use(MiniAppConfigPlugin, [
    {
      type: 'runtime',
      subPackages: userConfig.subPackages,
      appConfig: staticConfig,
      subAppConfigList,
      outputPath,
      target,
      nativeConfig: userConfig.nativeConfig,
    },
  ]);
};

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
    }),
  };
}

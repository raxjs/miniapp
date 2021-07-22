const {
  getAppConfig,
  filterNativePages
} = require('miniapp-builder-shared');
const MiniAppConfigPlugin = require('rax-miniapp-config-webpack-plugin');
const { dirname, resolve } = require('path');

const setBaseConfig = require('./setBaseConfig');

/**
 * Set miniapp runtime project webpack config
 * @param {object} config - webpack config chain
 * @param {object} options
 * @param {object} options.api - build scripts api
 * @param {string} options.target - miniapp platform
 * @param {string} options.babelRuleName - babel loader name in webpack chain
 * @param {string} options.outputPath - outputPath
 */
module.exports = (config, options) => {
  const { api, target } = options;
  const { context } = api;
  const { rootDir, userConfig: rootUserConfig } = context;
  const userConfig = rootUserConfig[target] || {};

  const outputPath = options.outputPath || resolve(rootDir, 'build', target);

  // Native lifecycle map
  const nativeLifeCycleMap = {};

  // Need copy files or dir
  const needCopyList = [];

  // Sub packages config
  const subAppConfigList = [];

  let mainPackageRoot = '';

  const appConfig = getAppConfig(rootDir, target, nativeLifeCycleMap);

  let completeRoutes = [];

  if (userConfig.subPackages) {
    appConfig.routes.forEach(app => {
      const subAppRoot = dirname(app.source);
      const subAppConfig = getAppConfig(rootDir, target, nativeLifeCycleMap, subAppRoot);
      if (app.miniappMain) mainPackageRoot = subAppRoot;
      subAppConfig.miniappMain = app.miniappMain;
      subAppConfigList.push(subAppConfig);
      completeRoutes = completeRoutes.concat(subAppConfig.routes);
    });
  } else {
    completeRoutes = appConfig.routes;
  }

  completeRoutes = filterNativePages(completeRoutes, needCopyList, {
    rootDir,
    target,
    outputPath,
  });

  setBaseConfig(config, {
    appConfig,
    completeRoutes,
    subAppConfigList,
    nativeLifeCycleMap,
    needCopyList,
    mainPackageRoot,
    ...options
  });

  config.plugin('MiniAppConfigPlugin').use(MiniAppConfigPlugin, [
    {
      type: 'runtime',
      subPackages: userConfig.subPackages,
      appConfig,
      subAppConfigList,
      outputPath,
      target,
      nativeConfig: userConfig.nativeConfig,
    },
  ]);
};

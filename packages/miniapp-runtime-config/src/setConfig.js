const {
  getAppConfig,
  filterNativePages,
  platformMap,
  pathHelper: { getPlatformExtensions },
} = require('miniapp-builder-shared');
const getMiniAppBabelPlugins = require('rax-miniapp-babel-plugins');
const MiniAppRuntimePlugin = require('rax-miniapp-runtime-webpack-plugin');
const MiniAppConfigPlugin = require('rax-miniapp-config-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve, dirname } = require('path');

/**
 * Set miniapp runtime project webpack config
 * @param {object} config - webpack config chain
 * @param {object} options
 * @param {object} options.api - build scripts api
 * @param {string} options.target - miniapp platform
 * @param {string} options.babelRuleName - babel loader name in webpack chain
 */
module.exports = (
  config,
  { api, target, babelRuleName = 'babel-loader', outputPath }
) => {
  const { context } = api;
  const { rootDir, command, userConfig: rootUserConfig } = context;
  const userConfig = rootUserConfig[target] || {};

  if (!outputPath) {
    outputPath = resolve(rootDir, 'build', target);
  }
  // Using components
  const usingComponents = {};
  // Native lifecycle map
  const nativeLifeCycleMap = {};

  // Using plugins
  const usingPlugins = {};

  // Need Copy files or dir
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

  config.output.filename('[name].js');
  // publicPath should not work in miniapp, just keep default value
  config.output.publicPath('/');

  // Distinguish end construction
  config.resolve.extensions
    .clear()
    .merge(
      getPlatformExtensions(platformMap[target].type, ['.js', '.jsx', '.ts', '.tsx', '.json'])
    );

  ['jsx', 'tsx'].forEach((ruleName) => {
    config.module
      .rule(ruleName)
      .use(babelRuleName)
      .tap((options) => {
        options.cacheDirectory = false; // rax-miniapp-babel-plugins needs to be executed every time
        options.presets = [
          ...options.presets,
          {
            plugins: getMiniAppBabelPlugins({
              usingComponents,
              nativeLifeCycleMap,
              target,
              rootDir,
              usingPlugins,
              runtimeDependencies: userConfig.runtimeDependencies,
            }),
          },
        ];
        return options;
      });
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
  config.plugin('MiniAppRuntimePlugin').use(MiniAppRuntimePlugin, [
    {
      api,
      routes: completeRoutes,
      mainPackageRoot,
      appConfig,
      subAppConfigList,
      target,
      usingComponents,
      nativeLifeCycleMap,
      usingPlugins,
      needCopyList,
    },
  ]);

  if (needCopyList.length > 0) {
    config.plugin('copyWebpackPluginForRuntimeMiniapp').use(CopyWebpackPlugin, [
      {
        patterns: needCopyList,
      },
    ]);
  }

  config.devServer.writeToDisk(true).noInfo(true).inline(false);
  if (!config.get('devtool')) {
    config.devtool(false);
  } else if (command === 'start') {
    config.devtool('inline-source-map');
  }
};

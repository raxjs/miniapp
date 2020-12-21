const {
  getAppConfig,
  filterNativePages,
} = require('miniapp-builder-shared');
const getMiniAppBabelPlugins = require('rax-miniapp-babel-plugins');
const MiniAppRuntimePlugin = require('rax-miniapp-runtime-webpack-plugin');
const MiniAppConfigPlugin = require('rax-miniapp-config-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve, dirname } = require('path');

/**
 * Set miniapp runtime project webpack config
 * @param {object} config - webpack config chain
 * @param {object} userConfig - user config for miniapp
 * @param {object} options
 * @param {object} options.context - webpack context
 * @param {string} options.target - miniapp platform
 * @param {string} options.babelRuleName - babel loader name in webpack chain
 */
module.exports = (
  config,
  userConfig,
  { context, target, babelRuleName = 'babel', outputPath }
) => {
  const { rootDir, command } = context;

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
      const subAppConfig = getAppConfig(rootDir, target, null, subAppRoot);
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

  ['jsx', 'tsx'].forEach((ruleName) => {
    config.module
      .rule(ruleName)
      .use(babelRuleName)
      .tap((options) => {
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
      routes: completeRoutes,
      subPackages: userConfig.subPackages,
      mainPackageRoot,
      target,
      config: userConfig,
      usingComponents,
      nativeLifeCycleMap,
      rootDir,
      command,
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

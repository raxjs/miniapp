const {
  platformMap,
  pathHelper: { getPlatformExtensions },
} = require('miniapp-builder-shared');
const getMiniAppBabelPlugins = require('rax-miniapp-babel-plugins');
const MiniAppRuntimePlugin = require('rax-miniapp-runtime-webpack-plugin');

/**
 * Set miniapp runtime project webpack config
 * @param {object} config - webpack config chain
 * @param {object} options
 * @param {object} options.api - build scripts api
 * @param {string} options.target - miniapp platform
 * @param {string} options.babelRuleName - babel loader name in webpack chain
 * @param {object} options.appConfig - app config
 * @param {array} options.completeRoutes - complete routes array
 * @param {array} options.subAppConfigList - sub packages config list
 * @param {object} options.nativeLifeCycleMap - native lifecycle map
 * @param {array} options.needCopyList - need copy files or dir
 * @param {boolean} options.isPluginProject - whether is plugin project
 */
module.exports = (
  config,
  { api, target, babelRuleName = 'babel-loader', appConfig, completeRoutes, subAppConfigList, nativeLifeCycleMap, needCopyList, mainPackageRoot = '', isPluginProject = false }
) => {
  const { context } = api;
  const { rootDir, command, userConfig: rootUserConfig } = context;
  const userConfig = rootUserConfig[target] || {};

  // Using components
  const usingComponents = {};

  // Using plugins
  const usingPlugins = {};

  // hasing rax-componentwrapper
  // pass variable by reference
  const usingComponentWrapper = {
    using: false
  };

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
              usingComponentWrapper
            }),
          },
        ];
        return options;
      });
  });

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
      isPluginProject,
      usingComponentWrapper
    },
  ]);

  if (needCopyList.length > 0) {
    config.plugin('CopyWebpackPlugin').tap(([copyList]) => {
      return [copyList.concat(needCopyList)];
    });
  }

  config.devServer.writeToDisk(true).noInfo(true).inline(false);
  if (!config.get('devtool')) {
    config.devtool(false);
  } else if (command === 'start') {
    config.devtool('inline-source-map');
  }
};

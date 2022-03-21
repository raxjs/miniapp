const {
  getPluginConfig,
  separateNativeRoutes,
} = require('miniapp-builder-shared');
const { dirname, join } = require('path');

const setBaseConfig = require('./setBaseConfig');

/**
 * Set miniapp runtime project webpack config
 * @param {object} config - webpack config chain
 * @param {object} options
 * @param {object} options.api - build scripts api
 * @param {string} options.target - miniapp platform
 * @param {string} options.babelRuleName - babel loader name in webpack chain
 */
module.exports = (config, options) => {
  const {
    api,
    target
  } = options;
  const {
    context,
    setValue
  } = api;
  const {
    rootDir
  } = context;

  // Native lifecycle map
  const nativeLifeCycleMap = {};

  // Sub packages config
  const subAppConfigList = [];

  const pluginConfig = getPluginConfig(rootDir, nativeLifeCycleMap);

  setValue('staticConfig', pluginConfig);

  const {
    normalRoutes,
    nativeRoutes
  } = separateNativeRoutes(pluginConfig.routes, {
    rootDir,
    target,
  });

  setBaseConfig(config, {
    isPluginProject: true,
    completeRoutes: normalRoutes,
    subAppConfigList,
    nativeLifeCycleMap,
    appConfig: pluginConfig,
    needCopyList: nativeRoutes.map(({
      source
    }) => ({
      from: dirname(join('src', source)),
      to: dirname(source),
    })),
    ...options
  });
};

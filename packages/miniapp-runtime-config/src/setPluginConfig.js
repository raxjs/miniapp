const {
  getPluginConfig,
  filterNativePages
} = require('miniapp-builder-shared');

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
  const { api, target, outputPath } = options;
  const { context, setValue } = api;
  const { rootDir } = context;

  // Native lifecycle map
  const nativeLifeCycleMap = {};

  // Sub packages config
  const subAppConfigList = [];

  // Need copy files or dir
  const needCopyList = [];

  const pluginConfig = getPluginConfig(rootDir, target, nativeLifeCycleMap);

  setValue('staticConfig', pluginConfig);

  const completeRoutes = filterNativePages(pluginConfig.routes, needCopyList, {
    rootDir,
    target,
    outputPath,
  });

  setBaseConfig(config, { completeRoutes, subAppConfigList, nativeLifeCycleMap, pluginConfig, needCopyList, ...options });
};

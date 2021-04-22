const { join } = require('path');
const isNpmModule = require('./isNpmModule');
/**
* Filter plugins that configed in config json
* @param {Object} config
* @param {Object} usingPlugins
* @returns {Object}
*/
function filterPlugin(config = {}, usingPlugins = {}) {
  const result = {};
  Object.keys(usingPlugins).forEach((plugin) => {
    const a = /plugin\:\/\/([\s\S]+?)\//.exec(usingPlugins[plugin].path);
    const pluginName = a && a[1];
    if (config.plugins && config.plugins[pluginName]) {
      result[plugin] = usingPlugins[plugin];
    }
  });
  return result;
};

/**
 * Filter components in main package or sub package
 * @param {Object} usingComponents
 * @param {string} type
 * @param {string} subAppRoot
 * @returns
 */
function filterComponent(usingComponents, type = 'main', subAppRoot = '') {
  const result = {};
  Object.keys(usingComponents).forEach(component => {
    // Put npm native components to every package temporarily
    const isNpmNativeComponents = isNpmModule(usingComponents[component].path);
    // miniapp-compiled are only supported in main package
    const isMainPackageRaxCompiledComponentDir = usingComponents[component].path.indexOf('./miniapp-compiled') === 0;

    if (isNpmNativeComponents || isMainPackageRaxCompiledComponentDir) {
      result[component] = usingComponents[component];
      return;
    }
    // miniapp-native path in main package must start with './miniapp-native'
    const isMainPackageNativeComponentDir = usingComponents[component].path.indexOf('./miniapp-native') === 0;
    if (type === 'main' && isMainPackageNativeComponentDir) {
      result[component] = usingComponents[component];
    } else if (type === 'sub' && (usingComponents[component].path.indexOf(`./${join(subAppRoot, 'miniapp-native')}`) === 0 || isMainPackageNativeComponentDir)) {
      result[component] = usingComponents[component];
    }
  });
  return result;
}

module.exports = {
  filterPlugin,
  filterComponent
};

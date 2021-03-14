/**
* Filter plugins that configed in config json
* @param {Object} config
* @param {Object} usingPlugins
* @returns {Object}
*/
module.exports = function filterPlugin(config = {}, usingPlugins = {}) {
 const result = {};
  Object.keys(usingPlugins).forEach((plugin) => {
    const a = /plugin\:\/\/([\s\S]+?)\//.exec(usingPlugins[plugin].path);
    const pluginName = a && a[1];
    if (config.plugins && config.plugins[pluginName]) {
      result[plugin] = usingPlugins[plugin];
    }
  });
  return result;
}

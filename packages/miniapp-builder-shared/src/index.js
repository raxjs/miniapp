const filterNativePages = require('./filterNativePages');
const getAppConfig = require('./getAppConfig');
const getPluginConfig = require('./getPluginConfig');
const pathHelper = require('./pathHelper');
const platformMap = require('./platformMap');
const constants = require('./constants');
const autoInstallNpm = require('./autoInstallNpm');

module.exports = {
  filterNativePages,
  getAppConfig,
  getPluginConfig,
  pathHelper,
  platformMap,
  constants,
  autoInstallNpm
};

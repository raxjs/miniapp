const separateNativeRoutes = require('./separateNativeRoutes');
const normalizeStaticConfig = require('./normalizeStaticConfig');
const getPluginConfig = require('./getPluginConfig');
const pathHelper = require('./pathHelper');
const platformMap = require('./platformMap');
const constants = require('./constants');
const autoInstallNpm = require('./autoInstallNpm');
const { transformAppConfig, transformPageConfig } = require('./transformConfig');

module.exports = {
  separateNativeRoutes,
  normalizeStaticConfig,
  getPluginConfig,
  pathHelper,
  platformMap,
  constants,
  autoInstallNpm,
  transformAppConfig,
  transformPageConfig
};

const { join } = require('path');
const { constants: { WECHAT_MINIPROGRAM }, platformMap } = require('miniapp-builder-shared');

const safeWriteFile = require('./safeWriteFile');

module.exports = function(outputPath, nativeConfig = {}, target) {
  // project.config.json in wechat miniprogram is necessary without which the project won't bootstrap
  const configContent = target === WECHAT_MINIPROGRAM ? Object.assign({ appid: '<your-app-id>' }, nativeConfig) : nativeConfig;
  safeWriteFile(join(outputPath, platformMap[target].nativeConfigFileName), configContent, true);
};

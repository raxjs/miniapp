const { join } = require('path');
const { constants: { WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP }, platformMap } = require('miniapp-builder-shared');

const safeWriteFile = require('./safeWriteFile');

const defaultConfig = {
  // project.config.json in wechat miniprogram is necessary without which the project won't bootstrap
  [WECHAT_MINIPROGRAM]: {
    appid: '<your-app-id>'
  },
  // setting in bytedance microapp is necessary without which the project will compile error
  [BYTEDANCE_MICROAPP]: {
    setting: {}
  }
};

module.exports = function(outputPath, nativeConfig = {}, target) {
  const configContent = Object.assign(defaultConfig[target] || {}, nativeConfig);
  safeWriteFile(join(outputPath, platformMap[target].nativeConfigFileName), configContent, true);
};

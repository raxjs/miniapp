const constants = require('./constants');
const { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM, KUAISHOU_MINIPROGRAM } = constants;

/**
 * Check whether the target is miniapp platform
 *
 * @param {string} target
 * @returns boolean
 */
function checkIsMiniappPlatform(target) {
  return [MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM, KUAISHOU_MINIPROGRAM].includes(target);
}

module.exports = checkIsMiniappPlatform;

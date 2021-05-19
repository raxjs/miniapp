const ali = require('./ali');
const wechat = require('./wechat');
const bytedance = require('./bytedance');
const baidu = require('./baidu');
const kuaishou = require('./kuaishou');

const { constants: { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM, KUAISHOU_MINIPROGRAM }} = require('miniapp-builder-shared');

module.exports = {
  [MINIAPP]: ali,
  [WECHAT_MINIPROGRAM]: wechat,
  [BYTEDANCE_MICROAPP]: bytedance,
  [BAIDU_SMARTPROGRAM]: baidu,
  [KUAISHOU_MINIPROGRAM]: kuaishou
};

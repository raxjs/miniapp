const ali = require('./ali');
const wechat = require('./wechat');
const { constants: { MINIAPP, WECHAT_MINIPROGRAM }} = require('miniapp-builder-shared');

module.exports = {
  [MINIAPP]: ali,
  [WECHAT_MINIPROGRAM]: wechat
};

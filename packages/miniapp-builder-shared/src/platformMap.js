const { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, QUICKAPP } = require('./constants');

module.exports = {
  [MINIAPP]: {
    type: 'ali',
    name: 'Alibaba MiniApp',
    apiNamespace: 'my',
    extension: {
      xml: '.axml',
      css: '.acss',
      script: '.sjs'
    }
  },
  [WECHAT_MINIPROGRAM]: {
    type: 'wechat',
    name: 'WeChat MiniProgram',
    apiNamespace: 'wx',
    extension: {
      xml: '.wxml',
      css: '.wxss',
      script: '.wxs'
    }
  },
  [BYTEDANCE_MICROAPP]: {
    type: 'bytedance',
    name: 'ByteDance MicroApp',
    apiNamespace: 'tt',
    extension: {
      xml: '.ttml',
      css: '.ttss',
      script: '.sjs'
    }
  },
  [QUICKAPP]: {
    type: 'quickapp',
    name: 'QuickApp',
    extension: {
      xml: '.ux',
      css: '.css',
    }
  },
};

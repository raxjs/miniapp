const { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM, KUAISHOU_MINIPROGRAM, QUICKAPP } = require('./constants');

module.exports = {
  [MINIAPP]: {
    type: 'ali',
    name: 'Alibaba MiniApp',
    apiNamespace: 'my',
    nativeConfigFileName: 'mini.project.json',
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
    nativeConfigFileName: 'project.config.json',
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
    nativeConfigFileName: 'project.config.json',
    extension: {
      xml: '.ttml',
      css: '.ttss',
      script: '.sjs'
    }
  },
  [BAIDU_SMARTPROGRAM]: {
    type: 'baidu',
    name: 'Baidu SmartProgram',
    apiNamespace: 'swan',
    nativeConfigFileName: 'project.swan.json',
    extension: {
      xml: '.swan',
      css: '.css',
      script: '.sjs'
    }
  },
  [KUAISHOU_MINIPROGRAM]: {
    type: 'kuaishou',
    name: 'KuaiShou MiniProgram',
    apiNamespace: 'ks',
    nativeConfigFileName: 'project.config.json',
    extension: {
      xml: '.ksml',
      css: '.css',
      script: '.wxs'
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

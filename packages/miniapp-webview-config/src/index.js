const MiniappWebviewPlugin = require('./plugin');
const { writeFileSync } = require('fs-extra');
const { resolve } = require('path');
const MiniAppConfigPlugin = require('rax-miniapp-config-webpack-plugin');
const {
  getAppConfig
} = require('miniapp-builder-shared');

const DEV_URL_PREFIX = 'devUrlPrefix';

module.exports = (config, options) => {
  const { api, target } = options;
  const {
    getValue,
    context: {
      command,
      userConfig: rootUserConfig,
      rootDir
    }
  } = api;

  const userConfig = rootUserConfig[target] || {};
  const appConfig = getAppConfig(rootDir, target, {});
  const outputPath = options.outputPath || resolve(rootDir, 'build', target);

  function getWebviewUrl(name) {
    if (command === 'build') {
      let urlPrefix = process.env.webview_prefix_path;
      if (!urlPrefix) {
        urlPrefix = rootUserConfig.webview.defaultPrefixPath;
      }
      if (!urlPrefix) {
        throw new Error('路径前缀不存在');
      }
      return `${urlPrefix}/${name}.html`;
    } else if (command === 'start') {
      const urlPrefix = getValue(DEV_URL_PREFIX);
      return `${urlPrefix}/${name}.html`;
    }
  }
  config.plugin('MiniappWebviewPlugin')
    .use(MiniappWebviewPlugin, [{
      api,
      target,
      getWebviewUrl
    }]);

  config.devServer.writeToDisk(true).noInfo(true).inline(false);
  if (!config.get('devtool')) {
    config.devtool(false);
  } else if (command === 'start') {
    config.devtool('inline-source-map');
  }

  // 临时文件
  const temp = resolve(rootDir, '.rax/temp.gif');
  writeFileSync(temp, '');
  config.entry('temp')
    .add('.rax/temp.gif')
    .end();

  config.module
    .rule('gif')
    .test(/\.gif$/)
    .use('file-loader')
    .loader('file-loader');

  config.plugin('MiniAppConfigPlugin').use(MiniAppConfigPlugin, [
    {
      type: 'runtime',
      subPackages: userConfig.subPackages,
      appConfig,
      subAppConfigList: [],
      outputPath,
      target,
      nativeConfig: userConfig.nativeConfig,
    },
  ]);
};

import { resolve, join } from 'path';
import * as MiniAppConfigPlugin from 'rax-miniapp-config-webpack-plugin';
import { normalizeStaticConfig } from 'miniapp-builder-shared';

import MiniappWebviewPlugin from './plugin';

import setEntry from './setEntry';

export function setWebviewConfig(config, options) {
  const { api, target } = options;
  const {
    getValue,
    context: {
      command,
      userConfig: rootUserConfig,
      rootDir
    },
    applyMethod,
  } = api;

  const userConfig = rootUserConfig[target] || {};
  const appConfig = normalizeStaticConfig(getValue('staticConfig'), { rootDir });
  const outputPath = options.outputPath || resolve(rootDir, 'build', target);

  setEntry(config, {
    rootDir,
    appConfig
  });

  config.plugin('MiniappWebviewPlugin')
    .use(MiniappWebviewPlugin, [{
      api,
      target,
      appConfig
    }]);

  config.plugin('MiniAppConfigPlugin').use(MiniAppConfigPlugin, [
    {
      type: 'webview',
      subPackages: userConfig.subPackages,
      appConfig,
      subAppConfigList: [],
      outputPath,
      target,
      nativeConfig: userConfig.nativeConfig,
    },
  ]);

  config
    .output
    .library(['page', '[name]'])
    .libraryTarget('umd');

  config.devServer.writeToDisk(true).noInfo(true).inline(false);
    if (!config.get('devtool')) {
      config.devtool(false);
    } else if (command === 'start') {
      config.devtool('inline-source-map');
    }
  
  applyMethod('addPluginTemplate', join(__dirname, './runtime/page.js'));
  const importDeclarations = getValue('importDeclarations');
  importDeclarations.createWebviewPage = {
    value: '$$framework/plugins/rax-miniapp/page'
  };
  api.setValue('importDeclarations', importDeclarations);
};

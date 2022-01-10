import { resolve, parse, dirname } from 'path';
import * as MiniAppConfigPlugin from 'rax-miniapp-config-webpack-plugin';
import { normalizeStaticConfig, constants } from 'miniapp-builder-shared';

import { RouteType } from './types';
import setBaseConfig from './setBaseConfig';

const { MINIAPP } = constants;

export function setWebviewConfig(config, options) {
  const { api, target } = options;
  const {
    getValue,
    context: {
      userConfig: rootUserConfig,
      rootDir,
      webpack
    },
    applyMethod,
    hasMethod,
    cancelTask,
    log
  } = api;

  const isWebpack4 = /^4\./.test(webpack.version);
  const userConfig = rootUserConfig[target] || {};

  // If using frm then do not generate miniapp webview code temporarily
  if (target === MINIAPP && userConfig.frm === true ) {
    cancelTask(MINIAPP);
    return;
  }

  const appConfig = normalizeStaticConfig(getValue('staticConfig'), { rootDir });
  const outputPath = options.outputPath || resolve(rootDir, 'build', target);

  const routes = appConfig.routes.map(route => {
    const { source, name, } = route;

    if (name) {
      return {
        ...route,
        webEntryName: name
      };
    }
    if (source) {
      const dir = dirname(source);
      return {
        ...route,
        webEntryName: parse(dir).name.toLocaleLowerCase()
      };
    }
  }).filter(r => !!r);

  setBaseConfig(config, options, routes);

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
    .libraryTarget('umd')
    .globalObject('self={}');;

  if (!isWebpack4) {
    config.merge({
      devServer: {
        client: false,
      }
    })
  } else {
    config.devServer.inline(false);
  }

  if (command === 'start' && config.get('devtool')) {
    config.devtool('inline-source-map');
  }

  config.devServer.hot(false);
  
  injectJSSDK(hasMethod, applyMethod, target);
  applyMethod('addPluginTemplate', join(__dirname, './runtime/page.js'));
  const importDeclarations = getValue('importDeclarations');
  importDeclarations.createWebviewPage = {
    value: '$$framework/plugins/miniapp/page'
  };
  api.setValue('importDeclarations', importDeclarations);
};

export function setWebviewPageConfig(config, options, remoteRoutes: RouteType[]) {
  setBaseConfig(config, options, remoteRoutes);
}


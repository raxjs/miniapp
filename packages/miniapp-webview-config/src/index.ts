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
    cancelTask,
  } = api;

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
};

export function setWebviewPageConfig(config, options, remoteRoutes: RouteType[]) {
  setBaseConfig(config, options, remoteRoutes);
}


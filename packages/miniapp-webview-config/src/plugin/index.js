const { join, dirname, parse } = require('path');
const { ensureDirSync } = require('fs-extra');
const { getAppConfig, constants: { MINIAPP, WECHAT_MINIPROGRAM, BAIDU_SMARTPROGRAM, QUICKAPP, BYTEDANCE_MICROAPP, KUAISHOU_MINIPROGRAM } } = require('miniapp-builder-shared');

const {
  generatePageJS,
  generatePageXML
} = require('./generators/page');
const { generateAppJS } = require('./generators/app');
const { STATIC_CONFIG } = require('./utils/constants');

const PluginName = 'WebViewPlugin';

class WebViewPlugin {
  constructor(options) {
    this.options = options;
    this.target = options.target;
  }

  apply(compiler) {
    const target = this.target;
    const {
      api: {
        context: {
          command,
          userConfig: rootUserConfig,
          rootDir
        },
        getValue
      },
      getWebviewUrl
    } = this.options;

    const appConfig = getAppConfig(rootDir);
    const staticRoutes = (getValue(STATIC_CONFIG) || {}).routes;
    const routes = appConfig.routes.map(route => {
      const { source } = route;
      const staticRoute = staticRoutes.find(s => s.source === source);
      if (staticRoute && staticRoute.name) {
        return {
          ...route,
          webEntryName: staticRoute.name
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
    const { outputDir = 'build' } = rootUserConfig;
    // todo subPackages
    let isFirstRender = true;
    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      if (isFirstRender) {
        generateAppJS(compilation, {
          target,
          command
        });
        routes.forEach(({ entryName, webEntryName }) => {
          const url = getWebviewUrl(webEntryName);
          generatePageXML(compilation, entryName, {
            target,
            command,
            url
          });

          generatePageJS(compilation, entryName, {
            target,
            command,
            url
          });
        });
        isFirstRender = false;
      }
      callback();
    });
  }
}

module.exports = WebViewPlugin;
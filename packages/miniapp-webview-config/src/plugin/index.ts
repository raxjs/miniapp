import { dirname, parse } from 'path';
import { getAppConfig } from 'miniapp-builder-shared';
import { DEV_URL_PREFIX } from './utils/constants';

const {
  generatePageJS,
  generatePageXML
} = require('./generators/page');
const { generateAppJS } = require('./generators/app');
const { STATIC_CONFIG } = require('./utils/constants');

const PluginName = 'WebViewPlugin';

class WebViewPlugin {
  options: any;
  target: string;

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
    } = this.options;

    const appConfig = getAppConfig(rootDir);
    const staticRoutes = (getValue(STATIC_CONFIG) || {}).routes;
    const routes = appConfig.routes.map(route => {
      const { source } = route;
      const staticRoute = staticRoutes.find(s => s.source === source);
      // todo, 等待修复
      if (staticRoute && staticRoute.name && staticRoute.name !== source) {
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
  }
}

export default WebViewPlugin;
import { DEV_URL_PREFIX } from './utils/constants';

import {
  generatePageJS,
  generatePageXML
} from './generators/page';
import { generateAppJS } from './generators/app';
import { RouteType } from 'src/types';

const PluginName = 'WebViewPlugin';
class WebViewPlugin {
  options: any;
  target: string;
  routes: RouteType[];

  constructor(options) {
    this.options = options;
    this.target = options.target;
    this.routes = options.routes;
  }

  apply(compiler) {
    const target = this.target;
    const {
      api: {
        context: {
          command,
          userConfig: rootUserConfig
        },
        getValue,
        log
      },
    } = this.options;

    const userConfig = rootUserConfig[target];

    const getWebviewUrl = this.generateWebviewUrl({ command, userConfig, getValue, target, log });

    // todo subPackages
    let isFirstRender = true;
    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      if (isFirstRender) {
        if (target === 'webview') {
          generateAppJS(compilation, {
            target,
            command
          });
        }
        this.routes.forEach(({ entryName, webEntryName, url: originalUrl }) => {
          const url = originalUrl ? originalUrl : getWebviewUrl(webEntryName);
          generatePageXML(compilation, entryName, {
            target,
            command,
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

  generateWebviewUrl({command, userConfig, target, getValue, log}) {
    let urlPrefix;
      if (command === 'build') {
        urlPrefix = process.env.webview_prefix_path || '';
        if (!urlPrefix) {
          if (userConfig.webview && userConfig.webviewDefaultPrefixUrl) {
            urlPrefix = userConfig.webviewDefaultPrefixUrl;
          }
        }
        if (!urlPrefix) {
          log.warn(`[${target}]: Neither environment variable "webview_prefix_path" nor webviewDefaultPrefixUrl in build.json exists`);
        }
        return (name: string) => {
          return `${urlPrefix}/${name}`;
        }
      }
      urlPrefix = getValue(DEV_URL_PREFIX);
      return (name: string) => {
        return `${urlPrefix}/${name}.html`;
      }
  }
}

export default WebViewPlugin;
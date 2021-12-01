import { dirname, parse } from 'path';
import { DEV_URL_PREFIX } from './utils/constants';

import {
  generatePageJS,
  generatePageXML
} from './generators/page';
import { generateAppJS } from './generators/app';
import { AppConfigType } from 'src/types';

const PluginName = 'WebViewPlugin';
class WebViewPlugin {
  options: any;
  target: string;
  appConfig: AppConfigType;

  constructor(options) {
    this.options = options;
    this.target = options.target;
    this.appConfig = options.appConfig;
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

    const routes = this.appConfig.routes.map(route => {
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
    // todo subPackages
    let isFirstRender = true;
    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      if (isFirstRender) {
        generateAppJS(compilation, {
          target,
          command
        });
        routes.forEach(({ entryName, webEntryName, url: originalUrl }) => {
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
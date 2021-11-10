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
      },
    } = this.options;

    const getWebviewUrl = this.generateWebviewUrl({ command, rootUserConfig, getValue });

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

  generateWebviewUrl({command, rootUserConfig, getValue}) {
    let urlPrefix;
      if (command === 'build') {
        urlPrefix = process.env.webview_prefix_path || '';
        if (!urlPrefix) {
          if (rootUserConfig.webview && rootUserConfig.webview.defaultPrefixPath) {
            urlPrefix = rootUserConfig.webview.defaultPrefixPath;
          }
        }
        if (!urlPrefix) {
          console.warn('Neither environment variable "webview_prefix_path" nor defaultPrefixPath in build.json exists');
        }
      } else if (command === 'start') {
        urlPrefix = getValue(DEV_URL_PREFIX);
      }
      return (name: string) => {
        return `${urlPrefix}/${name}.html`;
      }
  }
}

export default WebViewPlugin;
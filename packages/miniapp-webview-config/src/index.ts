import { resolve, join } from 'path';
import * as MiniAppConfigPlugin from 'rax-miniapp-config-webpack-plugin';
import { normalizeStaticConfig, constants } from 'miniapp-builder-shared';

import MiniappWebviewPlugin from './plugin';

import setEntry from './setEntry';

const { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM } = constants;

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
    hasMethod,
    cancelTask
  } = api;

  const userConfig = rootUserConfig[target] || {};

  // If using frm then do not generate miniapp webview code temporarily
  if (target === MINIAPP && userConfig.frm === true ) {
    cancelTask(MINIAPP);
  }

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
  injectJSSDK(hasMethod, applyMethod, target);
  applyMethod('addPluginTemplate', join(__dirname, './runtime/page.js'));
  const importDeclarations = getValue('importDeclarations');
  importDeclarations.createWebviewPage = {
    value: '$$framework/plugins/miniapp/page'
  };
  api.setValue('importDeclarations', importDeclarations);
};

function injectJSSDK(hasMethod, applyMethod, target) {
  if (!hasMethod('rax.injectHTML')) {
    return;
  }
  const UAMap = {
    [MINIAPP]: 'AliApp',
    [WECHAT_MINIPROGRAM]: 'miniProgram',
    [BYTEDANCE_MICROAPP]: 'ToutiaoMicroApp',
    [BAIDU_SMARTPROGRAM]: 'swan'
  };
  const JSSDKMap = {
    [MINIAPP]: 'https://appx/web-view.min.js',
    [WECHAT_MINIPROGRAM]: 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js',
    [BYTEDANCE_MICROAPP]: 'https://lf1-cdn-tos.bytegoofy.com/goofy/developer/jssdk/jssdk-1.0.3.js',
    [BAIDU_SMARTPROGRAM]: 'https://b.bdstatic.com/searchbox/icms/searchbox/js/swan-2.0.22.js'
  }
  const injectedScript = `<script>
  if (navigator.userAgent.indexOf('${UAMap[target]}') > -1) {
    document.write('\\x3Cscript src="${JSSDKMap[target]}" type="text/javascript">\\x3C/script>');
    window.__RAX_WEBVIEW__ = true;
  }
  </script>`;
  applyMethod('rax.injectHTML', 'script', [injectedScript]);
}

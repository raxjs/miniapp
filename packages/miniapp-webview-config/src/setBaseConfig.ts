import { join } from 'path';
import { constants } from 'miniapp-builder-shared';

import MiniappWebviewPlugin from './plugin';
import setEntry from './setEntry';

const { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM } = constants;

export default function setBaseConfig(config, options, routes) {
  const { api, target, outputPath } = options;
  const {
    getValue,
    context: {
      command,
      rootDir,
      webpack
    },
    applyMethod,
    hasMethod,
  } = api;

  const isWebpack4 = /^4\./.test(webpack.version);

  setEntry(config, {
    rootDir,
    routes
  });

  config.plugin('MiniappWebviewPlugin')
    .use(MiniappWebviewPlugin, [{
      api,
      target,
      routes,
    }]);

  config
    .output
    .library(['page', '[name]'])
    .libraryTarget('umd')
    .globalObject('self={}');

  if (!isWebpack4) {
    config.merge({
      devServer: {
        client: false,
      }
    });
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
}

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

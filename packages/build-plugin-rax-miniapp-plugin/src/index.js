const chalk = require('chalk');
const { constants: { MINIAPP, WECHAT_MINIPROGRAM }} = require('miniapp-builder-shared');

const build = require('./build');
const dev = require('./dev');

const pluginApp = (api, options = {}) => {
  enterCheck(api, options);

  const { registerUserConfig } = api;

  registerUserConfig({
    name: 'targets',
    validation: (value) => Array.isArray(value)
  });

  const SUPPORTED_MINIAPP_PLATFORMS = [ MINIAPP, WECHAT_MINIPROGRAM ];

  SUPPORTED_MINIAPP_PLATFORMS.forEach(miniapp => {
    registerUserConfig({
      name: miniapp,
      validation: 'object'
    });
  });

  api.setValue('targets', options.targets);

  const { context } = api;
  const { command } = context;

  if (command === 'build') {
    build(api, options);
  }

  if (command === 'start') {
    dev(api, options);
  }
};

function enterCheck(api) {
  const { context, log } = api;
  const { userConfig } = context;
  const { plugins, targets } = userConfig;

  let errMsg = '';
  let hasError = false;

  const firstPluginName = Array.isArray(plugins[0]) ? plugins[0][0] : plugins[0];

  if (firstPluginName !== 'build-plugin-rax-miniapp-plugin') {
    errMsg = 'build-plugin-rax-miniapp-plugin must be the first plugin, please check the order of plugins';
    hasError = true;
  }

  if (!(targets && targets.length)) {
    errMsg = 'build-plugin-rax-miniapp-plugin need to set targets, e.g. targets: ["miniapp", "wechat-miniprogram"]';
    hasError = true;
  }

  if (hasError) {
    log.error(chalk.red(errMsg));
    console.log();
    process.exit(1);
  }
}

module.exports = pluginApp;
